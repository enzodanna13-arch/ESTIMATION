import { AGENCE } from "@/lib/equipe";
import { COULEURS_DPE, type FlyerData } from "@/lib/prospectionFlyers";

// Template flyer = TON visuel Century 21 Icaza en FOND FIXE (images fournies),
// sur lequel on incruste UNIQUEMENT les champs dynamiques (DPE, négociateur,
// QR, identification du bien). Le design reste exactement celui du fichier.
// Slot A5 portrait (148,5 mm × 210 mm).

const RECTO_BG = "/prospection/recto-src.png";
const VERSO_BG = "/prospection/verso-src.png";
const DARK = "#181a1a";     // bandeau négociateur (recto)
const PANEL = "#fbf9f5";    // panneau clair du tableau DPE (verso)
const GOLD = "#c8a86a";

const face: React.CSSProperties = {
  width: "100%", height: "100%", position: "relative", overflow: "hidden",
  fontFamily: "Arial, Helvetica, sans-serif", color: "#141210",
  backgroundColor: "#ffffff", backgroundRepeat: "no-repeat", backgroundPosition: "center", backgroundSize: "100% 100%",
};

const abs = (o: React.CSSProperties): React.CSSProperties => ({ position: "absolute", ...o });

function IcoMini({ name }: { name: "phone" | "mail" | "pin" }) {
  const p = {
    phone: "M5 4h4l2 5-3 2c1 3 3 5 6 6l2-3 5 2v4c0 1-1 2-2 2C11 24 2 15 2 6c0-1 1-2 2-2z",
    mail: "M3 5h18v14H3zM3 6l9 6 9-6",
    pin: "M12 22s7-6 7-12a7 7 0 10-14 0c0 6 7 12 7 12zM12 10a2 2 0 100-4 2 2 0 000 4z",
  }[name];
  return <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke={GOLD} strokeWidth={1.7} strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}><path d={p} /></svg>;
}

// ---------------------------------------------------------------------------
export function FlyerRecto({ d }: { d: FlyerData }) {
  const nomComplet = [d.negoPrenom, d.negoNom].filter(Boolean).join(" ").replace(/\s+/g, " ").trim() || d.negoNom;
  return (
    <div style={{ ...face, backgroundImage: `url('${RECTO_BG}')` }}>
      <img src={RECTO_BG} alt="" style={{ display: "none" }} />

      {/* Identification du bien (encart noir sur la photo) */}
      <div style={abs({ left: "67%", top: "15.5%", width: "22%", height: "9.5%", background: "#1f2121", borderRadius: 6, padding: "4px 4px 4px 8px", boxSizing: "border-box", color: "#fff", display: "flex", flexDirection: "column", justifyContent: "center", lineHeight: 1.2 })}>
        <div style={{ fontSize: 10, fontWeight: 700 }}>◍ Bien {d.numero}/{d.total}</div>
        <div style={{ fontSize: 8.5, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{d.adresse}</div>
        <div style={{ fontSize: 8.5 }}>{[d.codePostal, d.commune].filter(Boolean).join(" ")}</div>
      </div>

      {/* Bandeau négociateur : on recouvre puis on ré-affiche (dynamique) */}
      <div style={abs({ left: "2.5%", top: "78%", width: "64.5%", height: "17.6%", background: DARK })} />
      {d.negoPhoto
        ? <img src={d.negoPhoto} alt="" style={abs({ left: "5%", top: "80.2%", width: "15%", aspectRatio: "1 / 1", borderRadius: "50%", objectFit: "cover", border: `2px solid ${GOLD}` })} />
        : <div style={abs({ left: "5%", top: "80.2%", width: "15%", aspectRatio: "1 / 1", borderRadius: "50%", border: `2px solid ${GOLD}`, background: DARK, color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, fontWeight: 700 })}>{(d.negoPrenom[0] ?? "") + (d.negoNom.split(" ").pop()?.[0] ?? "")}</div>}
      <div style={abs({ left: "25.5%", top: "79.2%", width: "41%", color: "#fff", lineHeight: 1.28 })}>
        <div style={{ fontSize: 15, fontWeight: 700 }}>{nomComplet}</div>
        <div style={{ fontSize: 10, color: "#dcd4c6" }}>{d.negoRole}</div>
        <div style={{ fontSize: 10, fontWeight: 700, color: GOLD, marginBottom: 4 }}>{AGENCE.nom}</div>
        <div style={{ fontSize: 10, display: "flex", alignItems: "center", gap: 6, marginBottom: 2 }}><IcoMini name="phone" /> {d.negoTel}</div>
        {d.negoEmail && <div style={{ fontSize: 10, display: "flex", alignItems: "center", gap: 6, marginBottom: 2 }}><IcoMini name="mail" /> {d.negoEmail}</div>}
        <div style={{ fontSize: 10, display: "flex", alignItems: "center", gap: 6 }}><IcoMini name="pin" /> {AGENCE.adresse}</div>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Barème DPE : les barres A→G sont dans l'image de fond. On incruste seulement
// l'étiquette (flèche + lettre) en face de la classe du bien.
const DPE_ROWS: Record<string, number> = { A: 26, B: 29.5, C: 33, D: 36.5, E: 40, F: 43.5, G: 47 };

export function FlyerVerso({ d }: { d: FlyerData }) {
  const classe = (d.dpe || "").toUpperCase();
  const rowY = DPE_ROWS[classe];
  const infos: { top: number; val: string }[] = [
    { top: 22.5, val: d.typeBien || "—" },
    { top: 27.7, val: d.surface ? `${d.surface} m²` : "—" },
    { top: 32.7, val: d.conso != null ? `${d.conso} kWh/m².an` : "—" },
    { top: 37.2, val: d.emissionGes != null ? `${d.emissionGes} kg CO₂/m².an` : "—" },
    { top: 41.7, val: d.dateDiag || "—" },
  ];
  return (
    <div style={{ ...face, backgroundImage: `url('${VERSO_BG}')` }}>
      <img src={VERSO_BG} alt="" style={{ display: "none" }} />

      {/* Valeurs du tableau (recouvrement panneau clair + valeur dynamique) */}
      {infos.map((r, i) => (
        <div key={i} style={abs({ left: "70%", top: `${r.top}%`, width: "27%", height: "4.3%", background: PANEL, display: "flex", alignItems: "center", justifyContent: "flex-end", paddingRight: "2%", boxSizing: "border-box", fontSize: 12, fontWeight: 800, color: "#141210" })}>{r.val}</div>
      ))}

      {/* Étiquette DPE dynamique (on masque l'étiquette d'origine puis on la replace) */}
      <div style={abs({ left: "22%", top: "24%", width: "16%", height: "24%", background: PANEL })} />
      {rowY != null && (
        <div style={abs({ left: "23%", top: `${rowY - 3.1}%`, height: "4.8%", display: "flex", alignItems: "center" })}>
          <div style={{ width: 0, height: 0, borderTop: "8px solid transparent", borderBottom: "8px solid transparent", borderRight: `9px solid ${COULEURS_DPE[classe]}` }} />
          <div style={{ background: COULEURS_DPE[classe], color: "#141210", fontWeight: 800, fontSize: 20, padding: "3px 13px", borderRadius: 4 }}>{classe}</div>
        </div>
      )}
      {/* Le QR code n'est PAS dynamique : celui du visuel fourni est conservé tel quel. */}
    </div>
  );
}
