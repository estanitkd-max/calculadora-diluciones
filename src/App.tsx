import { useState } from "react";

type Variant = "default" | "blue" | "green";

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

  // Estilos dinámicos
  const trackStyle = (on: boolean): React.CSSProperties => ({
    width: 36, height: 20, borderRadius: 10,
    background: on ? "#3b82f6" : "#cbd5e1",
    position: "relative", cursor: "pointer", flexShrink: 0,
    transition: "background .2s",
  });
  const dotStyle = (on: boolean): React.CSSProperties => ({
    width: 16, height: 16, background: "#fff", borderRadius: "50%",
    position: "absolute", top: 2, left: on ? 18 : 2,
    transition: "left .2s",
  });
  const resCardStyle = (variant: Variant): React.CSSProperties => ({
    background: variant === "blue" ? "#eff6ff" : variant === "green" ? "#f0fdf4" : "#f8fafc",
    border: variant === "blue" ? "1px solid #bfdbfe" : variant === "green" ? "1px solid #bbf7d0" : "none",
    borderRadius: 10, padding: 12,
  });
  const resValStyle = (variant: Variant): React.CSSProperties => ({
    fontSize: 20, fontWeight: 600, lineHeight: "1.2",
    color: variant === "blue" ? "#1d4ed8" : variant === "green" ? "#15803d" : "#0f172a",
  });
  const prepRowStyle = (last: boolean): React.CSSProperties => ({
    display: "flex", justifyContent: "space-between", alignItems: "center",
    padding: "6px 0", fontSize: 13,
    borderBottom: last ? "none" : "1px solid #e2e8f0",
    fontWeight: last ? 600 : 400,
  });

  const dil = parseFloat(dilucion);
  const litPrep = parseFloat(litrosPrep);

  return (
    <div style={{
      fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
      background: "#f1f5f9", minHeight: "100vh", padding: "24px 16px 48px",
    }}>
      <div style={{ maxWidth: 520, margin: "0 auto" }}>

        <div style={{ marginBottom: 20 }}>
          <h1 style={{ fontSize: 20, fontWeight: 600, color: "#0f172a", margin: 0 }}>
            Calculadora de diluciones
          </h1>
          <p style={{ fontSize: 13, color: "#64748b", marginTop: 3 }}>
            Ingresá los datos del producto para obtener la preparación y los costos.
          </p>
        </div>

        {/* Card de entrada */}
        <div style={{ background: "#fff", border: "1px solid #e2e8f0", borderRadius: 14, padding: 20, marginBottom: 12 }}>
          <p style={{ fontSize: 11, fontWeight: 600, color: "#94a3b8", textTransform: "uppercase", letterSpacing: ".06em", marginBottom: 14 }}>
            Datos del producto
          </p>

          <div style={{ marginBottom: 12 }}>
            <label style={{ display: "block", fontSize: 13, color: "#475569", marginBottom: 5 }}>Nombre del producto</label>
            <input style={{ width: "100%", padding: "9px 12px", fontSize: 14, border: "1px solid #cbd5e1", borderRadius: 8, background: "#f8fafc", color: "#0f172a" }}
              placeholder="Ej: Suma D10 Desengrasante"
              value={nombre} onChange={e => setNombre(e.target.value)} />
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
            <div style={{ marginBottom: 12 }}>
              <label style={{ display: "block", fontSize: 13, color: "#475569", marginBottom: 5 }}>Dilución (1 : X)</label>
              <input style={{ width: "100%", padding: "9px 12px", fontSize: 14, border: "1px solid #cbd5e1", borderRadius: 8, background: "#f8fafc", color: "#0f172a" }}
                type="number" placeholder="Ej: 10" min={1}
                value={dilucion} onChange={e => setDilucion(e.target.value)} />
            </div>
            <div style={{ marginBottom: 12 }}>
              <label style={{ display: "block", fontSize: 13, color: "#475569", marginBottom: 5 }}>Litros a preparar</label>
              <input style={{ width: "100%", padding: "9px 12px", fontSize: 14, border: "1px solid #cbd5e1", borderRadius: 8, background: "#f8fafc", color: "#0f172a" }}
                type="number" placeholder="Ej: 12" min={0.1} step={0.1}
                value={litrosPrep} onChange={e => setLitrosPrep(e.target.value)} />
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
            <div style={{ marginBottom: 12 }}>
              <label style={{ display: "block", fontSize: 13, color: "#475569", marginBottom: 5 }}>Presentación bidón (litros)</label>
              <input style={{ width: "100%", padding: "9px 12px", fontSize: 14, border: "1px solid #cbd5e1", borderRadius: 8, background: "#f8fafc", color: "#0f172a" }}
                type="number" placeholder="Ej: 5" min={0.1} step={0.1}
                value={litrosBidon} onChange={e => setLitrosBidon(e.target.value)} />
            </div>
            <div style={{ marginBottom: 12 }}>
              <label style={{ display: "block", fontSize: 13, color: "#475569", marginBottom: 5 }}>Precio del bidón ($)</label>
              <input style={{ width: "100%", padding: "9px 12px", fontSize: 14, border: "1px solid #cbd5e1", borderRadius: 8, background: "#f8fafc", color: "#0f172a" }}
                type="number" placeholder="Ej: 23500" min={1}
                value={precioBidon} onChange={e => setPrecioBidon(e.target.value)} />
            </div>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: 10, marginTop: 6 }}>
            <div style={trackStyle(redondeo)} onClick={() => setRedondeo(!redondeo)}>
              <div style={dotStyle(redondeo)} />
            </div>
            <span style={{ fontSize: 13, color: "#475569" }}>
              Redondear concentrado y agua a múltiplos de 10 ml
            </span>
          </div>
        </div>

        {error && (
          <div style={{ background: "#fef2f2", border: "1px solid #fecaca", borderRadius: 8, padding: "10px 14px", fontSize: 13, color: "#b91c1c", marginBottom: 10 }}>
            Por favor completá todos los campos antes de calcular.
          </div>
        )}

        <button
          style={{ width: "100%", padding: 12, background: "#2563eb", color: "#fff", border: "none", borderRadius: 10, fontSize: 15, fontWeight: 600, cursor: "pointer", marginBottom: 12 }}
          onClick={calcular}
        >
          Calcular dilución
        </button>

        {resultado && (
          <>
            {/* Cómo preparar */}
            <div style={{ background: "#fff", border: "1px solid #e2e8f0", borderRadius: 14, padding: 20, marginBottom: 12 }}>
              <p style={{ fontSize: 11, fontWeight: 600, color: "#94a3b8", textTransform: "uppercase", letterSpacing: ".06em", marginBottom: 14 }}>
                Cómo preparar la solución
              </p>
              <div style={{ background: "#f8fafc", borderRadius: 10, padding: 12, marginBottom: 10 }}>
                <p style={{ fontSize: 12, color: "#64748b", marginBottom: 10, lineHeight: "1.4" }}>
                  Para preparar {fmt(litPrep, 1)} L de {nombre} (dilución 1:{dil})
                </p>
                <div style={prepRowStyle(false)}>
                  <span style={{ color: "#64748b" }}>Concentrado a usar</span>
                  <span style={{ color: "#0f172a" }}>{fmtMl(resultado.concentradoMl, redondeo)}</span>
                </div>
                <div style={prepRowStyle(false)}>
                  <span style={{ color: "#64748b" }}>Agua a agregar</span>
                  <span style={{ color: "#0f172a" }}>{fmtMl(resultado.aguaMl, redondeo)}</span>
                </div>
                <div style={prepRowStyle(true)}>
                  <span style={{ color: "#64748b" }}>Solución total obtenida</span>
                  <span style={{ color: "#0f172a" }}>{fmt(resultado.solucionL, redondeo ? 1 : 2)} L</span>
                </div>
              </div>
            </div>

            {/* Análisis de costos */}
            <div style={{ background: "#fff", border: "1px solid #e2e8f0", borderRadius: 14, padding: 20, marginBottom: 12 }}>
              <p style={{ fontSize: 11, fontWeight: 600, color: "#94a3b8", textTransform: "uppercase", letterSpacing: ".06em", marginBottom: 14 }}>
                Análisis de costos
              </p>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 10 }}>
                <div style={resCardStyle("blue")}>
                  <p style={{ fontSize: 11, color: "#64748b", marginBottom: 4 }}>Costo por litro diluido</p>
                  <p style={resValStyle("blue")}>{fmtPeso(resultado.costoPorLitro)}</p>
                  <p style={{ fontSize: 11, color: "#94a3b8", marginTop: 2 }}>independiente de la cantidad</p>
                </div>
                <div style={resCardStyle("default")}>
                  <p style={{ fontSize: 11, color: "#64748b", marginBottom: 4 }}>Costo de esta preparación</p>
                  <p style={resValStyle("default")}>{fmtPeso(resultado.costoPreparacion)}</p>
                  <p style={{ fontSize: 11, color: "#94a3b8", marginTop: 2 }}>para {fmt(litPrep, 1)} L preparados</p>
                </div>
              </div>
              <div style={resCardStyle("green")}>
                <p style={{ fontSize: 11, color: "#64748b", marginBottom: 4 }}>Litros que rinde el bidón completo</p>
                <p style={resValStyle("green")}>{fmt(resultado.litrosRinde, 1)} L</p>
                <p style={{ fontSize: 11, color: "#94a3b8", marginTop: 2 }}>litros de solución lista para usar</p>
              </div>
            </div>
          </>
        )}

      </div>
    </div>
  );
}