"use client";

import { use, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Report from "@/components/Report";
import { getClientEstimation, urlPhotoBackoffice } from "@/lib/backofficeEstimations";
import type { EstimateResponse, PhotoInput, PropertyInput } from "@/lib/types";

// Dossier d'estimation client rendu EXACTEMENT comme l'outil interne : on
// réutilise le composant Report.tsx du Pro (non modifié), alimenté par les
// données persistées (proInput + dvfSales + subject + report). Route protégée
// par le mot de passe d'équipe (clé de session, conservée en navigation
// même onglet depuis le back-office). Le bouton d'export du dossier
// (window.print) est celui du composant Report lui-même.

async function photoBase64(id: string, idx: number): Promise<string | null> {
  try {
    const res = await fetch(urlPhotoBackoffice(id, idx), { cache: "no-store", headers: { "x-history-key": sessionStorage.getItem("estimation-history-key") ?? "" } });
    if (!res.ok) return null;
    const buf = new Uint8Array(await res.arrayBuffer());
    let bin = "";
    for (let i = 0; i < buf.length; i += 0x8000) bin += String.fromCharCode(...buf.subarray(i, i + 0x8000));
    return btoa(bin);
  } catch { return null; }
}

export default function DossierNegociateur({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const [data, setData] = useState<{ result: EstimateResponse; input: PropertyInput } | null>(null);
  const [etat, setEtat] = useState<"chargement" | "pret" | "verrou" | "introuvable" | "vide">("chargement");

  useEffect(() => {
    let vivant = true;
    (async () => {
      const rec = await getClientEstimation(id);
      if (!vivant) return;
      if (!rec) { setEtat(sessionStorage.getItem("estimation-history-key") ? "introuvable" : "verrou"); return; }
      if (!rec.proInput || rec.report.prix_estime <= 0) { setEtat("vide"); return; }

      // Recharge les photos (base64) depuis le Blob pour les pages photos du dossier.
      const mt = (i: number): PhotoInput["mediaType"] => {
        const m = rec.photos.find((p) => p.idx === i)?.mediaType ?? "image/jpeg";
        return m === "image/png" || m === "image/webp" ? m : "image/jpeg";
      };
      const photos: PhotoInput[] = [];
      for (const p of rec.photos) {
        const data64 = await photoBase64(id, p.idx);
        if (data64) photos.push({ name: `photo-${p.idx + 1}`, mediaType: mt(p.idx), data: data64 });
      }
      if (!vivant) return;
      const input: PropertyInput = { ...rec.proInput, photos };
      const result: EstimateResponse = {
        report: rec.report,
        dvfSales: rec.dvfSales ?? [],
        dvfSource: rec.dvfSource,
        engine: rec.engine,
        subject: rec.subject ?? null,
        input,
      };
      setData({ result, input });
      setEtat("pret");
    })();
    return () => { vivant = false; };
  }, [id]);

  if (etat === "chargement") return <Centre>Chargement du dossier…</Centre>;
  if (etat === "verrou") return <Centre>Accès réservé. Ouvrez d&apos;abord l&apos;outil et saisissez le mot de passe d&apos;équipe, puis rouvrez ce dossier.</Centre>;
  if (etat === "introuvable") return <Centre>Dossier introuvable.</Centre>;
  if (etat === "vide") return <Centre>L&apos;analyse automatique n&apos;est pas disponible pour ce dossier (à traiter manuellement).</Centre>;
  if (!data) return null;

  return <Report result={data.result} input={data.input} onReset={() => router.back()} />;
}

function Centre({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ minHeight: "70vh", display: "grid", placeItems: "center", padding: 40, textAlign: "center", color: "#4c463b", fontFamily: "system-ui, sans-serif", maxWidth: 520, margin: "0 auto" }}>
      <div>{children}</div>
    </div>
  );
}
