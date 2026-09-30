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

function personneDe(o: Record<string, unknown>): Partial<DonneesTracfin> {
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
}

// Extrait la liste des VENDEURS (un couple ou une indivision = plusieurs
// personnes). Renvoie un tableau, un objet par personne physique identifiée.
async function extraireKyc(docs: { b64: string }[]): Promise<Partial<DonneesTracfin>[] | null> {
  if (!process.env.ANTHROPIC_API_KEY || docs.length === 0) return null;
  const client = new Anthropic();
  const consigne = [
    "Ces documents sont la/les pièce(s) d'identité et/ou le mandat d'un dossier de vente immobilière.",
    "Il peut y avoir PLUSIEURS vendeurs (couple, indivision, co-propriétaires). Identifie CHAQUE personne physique vendeuse.",
    "Renvoie EXCLUSIVEMENT un JSON : un tableau « vendeurs » avec UN objet par personne (chaîne vide si l'info est absente) :",
    '{ "vendeurs": [',
    "  {",
    '    "nomPrenoms": "NOM en majuscules puis Prénom(s)",',
    '    "dateNaissance": "JJ/MM/AAAA",',
    '    "lieuNaissance": "ville (pays si étranger)",',
    '    "nationalite": "française, etc.",',
    '    "situationFamiliale": "célibataire / marié(e) / pacsé(e) / divorcé(e) / veuf(ve) si mentionné",',
    '    "profession": "profession si mentionnée",',
    '    "adresse": "adresse complète du domicile",',
    '    "telephone": "numéro si mentionné",',
    '    "email": "email si mentionné"',
    "  }",
    "] }",
    "UNE pièce d'identité = UNE personne : s'il y a deux cartes d'identité, renvoie DEUX vendeurs.",
    "N'INVENTE RIEN : si une information ne figure pas clairement, laisse la chaîne vide.",
    "La pièce d'identité prime pour l'état civil ; le mandat peut compléter adresse, profession, situation familiale, téléphone, email.",
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
        max_tokens: 2048,
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
    const o = JSON.parse(txt.slice(s, e + 1)) as { vendeurs?: unknown };
    const arr = Array.isArray(o.vendeurs) ? (o.vendeurs as Record<string, unknown>[]) : [];
    const personnes = arr.map(personneDe).filter((p) => p.nomPrenoms || p.dateNaissance);
    return personnes;
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
    const analyseIndisponible = extrait === null;

    // Un vendeur par pièce d'identité : si l'IA en renvoie plusieurs, on génère
    // une fiche par personne. Repli : au moins une fiche depuis la fiche client.
    let personnes: Partial<DonneesTracfin>[] = extrait ?? [];
    if (personnes.length === 0) {
      personnes = [{ nomPrenoms: [dossier.prenom, dossier.nom].filter(Boolean).join(" ") }];
    }
    const partageContact = personnes.length === 1; // couple : le tel/email du dossier n'appartient qu'à une personne

    const items: { nom: string; categorie: string; bytes: Uint8Array }[] = [];
    let champsVidesTotal = 0;
    let i = 0;
    for (const p of personnes.slice(0, 6)) {
      i++;
      const donnees: DonneesTracfin = {
        dateFiche: dateDuJour(),
        references: texte(dossier.nom),
        nomPrenoms: texte(p.nomPrenoms),
        dateNaissance: texte(p.dateNaissance),
        lieuNaissance: texte(p.lieuNaissance),
        nationalite: texte(p.nationalite),
        situationFamiliale: texte(p.situationFamiliale),
        profession: texte(p.profession),
        adresse: texte(p.adresse) || texte(dossier.adresseActuelle),
        telephone: texte(p.telephone) || (partageContact ? texte(dossier.tel) : ""),
        email: texte(p.email) || (partageContact ? texte(dossier.email) : ""),
      };
      champsVidesTotal += (["nomPrenoms", "dateNaissance", "lieuNaissance", "nationalite", "adresse"] as const)
        .filter((k) => !texte(donnees[k])).length;
      const bytes = await remplirFicheTracfin(donnees);
      const nomLisible = (donnees.nomPrenoms || `vendeur ${i}`).replace(/[\\/:*?"<>|\r\n]+/g, " ").trim().slice(0, 80);
      const suffixe = personnes.length > 1 ? ` — ${nomLisible}` : "";
      items.push({ nom: `Fiche Tracfin (KYC)${suffixe} — ${dossier.nom}.pdf`, categorie: "Tracfin", bytes });
    }

    const res = await addClientPdfsServer(id, items);
    if (!res) return Response.json({ error: "Dossier introuvable" }, { status: 404 });

    return Response.json({
      dossier: res.dossier,
      fiches: res.ajoutees,
      vendeurs: personnes.length,
      champsVides: champsVidesTotal,
      analyseIndisponible,
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Génération de la fiche Tracfin impossible";
    return Response.json({ error: message }, { status: 500 });
  }
}
