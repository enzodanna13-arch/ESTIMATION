import { listLeadsServer, saveLeadServer, type Lead } from "./serverLeads";
import { envoyerSmsPourLead } from "./serverSms";
import { twilioConfigure } from "./twilio";
import { ecrireRelancesConfig, lireRelancesConfig } from "./relancesConfig";

const JOUR = 86400000;

// Relances programmées après le dernier appel non abouti, en JOURS :
// le lendemain (J+1), puis J+3, puis J+6. Trois relances au maximum.
export const OFFSETS_RELANCE = [1, 3, 6];

// Statuts « client non joint au téléphone » qui ouvrent une séquence de relance.
export const STATUTS_NON_JOINT = ["Répondeur / message laissé", "À rappeler"];

export function estNonJoint(statut: string): boolean {
  return STATUTS_NON_JOINT.includes((statut || "").trim());
}

// Met à jour les champs de séquence d'après le changement de statut :
// - entrée en « non joint » → démarre une nouvelle séquence ;
// - sortie (client joint, RDV, converti, perdu…) → ferme la séquence.
export function appliquerTransitionRelance(lead: Lead, ancienStatut: string): Lead {
  const avant = estNonJoint(ancienStatut);
  const apres = estNonJoint(lead.statut);
  if (apres && !avant) return { ...lead, relanceAutoBase: Date.now(), relanceAutoCount: 0, relanceAutoLast: 0 };
  if (!apres && (lead.relanceAutoBase ?? 0) > 0) return { ...lead, relanceAutoBase: 0 };
  return lead;
}

export interface RelanceResume { actif: boolean; candidats: number; envoyes: number; erreurs: number; details: string[] }

// Traite toutes les relances dues. À appeler une fois par jour (le matin).
export async function traiterRelances(force = false): Promise<RelanceResume> {
  const resume: RelanceResume = { actif: true, candidats: 0, envoyes: 0, erreurs: 0, details: [] };
  const cfg = await lireRelancesConfig();
  if (!cfg.actif && !force) { resume.actif = false; resume.details.push("Relance automatique désactivée."); return resume; }
  if (!twilioConfigure()) { resume.details.push("Twilio non configuré (SMS impossibles)."); return resume; }

  const leads = await listLeadsServer();
  const now = Date.now();
  for (const lead of leads) {
    const base = lead.relanceAutoBase ?? 0;
    if (base <= 0) continue;                         // pas de séquence ouverte
    if (!estNonJoint(lead.statut)) continue;         // le client a été joint / statut changé
    if (!lead.negociateur?.trim()) continue;         // besoin d'un négociateur (signature)
    if (!lead.tel?.trim()) continue;                 // pas de numéro
    const count = lead.relanceAutoCount ?? 0;
    if (count >= OFFSETS_RELANCE.length) continue;   // séquence terminée
    if (now < base + OFFSETS_RELANCE[count] * JOUR) continue; // pas encore l'heure
    if ((lead.relanceAutoLast ?? 0) > now - JOUR + 3600000) continue; // déjà relancé aujourd'hui
    resume.candidats++;
    try {
      await envoyerSmsPourLead({ lead, type: "NO_ANSWER" });
      await saveLeadServer({ ...lead, relanceAutoCount: count + 1, relanceAutoLast: now });
      resume.envoyes++;
      resume.details.push(`Relance ${count + 1}/${OFFSETS_RELANCE.length} → ${[lead.prenom, lead.nom].filter(Boolean).join(" ")} (${lead.negociateur})`);
    } catch (e) {
      resume.erreurs++;
      resume.details.push(`Échec ${lead.nom || lead.tel} : ${(e as Error)?.message ?? "erreur"}`);
    }
  }
  await ecrireRelancesConfig({ dernierRun: now, dernierEnvoi: resume.envoyes });
  return resume;
}
