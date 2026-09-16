import { userCourant } from "@/lib/syndic/users";
import { compterUsers } from "@/lib/syndic/users";
import { toPublicUser } from "@/lib/syndic/types";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const user = await userCourant(request);
  if (!user) {
    // `besoinBootstrap` : aucun compte n'existe encore → proposer la création
    // du premier responsable (admin) à l'aide du mot de passe d'équipe.
    const besoinBootstrap = (await compterUsers()) === 0;
    return Response.json({ user: null, besoinBootstrap });
  }
  return Response.json({ user: toPublicUser(user) });
}
