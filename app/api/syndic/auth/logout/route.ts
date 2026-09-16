import { cookieDeconnexion } from "@/lib/syndic/session";

export const dynamic = "force-dynamic";

export async function POST() {
  return Response.json({ ok: true }, { headers: { "Set-Cookie": cookieDeconnexion() } });
}
