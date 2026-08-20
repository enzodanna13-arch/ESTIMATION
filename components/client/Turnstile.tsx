"use client";

import { useEffect, useRef } from "react";

// Widget CAPTCHA Cloudflare Turnstile. Si NEXT_PUBLIC_TURNSTILE_SITEKEY n'est
// pas défini, le composant ne s'affiche pas et considère la vérification comme
// désactivée (utile en développement, avant configuration). Aucun secret ici :
// seule la « site key » publique est utilisée, la vérification est côté serveur.

declare global {
  interface Window {
    turnstile?: {
      render: (el: HTMLElement, opts: Record<string, unknown>) => string;
      reset: (id?: string) => void;
    };
    onloadTurnstile?: () => void;
  }
}

export default function Turnstile({ onToken }: { onToken: (t: string) => void }) {
  const ref = useRef<HTMLDivElement | null>(null);
  const rendered = useRef(false);
  const sitekey = process.env.NEXT_PUBLIC_TURNSTILE_SITEKEY;

  useEffect(() => {
    if (!sitekey) return; // captcha désactivé (non configuré)
    const render = () => {
      if (rendered.current || !ref.current || !window.turnstile) return;
      rendered.current = true;
      window.turnstile.render(ref.current, {
        sitekey,
        callback: (t: string) => onToken(t),
        "expired-callback": () => onToken(""),
        "error-callback": () => onToken(""),
        theme: "light",
      });
    };
    if (window.turnstile) { render(); return; }
    const id = "cf-turnstile-script";
    if (!document.getElementById(id)) {
      const s = document.createElement("script");
      s.id = id;
      s.src = "https://challenges.cloudflare.com/turnstile/v0/api.js";
      s.async = true;
      s.defer = true;
      document.head.appendChild(s);
    }
    const t = setInterval(() => { if (window.turnstile) { clearInterval(t); render(); } }, 200);
    return () => clearInterval(t);
  }, [sitekey, onToken]);

  if (!sitekey) return null;
  return <div ref={ref} style={{ marginTop: 8 }} />;
}
