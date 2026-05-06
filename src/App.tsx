import { useState, useRef } from "react";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

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
    costoPorLitro: number;
    costoPreparacion: number;
    litrosRinde: number;
    dilRatio: number;
    dilPorcentaje: number;
  }>(null);
  const [error, setError] = useState(false);
  const [exportando, setExportando] = useState(false);

  const resultadoRef = useRef<HTMLDivElement>(null);

  const fmt = (n: number, dec: number) =>
    n.toLocaleString("es-AR", { minimumFractionDigits: dec, maximumFractionDigits: dec });

  const fmtPeso = (n: number) => "$" + fmt(n, 2);

  const fmtMl = (ml: number, entero: boolean) => {
    if (ml >= 1000) return fmt(ml / 1000, 3) + " L (" + fmt(ml, entero ? 0 : 1) + " ml)";
    return fmt(ml, entero ? 0 : 1) + " ml";
  };

  // Convierte el valor ingresado a ratio 1:X según el modo
  const getRatio = (): number => {
    const val = parseFloat(dilucion);
    if (isNaN(val)) return NaN;
    if (modoDilucion === "ratio") return val;
    // Porcentaje → ratio: X = (100 - %) / %
    if (val <= 0 || val >= 100) return NaN;
    return (100 - val) / val;
  };

  const calcular = () => {
    const ratio = getRatio();
    const litPrep = parseFloat(litrosPrep);
    const litBidon = parseFloat(litrosBidon);
    const precio = parseFloat(precioBidon);

    if (!nombre || isNaN(ratio) || isNaN(litPrep) || isNaN(litBidon) || isNaN(precio)) {
      setError(true);
      setResultado(null);
      return;
    }
    setError(false);

    const factor = ratio + 1;
    const precioPorLitroConc = precio / litBidon;

    let concentradoMl = (litPrep / factor) * 1000;
    let aguaMl = litPrep * 1000 - concentradoMl;

    if (redondeo) {
      concentradoMl = Math.round(concentradoMl / 10) * 10;
      aguaMl = Math.round(aguaMl / 10) * 10;
    }

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
      costoPorLitro: precioPorLitroConc / factor,
      costoPreparacion: (concentradoMl / 1000) * precioPorLitroConc,
      litrosRinde: litBidon * factor,
      dilRatio: ratioMostrar,
      dilPorcentaje: porcentaje,
    });
  };

  const capturarCanvas = async () => {
    if (!resultadoRef.current) return null;
    return await html2canvas(resultadoRef.current, {
      scale: 2,
      backgroundColor: "#f1f5f9",
      useCORS: true,
      windowWidth: resultadoRef.current.scrollWidth,
      windowHeight: resultadoRef.current.scrollHeight,
      height: resultadoRef.current.scrollHeight,
      width: resultadoRef.current.scrollWidth,
    });
  };

  const exportarImagen = async () => {
    setExportando(true);
    await new Promise(r => setTimeout(r, 150));
    const canvas = await capturarCanvas();
    if (!canvas) { setExportando(false); return; }
    const link = document.createElement("a");
    link.download = `dilución-${nombre.replace(/\s+/g, "-")}.png`;
    link.href = canvas.toDataURL("image/png");
    link.click();
    setExportando(false);
  };

  const exportarPDF = async () => {
    setExportando(true);
    await new Promise(r => setTimeout(r, 150));
    const canvas = await capturarCanvas();
    if (!canvas) { setExportando(false); return; }
    const imgData = canvas.toDataURL("image/png");
    const pdf = new jsPDF("p", "mm", "a4");
    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();
    const imgWidth = pageWidth - 20;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;

    if (imgHeight <= pageHeight - 20) {
      pdf.addImage(imgData, "PNG", 10, 10, imgWidth, imgHeight);
    } else {
      let yOffset = 0;
      let page = 0;
      const pageContentHeight = pageHeight - 20;
      while (yOffset < imgHeight) {
        if (page > 0) pdf.addPage();
        pdf.addImage(imgData, "PNG", 10, 10 - yOffset, imgWidth, imgHeight);
        yOffset += pageContentHeight;
        page++;
      }
    }
    pdf.save(`dilución-${nombre.replace(/\s+/g, "-")}.pdf`);
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
  const cardStyle: React.CSSProperties = {
    background: "#fff", border: "1px solid #e2e8f0",
    borderRadius: 14, padding: 20, marginBottom: 12,
  };
  const sectionTitleStyle: React.CSSProperties = {
    fontSize: 11, fontWeight: 600, color: "#94a3b8",
    textTransform: "uppercase", letterSpacing: ".06em", marginBottom: 14,
  };

  const litPrep = parseFloat(litrosPrep);

  // Preview de la conversión en tiempo real
  const ratioPreview = getRatio();
  const porcentajePreview = modoDilucion === "ratio" && !isNaN(ratioPreview)
    ? parseFloat((100 / (ratioPreview + 1)).toFixed(2))
    : null;
  const ratioDesdePorc = modoDilucion === "porcentaje" && !isNaN(ratioPreview)
    ? parseFloat(ratioPreview.toFixed(2))
    : null;

  return (
    <div style={{
      fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
      background: "#f1f5f9", minHeight: "100vh", padding: "24px 16px 48px",
    }}>
      <div style={{ maxWidth: 520, margin: "0 auto" }}>

        {/* Header */}
        <div style={{ marginBottom: 20 }}>
          <h1 style={{ fontSize: 20, fontWeight: 600, color: "#0f172a", margin: 0 }}>
            Calculadora de diluciones
          </h1>
          <p style={{ fontSize: 13, color: "#64748b", marginTop: 3 }}>
            Ingresá los datos del producto para obtener la preparación y los costos.
          </p>
        </div>

        {/* Formulario */}
        <div style={cardStyle}>
          <p style={sectionTitleStyle}>Datos del producto</p>

          <div style={{ marginBottom: 12 }}>
            <label style={labelStyle}>Nombre del producto</label>
            <input style={inputStyle} placeholder="Ej: Suma D10 Desengrasante"
              value={nombre} onChange={e => setNombre(e.target.value)} />
          </div>

          {/* Selector de modo + campo dilución */}
          <div style={{ marginBottom: 12 }}>
            <label style={labelStyle}>Dilución</label>

            {/* Toggle ratio / porcentaje */}
            <div style={{ display: "flex", marginBottom: 8, borderRadius: 8, overflow: "hidden", border: "1px solid #cbd5e1" }}>
              <button
                onClick={() => { setModoDilucion("ratio"); setDilucion(""); }}
                style={{
                  flex: 1, padding: "8px 0", fontSize: 13, fontWeight: 500,
                  border: "none", cursor: "pointer",
                  background: modoDilucion === "ratio" ? "#2563eb" : "#f8fafc",
                  color: modoDilucion === "ratio" ? "#fff" : "#475569",
                  transition: "all .15s",
                }}
              >
                Ratio 1 : X
              </button>
              <button
                onClick={() => { setModoDilucion("porcentaje"); setDilucion(""); }}
                style={{
                  flex: 1, padding: "8px 0", fontSize: 13, fontWeight: 500,
                  border: "none", borderLeft: "1px solid #cbd5e1", cursor: "pointer",
                  background: modoDilucion === "porcentaje" ? "#2563eb" : "#f8fafc",
                  color: modoDilucion === "porcentaje" ? "#fff" : "#475569",
                  transition: "all .15s",
                }}
              >
                Porcentaje %
              </button>
            </div>

            {/* Campo de entrada según modo */}
            <div style={{ position: "relative" }}>
              <input
                style={{ ...inputStyle, paddingRight: 48 }}
                type="number"
                placeholder={modoDilucion === "ratio" ? "Ej: 10" : "Ej: 5"}
                min={modoDilucion === "ratio" ? 1 : 0.01}
                max={modoDilucion === "porcentaje" ? 99.99 : undefined}
                step={modoDilucion === "porcentaje" ? 0.01 : 1}
                value={dilucion}
                onChange={e => setDilucion(e.target.value)}
              />
              <span style={{
                position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)",
                fontSize: 13, color: "#94a3b8", pointerEvents: "none",
              }}>
                {modoDilucion === "ratio" ? "1:X" : "%"}
              </span>
            </div>

            {/* Conversión en tiempo real */}
            {dilucion && !isNaN(ratioPreview) && (
              <div style={{
                marginTop: 6, padding: "6px 10px", background: "#f0fdf4",
                border: "1px solid #bbf7d0", borderRadius: 6, fontSize: 12, color: "#15803d",
              }}>
                {modoDilucion === "ratio"
                  ? `Equivale al ${fmt(porcentajePreview!, 2)}% de concentrado`
                  : `Equivale a dilución 1:${fmt(ratioDesdePorc!, 2)}`
                }
              </div>
            )}
          </div>

          <div style={{ marginBottom: 12 }}>
            <label style={labelStyle}>Litros a preparar</label>
            <input style={inputStyle} type="number" placeholder="Ej: 12" min={0.1} step={0.1}
              value={litrosPrep} onChange={e => setLitrosPrep(e.target.value)} />
          </div>

          <div style={{ marginBottom: 12 }}>
            <label style={labelStyle}>Presentación bidón (litros)</label>
            <input style={inputStyle} type="number" placeholder="Ej: 5" min={0.1} step={0.1}
              value={litrosBidon} onChange={e => setLitrosBidon(e.target.value)} />
          </div>

          <div style={{ marginBottom: 12 }}>
            <label style={labelStyle}>Precio del bidón ($)</label>
            <input style={inputStyle} type="number" placeholder="Ej: 23500" min={1}
              value={precioBidon} onChange={e => setPrecioBidon(e.target.value)} />
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
            {modoDilucion === "porcentaje" && " El porcentaje debe ser entre 0.01 y 99.99."}
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
            <div ref={resultadoRef} style={{ padding: "4px 0 8px" }}>

              <div style={cardStyle}>
                <p style={sectionTitleStyle}>Cómo preparar la solución</p>

                {/* Muestra ambas expresiones de la dilución */}
                <div style={{ display: "flex", gap: 8, marginBottom: 12 }}>
                  <span style={{ background: "#eff6ff", border: "1px solid #bfdbfe", borderRadius: 6, padding: "4px 10px", fontSize: 12, color: "#1d4ed8", fontWeight: 500 }}>
                    1 : {fmt(resultado.dilRatio, 2)}
                  </span>
                  <span style={{ background: "#f0fdf4", border: "1px solid #bbf7d0", borderRadius: 6, padding: "4px 10px", fontSize: 12, color: "#15803d", fontWeight: 500 }}>
                    {fmt(resultado.dilPorcentaje, 2)} %
                  </span>
                </div>

                <div style={{ background: "#f8fafc", borderRadius: 10, padding: 12, marginBottom: 10 }}>
                  <p style={{ fontSize: 12, color: "#64748b", marginBottom: 10, lineHeight: "1.4" }}>
                    Para preparar {fmt(litPrep, 1)} L de {nombre}
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

              <div style={cardStyle}>
                <p style={sectionTitleStyle}>Análisis de costos</p>
                <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 10 }}>
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

            </div>

            {/* Botones exportación */}
            <div style={{ display: "flex", flexDirection: "column", gap: 10, marginTop: 4 }}>
              <button
                onClick={exportarPDF}
                disabled={exportando}
                style={{
                  width: "100%", padding: "12px 0", fontSize: 14, fontWeight: 600,
                  cursor: exportando ? "not-allowed" : "pointer",
                  border: "none", borderRadius: 10,
                  background: exportando ? "#93c5fd" : "#2563eb", color: "#fff",
                }}
              >
                {exportando ? "Generando..." : "Exportar PDF"}
              </button>
              <button
                onClick={exportarImagen}
                disabled={exportando}
                style={{
                  width: "100%", padding: "12px 0", fontSize: 14, fontWeight: 600,
                  cursor: exportando ? "not-allowed" : "pointer",
                  border: "1px solid #cbd5e1", borderRadius: 10,
                  background: exportando ? "#f1f5f9" : "#fff",
                  color: exportando ? "#94a3b8" : "#0f172a",
                }}
              >
                {exportando ? "Generando..." : "Exportar imagen"}
              </button>
            </div>
          </>
        )}

      </div>
    </div>
  );
}