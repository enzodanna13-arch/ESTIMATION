import { calculerCompletude } from "@/lib/completude";
import { versPropertyInput, type ClientEstimationInput, type ClientEstimationRecord, type PhotoMeta } from "@/lib/clientTypes";
import type { PhotoInput, EstimationReport } from "@/lib/types";
import {
  addClientEstimationPhoto,
  countEstimationsToday,
  listClientEstimationsServer,
  saveClientEstimation,
} from "@/lib/clientEstimations";
import { fenetreAntiSpamMs, ipDe, plafondQuotidien, verifierTurnstile } from "@/lib/antiAbus";
import { leadVide, saveLeadServer } from "@/lib/serverLeads";
import { declencherNewLead } from "@/lib/serverSms";

export const dynamic = "force-dynamic";
export const maxDuration = 300;

// ORCHESTRATION de l'estimation CLIENT (tunnel public). Route NOUVELLE, en
// accès libre (pas de mot de passe d'équipe), protégée par Turnstile + plafond
// quotidien + anti-spam. Ne touche AUCUN fichier ni endpoint Pro. Crée le lead
// et l'estimation, lance le moteur client (Sonnet), et ne perd JAMAIS le
// prospect même si l'analyse IA échoue (statut « pending_review »).

const rid = () => `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
const token = () =>
  (globalThis.crypto?.randomUUID?.() ?? `${rid()}-${rid()}`).replace(/-/g, "");

const REPORT_VIDE: EstimationReport = {
  prix_estime: 0, fourchette_basse: 0, fourchette_haute: 0, prix_m2: 0, prix_presentation: 0,
  description_bien: "", indice_confiance: 0, delai_vente_estime: "", positionnement_marche: "",
  analyse_dvf: "", analyse_concurrence: "", analyse_invendus: "", analyse_photos: "",
  analyse_par_photo: [], etat_notes: [], coefficient_etat: "", impact_etat: 0,
  annonces_concurrentes: [], audit_concurrentiel: { nb_annonces_analysees: 0, prix_m2_min: 0, prix_m2_median: 0, prix_m2_max: 0, tension_marche: "", synthese: "" },
  scenarios_prix: [], references_dvf: [], base_mediane: 0, ajustements: [], etapes_commercialisation: [],
  points_forts: [], points_faibles: [], strategie_commercialisation: "", argumentaire_vendeur: "",
};

const txt = (v: unknown) => (typeof v === "string" ? v.trim() : "");
const nb = (v: unknown): number | null => (typeof v === "number" && Number.isFinite(v) ? v : null);
const emailValide = (e: string) => /.+@.+\..+/.test(e);

function nettoyer(raw: Record<string, unknown>): { input: ClientEstimationInput; photos: PhotoInput[] } | null {
  const b = raw as Partial<ClientEstimationInput> & { photos?: PhotoInput[] };
  const codePostal = txt(b.codePostal);
  const typeBien = b.typeBien === "maison" || b.typeBien === "appartement" ? b.typeBien : null;
  const nom = txt(b.nom), prenom = txt(b.prenom), tel = txt(b.tel), email = txt(b.email);
  const etat = txt(b.etat);
  // Validation minimale — sans elle, pas d'estimation ni de prospect exploitable.
  if (!/^\d{5}$/.test(codePostal) || !typeBien) return null;
  if (!nom || !prenom || !tel || !emailValide(email)) return null;
  if (b.consentement !== true) return null;

  const photosBrutes = Array.isArray(b.photos) ? b.photos.slice(0, 15) : [];
  const photos: PhotoInput[] = photosBrutes
    .filter((p): p is PhotoInput => !!p && typeof p.data === "string" && p.data.length > 0)
    .map((p) => ({ name: txt(p.name) || "photo", mediaType: p.mediaType, data: p.data }));

  const input: ClientEstimationInput = {
    adresse: txt(b.adresse), codePostal, ville: txt(b.ville), quartier: txt(b.quartier) || undefined,
    typeBien,
    surfaceHabitable: nb(b.surfaceHabitable), surfaceTerrain: nb(b.surfaceTerrain),
    nbPieces: nb(b.nbPieces), nbChambres: nb(b.nbChambres), nbSallesDeBain: nb(b.nbSallesDeBain), nbWc: nb(b.nbWc),
    etage: txt(b.etage) || undefined, nbEtages: nb(b.nbEtages), ascenseur: b.ascenseur === true,
    anneeConstruction: txt(b.anneeConstruction) || undefined, chauffage: txt(b.chauffage) || undefined,
    dpe: txt(b.dpe) || undefined, exposition: txt(b.exposition) || undefined,
    prestations: Array.isArray(b.prestations) ? b.prestations.filter((s) => typeof s === "string").slice(0, 20) : [],
    etat,
    prenom, nom, tel, email,
    projet: txt(b.projet), souhaiteRappel: b.souhaiteRappel === true, consentement: true,
    marketing: typeof b.marketing === "object" && b.marketing ? b.marketing : undefined,
    turnstileToken: txt(b.turnstileToken) || undefined,
  };
  return { input, photos };
}

export async function POST(request: Request) {
  let raw: Record<string, unknown>;
  try { raw = (await request.json()) as Record<string, unknown>; }
  catch { return Response.json({ error: "Requête invalide." }, { status: 400 }); }

  const parsed = nettoyer(raw);
  if (!parsed) {
    return Response.json({ error: "Merci de compléter l'adresse, le type de bien, vos coordonnées et d'accepter le traitement de vos données." }, { status: 400 });
  }
  const { input, photos } = parsed;

  // 1. CAPTCHA (anti-bot)
  const ip = ipDe(request);
  if (!(await verifierTurnstile(input.turnstileToken, ip))) {
    return Response.json({ error: "Vérification de sécurité échouée. Merci de réessayer." }, { status: 403 });
  }

  // 2. PLAFOND quotidien global (protège la facture IA)
  try {
    if ((await countEstimationsToday()) >= plafondQuotidien()) {
      return Response.json({ error: "Le service reçoit un nombre exceptionnel de demandes aujourd'hui. Merci de réessayer un peu plus tard, ou laissez-nous vos coordonnées pour être rappelé." }, { status: 429 });
    }
  } catch { /* comptage indisponible : on n'empêche pas l'estimation */ }

  // 3. ANTI-SPAM par contact (même tel/email trop rapproché)
  try {
    const fenetre = Date.now() - fenetreAntiSpamMs();
    const recent = (await listClientEstimationsServer()).some(
      (m) => m.createdAt >= fenetre && (m.tel === input.tel || m.email.toLowerCase() === input.email.toLowerCase()),
    );
    if (recent) {
      return Response.json({ error: "Une estimation vient d'être lancée pour ces coordonnées. Consultez votre dossier ou patientez quelques minutes." }, { status: 429 });
    }
  } catch { /* best-effort */ }

  const id = rid();
  const tk = token();
  const now = Date.now();
  const completude = calculerCompletude(input, photos.length).score;
  const photoMetas: PhotoMeta[] = photos.map((p, i) => ({ idx: i, mediaType: p.mediaType }));

  // PAS de génération automatique du dossier : l'estimation est réalisée par le
  // négociateur dans son outil interne (le bien et les photos y sont pré-chargés
  // via « Faire l'estimation dans l'outil »). Ici, on ne fait que capturer le
  // prospect, son bien et ses photos. Aucun appel IA, aucun coût.
  const report: EstimationReport = REPORT_VIDE;
  const engine: "ia" | "statistique" = "statistique";
  const statut = "Nouveau lead";
  const moteurVersion = "manuel";
  const proInput = versPropertyInput(input, photos);

  // Photos → Blob, clés par le token (n'empêche jamais la création du dossier)
  await Promise.all(
    photos.map((p, i) => addClientEstimationPhoto(tk, i, p.data, p.mediaType).catch(() => null)),
  );

  const record: ClientEstimationRecord = {
    id, token: tk, createdAt: now, updatedAt: now, moteurVersion, statut,
    input: { ...input, turnstileToken: undefined, consentement: true } as ClientEstimationRecord["input"],
    photos: photoMetas,
    report,
    dvfSource: "indisponible",
    engine,
    completude,
    confiance: 0,
    notes: [],
    marketing: input.marketing,
    transmisAuClient: false,
    envoyeLe: null,
    // Bien + coordonnées à recharger dans l'outil négociateur (photos rechargées
    // du Blob au moment du « Faire l'estimation dans l'outil »).
    proInput: { ...proInput, photos: [] },
  };

  // Lead commercial : réutilise le CRM existant (SMS auto, relances, export)
  // sans modifier aucun fichier Pro. Le lien lead↔estimation est conservé.
  try {
    const lead = leadVide({
      source: "site",
      campagne: input.marketing?.utm_campaign ?? "Estimation en ligne",
      nom: input.nom, prenom: input.prenom, tel: input.tel, email: input.email, ville: input.ville,
      typeProjet: "vendeur",
      statut: "Nouveau",
      message: `Estimation en ligne — ${input.typeBien} ${input.surfaceHabitable ?? "?"} m² à ${input.ville}. Projet : ${input.projet || "n.c."}.${input.souhaiteRappel ? " Souhaite être rappelé." : ""}`,
      notes: `Dossier estimation client : ${tk}`,
    });
    const saved = await saveLeadServer(lead);
    record.leadId = saved.id;
    await declencherNewLead(saved).catch(() => null); // SMS auto si configuré
  } catch { /* la création du lead ne doit jamais bloquer l'estimation */ }

  await saveClientEstimation(record);

  // Le client reçoit TOUJOURS une confirmation : son estimation est préparée
  // par un négociateur, qui l'appelle et la lui envoie par mail (sous 3h).
  // Le résultat chiffré n'est jamais renvoyé directement au navigateur.
  return Response.json({
    status: "recu",
    token: tk,
    message: "Merci pour toutes ces informations. Votre négociateur Century 21 Icaza prépare votre estimation, vous appelle et vous l'envoie par mail sous 3h.",
  });
}
