import Anthropic from "@anthropic-ai/sdk";
import { creerTicket, ticketOuvertParEmail, ajouterRelance } from "./tickets";
import { listerResidences } from "./residences";
import { CATEGORIES_LABELS, PRIORITES_LABELS, type TicketCategorie, type TicketPriorite } from "./types";

// Passerelle « mail → ticket » (Phase 1). Un mail entrant est :
// 1. pré-filtré (règles gratuites, sans IA) pour écarter pubs/automatiques ;
// 2. analysé par l'IA (est-ce une demande ? catégorie, priorité, résidence,
//    objet, résumé) — MINIMISATION : seuls le sujet et le corps partent à l'IA,
//    jamais l'adresse ni le téléphone de l'expéditeur ;
// 3. transformé en ticket : création directe si clair, « à valider » si ambigu ;
//    et rattaché comme relance si l'expéditeur a déjà une demande ouverte.

export interface EmailEntrant {
  from: string; // adresse de l'expéditeur (métadonnée, PAS envoyée à l'IA)
  fromName: string; // nom affiché
  subject: string;
  body: string;
}

const CATS = Object.keys(CATEGORIES_LABELS);
const PRIOS = Object.keys(PRIORITES_LABELS);

// Pré-filtre gratuit : écarte les envois manifestement non pertinents.
const MOTIFS_IGNORE = [
  "no-reply", "noreply", "ne-pas-repondre", "nepasrepondre", "mailer-daemon",
  "newsletter", "notification", "mailchimp", "sendinblue", "no_reply",
];
export function passePreFiltre(email: EmailEntrant): boolean {
  const from = (email.from ?? "").toLowerCase();
  if (MOTIFS_IGNORE.some((m) => from.includes(m))) return false;
  const sujet = (email.subject ?? "").toLowerCase();
  if (/désabonn|desabonn|unsubscribe|se désinscrire/.test(sujet)) return false;
  if (!(email.body ?? "").trim() && !sujet.trim()) return false;
  return true;
}

const SYSTEME = `Tu tries les emails reçus par un service de syndic de copropriété. À partir UNIQUEMENT du sujet et du corps d'un email, tu déduis s'il s'agit d'une DEMANDE d'un copropriétaire/occupant (question, réclamation, signalement, demande de document, travaux, sinistre, charges, assemblée générale…) ou NON (publicité, information automatique, message interne, spam).

Tu n'inventes rien. Tu ne déduis la résidence que si elle est clairement citée dans le texte.

Réponds STRICTEMENT en JSON, sans texte autour :
{"est_demande": true|false, "confiance": 0-100, "categorie": "information|demande_document|travaux_parties_communes|sinistre|reclamation|charges_comptabilite|assemblee_generale|autre", "priorite": "normale|haute|urgence", "residence": "nom de la résidence si citée, sinon vide", "objet": "objet court", "resume": "résumé neutre de la demande en 1-2 phrases"}`;

interface AnalyseEmail {
  est_demande: boolean; confiance: number; categorie: string; priorite: string;
  residence: string; objet: string; resume: string;
}

function parseJson(text: string): AnalyseEmail | null {
  const m = text.match(/\{[\s\S]*\}/);
  if (!m) return null;
  try { return JSON.parse(m[0]) as AnalyseEmail; } catch { return null; }
}

export async function analyserEmail(email: EmailEntrant): Promise<AnalyseEmail | null> {
  const client = new Anthropic();
  const model = process.env.SYNDIC_IA_MODEL || "claude-sonnet-5";
  // MINIMISATION : uniquement sujet + corps.
  const contenu = `SUJET : ${email.subject || "(vide)"}\n\nCORPS :\n${email.body || "(vide)"}`;
  const message = await client.messages.create({
    model, max_tokens: 600, system: SYSTEME,
    messages: [{ role: "user", content: contenu }],
  });
  const text = message.content.filter((b): b is Anthropic.TextBlock => b.type === "text").map((b) => b.text).join("");
  return parseJson(text);
}

const norm = (s: string) => (s ?? "").toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/[^a-z0-9]+/g, " ").trim();

export type ResultatIngestion =
  | { statut: "ignore"; raison: string }
  | { statut: "relance"; ticketId: string; numero: string }
  | { statut: "cree" | "a_valider"; ticketId: string; numero: string; aValider: boolean };

export async function ingererEmail(email: EmailEntrant, creePar: string): Promise<ResultatIngestion> {
  if (!passePreFiltre(email)) return { statut: "ignore", raison: "Écarté par le pré-filtre (expéditeur/objet non pertinent)" };
  if (!process.env.ANTHROPIC_API_KEY) return { statut: "ignore", raison: "IA non configurée" };

  const a = await analyserEmail(email);
  if (!a) return { statut: "ignore", raison: "Analyse IA illisible" };
  if (!a.est_demande || a.confiance < 40) return { statut: "ignore", raison: `Pas identifié comme une demande (confiance ${a.confiance}%)` };

  // Anti-doublon : relance si l'expéditeur a déjà une demande ouverte.
  const dejaOuvert = await ticketOuvertParEmail(email.from);
  if (dejaOuvert) {
    await ajouterRelance(dejaOuvert, `Relance reçue par mail — ${a.objet || email.subject}`);
    return { statut: "relance", ticketId: dejaOuvert.id, numero: dejaOuvert.numero };
  }

  // Rapprochement de résidence (par nom cité).
  let residenceId: string | null = null;
  if (a.residence) {
    const cible = norm(a.residence);
    const residences = await listerResidences();
    const match = residences.find((r) => norm(r.nom) && (norm(r.nom).includes(cible) || cible.includes(norm(r.nom))));
    residenceId = match?.id ?? null;
  }

  const categorie = (CATS.includes(a.categorie) ? a.categorie : "autre") as TicketCategorie;
  const priorite = (PRIOS.includes(a.priorite) ? a.priorite : "normale") as TicketPriorite;
  // Clair (confiance ≥ 70) → création directe ; ambigu (40-69) → à valider.
  const aValider = a.confiance < 70;

  const ticket = await creerTicket({
    origine: "mail",
    categorie,
    priorite,
    residenceId,
    lotId: null,
    contactId: null,
    demandeurNom: email.fromName || email.from,
    demandeurTelephone: "",
    demandeurEmail: email.from,
    demandeurQualite: "",
    objet: a.objet || email.subject,
    description: a.resume || email.body,
    creneauRappel: "",
  }, creePar, { iaCategorie: categorie, iaPriorite: priorite, iaResidenceId: residenceId, iaConfiance: a.confiance, aValider });

  return { statut: aValider ? "a_valider" : "cree", ticketId: ticket.id, numero: ticket.numero, aValider };
}
