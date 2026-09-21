import { verifierAccesEquipe } from "@/lib/historyAuth";

export const dynamic = "force-dynamic";

// Géocodage d'une adresse (Base Adresse Nationale, gratuit) → lat/lon, pour
// placer le bien sur la carte de la chasse. Repli sur la commune si l'adresse
// précise n'est pas trouvée.

async function ban(q: string, codePostal: string): Promise<{ lat: number; lon: number } | null> {
  if (!q.trim()) return null;
  try {
    const url = `https://api-adresse.data.gouv.fr/search/?q=${encodeURIComponent(q)}${/^\d{5}$/.test(codePostal) ? `&postcode=${codePostal}` : ""}&limit=1`;
    const ctrl = new AbortController();
    const t = setTimeout(() => ctrl.abort(), 7000);
    const res = await fetch(url, { signal: ctrl.signal });
    clearTimeout(t);
    if (!res.ok) return null;
    const body = (await res.json()) as { features?: { geometry?: { coordinates?: number[] } }[] };
    const c = body.features?.[0]?.geometry?.coordinates;
    if (!c || typeof c[0] !== "number" || typeof c[1] !== "number") return null;
    return { lon: c[0], lat: c[1] };
  } catch {
    return null;
  }
}

export async function POST(request: Request) {
  if (!(await verifierAccesEquipe(request))) return Response.json({ error: "Accès réservé" }, { status: 401 });
  let adresse = "", ville = "", codePostal = "";
  try {
    const b = (await request.json()) as { adresse?: string; ville?: string; codePostal?: string };
    adresse = (b.adresse ?? "").trim();
    ville = (b.ville ?? "").trim();
    codePostal = (b.codePostal ?? "").trim();
  } catch {
    return Response.json({ error: "Requête invalide" }, { status: 400 });
  }
  if (!/^\d{5}$/.test(codePostal)) {
    const m = ville.match(/\b(\d{5})\b/);
    if (m) codePostal = m[1];
  }
  const villeSansCp = ville.replace(/\b\d{5}\b/, "").trim();

  // 1) adresse précise, 2) repli commune
  const q1 = [adresse, villeSansCp].filter(Boolean).join(" ");
  const q2 = [villeSansCp || ville, codePostal].filter(Boolean).join(" ");
  const r = (await ban(q1, codePostal)) ?? (await ban(q2, codePostal));
  if (!r) return Response.json({ trouve: false });
  return Response.json({ trouve: true, lat: r.lat, lon: r.lon });
}
