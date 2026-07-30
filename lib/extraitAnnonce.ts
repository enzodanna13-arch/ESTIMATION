// Extraction « best-effort » des métadonnées PUBLIQUES d'UNE page d'annonce
// (titre, prix, photo, ville) : JSON-LD schema.org d'abord, puis balises
// Open Graph, puis repli sur le <title> et une détection de prix. Aucune
// dépendance ; une seule page lue, à la demande — pas de moissonnage.

export interface AnnonceExtraite {
  titre: string;
  prix: number | null;
  image: string;
  ville: string;
  source: string;
}

function decode(s: string): string {
  return s
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#0?39;|&apos;/g, "'")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&nbsp;|&#160;/g, " ")
    .replace(/&eacute;/g, "é")
    .replace(/&egrave;/g, "è")
    .trim();
}

function meta(html: string, prop: string): string | null {
  const re = new RegExp(
    `<meta[^>]+(?:property|name)=["']${prop}["'][^>]+content=["']([^"']+)["']`,
    "i",
  );
  const m = html.match(re) ?? html.match(
    new RegExp(`<meta[^>]+content=["']([^"']+)["'][^>]+(?:property|name)=["']${prop}["']`, "i"),
  );
  return m ? decode(m[1]) : null;
}

function prixDepuisTexte(t: string): number | null {
  // Cherche un montant plausible d'annonce (≥ 10 000 €)
  const matches = [...t.matchAll(/(\d[\d  .]{4,})\s*€/g)];
  const valeurs = matches
    .map((m) => Number(m[1].replace(/[^\d]/g, "")))
    .filter((n) => n >= 10000 && n <= 50000000);
  return valeurs.length ? valeurs[0] : null;
}

/** Parcourt le JSON-LD à la recherche d'un prix (offers/price). */
function prixDepuisJsonLd(html: string): number | null {
  const blocs = [...html.matchAll(/<script[^>]+application\/ld\+json[^>]*>([\s\S]*?)<\/script>/gi)];
  for (const b of blocs) {
    try {
      const data = JSON.parse(b[1].trim());
      const pile = Array.isArray(data) ? [...data] : [data];
      while (pile.length) {
        const n = pile.pop();
        if (!n || typeof n !== "object") continue;
        const offers = n.offers ?? n.priceSpecification;
        const cands = [n.price, offers?.price, Array.isArray(offers) ? offers[0]?.price : null];
        for (const c of cands) {
          const v = typeof c === "string" ? Number(c.replace(/[^\d.]/g, "")) : typeof c === "number" ? c : NaN;
          if (v >= 10000 && v <= 50000000) return Math.round(v);
        }
        for (const val of Object.values(n)) if (val && typeof val === "object") pile.push(val);
      }
    } catch {
      /* JSON-LD invalide : on ignore ce bloc */
    }
  }
  return null;
}

export async function extraireAnnonce(url: string): Promise<AnnonceExtraite | null> {
  let hote = "";
  try {
    hote = new URL(url).hostname.replace(/^www\./, "");
  } catch {
    return null;
  }
  let res: Response;
  try {
    res = await fetch(url, {
      redirect: "follow",
      headers: {
        "user-agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120 Safari/537.36",
        "accept-language": "fr-FR,fr;q=0.9",
      },
      signal: AbortSignal.timeout(15000),
    });
  } catch {
    return null;
  }
  if (!res.ok) return null;
  const html = (await res.text()).slice(0, 800000);

  const titre = meta(html, "og:title") ?? decode((html.match(/<title[^>]*>([^<]+)<\/title>/i)?.[1] ?? "")).slice(0, 160);
  const image = meta(html, "og:image") ?? "";
  const prix = prixDepuisJsonLd(html) ?? prixDepuisTexte(meta(html, "og:description") ?? "") ?? prixDepuisTexte(html);
  const villeMeta = meta(html, "og:locality") ?? meta(html, "og:region") ?? "";

  return {
    titre: titre || `Annonce ${hote}`,
    prix,
    image,
    ville: villeMeta,
    source: hote,
  };
}
