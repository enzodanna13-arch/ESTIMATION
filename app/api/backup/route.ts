import JSZip from "jszip";
import { list } from "@vercel/blob";
import { checkHistoryPassword } from "@/lib/historyAuth";

export const dynamic = "force-dynamic";
export const maxDuration = 60;

// Sauvegarde COMPLÈTE : réunit dans un seul fichier .zip TOUT le contenu du
// stockage partagé (dossiers clients + pièces PDF, estimations, documents
// générés, registre des appels, leads, visites…). Chaque fichier est rangé
// sous son chemin d'origine, ce qui rend la sauvegarde lisible et ré-importable.
export async function GET(request: Request) {
  if (!checkHistoryPassword(request)) {
    return Response.json({ error: "Accès réservé — mot de passe requis" }, { status: 401 });
  }
  try {
    // 1. Lister TOUS les blobs (pagination par curseur)
    const blobs: { pathname: string; url: string; size: number }[] = [];
    let cursor: string | undefined;
    do {
      const page = await list({ limit: 1000, cursor });
      for (const b of page.blobs) blobs.push({ pathname: b.pathname, url: b.url, size: b.size });
      cursor = page.hasMore ? page.cursor : undefined;
    } while (cursor);

    // 2. Télécharger chaque blob et l'ajouter au zip (par lots pour ménager la mémoire)
    const zip = new JSZip();
    const LOT = 12;
    for (let i = 0; i < blobs.length; i += LOT) {
      const lot = blobs.slice(i, i + LOT);
      await Promise.all(
        lot.map(async (b) => {
          try {
            const res = await fetch(b.url, { cache: "no-store" });
            if (!res.ok) return;
            zip.file(b.pathname, await res.arrayBuffer());
          } catch {
            /* blob illisible : on l'ignore sans casser la sauvegarde */
          }
        }),
      );
    }

    // 3. Manifeste récapitulatif (repères de contenu)
    const parDossier: Record<string, number> = {};
    for (const b of blobs) {
      const cat = b.pathname.split("/")[0] || "(racine)";
      parDossier[cat] = (parDossier[cat] ?? 0) + 1;
    }
    const manifeste = {
      genereLe: new Date().toISOString(),
      nbFichiers: blobs.length,
      tailleTotaleOctets: blobs.reduce((s, b) => s + (b.size || 0), 0),
      contenu: parDossier,
      note: "Sauvegarde complète du stockage partagé de l'agence (IA Century21-Icazaimmobilier).",
    };
    zip.file("_sauvegarde-manifeste.json", JSON.stringify(manifeste, null, 2));

    // 4. Générer le zip
    const buf = await zip.generateAsync({ type: "nodebuffer", compression: "DEFLATE", compressionOptions: { level: 6 } });
    const d = new Date();
    const nom = `sauvegarde-estimation-ia-${d.getFullYear()}${String(d.getMonth() + 1).padStart(2, "0")}${String(d.getDate()).padStart(2, "0")}.zip`;
    return new Response(buf as unknown as BodyInit, {
      status: 200,
      headers: {
        "content-type": "application/zip",
        "content-disposition": `attachment; filename="${nom}"`,
        "cache-control": "no-store",
      },
    });
  } catch (err) {
    console.error("Sauvegarde — échec :", err);
    return Response.json({ error: "Sauvegarde impossible" }, { status: 500 });
  }
}
