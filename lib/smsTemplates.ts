import type { Lead } from "./serverLeads";
import { prenomNegociateur, telNegociateurFormate } from "./equipe";

// Templates SMS CENTRALISÉS — aucun texte SMS dupliqué ailleurs.
// buildSmsTemplate(type, lead, agentNom?, custom?) renvoie le corps du message
// et indique si une négociatrice est requise (relances signées).

export type SmsType =
  | "NEW_LEAD"
  | "NO_ANSWER"
  | "NOT_INTERESTED"
  | "CUSTOM"
  | "APPOINTMENT_CONFIRMATION"
  | "APPOINTMENT_REMINDER"
  | "FOLLOW_UP";

export const SMS_TYPE_LABELS: Record<SmsType, string> = {
  NEW_LEAD: "Nouveau lead",
  NO_ANSWER: "Pas répondu",
  NOT_INTERESTED: "Pas intéressé",
  CUSTOM: "Message personnalisé",
  APPOINTMENT_CONFIRMATION: "Confirmation de RDV",
  APPOINTMENT_REMINDER: "Rappel de RDV",
  FOLLOW_UP: "Relance",
};

// Types proposés à l'envoi MANUEL depuis la fiche (NEW_LEAD est automatique).
export const SMS_TYPES_MANUELS: SmsType[] = ["NO_ANSWER", "NOT_INTERESTED", "CUSTOM"];

const AGENCE = "CENTURY 21 Icaza";

function prenomClient(lead: Lead): string {
  return (lead.prenom || "").trim();
}

// Signature agence + négociatrice « CENTURY 21 Icaza \n Léa – 07 68 26 77 35 ».
function signatureAgent(agentNom: string): string | null {
  const prenom = prenomNegociateur(agentNom);
  const tel = telNegociateurFormate(agentNom);
  if (!prenom || !tel) return null;
  return `${AGENCE}\n${prenom} – ${tel}`;
}

export interface SmsTemplate {
  body: string;
  requiresAgent: boolean;
}

export function buildSmsTemplate(
  type: SmsType,
  lead: Lead,
  agentNom?: string,
  custom?: string,
): SmsTemplate {
  const p = prenomClient(lead);
  const bonjour = p ? `Bonjour ${p},` : "Bonjour,";
  const sig = agentNom ? signatureAgent(agentNom) : null;

  switch (type) {
    case "NEW_LEAD":
      // SMS générique agence — JAMAIS de négociatrice ni de numéro personnel.
      return {
        requiresAgent: false,
        body: `${bonjour} nous avons bien reçu votre demande concernant l'estimation de votre bien. L'équipe ${AGENCE} vous rappelle dans les meilleurs délais afin d'échanger avec vous sur votre projet.\n\n${AGENCE}`,
      };

    case "NO_ANSWER":
      return {
        requiresAgent: true,
        body: `${bonjour} nous avons essayé de vous joindre concernant l'estimation de votre bien. N'hésitez pas à nous rappeler ou à répondre directement à ce SMS afin que nous puissions échanger selon vos disponibilités.\n\n${sig ?? AGENCE}`,
      };

    case "NOT_INTERESTED":
      return {
        requiresAgent: true,
        body: `${bonjour} nous faisons suite à votre demande concernant l'estimation de votre bien. Nous comprenons que votre projet ne soit peut-être plus d'actualité. Si votre situation évolue ou si vous souhaitez simplement connaître la valeur actuelle de votre bien, nous restons à votre disposition.\n\n${sig ?? AGENCE}`,
      };

    case "CUSTOM": {
      const corps = (custom ?? "").trim();
      // Reprise automatique de la signature négociatrice si attribuée.
      return { requiresAgent: false, body: sig ? `${corps}\n\n${sig}` : corps };
    }

    // Prévu pour les futures automatisations (RDV, relances programmées).
    case "APPOINTMENT_CONFIRMATION":
      return {
        requiresAgent: true,
        body: `${bonjour} nous vous confirmons notre rendez-vous concernant l'estimation de votre bien. À très bientôt.\n\n${sig ?? AGENCE}`,
      };
    case "APPOINTMENT_REMINDER":
      return {
        requiresAgent: true,
        body: `${bonjour} petit rappel de notre rendez-vous concernant l'estimation de votre bien. À très vite.\n\n${sig ?? AGENCE}`,
      };
    case "FOLLOW_UP":
      return {
        requiresAgent: true,
        body: `${bonjour} nous revenons vers vous concernant l'estimation de votre bien. Souhaitez-vous que nous en échangions ?\n\n${sig ?? AGENCE}`,
      };
  }
}
