import { checkHistoryPassword } from "@/lib/historyAuth";
import { ROOM_TYPES, STYLES_DECO, type EditRequest, type EditResult } from "@/lib/imageEditing/types";

export const maxDuration = 300;
export const dynamic = "force-dynamic";

// Route de retouche IA (« Vider la pièce » et « Meubler virtuellement »).
// Le FOURNISSEUR est choisi par variable d'environnement — l'UI ne change
// jamais. Fournisseurs prêts à brancher :
//   IMAGE_EDIT_PROVIDER=replicate  → REPLICATE_API_TOKEN + versions de modèles
//   IMAGE_EDIT_PROVIDER=http       → IMAGE_EDIT_ENDPOINT (+ IMAGE_EDIT_API_KEY)
// Sans configuration : réponse 501 « non configuré » (l'UI l'indique proprement).

function construirePrompt(req: EditRequest): { prompt: string; negative: string } {
  if (req.action === "emptyRoom") {
    return {
      prompt:
        "Empty this room completely: remove all furniture, decorations and movable objects. " +
        "Keep and realistically reconstruct the walls, floor, ceiling, windows, doors, radiators and all fixed equipment. " +
        "Preserve the exact architecture, volumes and perspective. Photorealistic real-estate photo, clean and neutral.",
      negative: "furniture, decoration, people, text, watermark, distortion, changed architecture",
    };
  }
  const style = STYLES_DECO.find((s) => s.id === req.style);
  const room = ROOM_TYPES.find((r) => r.id === req.roomType);
  const styleFrag = req.style === "auto" || !style
    ? "the most fitting interior design style for this room"
    : style.prompt;
  const roomFrag = room ? room.prompt : "tasteful furniture adapted to the room";
  return {
    prompt:
      `Virtually stage this empty room as a ${roomFrag}. Style: ${styleFrag}. ` +
      "Photorealistic real-estate home staging. Respect the exact room dimensions, perspective, windows, doors, openings and existing architecture. " +
      "Do not modify the structure, walls, floor or ceiling. Natural lighting, professional listing photo.",
    negative: "changed architecture, extra windows, extra doors, distortion, people, text, watermark, unrealistic",
  };
}

// ---- Fournisseur Replicate (polling) ----
async function viaReplicate(req: EditRequest, prompt: string): Promise<EditResult> {
  const token = process.env.REPLICATE_API_TOKEN;
  const version =
    req.action === "emptyRoom"
      ? process.env.REPLICATE_EMPTY_ROOM_VERSION
      : process.env.REPLICATE_STAGING_VERSION;
  if (!token || !version) return { ok: false, notConfigured: true, error: "Fournisseur Replicate incomplet (token/version manquants)." };

  const dataUrl = `data:${req.image.mediaType};base64,${req.image.data}`;
  const create = await fetch("https://api.replicate.com/v1/predictions", {
    method: "POST",
    headers: { Authorization: `Bearer ${token}`, "content-type": "application/json" },
    body: JSON.stringify({ version, input: { image: dataUrl, prompt } }),
  });
  if (!create.ok) return { ok: false, error: `Replicate: ${create.status}` };
  let pred = (await create.json()) as { id: string; status: string; output?: unknown; urls?: { get: string } };

  const debut = Date.now();
  while (["starting", "processing"].includes(pred.status) && Date.now() - debut < 270_000) {
    await new Promise((r) => setTimeout(r, 2000));
    const poll = await fetch(pred.urls!.get, { headers: { Authorization: `Bearer ${token}` } });
    pred = (await poll.json()) as typeof pred;
  }
  if (pred.status !== "succeeded") return { ok: false, error: `Génération ${pred.status}` };

  const url = Array.isArray(pred.output) ? (pred.output[pred.output.length - 1] as string) : (pred.output as string);
  if (!url) return { ok: false, error: "Aucune image renvoyée." };
  const bin = await fetch(url);
  const buf = Buffer.from(await bin.arrayBuffer());
  return { ok: true, provider: "replicate", image: { mediaType: bin.headers.get("content-type") ?? "image/png", data: buf.toString("base64") } };
}

// ---- Fournisseur Black Forest Labs — FLUX Kontext (édition par instruction) ----
async function viaBfl(req: EditRequest, prompt: string): Promise<EditResult> {
  const key = process.env.BFL_API_KEY;
  if (!key) return { ok: false, notConfigured: true, error: "BFL_API_KEY non défini." };
  const modele = process.env.BFL_MODEL || "flux-kontext-pro"; // ou flux-kontext-max
  const base = process.env.BFL_API_BASE || "https://api.bfl.ai";

  const create = await fetch(`${base}/v1/${modele}`, {
    method: "POST",
    headers: { "x-key": key, "content-type": "application/json", accept: "application/json" },
    body: JSON.stringify({ prompt, input_image: req.image.data, output_format: "jpeg", safety_tolerance: 2 }),
  });
  if (create.status === 402) return { ok: false, error: "Crédits BFL insuffisants — rechargez le compte Black Forest Labs." };
  if (create.status === 401 || create.status === 403) return { ok: false, error: "Clé BFL refusée." };
  if (!create.ok) return { ok: false, error: `BFL: ${create.status}` };
  const cj = (await create.json()) as { id?: string; polling_url?: string };
  const pollUrl = cj.polling_url || (cj.id ? `${base}/v1/get_result?id=${cj.id}` : null);
  if (!pollUrl) return { ok: false, error: "BFL: réponse invalide." };

  const debut = Date.now();
  while (Date.now() - debut < 270_000) {
    await new Promise((r) => setTimeout(r, 2000));
    const pr = await fetch(pollUrl, { headers: { "x-key": key, accept: "application/json" } });
    const pj = (await pr.json()) as { status: string; result?: { sample?: string } };
    if (pj.status === "Ready" && pj.result?.sample) {
      const bin = await fetch(pj.result.sample);
      const buf = Buffer.from(await bin.arrayBuffer());
      return { ok: true, provider: "bfl", image: { mediaType: "image/jpeg", data: buf.toString("base64") } };
    }
    if (["Error", "Failed", "Content Moderated", "Request Moderated"].includes(pj.status)) {
      return { ok: false, error: `BFL: ${pj.status}` };
    }
  }
  return { ok: false, error: "BFL: délai dépassé." };
}

// ---- Fournisseur HTTP générique ----
async function viaHttp(req: EditRequest, prompt: string): Promise<EditResult> {
  const endpoint = process.env.IMAGE_EDIT_ENDPOINT;
  if (!endpoint) return { ok: false, notConfigured: true, error: "IMAGE_EDIT_ENDPOINT non défini." };
  const res = await fetch(endpoint, {
    method: "POST",
    headers: {
      "content-type": "application/json",
      ...(process.env.IMAGE_EDIT_API_KEY ? { authorization: `Bearer ${process.env.IMAGE_EDIT_API_KEY}` } : {}),
    },
    body: JSON.stringify({ action: req.action, prompt, image: req.image }),
  });
  if (!res.ok) return { ok: false, error: `Fournisseur: ${res.status}` };
  const body = (await res.json()) as { image?: { mediaType: string; data: string }; data?: string };
  const image = body.image ?? (body.data ? { mediaType: "image/png", data: body.data } : undefined);
  if (!image) return { ok: false, error: "Réponse du fournisseur invalide." };
  return { ok: true, provider: "http", image };
}

export async function POST(request: Request) {
  if (!checkHistoryPassword(request)) {
    return Response.json({ ok: false, error: "Accès réservé" } satisfies EditResult, { status: 401 });
  }
  let req: EditRequest;
  try {
    req = (await request.json()) as EditRequest;
  } catch {
    return Response.json({ ok: false, error: "Requête invalide" } satisfies EditResult, { status: 400 });
  }
  if (!req.image?.data || (req.action !== "emptyRoom" && req.action !== "virtualStaging")) {
    return Response.json({ ok: false, error: "Paramètres manquants" } satisfies EditResult, { status: 400 });
  }

  const fournisseur = process.env.IMAGE_EDIT_PROVIDER;
  if (!fournisseur) {
    return Response.json(
      {
        ok: false,
        notConfigured: true,
        error:
          "Le moteur IA de génération d'images n'est pas encore connecté. L'espace est prêt : définissez IMAGE_EDIT_PROVIDER (bfl, replicate ou http) et les clés associées pour activer « Vider la pièce » et « Meubler ».",
      } satisfies EditResult,
      { status: 501 },
    );
  }

  const { prompt } = construirePrompt(req);
  try {
    const result =
      fournisseur === "bfl" ? await viaBfl(req, prompt)
      : fournisseur === "replicate" ? await viaReplicate(req, prompt)
      : await viaHttp(req, prompt);
    return Response.json(result, { status: result.ok ? 200 : result.notConfigured ? 501 : 502 });
  } catch (err) {
    console.error("Retouche IA — échec :", err);
    return Response.json({ ok: false, error: "Génération impossible — réessayez." } satisfies EditResult, { status: 500 });
  }
}
