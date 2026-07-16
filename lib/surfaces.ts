import type { PropertyInput } from "./types";

// Règle « maison » : la surface habitable TOTALE = surface du logement
// principal + surfaces des dépendances HABITABLES (studio, T2/T3/T4,
// maison d'amis). Les dépendances non habitables (garage, atelier, abri…)
// ne comptent pas dans la surface habitable — elles restent des atouts
// valorisés à part.

export const DEPENDANCES_HABITABLES = [
  "Studio indépendant",
  "T2 indépendant",
  "T3 indépendant",
  "T4 indépendant",
  "Maison d'amis",
];

export function surfaceDependancesHabitables(
  input: Pick<PropertyInput, "dependances">,
): number {
  return (input.dependances ?? [])
    .filter((d) => DEPENDANCES_HABITABLES.includes(d.type))
    .reduce((s, d) => s + (d.surface ?? 0), 0);
}

export function surfaceHabitableTotale(
  input: Pick<PropertyInput, "surfaceHabitable" | "dependances">,
): number {
  return (input.surfaceHabitable ?? 0) + surfaceDependancesHabitables(input);
}
