import { AGENCE } from "@/lib/equipe";
import { COULEURS_DPE, type FlyerData } from "@/lib/prospectionFlyers";

// Template graphique FIXE des flyers de prospection (identité Century 21 Icaza :
// noir / doré / beige / blanc). Les champs dynamiques viennent de FlyerData.
// Rendu dans un slot A5 portrait (148,5 mm × 210 mm ≈ 561 × 794 px @96dpi).

const NOIR = "#141210";
const GOLD = "#b8935a";
const BEIGE = "#f3ede2";
const GRIS = "#6f6a63";

const rootA5: React.CSSProperties = {
  width: "100%", height: "100%", background: "#ffffff", color: NOIR, position: "relative",
  fontFamily: "Arial, Helvetica, sans-serif", display: "flex", flexDirection: "column", overflow: "hidden",
};

// Icônes fil de fer (or) — simples, comme le visuel de référence.
function Ico({ name, size = 22, color = GOLD }: { name: string; size?: number; color?: string }) {
  const p: Record<string, React.ReactNode> = {
    people: <><circle cx="9" cy="8" r="3" /><circle cx="17" cy="9" r="2.4" /><path d="M3 19c0-3 3-5 6-5s6 2 6 5M15 18c0-2 2-3.5 4-3.5s3 1 3 3" /></>,
    home: <path d="M4 11l8-6 8 6M6 10v9h12v-9M10 19v-5h4v5" />,
    doc: <><path d="M7 3h7l4 4v14H7z" /><path d="M14 3v4h4M9 12h7M9 15h7M9 9h3" /></>,
    hands: <path d="M3 12l4-3 4 3 3-2 4 3M3 12l5 4 4-2 4 3M8 16l3 3" />,
    chart: <><path d="M4 20V10M10 20V5M16 20v-7M22 20V8" /><path d="M3 20h19" /></>,
    person: <><circle cx="12" cy="8" r="3.4" /><path d="M5 20c0-4 3.5-6 7-6s7 2 7 6" /></>,
    ruler: <><rect x="4" y="8" width="16" height="8" rx="1" /><path d="M8 8v3M12 8v4M16 8v3" /></>,
    energy: <path d="M13 2L5 13h5l-1 9 8-12h-5z" />,
    leaf: <path d="M20 4C10 4 4 10 4 20c8 0 16-4 16-16zM4 20C8 14 14 9 18 7" />,
    calendar: <><rect x="4" y="5" width="16" height="15" rx="2" /><path d="M4 9h16M8 3v4M16 3v4" /></>,
    phone: <path d="M5 4h4l2 5-3 2c1 3 3 5 6 6l2-3 5 2v4c0 1-1 2-2 2C11 24 2 15 2 6c0-1 1-2 2-2z" />,
    mail: <><rect x="3" y="5" width="18" height="14" rx="2" /><path d="M3 7l9 6 9-6" /></>,
    pin: <><path d="M12 22s7-6 7-12a7 7 0 10-14 0c0 6 7 12 7 12z" /><circle cx="12" cy="10" r="2.5" /></>,
  };
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round">
      {p[name]}
    </svg>
  );
}

function LogoC21({ dark = false }: { dark?: boolean }) {
  const c = dark ? "#ffffff" : NOIR;
  return (
    <div style={{ lineHeight: 1 }}>
      <div style={{ fontSize: 21, fontWeight: 800, letterSpacing: 3, color: c }}>CENTURY 21<span style={{ color: GOLD, fontSize: 11 }}>®</span></div>
      <div style={{ fontSize: 15, color: GOLD, fontStyle: "italic", marginTop: 2, fontWeight: 600 }}>Icaza Immobilier</div>
      <div style={{ fontSize: 9, letterSpacing: 4, color: dark ? "#cbb58f" : GRIS, marginTop: 2 }}>MARTIGUES</div>
    </div>
  );
}

function Sceau({ size = 54 }: { size?: number }) {
  return (
    <div style={{ width: size, height: size, borderRadius: "50%", border: `2px solid ${GOLD}`, background: NOIR, color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800, fontSize: size * 0.42 }}>21</div>
  );
}

// Bandeau discret d'identification (numéro d'étape + adresse).
function Ident({ d, dark }: { d: FlyerData; dark?: boolean }) {
  return (
    <div style={{ position: "absolute", top: 4, right: 6, fontSize: 8, color: dark ? "#bdb3a3" : "#b9b0a3", letterSpacing: 0.5, textAlign: "right", maxWidth: 240 }}>
      Bien {d.numero}/{d.total} · {d.adresse}
    </div>
  );
}

// ---------------------------------------------------------------------------
export function FlyerRecto({ d }: { d: FlyerData }) {
  const args = [
    { i: "people", t: "Des acquéreurs sérieux et actifs dans votre secteur" },
    { i: "home", t: "Une estimation gratuite et sans engagement" },
    { i: "doc", t: "Des conseils personnalisés sur votre projet" },
    { i: "hands", t: "Un interlocuteur local qui connaît votre quartier" },
  ];
  return (
    <div style={rootA5}>
      <Ident d={d} />
      {/* En-tête noir */}
      <div style={{ background: NOIR, padding: "14px 18px 16px", display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <LogoC21 dark />
        <Sceau />
      </div>
      {/* Hero beige */}
      <div style={{ height: 210, background: `linear-gradient(135deg, ${BEIGE} 60%, #e7dcc9)`, display: "flex", alignItems: "center", justifyContent: "center", position: "relative" }}>
        <svg width="150" height="120" viewBox="0 0 24 24" fill="none" stroke={GOLD} strokeWidth={0.9} strokeLinecap="round" strokeLinejoin="round" opacity={0.85}>
          <path d="M3 11l9-7 9 7M5 10v10h14V10M10 20v-6h4v6" />
          <path d="M2 20h20" />
        </svg>
        <div style={{ position: "absolute", right: 16, bottom: 12 }}><Sceau size={34} /></div>
      </div>
      {/* Message */}
      <div style={{ padding: "26px 22px 10px" }}>
        <div style={{ fontSize: 33, fontWeight: 800, lineHeight: 1.05 }}>VOTRE BIEN</div>
        <div style={{ fontSize: 33, fontWeight: 800, color: GOLD, lineHeight: 1.05 }}>NOUS INTÉRESSE</div>
        <div style={{ width: 56, height: 3, background: GOLD, margin: "14px 0 16px" }} />
        <div style={{ fontSize: 13.5, color: "#33302b", lineHeight: 1.6 }}>
          Nous passons dans votre secteur avec des <b>acquéreurs sérieux</b> et souhaitons en savoir plus sur votre bien.
        </div>
      </div>
      {/* Arguments */}
      <div style={{ display: "flex", padding: "16px 14px 14px", gap: 6, marginTop: "auto" }}>
        {args.map((a, i) => (
          <div key={i} style={{ flex: 1, textAlign: "center", padding: "0 3px", borderLeft: i ? "1px solid #e7e0d4" : "none" }}>
            <div style={{ display: "flex", justifyContent: "center", marginBottom: 6 }}><Ico name={a.i} size={26} /></div>
            <div style={{ fontSize: 8.6, color: "#4a463f", lineHeight: 1.35 }}>{a.t}</div>
          </div>
        ))}
      </div>
      {/* Pied négociateur (noir) */}
      <div style={{ background: NOIR, color: "#fff", padding: "14px 18px", display: "flex", alignItems: "center", gap: 14 }}>
        {d.negoPhoto
          ? <img src={d.negoPhoto} alt="" style={{ width: 62, height: 62, borderRadius: "50%", objectFit: "cover", border: `2px solid ${GOLD}` }} />
          : <div style={{ width: 62, height: 62, borderRadius: "50%", border: `2px solid ${GOLD}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20, fontWeight: 700 }}>{(d.negoPrenom[0] ?? "") + (d.negoNom.split(" ").pop()?.[0] ?? "")}</div>}
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 16, fontWeight: 700 }}>{d.negoPrenom} {d.negoNom.replace(d.negoPrenom, "").trim() || d.negoNom.split(" ").slice(1).join(" ")}</div>
          <div style={{ fontSize: 9.5, color: "#cbb58f" }}>{d.negoRole}</div>
          <div style={{ fontSize: 9.5, color: "#e8e2d6", marginBottom: 5 }}>{AGENCE.nom}</div>
          <div style={{ fontSize: 9.5, display: "flex", alignItems: "center", gap: 5, marginBottom: 2 }}><Ico name="phone" size={12} /> {d.negoTel}</div>
          {d.negoEmail && <div style={{ fontSize: 9.5, display: "flex", alignItems: "center", gap: 5, marginBottom: 2 }}><Ico name="mail" size={12} /> {d.negoEmail}</div>}
          <div style={{ fontSize: 9.5, display: "flex", alignItems: "center", gap: 5 }}><Ico name="pin" size={12} /> {AGENCE.adresse}</div>
        </div>
        <div style={{ fontFamily: "Georgia, serif", fontStyle: "italic", color: GOLD, fontSize: 15, textAlign: "center", lineHeight: 1.2, width: 92 }}>Parlons de votre projet !</div>
      </div>
      <div style={{ background: "#0c0b09", color: "#8f887c", fontSize: 8, letterSpacing: 1.5, textAlign: "center", padding: "5px 0" }}>TRANSACTION &nbsp;|&nbsp; GESTION LOCATIVE &nbsp;|&nbsp; SYNDIC DE COPROPRIÉTÉ</div>
    </div>
  );
}

// ---------------------------------------------------------------------------
function BarreDpe({ classe }: { classe: string }) {
  const ordre = ["A", "B", "C", "D", "E", "F", "G"];
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 7 }}>
      {ordre.map((c, i) => {
        const larg = 48 + i * 13; // largeur croissante A→G
        const actif = c === classe;
        return (
          <div key={c} style={{ display: "flex", alignItems: "center", height: 22, position: "relative" }}>
            <div style={{ width: larg, height: "100%", background: COULEURS_DPE[c], display: "flex", alignItems: "center", paddingLeft: 8, color: "#1a1a1a", fontWeight: 800, fontSize: 11, clipPath: "polygon(0 0, calc(100% - 8px) 0, 100% 50%, calc(100% - 8px) 100%, 0 100%)" }}>{c}</div>
            {actif && (
              <div style={{ display: "flex", alignItems: "center", marginLeft: 6 }}>
                <div style={{ width: 0, height: 0, borderTop: "7px solid transparent", borderBottom: "7px solid transparent", borderRight: `8px solid ${COULEURS_DPE[c]}` }} />
                <div style={{ background: COULEURS_DPE[c], color: "#1a1a1a", fontWeight: 800, fontSize: 15, padding: "2px 12px", borderRadius: 4 }}>{c}</div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

export function FlyerVerso({ d }: { d: FlyerData }) {
  const infos: { i: string; label: string; val: string }[] = [
    { i: "home", label: "Type de bien", val: d.typeBien },
    { i: "ruler", label: "Surface habitable", val: d.surface ? `${d.surface} m²` : "—" },
    { i: "energy", label: "Consommation d'énergie", val: d.conso != null ? `${d.conso} kWh/m².an` : "—" },
    { i: "leaf", label: "Émissions de gaz à effet de serre", val: d.emissionGes != null ? `${d.emissionGes} kg CO₂/m².an` : "—" },
    { i: "calendar", label: "Date du diagnostic", val: d.dateDiag || "—" },
  ];
  const accomp = [
    { i: "chart", t: "UNE ANALYSE DU MARCHÉ LOCAL", s: "Nous réalisons une étude complète pour estimer la valeur de votre bien." },
    { i: "person", t: "DES ACQUÉREURS QUALIFIÉS", s: "Nous disposons d'acheteurs actifs et sélectionnés dans votre secteur." },
    { i: "doc", t: "UN CONSEIL PERSONNALISÉ", s: "Nous vous guidons à chaque étape de votre projet." },
    { i: "hands", t: "UN INTERLOCUTEUR LOCAL", s: "Une équipe implantée à Martigues, qui connaît parfaitement le marché." },
  ];
  return (
    <div style={rootA5}>
      <Ident d={d} />
      {/* En-tête */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", padding: "16px 18px 8px" }}>
        <LogoC21 />
        <div style={{ textAlign: "right", fontSize: 9.5, letterSpacing: 1, color: NOIR, fontWeight: 600 }}>UNE ÉQUIPE LOCALE<br />À VOS CÔTÉS<div style={{ height: 2, width: 40, background: GOLD, marginLeft: "auto", marginTop: 4 }} /></div>
      </div>
      {/* Titre */}
      <div style={{ padding: "6px 18px 4px" }}>
        <div style={{ fontSize: 22, fontWeight: 800, lineHeight: 1.1 }}>VOTRE DIAGNOSTIC</div>
        <div style={{ fontSize: 22, fontWeight: 800, lineHeight: 1.1 }}>ÉNERGÉTIQUE <span style={{ color: GOLD }}>EN DÉTAIL</span></div>
      </div>
      {/* DPE + table */}
      <div style={{ display: "flex", gap: 14, padding: "16px 18px 10px", alignItems: "center" }}>
        <BarreDpe classe={d.dpe || "D"} />
        <div style={{ flex: 1, border: "1px solid #e7e0d4", borderRadius: 8 }}>
          {infos.map((r, i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: 8, padding: "10.5px 10px", borderTop: i ? "1px solid #eee7db" : "none" }}>
              <Ico name={r.i} size={16} />
              <div style={{ flex: 1, fontSize: 9.5, color: GRIS }}>{r.label}</div>
              <div style={{ fontSize: 10.5, fontWeight: 800, textAlign: "right" }}>{r.val}</div>
            </div>
          ))}
        </div>
      </div>
      {/* Bandeau info */}
      <div style={{ margin: "10px 18px", background: BEIGE, borderRadius: 8, padding: "12px 14px", display: "flex", gap: 10, alignItems: "center" }}>
        <Ico name="home" size={22} />
        <div style={{ fontSize: 10.2, color: "#423d35", lineHeight: 1.45 }}>Ce diagnostic indique que votre bien présente des caractéristiques qui peuvent intéresser nos acquéreurs dans le cadre de leur recherche.</div>
      </div>
      {/* Accompagnement */}
      <div style={{ padding: "14px 16px 12px" }}>
        <div style={{ fontSize: 12.5, fontWeight: 800, letterSpacing: 0.5, marginBottom: 10 }}>NOTRE ACCOMPAGNEMENT</div>
        <div style={{ display: "flex", gap: 6 }}>
          {accomp.map((a, i) => (
            <div key={i} style={{ flex: 1, textAlign: "center", padding: "0 3px", borderLeft: i ? "1px solid #eee7db" : "none" }}>
              <div style={{ display: "flex", justifyContent: "center", marginBottom: 4 }}><Ico name={a.i} size={22} /></div>
              <div style={{ fontSize: 7.6, fontWeight: 800, marginBottom: 3, lineHeight: 1.2 }}>{a.t}</div>
              <div style={{ fontSize: 7.4, color: GRIS, lineHeight: 1.3 }}>{a.s}</div>
            </div>
          ))}
        </div>
      </div>
      {/* Pied CTA + QR (noir) */}
      <div style={{ marginTop: "auto", background: NOIR, color: "#fff", padding: "14px 18px", display: "flex", alignItems: "center", gap: 12 }}>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 15, fontWeight: 800, lineHeight: 1.15 }}>OBTENEZ UNE ESTIMATION<br />DE VOTRE BIEN</div>
          <div style={{ fontSize: 10, color: "#d8d2c6", margin: "5px 0 6px" }}>Rapide, gratuite et sans engagement.</div>
          <div style={{ fontFamily: "Georgia, serif", fontStyle: "italic", color: GOLD, fontSize: 12 }}>Scannez ici pour votre estimation !</div>
        </div>
        {d.qr && <img src={d.qr} alt="QR estimation" style={{ width: 92, height: 92, background: "#fff", padding: 4, borderRadius: 6 }} />}
      </div>
      <div style={{ background: "#0c0b09", color: "#8f887c", fontSize: 8, letterSpacing: 1, textAlign: "center", padding: "5px 0" }}>CENTURY 21 Icaza Immobilier · {AGENCE.site}</div>
    </div>
  );
}
