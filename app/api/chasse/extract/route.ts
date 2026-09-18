import Anthropic from "@anthropic-ai/sdk";
import { verifierAccesEquipe } from "@/lib/historyAuth";

export const maxDuration = 120;
export const dynamic = "force-dynamic";

// Extraction d'une annonce immobilière à partir de son lien : on récupère la
// page (métadonnées Open Graph, JSON-LD, photos) puis l'IA structure les infos
// du bien. Si le site bloque la lecture automatique, on renvoie ce qu'on a pu
// obtenir (au minimum le lien) pour que le négociateur complète à la main.

const SCHEMA = {
  type: "object",
  properties: {
    titre: { type: "string", description: "Titre court du bien (ex. « Maison 4 pièces 105 m² — Martigues »). Vide si inconnu." },
    typeBien: { type: "string", description: "Appartement, Maison, Terrain, Immeuble, Local, Parking… Vide si inconnu." },
    ville: { type: "string", description: "Commune du bien. Vide si inconnue." },
    codePostal: { type: "string", description: "Code postal du bien (5 chiffres). Vide si inconnu." },
    prixAffiche: { type: "number", description: "Prix demandé dans l'annonce en euros (nombre seul, sans espaces). 0 si inconnu." },
    surface: { type: "number", description: "Surface habitable en m² (nombre seul). 0 si inconnue." },
    pieces: { type: "number", description: "Nombre de pièces. 0 si inconnu." },
    chambres: { type: "number", description: "Nombre de chambres. 0 si inconnu." },
    dpe: { type: "string", description: "Classe énergétique DPE (A à G). Vide si inconnue." },
    description: { type: "string", description: "Description du bien reprise de l'annonce (résumé fidèle, 1 à 6 phrases). Vide si aucune." },
  },
  required: ["titre", "typeBien", "ville", "codePostal", "prixAffiche", "surface", "pieces", "chambres", "dpe", "description"],
} as const;

function absolutiser(src: string, base: string): string | null {
  try {
    return new URL(src, base).toString();
  } catch {
    return null;
  }
}

// Une image est-elle exploitable comme photo de bien ? (on écarte icônes,
// logos, pixels de suivi, data-URI, svg…)
function photoValide(u: string): boolean {
  if (!/^https?:\/\//i.test(u)) return false;
  if (/\.svg(\?|$)/i.test(u)) return false;
  if (/(sprite|logo|icon|favicon|pixel|tracking|placeholder|avatar|blank)/i.test(u)) return false;
  return /\.(jpe?g|png|webp|avif)(\?|$)/i.test(u) || /(image|photo|media|cdn|static)/i.test(u);
}

function extrairePhotos(html: string, base: string): string[] {
  const trouvees = new Set<string>();
  const pousser = (raw: string | undefined | null) => {
    if (!raw) return;
    const abs = absolutiser(raw.trim(), base);
    if (abs && photoValide(abs)) trouvees.add(abs);
  };
  // og:image / twitter:image
  for (const m of html.matchAll(/<meta[^>]+(?:property|name)=["'](?:og:image(?::secure_url)?|twitter:image)["'][^>]+content=["']([^"']+)["']/gi)) pousser(m[1]);
  for (const m of html.matchAll(/<meta[^>]+content=["']([^"']+)["'][^>]+(?:property|name)=["'](?:og:image(?::secure_url)?|twitter:image)["']/gi)) pousser(m[1]);
  // JSON-LD "image": "..." ou ["...","..."]
  for (const m of html.matchAll(/"image"\s*:\s*("([^"]+)"|\[([^\]]+)\])/gi)) {
    if (m[2]) pousser(m[2]);
    if (m[3]) for (const s of m[3].split(",")) pousser(s.replace(/^\s*"|"\s*$/g, ""));
  }
  // <img src / data-src / data-original / srcset
  for (const m of html.matchAll(/<img[^>]+(?:data-src|data-original|data-lazy|src)=["']([^"']+)["']/gi)) pousser(m[1]);
  for (const m of html.matchAll(/(?:data-)?srcset=["']([^"']+)["']/gi)) {
    const premier = m[1].split(",")[0]?.trim().split(/\s+/)[0];
    pousser(premier);
  }
  return [...trouvees].slice(0, 20);
}

// Réduit la page à un texte utile pour l'IA (métadonnées + texte visible).
function contenuPourIA(html: string): string {
  const metas: string[] = [];
  for (const m of html.matchAll(/<meta[^>]+(property|name)=["']([^"']+)["'][^>]+content=["']([^"']*)["'][^>]*>/gi)) {
    if (/og:|twitter:|description|price|keywords/i.test(m[2])) metas.push(`${m[2]}: ${m[3]}`);
  }
  const jsonld: string[] = [];
  for (const m of html.matchAll(/<script[^>]+application\/ld\+json[^>]*>([\s\S]*?)<\/script>/gi)) jsonld.push(m[1].slice(0, 4000));
  const titre = html.match(/<title[^>]*>([\s\S]*?)<\/title>/i)?.[1] ?? "";
  // Texte visible : on retire scripts/styles puis les balises
  const visible = html
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/gi, " ")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, 9000);
  return [
    `TITRE PAGE: ${titre}`,
    metas.length ? `META:\n${metas.join("\n")}` : "",
    jsonld.length ? `JSON-LD:\n${jsonld.join("\n")}` : "",
    `TEXTE VISIBLE:\n${visible}`,
  ].filter(Boolean).join("\n\n").slice(0, 16000);
}

// Structuration des champs du bien par l'IA à partir d'un contenu texte.
async function structurerAvecIA(contenu: string, source: string): Promise<Record<string, unknown> | null> {
  if (!process.env.ANTHROPIC_API_KEY) return null;
  const client = new Anthropic();
  const stream = client.messages.stream({
    model: process.env.ESTIMATION_MODEL ?? "claude-opus-4-8",
    max_tokens: 1500,
    system:
      "Tu extrais les caractéristiques d'un bien à partir du contenu d'une annonce immobilière française. Tu réponds EXCLUSIVEMENT par un objet JSON valide conforme au schéma. Tu n'inventes jamais : un champ absent reste vide (\"\") ou 0.",
    output_config: { effort: "low" },
    messages: [
      {
        role: "user",
        content: `Voici le contenu d'une annonce immobilière${source ? ` (${source})` : ""}. Extrais les caractéristiques du bien dans le schéma JSON.
RÈGLES : n'invente rien ; prix et surface en nombres seuls (sans espaces ni €/m²) ; description = résumé fidèle de l'annonce.

SCHÉMA : ${JSON.stringify(SCHEMA)}

CONTENU :
${contenu}`,
      },
    ],
  });
  const message = await stream.finalMessage();
  const text = message.content
    .filter((b): b is Anthropic.TextBlock => b.type === "text")
    .map((b) => b.text)
    .join("");
  const cleaned = text.replace(/```json/gi, "").replace(/```/g, "");
  const start = cleaned.indexOf("{");
  const end = cleaned.lastIndexOf("}");
  if (start < 0 || end <= start) throw new Error("Réponse IA sans JSON");
  return JSON.parse(cleaned.slice(start, end + 1)) as Record<string, unknown>;
}

function versFiche(r: Record<string, unknown>, url: string, source: string, photos: string[]) {
  const str = (k: string) => (typeof r[k] === "string" ? (r[k] as string).trim() : "");
  const num = (k: string) => (typeof r[k] === "number" && isFinite(r[k] as number) ? (r[k] as number) : 0);
  return {
    url, source,
    titre: str("titre"),
    typeBien: str("typeBien"),
    ville: str("ville"),
    codePostal: str("codePostal"),
    prixAffiche: num("prixAffiche"),
    surface: num("surface"),
    pieces: num("pieces"),
    chambres: num("chambres"),
    dpe: str("dpe").toUpperCase().slice(0, 1),
    description: str("description"),
    photos,
  };
}

export async function POST(request: Request) {
  if (!(await verifierAccesEquipe(request))) {
    return Response.json({ error: "Accès réservé — mot de passe requis" }, { status: 401 });
  }

  let url = "";
  let texte = "";
  try {
    const body = (await request.json()) as { url?: string; texte?: string };
    url = (body.url ?? "").trim();
    texte = (body.texte ?? "").trim();
  } catch {
    return Response.json({ error: "Requête invalide" }, { status: 400 });
  }

  // MODE 1 — Texte collé (fonctionne partout, même sur les sites bloqués) :
  // le négociateur copie le texte de l'annonce depuis son navigateur.
  if (texte.length >= 30) {
    const source = /^https?:\/\//i.test(url) ? (() => { try { return new URL(url).host.replace(/^www\./, ""); } catch { return "annonce"; } })() : "annonce collée";
    try {
      const r = await structurerAvecIA(texte.slice(0, 16000), source);
      if (!r) return Response.json({ bloque: false, source, fiche: { url, source, description: texte.slice(0, 4000), photos: [] } });
      return Response.json({ bloque: false, source, fiche: versFiche(r, url, source, []) });
    } catch (err) {
      console.error("Extraction annonce (texte) impossible :", err);
      return Response.json({ bloque: false, source, fiche: { url, source, description: texte.slice(0, 4000), photos: [] } });
    }
  }

  if (!/^https?:\/\//i.test(url)) {
    return Response.json({ error: "Collez le lien de l'annonce (https://…) ou son texte." }, { status: 400 });
  }

  const source = (() => { try { return new URL(url).host.replace(/^www\./, ""); } catch { return ""; } })();

  // 1) Récupération de la page
  let html = "";
  let bloque = false;
  try {
    const ctrl = new AbortController();
    const t = setTimeout(() => ctrl.abort(), 20000);
    const res = await fetch(url, {
      signal: ctrl.signal,
      redirect: "follow",
      headers: {
        "user-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0 Safari/537.36",
        "accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
        "accept-language": "fr-FR,fr;q=0.9,en;q=0.8",
      },
    });
    clearTimeout(t);
    if (res.ok) {
      html = await res.text();
    } else {
      bloque = true;
    }
  } catch {
    bloque = true;
  }

  // Site bloquant / illisible (Leboncoin, SeLoger… bloquent les robots) : on
  // renvoie une fiche minimale ET on invite à coller le texte de l'annonce.
  if (bloque || html.length < 200) {
    return Response.json({
      bloque: true,
      source,
      fiche: { url, source, photos: [] },
      message: `${source || "Ce site"} bloque la lecture automatique (Leboncoin et SeLoger notamment). Astuce : sur l'annonce, sélectionnez le texte (les infos), copiez-le et collez-le dans « Coller le texte de l'annonce » — l'IA remplira la fiche. Ajoutez les photos avec « Importer des photos ».`,
    });
  }

  const photos = extrairePhotos(html, url);

  // 2) Structuration par l'IA (si le moteur est configuré). Sinon, on renvoie
  // au moins les photos et la source.
  if (!process.env.ANTHROPIC_API_KEY) {
    return Response.json({ bloque: false, source, fiche: { url, source, photos } });
  }

  try {
    const r = await structurerAvecIA(contenuPourIA(html), source);
    if (!r) return Response.json({ bloque: false, source, fiche: { url, source, photos } });
    return Response.json({ bloque: false, source, fiche: versFiche(r, url, source, photos) });
  } catch (err) {
    console.error("Extraction annonce (IA) impossible :", err);
    // L'IA a échoué mais on a la page : on renvoie au moins les photos.
    return Response.json({ bloque: false, source, fiche: { url, source, photos } });
  }
}
