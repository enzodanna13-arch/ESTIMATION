import Anthropic from "@anthropic-ai/sdk";
import { verifierAccesEquipe } from "@/lib/historyAuth";
import { addClientPdfsServer, getClientFileServer, getClientServer } from "@/lib/serverHistory";
import { remplirFicheTracfin, type DonneesTracfin } from "@/lib/tracfin/remplir";

export const dynamic = "force-dynamic";
export const maxDuration = 120;

// Génération automatique de la fiche d'identification Tracfin (KYC) d'un dossier
// vendeur : l'IA lit la pièce d'identité et le mandat déjà présents au dossier,
// en extrait les informations du client, et on les reporte sur le modèle de
// fiche. La partie « notation des risques » reste vierge — à l'appréciation et
// sous la responsabilité de l'agent.

const CATS_SOURCES = ["Pièce d'identité", "Mandat", "Titre de propriété"];
const MAX_DOC_OCTETS = 8 * 1024 * 1024; // on ignore une source trop lourde

function dateDuJour(): string {
  return new Date().toLocaleDateString("fr-FR", { day: "2-digit", month: "long", year: "numeric" });
}

function texte(v: unknown): string {
  return typeof v === "string" ? v.trim() : "";
}

async function extraireKyc(docs: { b64: string }[]): Promise<Partial<DonneesTracfin> | null> {
  if (!process.env.ANTHROPIC_API_KEY || docs.length === 0) return null;
  const client = new Anthropic();
  const consigne = [
    "Ces documents sont la pièce d'identité et/ou le mandat d'un CLIENT VENDEUR (personne physique).",
    "Extrais les informations d'identité du vendeur pour une fiche KYC / Tracfin.",
    "Renvoie EXCLUSIVEMENT un JSON avec ces clés (chaîne vide si l'info est absente) :",
    "{",
    '  "nomPrenoms": "NOM en majuscules puis Prénom(s)",',
    '  "dateNaissance": "JJ/MM/AAAA",',
    '  "lieuNaissance": "ville (pays si étranger)",',
    '  "nationalite": "française, etc.",',
    '  "situationFamiliale": "célibataire / marié(e) / pacsé(e) / divorcé(e) / veuf(ve) si mentionné",',
    '  "profession": "profession si mentionnée",',
    '  "adresse": "adresse complète du domicile",',
    '  "telephone": "numéro si mentionné",',
    '  "email": "email si mentionné"',
    "}",
    "N'INVENTE RIEN : si une information ne figure pas clairement dans les documents, laisse la chaîne vide.",
    "La pièce d'identité prime pour l'état civil (nom, naissance, nationalité) ; le mandat peut compléter adresse, profession, situation familiale, téléphone, email.",
  ].join("\n");

  const content: Anthropic.MessageParam["content"] = [
    ...docs.map((d) => ({ type: "document" as const, source: { type: "base64" as const, media_type: "application/pdf" as const, data: d.b64 } })),
    { type: "text" as const, text: consigne },
  ];

  let msg: Anthropic.Message | null = null;
  for (let essai = 0; essai < 3; essai++) {
    try {
      msg = await client.messages.create({
        model: process.env.EXTRACT_MODEL ?? "claude-sonnet-5",
        max_tokens: 1024,
        system: "Tu es un assistant d'agence immobilière. Tu extrais des données d'identité et réponds uniquement par du JSON conforme, sans commentaire.",
        messages: [{ role: "user", content }],
      });
      break;
    } catch (e) {
      const status = (e as { status?: number })?.status;
      const transitoire = status === undefined || status === 429 || status === 529 || (status >= 500 && status < 600);
      if (!transitoire || essai === 2) throw e;
      await new Promise((r) => setTimeout(r, 1500 * (essai + 1)));
    }
  }
  if (!msg) return null;
  const txt = msg.content.filter((b): b is Anthropic.TextBlock => b.type === "text").map((b) => b.text).join("");
  const s = txt.indexOf("{"), e = txt.lastIndexOf("}");
  if (s < 0 || e <= s) return null;
  try {
    const o = JSON.parse(txt.slice(s, e + 1)) as Record<string, unknown>;
    return {
      nomPrenoms: texte(o.nomPrenoms),
      dateNaissance: texte(o.dateNaissance),
      lieuNaissance: texte(o.lieuNaissance),
      nationalite: texte(o.nationalite),
      situationFamiliale: texte(o.situationFamiliale),
      profession: texte(o.profession),
      adresse: texte(o.adresse),
      telephone: texte(o.telephone),
      email: texte(o.email),
    };
  } catch {
    return null;
  }
}

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!(await verifierAccesEquipe(request))) {
    return Response.json({ error: "Accès réservé — mot de passe requis" }, { status: 401 });
  }
  if (!process.env.ANTHROPIC_API_KEY) {
    return Response.json({ error: "Service d'analyse indisponible (clé IA absente)." }, { status: 503 });
  }
  const { id } = await params;

  const dossier = await getClientServer(id);
  if (!dossier) return Response.json({ error: "Dossier introuvable" }, { status: 404 });

  // Sources : pièce d'identité en priorité, puis mandat / titre.
  const sources = dossier.pieces
    .filter((p) => CATS_SOURCES.includes(p.categorie))
    .sort((a, b) => CATS_SOURCES.indexOf(a.categorie) - CATS_SOURCES.indexOf(b.categorie));
  if (!sources.some((p) => p.categorie === "Pièce d'identité")) {
    return Response.json(
      { error: "Ajoute d'abord la pièce d'identité du vendeur au dossier (c'est la source principale de la fiche Tracfin)." },
      { status: 400 },
    );
  }

  try {
    const docs: { b64: string }[] = [];
    for (const p of sources.slice(0, 4)) {
      const buf = await getClientFileServer(id, p.fileId);
      if (!buf || buf.byteLength > MAX_DOC_OCTETS) continue;
      docs.push({ b64: Buffer.from(buf).toString("base64") });
    }

    const extrait = await extraireKyc(docs).catch(() => null);

    // Fusion : IA d'abord, puis repli sur la fiche du dossier pour tel/email et
    // le nom. Références = nom du dossier (n° de mandat).
    const donnees: DonneesTracfin = {
      dateFiche: dateDuJour(),
      references: texte(dossier.nom),
      nomPrenoms: extrait?.nomPrenoms || [dossier.prenom, dossier.nom].filter(Boolean).join(" "),
      dateNaissance: extrait?.dateNaissance,
      lieuNaissance: extrait?.lieuNaissance,
      nationalite: extrait?.nationalite,
      situationFamiliale: extrait?.situationFamiliale,
      profession: extrait?.profession,
      adresse: extrait?.adresse || texte(dossier.adresseActuelle),
      telephone: extrait?.telephone || texte(dossier.tel),
      email: extrait?.email || texte(dossier.email),
    };

    const bytes = await remplirFicheTracfin(donnees);
    const res = await addClientPdfsServer(id, [
      { nom: `Fiche Tracfin (KYC) — ${dossier.nom}.pdf`, categorie: "Tracfin", bytes },
    ]);
    if (!res) return Response.json({ error: "Dossier introuvable" }, { status: 404 });

    // Champs d'identité restés vides (à compléter à la main).
    const champsVides = (["nomPrenoms", "dateNaissance", "lieuNaissance", "nationalite", "adresse"] as const)
      .filter((k) => !texte(donnees[k]));

    return Response.json({
      dossier: res.dossier,
      champsVides,
      analyseIndisponible: !extrait,
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Génération de la fiche Tracfin impossible";
    return Response.json({ error: message }, { status: 500 });
  }
}
