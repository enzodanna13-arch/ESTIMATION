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

// Pièces effectivement utiles au remplissage de la fiche Tracfin : la pièce
// d'identité et le titre de propriété (état civil complet + date d'acquisition),
// plus le mandat pour le numéro. On n'envoie QUE celles-ci (les autres pièces
// sont inutiles à l'identité et alourdiraient inutilement l'analyse).
const CATS_PRIORITAIRES = ["Pièce d'identité", "Titre de propriété", "Mandat"];
const MAX_DOC_OCTETS = 8 * 1024 * 1024; // on ignore une source trop lourde
const MAX_DOCS = 8; // nombre de pièces envoyées à l'IA
const MAX_PAGES_IA = 90; // total de pages par requête (limite API = 100)
const BUDGET_B64_TOTAL = 24 * 1024 * 1024; // enveloppe totale envoyée (base64)

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

interface ExtraitKyc {
  vendeurs: Partial<DonneesTracfin>[];
  numeroMandat: string;
  dateAcquisition: string; // date figurant sur le titre de propriété
}

// Calcule la durée de détention entre la date d'acquisition (titre de
// propriété) et aujourd'hui. Accepte « JJ/MM/AAAA », « MM/AAAA » ou « AAAA ».
function dureeDetentionDepuis(dateAcq: string): string {
  const s = dateAcq.trim();
  if (!s) return "";
  const m = s.match(/(?:(\d{1,2})\/)?(?:(\d{1,2})\/)?(\d{4})/);
  if (!m) return s; // format non reconnu : on garde le texte brut
  const jour = m[1] ? Number(m[1]) : m[2] ? 1 : 1;
  const mois = m[2] ? Number(m[2]) : m[1] ? Number(m[1]) : 1;
  const annee = Number(m[3]);
  const debut = new Date(annee, Math.max(0, mois - 1), jour);
  if (Number.isNaN(debut.getTime()) || debut > new Date()) return s;
  const now = new Date();
  let ans = now.getFullYear() - debut.getFullYear();
  let moisDiff = now.getMonth() - debut.getMonth();
  if (now.getDate() < debut.getDate()) moisDiff -= 1;
  if (moisDiff < 0) { ans -= 1; moisDiff += 12; }
  const parts: string[] = [];
  if (ans > 0) parts.push(`${ans} an${ans > 1 ? "s" : ""}`);
  if (moisDiff > 0) parts.push(`${moisDiff} mois`);
  const duree = parts.length > 0 ? parts.join(" et ") : "moins d'un mois";
  return `${duree} (depuis le ${debut.toLocaleDateString("fr-FR")})`;
}

// Analyse TOUS les documents fournis du dossier vendeur et en extrait : les
// vendeurs (état civil + coordonnées), le numéro de mandat et la durée de
// détention du bien. Renvoie null si l'analyse échoue.
async function extraireKyc(docs: { b64: string }[]): Promise<ExtraitKyc | null> {
  if (!process.env.ANTHROPIC_API_KEY || docs.length === 0) return null;
  const client = new Anthropic();
  const consigne = [
    "Voici les pièces d'un dossier de vente immobilière : la/les PIÈCE(S) D'IDENTITÉ et le TITRE DE PROPRIÉTÉ des vendeurs (et éventuellement le mandat).",
    "Ce sont les deux sources à exploiter en priorité. Le TITRE DE PROPRIÉTÉ (acte notarié) contient en général l'ÉTAT CIVIL COMPLET des vendeurs : nom, prénoms, date et lieu de naissance, nationalité, situation familiale / régime matrimonial, profession et adresse — sers-t'en abondamment, en plus de la pièce d'identité.",
    "Analyse-les et recoupe les informations pour remplir une fiche KYC / Tracfin.",
    "Il peut y avoir PLUSIEURS vendeurs (couple, indivision). Identifie CHAQUE personne physique vendeuse.",
    "Renvoie EXCLUSIVEMENT ce JSON (chaîne vide si une info est réellement absente de tous les documents) :",
    "{",
    '  "numeroMandat": "le numéro du mandat de vente (cherche « mandat n° », « n° de mandat » dans le mandat)",',
    '  "dateAcquisition": "la date d\'acquisition figurant sur le TITRE DE PROPRIÉTÉ (date de l\'acte / de signature chez le notaire), au format JJ/MM/AAAA",',
    '  "vendeurs": [',
    "    {",
    '      "nomPrenoms": "NOM en majuscules puis Prénom(s)",',
    '      "dateNaissance": "JJ/MM/AAAA",',
    '      "lieuNaissance": "ville (pays si étranger)",',
    '      "nationalite": "française, etc.",',
    '      "situationFamiliale": "célibataire / marié(e) / pacsé(e) / divorcé(e) / veuf(ve)",',
    '      "profession": "profession",',
    '      "adresse": "adresse complète du domicile",',
    '      "telephone": "numéro",',
    '      "email": "email"',
    "    }",
    "  ]",
    "}",
    "UNE pièce d'identité = UNE personne : deux cartes d'identité → DEUX vendeurs.",
    "Recoupe les sources : la pièce d'identité et le TITRE DE PROPRIÉTÉ priment pour l'état civil (nom, prénoms, naissance, nationalité, situation familiale, profession, adresse) ; le titre de propriété donne la date d'acquisition ; le mandat donne le numéro de mandat et éventuellement téléphone/email.",
    "N'INVENTE RIEN : laisse une chaîne vide si l'information ne figure vraiment nulle part.",
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
        system: "Tu es un assistant d'agence immobilière. Tu extrais des données et réponds uniquement par du JSON conforme, sans commentaire.",
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
    const o = JSON.parse(txt.slice(s, e + 1)) as { vendeurs?: unknown; numeroMandat?: unknown; dateAcquisition?: unknown };
    const arr = Array.isArray(o.vendeurs) ? (o.vendeurs as Record<string, unknown>[]) : [];
    const vendeurs = arr.map(personneDe).filter((p) => p.nomPrenoms || p.dateNaissance);
    return { vendeurs, numeroMandat: texte(o.numeroMandat), dateAcquisition: texte(o.dateAcquisition) };
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
    const suffixe = personnes.length > 1 ? ` - ${nomLisible}` : "";
    items.push({ nom: `Fiche Tracfin (KYC)${suffixe} - ${nomDossier}.pdf`, categorie: "Tracfin", bytes });
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
        dureeDetention: texte(f.dureeDetention),
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

    // ---- MODE AUTO : l'IA analyse TOUTES les pièces du dossier ----
    if (!process.env.ANTHROPIC_API_KEY) {
      return Response.json({ error: "Service d'analyse indisponible (clé IA absente)." }, { status: 503 });
    }
    if (!dossier.pieces.some((p) => p.categorie === "Pièce d'identité")) {
      return Response.json(
        { error: "Ajoute d'abord la pièce d'identité du vendeur au dossier (c'est la source principale de la fiche Tracfin)." },
        { status: 400 },
      );
    }

    // On n'envoie QUE les pièces utiles au KYC (identité, mandat, titre, offre,
    // taxe), triées par pertinence. Les pièces volumineuses et inutiles pour
    // l'identité (diagnostics, compromis…) sont exclues : l'API d'analyse est
    // limitée à 100 pages PAR REQUÊTE, les inclure faisait échouer l'analyse.
    const rang = (c: string) => CATS_PRIORITAIRES.indexOf(c);
    const pertinentes = dossier.pieces
      .filter((p) => CATS_PRIORITAIRES.includes(p.categorie))
      .sort((a, b) => rang(a.categorie) - rang(b.categorie));

    const { PDFDocument } = await import("pdf-lib");
    const docs: { b64: string }[] = [];
    let totalB64 = 0;
    let totalPages = 0;
    for (const p of pertinentes) {
      if (docs.length >= MAX_DOCS || totalPages >= MAX_PAGES_IA) break;
      const buf = await getClientFileServer(id, p.fileId, p.url);
      if (!buf || buf.byteLength > MAX_DOC_OCTETS) continue;
      let pages = 0;
      try { pages = (await PDFDocument.load(buf, { ignoreEncryption: true })).getPageCount(); } catch { continue; }
      if (pages === 0 || totalPages + pages > MAX_PAGES_IA) continue; // respecte la limite API
      const b64 = Buffer.from(buf).toString("base64");
      if (totalB64 + b64.length > BUDGET_B64_TOTAL) continue;
      totalB64 += b64.length;
      totalPages += pages;
      docs.push({ b64 });
    }

    let extrait: ExtraitKyc | null = null;
    let erreurIA = "";
    try {
      extrait = await extraireKyc(docs);
    } catch (e) {
      const status = (e as { status?: number })?.status;
      erreurIA = `${status ? status + " " : ""}${e instanceof Error ? e.message : "erreur"}`.slice(0, 120);
    }
    const analyseIndisponible = extrait === null;

    let brut: Partial<DonneesTracfin>[] = extrait?.vendeurs ?? [];
    if (brut.length === 0) brut = [{ nomPrenoms: [dossier.prenom, dossier.nom].filter(Boolean).join(" ") }];
    const partageContact = brut.length === 1; // couple : tel/email du dossier non attribuable
    const references = extrait?.numeroMandat || texte(dossier.nom);
    const dureeDetention = extrait ? dureeDetentionDepuis(extrait.dateAcquisition) : "";

    const personnes: DonneesTracfin[] = brut.slice(0, 6).map((p) => ({
      dateFiche: dateDuJour(),
      references,
      nomPrenoms: texte(p.nomPrenoms),
      dateNaissance: texte(p.dateNaissance),
      lieuNaissance: texte(p.lieuNaissance),
      nationalite: texte(p.nationalite),
      situationFamiliale: texte(p.situationFamiliale),
      profession: texte(p.profession),
      adresse: texte(p.adresse) || texte(dossier.adresseActuelle),
      telephone: texte(p.telephone) || (partageContact ? texte(dossier.tel) : ""),
      email: texte(p.email) || (partageContact ? texte(dossier.email) : ""),
      dureeDetention,
    }));

    const res = await addClientPdfsServer(id, await fabriquerItems(dossier.nom, personnes));
    if (!res) return Response.json({ error: "Dossier introuvable" }, { status: 404 });

    const diag = `IA=${extrait ? "ok" : "null"} · docs=${docs.length} (${totalPages} p.) · vendeurs=${extrait?.vendeurs.length ?? 0} · mandat=${extrait?.numeroMandat ? "oui" : "non"} · acq=${extrait?.dateAcquisition ? "oui" : "non"}${erreurIA ? ` · erreurIA=${erreurIA}` : ""}`;

    return Response.json({
      dossier: res.dossier,
      fiches: res.ajoutees,
      vendeurs: personnes.length,
      champsVides: compterChampsVides(personnes),
      analyseIndisponible,
      donnees: personnes,
      fileIds: res.fileIds,
      diag,
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Génération de la fiche Tracfin impossible";
    return Response.json({ error: message }, { status: 500 });
  }
}
