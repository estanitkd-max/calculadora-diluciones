import { useState, useRef } from "react";
import html2canvas from "html2canvas";

type Variant = "default" | "blue" | "green";
type ModoDilucion = "ratio" | "porcentaje";

export default function App() {
  const [nombre, setNombre] = useState("");
  const [modoDilucion, setModoDilucion] = useState<ModoDilucion>("ratio");
  const [dilucion, setDilucion] = useState("");
  const [litrosPrep, setLitrosPrep] = useState("");
  const [litrosBidon, setLitrosBidon] = useState("");
  const [precioBidon, setPrecioBidon] = useState("");
  const [redondeo, setRedondeo] = useState(false);
  const [resultado, setResultado] = useState<null | {
    concentradoMl: number;
    aguaMl: number;
    solucionL: number;
    costoPorLitro: number | null;
    costoPreparacion: number | null;
    litrosRinde: number | null;
    dilRatio: number;
    dilPorcentaje: number;
    tieneCostos: boolean;
    tieneBidon: boolean;
  }>(null);
  const [error, setError] = useState("");
  const [exportando, setExportando] = useState(false);

  const fichaRef = useRef<HTMLDivElement>(null);

  const fmt = (n: number, dec: number) =>
    n.toLocaleString("es-AR", { minimumFractionDigits: dec, maximumFractionDigits: dec });

  const fmtPeso = (n: number) => "$" + fmt(n, 2);

  const fmtMl = (ml: number, entero: boolean) => {
    if (ml >= 1000) return fmt(ml / 1000, 3) + " L (" + fmt(ml, entero ? 0 : 1) + " ml)";
    return fmt(ml, entero ? 0 : 1) + " ml";
  };

  const getRatio = (): number => {
    const val = parseFloat(dilucion);
    if (isNaN(val)) return NaN;
    if (modoDilucion === "ratio") return val;
    if (val <= 0 || val >= 100) return NaN;
    return (100 - val) / val;
  };

  const calcular = () => {
    const ratio = getRatio();
    const litPrep = parseFloat(litrosPrep);

    // Solo dilución y litros a preparar son obligatorios
    if (isNaN(ratio) || ratio <= 0) {
      setError("Ingresá un valor de dilución válido.");
      setResultado(null);
      return;
    }
    if (isNaN(litPrep) || litPrep <= 0) {
      setError("Ingresá los litros que querés preparar.");
      setResultado(null);
      return;
    }
    setError("");

    const factor = ratio + 1;
    let concentradoMl = (litPrep / factor) * 1000;
    let aguaMl = litPrep * 1000 - concentradoMl;

    if (redondeo) {
      concentradoMl = Math.round(concentradoMl / 10) * 10;
      aguaMl = Math.round(aguaMl / 10) * 10;
    }

    const litBidon = parseFloat(litrosBidon);
    const precio = parseFloat(precioBidon);

    const tieneBidon = !isNaN(litBidon) && litBidon > 0;
    const tieneCostos = tieneBidon && !isNaN(precio) && precio > 0;

    const precioPorLitroConc = tieneCostos ? precio / litBidon : null;

    const porcentaje = modoDilucion === "porcentaje"
      ? parseFloat(dilucion)
      : parseFloat((100 / factor).toFixed(2));

    const ratioMostrar = modoDilucion === "ratio"
      ? parseFloat(dilucion)
      : parseFloat(ratio.toFixed(2));

    setResultado({
      concentradoMl,
      aguaMl,
      solucionL: concentradoMl / 1000 + aguaMl / 1000,
      costoPorLitro: tieneCostos ? precioPorLitroConc! / factor : null,
      costoPreparacion: tieneCostos ? (concentradoMl / 1000) * precioPorLitroConc! : null,
      litrosRinde: tieneBidon ? litBidon * factor : null,
      dilRatio: ratioMostrar,
      dilPorcentaje: porcentaje,
      tieneCostos,
      tieneBidon,
    });
  };

  const exportarFicha = async () => {
    if (!fichaRef.current || !resultado) return;
    setExportando(true);
    fichaRef.current.style.display = "flex";
    await new Promise(r => setTimeout(r, 200));
    const canvas = await html2canvas(fichaRef.current, {
      scale: 2,
      backgroundColor: null,
      useCORS: true,
    });
    fichaRef.current.style.display = "none";
    const link = document.createElement("a");
    const nombreArchivo = nombre ? nombre.replace(/\s+/g, "-") : "dilución";
    link.download = `ficha-${nombreArchivo}.png`;
    link.href = canvas.toDataURL("image/png");
    link.click();
    setExportando(false);
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

  const inputStyle: React.CSSProperties = {
    width: "100%", padding: "9px 12px", fontSize: 14,
    border: "1px solid #cbd5e1", borderRadius: 8,
    background: "#f8fafc", color: "#0f172a",
  };
  const labelStyle: React.CSSProperties = {
    display: "block", fontSize: 13, color: "#475569", marginBottom: 5,
  };
  const optLabelStyle: React.CSSProperties = {
    ...labelStyle,
    display: "flex", alignItems: "center", gap: 6,
  };
  const cardStyle: React.CSSProperties = {
    background: "#fff", border: "1px solid #e2e8f0",
    borderRadius: 14, padding: 20, marginBottom: 12,
  };
  const sectionTitleStyle: React.CSSProperties = {
    fontSize: 11, fontWeight: 600, color: "#94a3b8",
    textTransform: "uppercase", letterSpacing: ".06em", marginBottom: 14,
  };

  const litPrep = parseFloat(litrosPrep);
  const ratioPreview = getRatio();
  const porcentajePreview = modoDilucion === "ratio" && !isNaN(ratioPreview)
    ? parseFloat((100 / (ratioPreview + 1)).toFixed(2))
    : null;
  const ratioDesdePorc = modoDilucion === "porcentaje" && !isNaN(ratioPreview)
    ? parseFloat(ratioPreview.toFixed(2))
    : null;

  // Ficha de exportación (oculta, se renderiza solo al exportar)
  const FichaExport = () => {
    if (!resultado) return null;
    const panelBase: React.CSSProperties = {
      width: 320, minHeight: 420, padding: 24, display: "flex",
      flexDirection: "column", borderRadius: 16,
    };
    const fichaRowStyle: React.CSSProperties = {
      display: "flex", justifyContent: "space-between",
      alignItems: "center", padding: "7px 0",
      borderBottom: "1px solid rgba(255,255,255,0.15)", fontSize: 13,
    };
    const fichaRowLast: React.CSSProperties = {
      ...fichaRowStyle, borderBottom: "none", fontWeight: 700, fontSize: 14,
    };

    return (
      <div
        ref={fichaRef}
        style={{
          display: "none",
          gap: 12,
          padding: 20,
          background: "#f1f5f9",
          borderRadius: 20,
          width: "fit-content",
        }}
      >
        {/* Lado 1 — Cómo diluir */}
        <div style={{ ...panelBase, background: "linear-gradient(145deg, #1e3a5f, #2563eb)" }}>
          <div style={{ marginBottom: 16 }}>
            <p style={{ fontSize: 10, color: "rgba(255,255,255,0.6)", textTransform: "uppercase", letterSpacing: ".08em", margin: "0 0 4px" }}>
              Cómo preparar
            </p>
            <p style={{ fontSize: 17, fontWeight: 700, color: "#fff", margin: 0 }}>
              {nombre || "Producto"}
            </p>
          </div>

          {/* Badges dilución */}
          <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
            <span style={{ background: "rgba(255,255,255,0.15)", borderRadius: 6, padding: "4px 10px", fontSize: 12, color: "#fff", fontWeight: 600 }}>
              1 : {fmt(resultado.dilRatio, 2)}
            </span>
            <span style={{ background: "rgba(255,255,255,0.15)", borderRadius: 6, padding: "4px 10px", fontSize: 12, color: "#fff", fontWeight: 600 }}>
              {fmt(resultado.dilPorcentaje, 2)} %
            </span>
          </div>

          {/* Preparación */}
          <div style={{ background: "rgba(255,255,255,0.1)", borderRadius: 10, padding: 14, flex: 1 }}>
            <p style={{ fontSize: 11, color: "rgba(255,255,255,0.6)", margin: "0 0 10px" }}>
              Para preparar {fmt(litPrep, 1)} L
            </p>
            <div style={fichaRowStyle}>
              <span style={{ color: "rgba(255,255,255,0.7)" }}>Concentrado</span>
              <span style={{ color: "#fff", fontWeight: 600 }}>{fmtMl(resultado.concentradoMl, redondeo)}</span>
            </div>
            <div style={fichaRowStyle}>
              <span style={{ color: "rgba(255,255,255,0.7)" }}>Agua</span>
              <span style={{ color: "#fff", fontWeight: 600 }}>{fmtMl(resultado.aguaMl, redondeo)}</span>
            </div>
            <div style={fichaRowLast}>
              <span style={{ color: "rgba(255,255,255,0.7)" }}>Total obtenido</span>
              <span style={{ color: "#fff" }}>{fmt(resultado.solucionL, 2)} L</span>
            </div>
          </div>

          {/* Litros que rinde el bidón */}
          {resultado.tieneBidon && resultado.litrosRinde !== null && (
            <div style={{ marginTop: 12, background: "rgba(255,255,255,0.1)", borderRadius: 10, padding: "10px 14px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ fontSize: 12, color: "rgba(255,255,255,0.7)" }}>Rinde el bidón completo</span>
              <span style={{ fontSize: 15, fontWeight: 700, color: "#fff" }}>{fmt(resultado.litrosRinde, 1)} L</span>
            </div>
          )}

          <p style={{ fontSize: 10, color: "rgba(255,255,255,0.35)", marginTop: 16, textAlign: "center" }}>
            Calculadora de Diluciones
          </p>
        </div>

        {/* Lado 2 — Análisis de costos (solo si hay datos) */}
        {resultado.tieneCostos && (
          <div style={{ ...panelBase, background: "linear-gradient(145deg, #14532d, #16a34a)" }}>
            <div style={{ marginBottom: 16 }}>
              <p style={{ fontSize: 10, color: "rgba(255,255,255,0.6)", textTransform: "uppercase", letterSpacing: ".08em", margin: "0 0 4px" }}>
                Análisis de costos
              </p>
              <p style={{ fontSize: 17, fontWeight: 700, color: "#fff", margin: 0 }}>
                {nombre || "Producto"}
              </p>
            </div>

            <div style={{ background: "rgba(255,255,255,0.1)", borderRadius: 10, padding: 14, flex: 1, display: "flex", flexDirection: "column", gap: 12 }}>

              <div>
                <p style={{ fontSize: 11, color: "rgba(255,255,255,0.6)", margin: "0 0 4px" }}>Costo por litro diluido</p>
                <p style={{ fontSize: 28, fontWeight: 800, color: "#fff", margin: 0 }}>{fmtPeso(resultado.costoPorLitro!)}</p>
                <p style={{ fontSize: 11, color: "rgba(255,255,255,0.5)", margin: "2px 0 0" }}>independiente de la cantidad</p>
              </div>

              <div style={{ height: 1, background: "rgba(255,255,255,0.15)" }} />

              <div>
                <p style={{ fontSize: 11, color: "rgba(255,255,255,0.6)", margin: "0 0 4px" }}>Costo de esta preparación</p>
                <p style={{ fontSize: 24, fontWeight: 700, color: "#fff", margin: 0 }}>{fmtPeso(resultado.costoPreparacion!)}</p>
                <p style={{ fontSize: 11, color: "rgba(255,255,255,0.5)", margin: "2px 0 0" }}>para {fmt(litPrep, 1)} L preparados</p>
              </div>

              <div style={{ height: 1, background: "rgba(255,255,255,0.15)" }} />

              <div>
                <p style={{ fontSize: 11, color: "rgba(255,255,255,0.6)", margin: "0 0 4px" }}>Rinde el bidón completo</p>
                <p style={{ fontSize: 24, fontWeight: 700, color: "#fff", margin: 0 }}>{fmt(resultado.litrosRinde!, 1)} L</p>
                <p style={{ fontSize: 11, color: "rgba(255,255,255,0.5)", margin: "2px 0 0" }}>de solución lista para usar</p>
              </div>

            </div>

            <p style={{ fontSize: 10, color: "rgba(255,255,255,0.35)", marginTop: 16, textAlign: "center" }}>
              Calculadora de Diluciones
            </p>
          </div>
        )}
      </div>
    );
  };

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
            Solo dilución y litros son obligatorios. El resto es opcional.
          </p>
        </div>

        <div style={cardStyle}>
          <p style={sectionTitleStyle}>Datos del producto</p>

          {/* Nombre — opcional */}
          <div style={{ marginBottom: 12 }}>
            <label style={optLabelStyle}>
              Nombre del producto
              <span style={{ fontSize: 11, color: "#94a3b8", fontWeight: 400 }}>opcional</span>
            </label>
            <input style={inputStyle} placeholder="Ej: Suma D10 Desengrasante"
              value={nombre} onChange={e => setNombre(e.target.value)} />
          </div>

          {/* Dilución — campo más compacto */}
          <div style={{ marginBottom: 12 }}>
            <label style={labelStyle}>
              Dilución <span style={{ color: "#ef4444", fontSize: 12 }}>*</span>
            </label>
            <div style={{ display: "flex", gap: 8, alignItems: "flex-start" }}>
              {/* Toggle compacto */}
              <div style={{ display: "flex", borderRadius: 8, overflow: "hidden", border: "1px solid #cbd5e1", flexShrink: 0 }}>
                <button
                  onClick={() => { setModoDilucion("ratio"); setDilucion(""); }}
                  style={{
                    padding: "9px 12px", fontSize: 13, fontWeight: 500,
                    border: "none", cursor: "pointer", whiteSpace: "nowrap",
                    background: modoDilucion === "ratio" ? "#2563eb" : "#f8fafc",
                    color: modoDilucion === "ratio" ? "#fff" : "#475569",
                  }}
                >1 : X</button>
                <button
                  onClick={() => { setModoDilucion("porcentaje"); setDilucion(""); }}
                  style={{
                    padding: "9px 12px", fontSize: 13, fontWeight: 500,
                    border: "none", borderLeft: "1px solid #cbd5e1", cursor: "pointer",
                    background: modoDilucion === "porcentaje" ? "#2563eb" : "#f8fafc",
                    color: modoDilucion === "porcentaje" ? "#fff" : "#475569",
                  }}
                >%</button>
              </div>

              {/* Campo numérico */}
              <div style={{ position: "relative", flex: 1 }}>
                <input
                  style={{ ...inputStyle, paddingRight: 36 }}
                  type="number"
                  placeholder={modoDilucion === "ratio" ? "Ej: 10" : "Ej: 5"}
                  min={modoDilucion === "ratio" ? 1 : 0.01}
                  max={modoDilucion === "porcentaje" ? 99.99 : undefined}
                  step={modoDilucion === "porcentaje" ? 0.01 : 1}
                  value={dilucion}
                  onChange={e => setDilucion(e.target.value)}
                />
                <span style={{
                  position: "absolute", right: 10, top: "50%", transform: "translateY(-50%)",
                  fontSize: 12, color: "#94a3b8", pointerEvents: "none",
                }}>
                  {modoDilucion === "ratio" ? "1:X" : "%"}
                </span>
              </div>
            </div>

            {/* Conversión en tiempo real */}
            {dilucion && !isNaN(ratioPreview) && ratioPreview > 0 && (
              <div style={{ marginTop: 6, padding: "5px 10px", background: "#f0fdf4", border: "1px solid #bbf7d0", borderRadius: 6, fontSize: 12, color: "#15803d" }}>
                {modoDilucion === "ratio"
                  ? `≈ ${fmt(porcentajePreview!, 2)}% de concentrado`
                  : `≈ dilución 1:${fmt(ratioDesdePorc!, 2)}`}
              </div>
            )}
          </div>

          {/* Litros a preparar — obligatorio */}
          <div style={{ marginBottom: 12 }}>
            <label style={labelStyle}>
              Litros a preparar <span style={{ color: "#ef4444", fontSize: 12 }}>*</span>
            </label>
            <input style={inputStyle} type="number" placeholder="Ej: 12" min={0.1} step={0.1}
              value={litrosPrep} onChange={e => setLitrosPrep(e.target.value)} />
          </div>

          {/* Separador opcional */}
          <div style={{ display: "flex", alignItems: "center", gap: 8, margin: "16px 0 12px" }}>
            <div style={{ flex: 1, height: 1, background: "#e2e8f0" }} />
            <span style={{ fontSize: 11, color: "#94a3b8", whiteSpace: "nowrap" }}>Para análisis de costos (opcional)</span>
            <div style={{ flex: 1, height: 1, background: "#e2e8f0" }} />
          </div>

          {/* Litros bidón y precio — opcionales */}
          <div style={{ marginBottom: 12 }}>
            <label style={optLabelStyle}>
              Presentación bidón (litros)
              <span style={{ fontSize: 11, color: "#94a3b8", fontWeight: 400 }}>opcional</span>
            </label>
            <input style={inputStyle} type="number" placeholder="Ej: 5" min={0.1} step={0.1}
              value={litrosBidon} onChange={e => setLitrosBidon(e.target.value)} />
          </div>

          <div style={{ marginBottom: 12 }}>
            <label style={optLabelStyle}>
              Precio del bidón ($)
              <span style={{ fontSize: 11, color: "#94a3b8", fontWeight: 400 }}>opcional</span>
            </label>
            <input style={inputStyle} type="number" placeholder="Ej: 23500" min={1}
              value={precioBidon} onChange={e => setPrecioBidon(e.target.value)} />
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: 10, marginTop: 6 }}>
            <div style={trackStyle(redondeo)} onClick={() => setRedondeo(!redondeo)}>
              <div style={dotStyle(redondeo)} />
            </div>
            <span style={{ fontSize: 13, color: "#475569" }}>
              Redondear a múltiplos de 10 ml
            </span>
          </div>
        </div>

        {error && (
          <div style={{ background: "#fef2f2", border: "1px solid #fecaca", borderRadius: 8, padding: "10px 14px", fontSize: 13, color: "#b91c1c", marginBottom: 10 }}>
            {error}
          </div>
        )}

        <button
          style={{ width: "100%", padding: 12, background: "#2563eb", color: "#fff", border: "none", borderRadius: 10, fontSize: 15, fontWeight: 600, cursor: "pointer", marginBottom: 12 }}
          onClick={calcular}
        >
          Calcular dilución
        </button>

        {/* Resultados */}
        {resultado && (
          <>
            <div style={cardStyle}>
              <p style={sectionTitleStyle}>Cómo preparar la solución</p>

              <div style={{ display: "flex", gap: 8, marginBottom: 12 }}>
                <span style={{ background: "#eff6ff", border: "1px solid #bfdbfe", borderRadius: 6, padding: "4px 10px", fontSize: 12, color: "#1d4ed8", fontWeight: 500 }}>
                  1 : {fmt(resultado.dilRatio, 2)}
                </span>
                <span style={{ background: "#f0fdf4", border: "1px solid #bbf7d0", borderRadius: 6, padding: "4px 10px", fontSize: 12, color: "#15803d", fontWeight: 500 }}>
                  {fmt(resultado.dilPorcentaje, 2)} %
                </span>
              </div>

              <div style={{ background: "#f8fafc", borderRadius: 10, padding: 12 }}>
                <p style={{ fontSize: 12, color: "#64748b", marginBottom: 10, lineHeight: "1.4" }}>
                  Para preparar {fmt(litPrep, 1)} L{nombre ? ` de ${nombre}` : ""}
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

              {resultado.tieneBidon && resultado.litrosRinde !== null && (
                <div style={{ ...resCardStyle("green"), marginTop: 10 }}>
                  <p style={{ fontSize: 11, color: "#64748b", marginBottom: 4 }}>Litros que rinde el bidón completo</p>
                  <p style={resValStyle("green")}>{fmt(resultado.litrosRinde, 1)} L</p>
                  <p style={{ fontSize: 11, color: "#94a3b8", marginTop: 2 }}>de solución lista para usar</p>
                </div>
              )}
            </div>

            {resultado.tieneCostos && (
              <div style={cardStyle}>
                <p style={sectionTitleStyle}>Análisis de costos</p>
                <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                  <div style={resCardStyle("blue")}>
                    <p style={{ fontSize: 11, color: "#64748b", marginBottom: 4 }}>Costo por litro diluido</p>
                    <p style={resValStyle("blue")}>{fmtPeso(resultado.costoPorLitro!)}</p>
                    <p style={{ fontSize: 11, color: "#94a3b8", marginTop: 2 }}>independiente de la cantidad</p>
                  </div>
                  <div style={resCardStyle("default")}>
                    <p style={{ fontSize: 11, color: "#64748b", marginBottom: 4 }}>Costo de esta preparación</p>
                    <p style={resValStyle("default")}>{fmtPeso(resultado.costoPreparacion!)}</p>
                    <p style={{ fontSize: 11, color: "#94a3b8", marginTop: 2 }}>para {fmt(litPrep, 1)} L preparados</p>
                  </div>
                </div>
              </div>
            )}

            {/* Botón exportar ficha */}
            <button
              onClick={exportarFicha}
              disabled={exportando}
              style={{
                width: "100%", padding: "12px 0", fontSize: 14, fontWeight: 600,
                cursor: exportando ? "not-allowed" : "pointer",
                border: "none", borderRadius: 10, marginTop: 4,
                background: exportando ? "#93c5fd" : "#2563eb", color: "#fff",
              }}
            >
              {exportando ? "Generando ficha..." : "Exportar ficha como imagen"}
            </button>
          </>
        )}

        {/* Ficha oculta para exportar */}
        <FichaExport />

      </div>
    </div>
  );
}