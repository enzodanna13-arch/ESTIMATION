import { put } from "@vercel/blob";
import { verifierAccesEquipe } from "@/lib/historyAuth";

export const maxDuration = 60;
export const dynamic = "force-dynamic";

// Import de photos pour une fiche de chasse : le négociateur téléverse les
// images qu'il a enregistrées depuis l'annonce (utile quand le site bloque la
// lecture automatique). Les fichiers sont stockés dans Vercel Blob et leurs
// URL publiques sont renvoyées pour être ajoutées à la fiche.

interface ImgIn { nom?: string; data: string } // data = base64 (avec ou sans préfixe data:)

function typeEtData(data: string): { mime: string; ext: string; b64: string } | null {
  let b64 = data;
  const m = data.match(/^data:(image\/(jpe?g|png|webp|avif));base64,(.*)$/i);
  if (m) { b64 = m[3]; }
  // Détection par signature si pas de préfixe
  if (b64.startsWith("/9j/")) return { mime: "image/jpeg", ext: "jpg", b64 };
  if (b64.startsWith("iVBORw0KGgo")) return { mime: "image/png", ext: "png", b64 };
  if (b64.startsWith("UklGR")) return { mime: "image/webp", ext: "webp", b64 };
  if (m) {
    const sub = m[2].toLowerCase();
    const ext = sub === "jpeg" ? "jpg" : sub;
    return { mime: m[1].toLowerCase(), ext, b64 };
  }
  return null;
}

export async function POST(request: Request) {
  if (!(await verifierAccesEquipe(request))) {
    return Response.json({ error: "Accès réservé — mot de passe requis" }, { status: 401 });
  }
  let ficheId = "";
  let images: ImgIn[] = [];
  try {
    const body = (await request.json()) as { ficheId?: string; images?: ImgIn[] };
    ficheId = (body.ficheId ?? "sans-id").replace(/[^a-z0-9-]/gi, "").slice(0, 60) || "sans-id";
    images = (body.images ?? []).slice(0, 20);
  } catch {
    return Response.json({ error: "Requête invalide" }, { status: 400 });
  }
  if (images.length === 0) return Response.json({ error: "Aucune image" }, { status: 400 });

  const urls: string[] = [];
  for (const img of images) {
    const info = typeEtData(img.data ?? "");
    if (!info) continue;
    try {
      const bin = Buffer.from(info.b64, "base64");
      if (bin.length === 0 || bin.length > 8_000_000) continue; // 8 Mo max/photo
      const nom = `chasse/photos/${ficheId}/${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}.${info.ext}`;
      const res = await put(nom, bin, { access: "public", addRandomSuffix: false, contentType: info.mime });
      urls.push(res.url);
    } catch (err) {
      console.error("Upload photo chasse impossible :", err);
    }
  }
  if (urls.length === 0) return Response.json({ error: "Aucune image lisible (JPEG, PNG ou WebP attendus)" }, { status: 400 });
  return Response.json({ urls });
}
