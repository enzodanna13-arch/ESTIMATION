"use client";

import { use, useEffect, useState } from "react";
import Link from "next/link";
import { getDossier } from "@/lib/clientApi";
import type { DossierClientPublic } from "@/lib/clientTypes";
import DossierClient from "@/components/client/DossierClient";

export default function ResultatPage({ params }: { params: Promise<{ token: string }> }) {
  const { token } = use(params);
  const [dossier, setDossier] = useState<DossierClientPublic | null>(null);
  const [etat, setEtat] = useState<"chargement" | "pret" | "attente" | "introuvable">("chargement");

  useEffect(() => {
    let vivant = true;
    getDossier(token).then((d) => {
      if (!vivant) return;
      if (!d) { setEtat("introuvable"); return; }
      setDossier(d);
      // Le dossier n'est visible qu'une fois VALIDÉ ET TRANSMIS par le négociateur.
      setEtat(d.transmis && d.report.prix_estime > 0 ? "pret" : "attente");
    });
    return () => { vivant = false; };
  }, [token]);

  if (etat === "chargement") {
    return (
      <main className="tunnel"><div className="wrap-narrow"><div className="analyse"><h2>Chargement de votre dossier…</h2></div></div></main>
    );
  }

  if (etat === "introuvable") {
    return (
      <main className="tunnel"><div className="wrap-narrow"><div className="qcard" style={{ textAlign: "center" }}>
        <h2 className="qtitle">Dossier introuvable</h2>
        <p className="qhint">Ce lien n&apos;est plus valide ou le dossier n&apos;existe pas.</p>
        <Link href="/estimation/commencer" className="btn btn-gold" style={{ marginTop: 12 }}>Lancer une nouvelle estimation</Link>
      </div></div></main>
    );
  }

  if (etat === "attente" || !dossier) {
    return (
      <main className="tunnel"><div className="wrap-narrow"><div className="qcard" style={{ textAlign: "center" }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/c21/sceau-petit.png" alt="" style={{ width: 54, marginBottom: 18 }} />
        <h2 className="qtitle">Votre estimation est en préparation</h2>
        <p className="qhint">Votre négociateur Century 21 Icaza finalise votre dossier, vous appelle et vous l&apos;envoie par mail sous 3h. Merci de votre confiance.</p>
      </div></div></main>
    );
  }

  return <DossierClient dossier={dossier} />;
}
