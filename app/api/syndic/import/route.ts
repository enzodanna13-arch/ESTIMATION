import { garde } from "@/lib/syndic/guard";
import { analyserImport, parseCsv, type TypeImport } from "@/lib/syndic/csv";
import {
  contactVide, listerContacts, listerLots, listerResidences,
  lotVide, residenceVide, sauverContact, sauverLot, sauverResidence,
} from "@/lib/syndic/residences";
import type { ContactSyndic, LotSyndic, QualiteContact, Residence } from "@/lib/syndic/types";

export const dynamic = "force-dynamic";
const TYPES: TypeImport[] = ["residences", "lots", "contacts"];

export async function POST(request: Request) {
  const g = await garde(request, "administrer");
  if ("erreur" in g) return g.erreur;

  let body: { type?: string; csvText?: string; mapping?: Record<string, string>; appliquer?: boolean };
  try { body = (await request.json()) as typeof body; } catch {
    return Response.json({ error: "Requête invalide" }, { status: 400 });
  }
  const type = body.type as TypeImport;
  if (!TYPES.includes(type)) return Response.json({ error: "Type d'import inconnu" }, { status: 400 });
  const parse = parseCsv(body.csvText ?? "");
  if (parse.headers.length === 0) return Response.json({ error: "Fichier vide ou illisible" }, { status: 400 });

  const analyse = analyserImport(type, parse, body.mapping ?? {});

  // Aperçu (pas d'écriture) : on renvoie les colonnes détectées + les 30
  // premières lignes analysées, pour valider la correspondance avant d'importer.
  if (!body.appliquer) {
    return Response.json({
      headers: parse.headers,
      apercu: analyse.lignes.slice(0, 30),
      nbValides: analyse.nbValides,
      nbErreurs: analyse.nbErreurs,
      total: analyse.lignes.length,
    });
  }

  // Application : upsert sur refExterne (import rejouable sans doublon).
  const valides = analyse.lignes.filter((l) => l.erreurs.length === 0);
  let crees = 0, majs = 0;

  if (type === "residences") {
    const parRef = new Map((await listerResidences()).map((r) => [r.refExterne, r] as const));
    for (const l of valides) {
      const v = l.valeurs;
      const exist = parRef.get(v.refExterne);
      const r: Residence = exist
        ? { ...exist, nom: v.nom, adresse: v.adresse, codePostal: v.codePostal, commune: v.commune }
        : residenceVide({ nom: v.nom, adresse: v.adresse, codePostal: v.codePostal, commune: v.commune, refExterne: v.refExterne });
      await sauverResidence(r);
      exist ? majs++ : crees++;
    }
  } else if (type === "lots") {
    const residParRef = new Map((await listerResidences()).map((r) => [r.refExterne, r] as const));
    const parRef = new Map((await listerLots()).map((l) => [l.refExterne, l] as const));
    const erreurs: string[] = [];
    for (const l of valides) {
      const v = l.valeurs;
      const resid = residParRef.get(v.residenceRef);
      if (!resid) { erreurs.push(`Ligne ${l.ligne} : résidence « ${v.residenceRef} » introuvable`); continue; }
      const exist = parRef.get(v.refExterne);
      const lot: LotSyndic = exist
        ? { ...exist, residenceId: resid.id, numero: v.numero, batiment: v.batiment, etage: v.etage, type: v.type }
        : lotVide({ residenceId: resid.id, numero: v.numero, batiment: v.batiment, etage: v.etage, type: v.type, refExterne: v.refExterne });
      await sauverLot(lot);
      exist ? majs++ : crees++;
    }
    return Response.json({ crees, majs, ignores: analyse.nbErreurs + erreurs.length, erreurs });
  } else {
    const lotParRef = new Map((await listerLots()).map((l) => [l.refExterne, l] as const));
    const parRef = new Map((await listerContacts()).map((c) => [c.refExterne, c] as const));
    for (const l of valides) {
      const v = l.valeurs;
      const exist = parRef.get(v.refExterne);
      const base: ContactSyndic = exist
        ? { ...exist, nom: v.nom, prenom: v.prenom, telephone: v.telephone, email: v.email }
        : contactVide({ nom: v.nom, prenom: v.prenom, telephone: v.telephone, email: v.email, refExterne: v.refExterne });
      if (v.lotRef) {
        const lot = lotParRef.get(v.lotRef);
        if (lot) {
          const qualite = (v.qualite || "proprietaire") as QualiteContact;
          const liens = base.liens.filter((x) => x.lotId !== lot.id);
          liens.push({ lotId: lot.id, qualite });
          base.liens = liens;
        }
      }
      await sauverContact(base);
      exist ? majs++ : crees++;
    }
  }

  return Response.json({ crees, majs, ignores: analyse.nbErreurs, erreurs: [] });
}
