import { useState } from "react";

export default function App() {
  const [nombre, setNombre] = useState("");
  const [dilucion, setDilucion] = useState("");
  const [litrosPrep, setLitrosPrep] = useState("");
  const [litrosBidon, setLitrosBidon] = useState("");
  const [precioBidon, setPrecioBidon] = useState("");
  const [redondeo, setRedondeo] = useState(false);
  const [resultado, setResultado] = useState<null | {
    concentradoMl: number;
    aguaMl: number;
    solucionL: number;
    costoPorLitro: number;
    costoPreparacion: number;
    litrosRinde: number;
  }>(null);
  const [error, setError] = useState(false);

  const fmt = (n: number, dec: number) =>
    n.toLocaleString("es-AR", { minimumFractionDigits: dec, maximumFractionDigits: dec });

  const fmtPeso = (n: number) => "$" + fmt(n, 2);

  const fmtMl = (ml: number, entero: boolean) => {
    if (ml >= 1000) return fmt(ml / 1000, 3) + " L (" + fmt(ml, entero ? 0 : 1) + " ml)";
    return fmt(ml, entero ? 0 : 1) + " ml";
  };

  const calcular = () => {
    const dil = parseFloat(dilucion);
    const litPrep = parseFloat(litrosPrep);
    const litBidon = parseFloat(litrosBidon);
    const precio = parseFloat(precioBidon);

    if (!nombre || isNaN(dil) || isNaN(litPrep) || isNaN(litBidon) || isNaN(precio)) {
      setError(true);
      setResultado(null);
      return;
    }
    setError(false);

    const factor = dil + 1;
    const precioPorLitroConc = precio / litBidon;

    let concentradoMl = (litPrep / factor) * 1000;
    let aguaMl = litPrep * 1000 - concentradoMl;

    if (redondeo) {
      concentradoMl = Math.round(concentradoMl / 10) * 10;
      aguaMl = Math.round(aguaMl / 10) * 10;
    }

    setResultado({
      concentradoMl,
      aguaMl,
      solucionL: concentradoMl / 1000 + aguaMl / 1000,
      costoPorLitro: precioPorLitroConc / factor,
      costoPreparacion: (concentradoMl / 1000) * precioPorLitroConc,
      litrosRinde: litBidon * factor,
    });
  };

  const s: Record<string, React.CSSProperties> = {
    body: {
      fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
      background: "#f1f5f9",
      minHeight: "100vh",
      padding: "24px 16px 48px",
    },
    container: { maxWidth: 520, margin: "0 auto" },
    header: { marginBottom: 20 },
    h1: { fontSize: 20, fontWeight: 600, color: "#0f172a" },
    sub: { fontSize: 13, color: "#64748b", marginTop: 3 },
    card: {
      background: "#fff",
      border: "1px solid #e2e8f0",
      borderRadius: 14,
      padding: 20,
      marginBottom: 12,
    },
    sectionTitle: {
      fontSize: 11,
      fontWeight: 600,
      color: "#94a3b8",
      textTransform: "uppercase",
      letterSpacing: ".06em",
      marginBottom: 14,
    },
    field: { marginBottom: 12 },
    label: { display: "block", fontSize: 13, color: "#475569", marginBottom: 5 },
    input: {
      width: "100%",
      padding: "9px 12px",
      fontSize: 14,
      border: "1px solid #cbd5e1",
      borderRadius: 8,
      background: "#f8fafc",
      color: "#0f172a",
    },
    row2: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 },
    toggleRow: { display: "flex", alignItems: "center", gap: 10, marginTop: 6 },
    toggleLabel: { fontSize: 13, color: "#475569" },
    track: (on: boolean): React.CSSProperties => ({
      width: 36, height: 20, borderRadius: 10,
      background: on ? "#3b82f6" : "#cbd5e1",
      position: "relative", cursor: "pointer", flexShrink: 0,
      transition: "background .2s",
    }),
    dot: (on: boolean): React.CSSProperties => ({
      width: 16, height: 16, background: "#fff", borderRadius: "50%",
      position: "absolute", top: 2, left: on ? 18 : 2,
      transition: "left .2s",
    }),
    btn: {
      width: "100%", padding: 12, background: "#2563eb", color: "#fff",
      border: "none", borderRadius: 10, fontSize: 15, fontWeight: 600,
      cursor: "pointer", marginBottom: 12,
    },
    errorMsg: {
      background: "#fef2f2", border: "1px solid #fecaca",
      borderRadius: 8, padding: "10px 14px", fontSize: 13,
      color: "#b91c1c", marginBottom: 10,
    },
    resGrid: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 10 },
    resCard: (variant: "default" | "blue" | "green"): React.CSSProperties => ({
      background: variant === "blue" ? "#eff6ff" : variant === "green" ? "#f0fdf4" : "#f8fafc",
      border: variant === "blue" ? "1px solid #bfdbfe" : variant === "green" ? "1px solid #bbf7d0" : "none",
      borderRadius: 10, padding: 12,
    }),
    resLabel: { fontSize: 11, color: "#64748b", marginBottom: 4 },
    resVal: (variant: "default" | "blue" | "green"): React.CSSProperties => ({
      fontSize: 20, fontWeight: 600, lineHeight: "1.2",
      color: variant === "blue" ? "#1d4ed8" : variant === "green" ? "#15803d" : "#0f172a",
    }),
    resUnit: { fontSize: 11, color: "#94a3b8", marginTop: 2 },
    prepBox: { background: "#f8fafc", borderRadius: 10, padding: 12, marginBottom: 10 },
    prepTitle: { fontSize: 12, color: "#64748b", marginBottom: 10, lineHeight: "1.4" },
    prepRow: (last: boolean): React.CSSProperties => ({
      display: "flex", justifyContent: "space-between", alignItems: "center",
      padding: "6px 0", fontSize: 13,
      borderBottom: last ? "none" : "1px solid #e2e8f0",
      fontWeight: last ? 600 : 400,
    }),
    prepKey: { color: "#64748b" },
    prepVal: { color: "#0f172a" },
  };

  const dil = parseFloat(dilucion);
  const litPrep = parseFloat(litrosPrep);

  return (
    <div style={s.body}>
      <div style={s.container}>

        <div style={s.header}>
          <h1 style={s.h1}>Calculadora de diluciones</h1>
          <p style={s.sub}>Ingresá los datos del producto para obtener la preparación y los costos.</p>
        </div>

        <div style={s.card}>
          <p style={s.sectionTitle}>Datos del producto</p>

          <div style={s.field}>
            <label style={s.label}>Nombre del producto</label>
            <input style={s.input} placeholder="Ej: Suma D10 Desengrasante"
              value={nombre} onChange={e => setNombre(e.target.value)} />
          </div>

          <div style={s.row2}>
            <div style={s.field}>
              <label style={s.label}>Dilución (1 : X)</label>
              <input style={s.input} type="number" placeholder="Ej: 10" min={1}
                value={dilucion} onChange={e => setDilucion(e.target.value)} />
            </div>
            <div style={s.field}>
              <label style={s.label}>Litros a preparar</label>
              <input style={s.input} type="number" placeholder="Ej: 12" min={0.1} step={0.1}
                value={litrosPrep} onChange={e => setLitrosPrep(e.target.value)} />
            </div>
          </div>

          <div style={s.row2}>
            <div style={s.field}>
              <label style={s.label}>Presentación bidón (litros)</label>
              <input style={s.input} type="number" placeholder="Ej: 5" min={0.1} step={0.1}
                value={litrosBidon} onChange={e => setLitrosBidon(e.target.value)} />
            </div>
            <div style={s.field}>
              <label style={s.label}>Precio del bidón ($)</label>
              <input style={s.input} type="number" placeholder="Ej: 23500" min={1}
                value={precioBidon} onChange={e => setPrecioBidon(e.target.value)} />
            </div>
          </div>

          <div style={s.toggleRow}>
            <div style={s.track(redondeo)} onClick={() => setRedondeo(!redondeo)}>
              <div style={s.dot(redondeo)} />
            </div>
            <span style={s.toggleLabel}>Redondear concentrado y agua a múltiplos de 10 ml</span>
          </div>
        </div>

        {error && (
          <div style={s.errorMsg}>Por favor completá todos los campos antes de calcular.</div>
        )}

        <button style={s.btn} onClick={calcular}>Calcular dilución</button>

        {resultado && (
          <>
            <div style={s.card}>
              <p style={s.sectionTitle}>Cómo preparar la solución</p>
              <div style={s.prepBox}>
                <p style={s.prepTitle}>
                  Para preparar {fmt(litPrep, 1)} L de {nombre} (dilución 1:{dil})
                </p>
                <div style={s.prepRow(false)}>
                  <span style={s.prepKey}>Concentrado a usar</span>
                  <span style={s.prepVal}>{fmtMl(resultado.concentradoMl, redondeo)}</span>
                </div>
                <div style={s.prepRow(false)}>
                  <span style={s.prepKey}>Agua a agregar</span>
                  <span style={s.prepVal}>{fmtMl(resultado.aguaMl, redondeo)}</span>
                </div>
                <div style={s.prepRow(true)}>
                  <span style={s.prepKey}>Solución total obtenida</span>
                  <span style={s.prepVal}>{fmt(resultado.solucionL, redondeo ? 1 : 2)} L</span>
                </div>
              </div>
            </div>

            <div style={s.card}>
              <p style={s.sectionTitle}>Análisis de costos</p>
              <div style={s.resGrid}>
                <div style={s.resCard("blue")}>
                  <p style={s.resLabel}>Costo por litro diluido</p>
                  <p style={s.resVal("blue")}>{fmtPeso(resultado.costoPorLitro)}</p>
                  <p style={s.resUnit}>independiente de la cantidad</p>
                </div>
                <div style={s.resCard("default")}>
                  <p style={s.resLabel}>Costo de esta preparación</p>
                  <p style={s.resVal("default")}>{fmtPeso(resultado.costoPreparacion)}</p>
                  <p style={s.resUnit}>para {fmt(litPrep, 1)} L preparados</p>
                </div>
              </div>
              <div style={s.resCard("green")}>
                <p style={s.resLabel}>Litros que rinde el bidón completo</p>
                <p style={s.resVal("green")}>{fmt(resultado.litrosRinde, 1)} L</p>
                <p style={s.resUnit}>litros de solución lista para usar</p>
              </div>
            </div>
          </>
        )}

      </div>
    </div>
  );
}