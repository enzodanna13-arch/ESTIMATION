import Anthropic from "@anthropic-ai/sdk";
import { verifierAccesEquipe } from "@/lib/historyAuth";
import { addClientPdfsServer, deleteClientFileServer, getClientFileServer, getClientServer } from "@/lib/serverHistory";
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

// Construit les items PDF (une pièce par vendeur) à partir des données finales.
async function fabriquerItems(nomDossier: string, personnes: DonneesTracfin[]) {
  const items: { nom: string; categorie: string; bytes: Uint8Array }[] = [];
  let i = 0;
  for (const donnees of personnes.slice(0, 6)) {
    i++;
    const bytes = await remplirFicheTracfin(donnees);
    const nomLisible = (donnees.nomPrenoms || `vendeur ${i}`).replace(/[\\/:*?"<>|\r\n]+/g, " ").trim().slice(0, 80);
    const suffixe = personnes.length > 1 ? ` — ${nomLisible}` : "";
    items.push({ nom: `Fiche Tracfin (KYC)${suffixe} — ${nomDossier}.pdf`, categorie: "Tracfin", bytes });
  }
  return items;
}

function compterChampsVides(personnes: DonneesTracfin[]): number {
  return personnes.reduce(
    (n, d) => n + (["nomPrenoms", "dateNaissance", "lieuNaissance", "nationalite", "adresse"] as const).filter((k) => !texte(d[k])).length,
    0,
  );
}

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!(await verifierAccesEquipe(request))) {
    return Response.json({ error: "Accès réservé — mot de passe requis" }, { status: 401 });
  }
  const { id } = await params;

  const dossier = await getClientServer(id);
  if (!dossier) return Response.json({ error: "Dossier introuvable" }, { status: 404 });

  // Corps facultatif : mode MANUEL si `fiches` fourni (données corrigées par
  // l'agent). `remplacer` = fileIds des fiches précédentes à supprimer.
  let body: { fiches?: DonneesTracfin[]; remplacer?: string[] } = {};
  try {
    body = (await request.json()) as typeof body;
  } catch {
    /* pas de corps = mode auto */
  }
  const modeManuel = Array.isArray(body.fiches) && body.fiches.length > 0;

  try {
    // ---- MODE MANUEL : on génère à partir des données saisies/corrigées ----
    if (modeManuel) {
      for (const fid of body.remplacer ?? []) {
        await deleteClientFileServer(id, fid).catch(() => {});
      }
      const personnes: DonneesTracfin[] = body.fiches!.slice(0, 6).map((f) => ({
        dateFiche: texte(f.dateFiche) || dateDuJour(),
        references: texte(f.references) || texte(dossier.nom),
        nomPrenoms: texte(f.nomPrenoms),
        dateNaissance: texte(f.dateNaissance),
        lieuNaissance: texte(f.lieuNaissance),
        nationalite: texte(f.nationalite),
        situationFamiliale: texte(f.situationFamiliale),
        profession: texte(f.profession),
        adresse: texte(f.adresse),
        telephone: texte(f.telephone),
        email: texte(f.email),
      }));
      const res = await addClientPdfsServer(id, await fabriquerItems(dossier.nom, personnes));
      if (!res) return Response.json({ error: "Dossier introuvable" }, { status: 404 });
      return Response.json({
        dossier: res.dossier,
        fiches: res.ajoutees,
        vendeurs: personnes.length,
        champsVides: compterChampsVides(personnes),
        analyseIndisponible: false,
        donnees: personnes,
        fileIds: res.fileIds,
      });
    }

    // ---- MODE AUTO : extraction IA depuis la pièce d'identité + le mandat ----
    if (!process.env.ANTHROPIC_API_KEY) {
      return Response.json({ error: "Service d'analyse indisponible (clé IA absente)." }, { status: 503 });
    }
    const sources = dossier.pieces
      .filter((p) => CATS_SOURCES.includes(p.categorie))
      .sort((a, b) => CATS_SOURCES.indexOf(a.categorie) - CATS_SOURCES.indexOf(b.categorie));
    if (!sources.some((p) => p.categorie === "Pièce d'identité")) {
      return Response.json(
        { error: "Ajoute d'abord la pièce d'identité du vendeur au dossier (c'est la source principale de la fiche Tracfin)." },
        { status: 400 },
      );
    }

    const docs: { b64: string }[] = [];
    for (const p of sources.slice(0, 4)) {
      const buf = await getClientFileServer(id, p.fileId, p.url);
      if (!buf || buf.byteLength > MAX_DOC_OCTETS) continue;
      docs.push({ b64: Buffer.from(buf).toString("base64") });
    }

    const extrait = await extraireKyc(docs).catch(() => null);
    const analyseIndisponible = extrait === null;

    let brut: Partial<DonneesTracfin>[] = extrait ?? [];
    if (brut.length === 0) brut = [{ nomPrenoms: [dossier.prenom, dossier.nom].filter(Boolean).join(" ") }];
    const partageContact = brut.length === 1; // couple : tel/email du dossier non attribuable

    const personnes: DonneesTracfin[] = brut.slice(0, 6).map((p) => ({
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
    }));

    const res = await addClientPdfsServer(id, await fabriquerItems(dossier.nom, personnes));
    if (!res) return Response.json({ error: "Dossier introuvable" }, { status: 404 });

    return Response.json({
      dossier: res.dossier,
      fiches: res.ajoutees,
      vendeurs: personnes.length,
      champsVides: compterChampsVides(personnes),
      analyseIndisponible,
      donnees: personnes,
      fileIds: res.fileIds,
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Génération de la fiche Tracfin impossible";
    return Response.json({ error: message }, { status: 500 });
  }
}
