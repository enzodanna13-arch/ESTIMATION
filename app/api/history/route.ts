import { listEstimationsServer } from "@/lib/serverHistory";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const entries = await listEstimationsServer();
    return Response.json({ entries });
  } catch (err) {
    console.error("Lecture de l'historique impossible :", err);
    return Response.json({ entries: [] });
  }
}
