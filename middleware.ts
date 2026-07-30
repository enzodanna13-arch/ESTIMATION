import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Le domaine public des visites virtuelles (visite360-icaza.vercel.app) ne
// sert QUE les visites : l'outil interne (estimations, documents, dossiers
// clients) reste réservé au domaine de l'agence. Toute autre URL sur le
// domaine visite est renvoyée vers une page « visite introuvable ».

const HOTES_VISITE = ["visite360-icaza.vercel.app"];

export function middleware(request: NextRequest) {
  const hote = request.headers.get("host") ?? "";
  if (!HOTES_VISITE.includes(hote)) return NextResponse.next();
  const { pathname } = request.nextUrl;
  const autorise =
    pathname.startsWith("/visite/") ||
    pathname.startsWith("/api/visites/") ||
    pathname.startsWith("/_next/") ||
    pathname.startsWith("/c21/") ||
    pathname === "/favicon.ico";
  if (autorise) return NextResponse.next();
  const url = request.nextUrl.clone();
  url.pathname = "/visite/introuvable";
  return NextResponse.redirect(url);
}

export const config = {
  matcher: ["/((?!_next/static|_next/image).*)"],
};
