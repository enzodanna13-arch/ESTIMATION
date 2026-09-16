// Import CSV des résidences, lots et contacts. Le format d'export du logiciel de
// syndic n'est pas connu d'avance : l'admin fait donc CORRESPONDRE les colonnes
// du fichier aux champs attendus, avec aperçu et rapport d'erreurs. L'import est
// rejouable sans doublon (mise à jour sur `refExterne`). Parsing pur et testable.

export type TypeImport = "residences" | "lots" | "contacts";

export interface ChampImport {
  cle: string;
  libelle: string;
  requis: boolean;
}

// Champs attendus par type (l'ordre sert d'ordre d'affichage dans l'écran).
export const CHAMPS_IMPORT: Record<TypeImport, ChampImport[]> = {
  residences: [
    { cle: "refExterne", libelle: "Référence (identifiant syndic)", requis: true },
    { cle: "nom", libelle: "Nom de la résidence", requis: true },
    { cle: "adresse", libelle: "Adresse", requis: false },
    { cle: "codePostal", libelle: "Code postal", requis: false },
    { cle: "commune", libelle: "Commune", requis: false },
  ],
  lots: [
    { cle: "refExterne", libelle: "Référence du lot", requis: true },
    { cle: "residenceRef", libelle: "Référence de la résidence", requis: true },
    { cle: "numero", libelle: "Numéro de lot", requis: true },
    { cle: "batiment", libelle: "Bâtiment", requis: false },
    { cle: "etage", libelle: "Étage", requis: false },
    { cle: "type", libelle: "Type de lot", requis: false },
  ],
  contacts: [
    { cle: "refExterne", libelle: "Référence du contact", requis: true },
    { cle: "nom", libelle: "Nom", requis: true },
    { cle: "prenom", libelle: "Prénom", requis: false },
    { cle: "telephone", libelle: "Téléphone", requis: false },
    { cle: "email", libelle: "Email", requis: false },
    { cle: "lotRef", libelle: "Référence du lot rattaché", requis: false },
    { cle: "qualite", libelle: "Qualité (proprietaire/occupant/conseil_syndical)", requis: false },
  ],
};

// Détecte le séparateur (`;` fréquent sur les exports FR, sinon `,` ou tab).
function detecterSeparateur(entete: string): string {
  const candidats = [";", ",", "\t"];
  let best = ";", score = -1;
  for (const c of candidats) {
    const n = entete.split(c).length;
    if (n > score) { score = n; best = c; }
  }
  return best;
}

// Parse une ligne CSV en tenant compte des guillemets.
function parseLigne(ligne: string, sep: string): string[] {
  const cells: string[] = [];
  let cur = "", dansGuillemets = false;
  for (let i = 0; i < ligne.length; i++) {
    const ch = ligne[i];
    if (ch === '"') {
      if (dansGuillemets && ligne[i + 1] === '"') { cur += '"'; i++; }
      else dansGuillemets = !dansGuillemets;
    } else if (ch === sep && !dansGuillemets) {
      cells.push(cur); cur = "";
    } else {
      cur += ch;
    }
  }
  cells.push(cur);
  return cells.map((c) => c.trim());
}

export interface CsvParse {
  headers: string[];
  rows: string[][];
}

export function parseCsv(texte: string): CsvParse {
  const lignes = texte.replace(/\r\n/g, "\n").replace(/\r/g, "\n").split("\n").filter((l) => l.trim() !== "");
  if (lignes.length === 0) return { headers: [], rows: [] };
  const sep = detecterSeparateur(lignes[0]);
  const headers = parseLigne(lignes[0], sep);
  const rows = lignes.slice(1).map((l) => parseLigne(l, sep));
  return { headers, rows };
}

export interface LigneAnalysee {
  ligne: number; // numéro de ligne (1 = première ligne de données)
  valeurs: Record<string, string>;
  erreurs: string[];
}

export interface AnalyseImport {
  lignes: LigneAnalysee[];
  nbValides: number;
  nbErreurs: number;
}

const QUALITES_OK = new Set(["proprietaire", "occupant", "conseil_syndical", ""]);

// Applique la correspondance de colonnes et valide chaque ligne. `mapping`
// associe une clé de champ (ex. "nom") à un nom de colonne du fichier.
export function analyserImport(
  type: TypeImport,
  parse: CsvParse,
  mapping: Record<string, string>,
): AnalyseImport {
  const champs = CHAMPS_IMPORT[type];
  const idxCol = (nomCol: string) => parse.headers.indexOf(nomCol);

  const lignes: LigneAnalysee[] = parse.rows.map((row, i) => {
    const valeurs: Record<string, string> = {};
    const erreurs: string[] = [];
    for (const champ of champs) {
      const nomCol = mapping[champ.cle];
      const val = nomCol && idxCol(nomCol) >= 0 ? (row[idxCol(nomCol)] ?? "").trim() : "";
      valeurs[champ.cle] = val;
      if (champ.requis && !val) erreurs.push(`« ${champ.libelle} » manquant`);
    }
    if (type === "contacts" && valeurs.qualite && !QUALITES_OK.has(valeurs.qualite)) {
      erreurs.push(`Qualité « ${valeurs.qualite} » non reconnue`);
    }
    return { ligne: i + 1, valeurs, erreurs };
  });

  const nbErreurs = lignes.filter((l) => l.erreurs.length > 0).length;
  return { lignes, nbValides: lignes.length - nbErreurs, nbErreurs };
}
