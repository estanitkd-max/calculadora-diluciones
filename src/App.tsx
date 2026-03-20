import { useState } from "react";

export default function App() {
  const [nombreProducto, setNombreProducto] = useState("");
  const [modoDilucion, setModoDilucion] = useState<"proporcion" | "porcentaje">("proporcion");
  const [dilucion, setDilucion] = useState(0);
  const [litrosPreparar, setLitrosPreparar] = useState(1);
  const [litrosBidon, setLitrosBidon] = useState(5);
  const [precioBidon, setPrecioBidon] = useState(0);
  const [redondear10ml, setRedondear10ml] = useState(false);
  const [imagenGenerada, setImagenGenerada] = useState<string | null>(null);

  const generarFicha = () => {
    const canvas = document.createElement("canvas");
    canvas.width = 900;
    canvas.height = 600;

    const ctx = canvas.getContext("2d")!;

    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    let productoLitros = 0;
    let aguaLitros = 0;

    if (modoDilucion === "proporcion") {
      const totalPartes = dilucion + 1;
      productoLitros = litrosPreparar / totalPartes;
      aguaLitros = litrosPreparar - productoLitros;
    } else {
      productoLitros = litrosPreparar * (dilucion / 100);
      aguaLitros = litrosPreparar - productoLitros;
    }

    let productoMl = productoLitros * 1000;
    let aguaMl = aguaLitros * 1000;

    if (redondear10ml) {
      productoMl = Math.round(productoMl / 10) * 10;
      aguaMl = Math.round(aguaMl / 10) * 10;
    } else {
      productoMl = Math.round(productoMl);
      aguaMl = Math.round(aguaMl);
    }

    const costoPorLitro = precioBidon
      ? (precioBidon / litrosBidon) * productoLitros
      : null;

    // TITULO
    ctx.fillStyle = "#14532d";
    ctx.font = "bold 34px Arial";
    ctx.fillText("Ficha de Dilución", 50, 60);

    // LINEA DIVISORIA
    ctx.strokeStyle = "#ddd";
    ctx.beginPath();
    ctx.moveTo(50, 80);
    ctx.lineTo(850, 80);
    ctx.stroke();

    // COLUMNA IZQUIERDA
    let yLeft = 130;

    ctx.fillStyle = "#14532d";
    ctx.font = "bold 22px Arial";
    ctx.fillText("Dilución del producto", 50, yLeft);

    yLeft += 40;
    ctx.fillStyle = "#000";
    ctx.font = "20px Arial";

    if (nombreProducto) {
      ctx.fillText(`Producto: ${nombreProducto}`, 50, yLeft);
      yLeft += 35;
    }

    const textoDilucion =
      modoDilucion === "proporcion" ? `1:${dilucion}` : `${dilucion}%`;

    ctx.fillText(`Dilución: ${textoDilucion}`, 50, yLeft);
    yLeft += 35;

    ctx.fillText(`Preparación: ${litrosPreparar} L`, 50, yLeft);
    yLeft += 35;

    ctx.fillText(`Producto: ${productoMl} ml`, 50, yLeft);
    yLeft += 35;

    ctx.fillText(`Agua: ${aguaMl} ml`, 50, yLeft);

    // COLUMNA DERECHA (COSTOS)
    if (costoPorLitro !== null) {
      let yRight = 130;

      ctx.fillStyle = "#14532d";
      ctx.font = "bold 22px Arial";
      ctx.fillText("Costos", 500, yRight);

      yRight += 40;
      ctx.fillStyle = "#000";
      ctx.font = "20px Arial";

      ctx.fillText(`Precio bidón: $${precioBidon}`, 500, yRight);

      yRight += 35;

      ctx.fillText(`Costo por litro: $${costoPorLitro.toFixed(2)}`, 500, yRight);
    }

    // LOGO
    const logo = new Image();
    logo.src = window.location.origin + "/logo.png";

    logo.onload = () => {
      ctx.drawImage(logo, 350, 450, 200, 80);

      // NOTA SEGURIDAD
      ctx.fillStyle = "#b91c1c";
      ctx.font = "bold 16px Arial";
      ctx.fillText(
        "Siempre agregar primero el agua por seguridad",
        50,
        550
      );

      const dataUrl = canvas.toDataURL("image/png");
      setImagenGenerada(dataUrl);
    };

    logo.onerror = () => {
      // NOTA SEGURIDAD (fallback)
      ctx.fillStyle = "#b91c1c";
      ctx.font = "bold 16px Arial";
      ctx.fillText(
        "Siempre agregar primero el agua por seguridad",
        50,
        550
      );

      const dataUrl = canvas.toDataURL("image/png");
      setImagenGenerada(dataUrl);
    };

    const dataUrl = canvas.toDataURL("image/png");
    setImagenGenerada(dataUrl);
  };

  return (
    <div style={{ background: "#f5f5f5", minHeight: "100vh", padding: 20, display: "flex", justifyContent: "center" }}>
      <div style={{ width: "100%", maxWidth: 500, background: "white", padding: 25, borderRadius: 16, boxShadow: "0 8px 25px rgba(0,0,0,0.08)" }}>
        <h2 style={{ color: "#14532d" }}>Suñé Distribuciones</h2>

        <Input label="Nombre del producto">
          <input type="text" value={nombreProducto} onChange={(e) => setNombreProducto(e.target.value)} style={inputStyle} />
        </Input>

        <Input label="Tipo de dilución">
          <div style={{ display: "flex", gap: 15 }}>
            <label><input type="radio" checked={modoDilucion === "proporcion"} onChange={() => setModoDilucion("proporcion")} /> 1:X</label>
            <label><input type="radio" checked={modoDilucion === "porcentaje"} onChange={() => setModoDilucion("porcentaje")} /> %</label>
          </div>
        </Input>

        <Input label={modoDilucion === "proporcion" ? "Dilución (1:X)" : "Porcentaje (%)"}>
          <input type="number" value={dilucion} onChange={(e) => setDilucion(Number(e.target.value))} style={inputStyle} />
        </Input>

        <Input label="Litros a preparar">
          <input type="number" value={litrosPreparar} onChange={(e) => setLitrosPreparar(Number(e.target.value))} style={inputStyle} />
        </Input>

        <Input label="Litros del bidón">
          <input type="number" value={litrosBidon} onChange={(e) => setLitrosBidon(Number(e.target.value))} style={inputStyle} />
        </Input>

        <Input label="Precio del bidón">
          <input type="number" value={precioBidon} onChange={(e) => setPrecioBidon(Number(e.target.value))} style={inputStyle} />
        </Input>

        <label style={{ marginBottom: 20, display: "block" }}>
          <input type="checkbox" checked={redondear10ml} onChange={(e) => setRedondear10ml(e.target.checked)} /> Redondear a múltiplos de 10 ml
        </label>

        <button onClick={generarFicha} style={buttonStyle}>Calcular datos</button>

        {imagenGenerada && (
          <div style={{ marginTop: 20 }}>
            <a href={imagenGenerada} download="ficha.png" style={downloadStyle}>Descargar imagen</a>
            <img src={imagenGenerada} style={{ width: "100%", marginTop: 10, borderRadius: 10 }} />
          </div>
        )}
      </div>
    </div>
  );
}

const Input = ({ label, children }: any) => (
  <div style={{ marginBottom: 15 }}>
    <label style={{ fontSize: 13, color: "#555" }}>{label}</label>
    {children}
  </div>
);

const inputStyle = {
  width: "100%",
  padding: 12,
  marginTop: 5,
  borderRadius: 8,
  border: "1px solid #ddd",
};

const buttonStyle = {
  width: "100%",
  padding: 14,
  backgroundColor: "#14532d",
  color: "white",
  border: "none",
  borderRadius: 10,
  fontSize: 16,
  cursor: "pointer",
};

const downloadStyle = {
  display: "inline-block",
  padding: "10px 15px",
  backgroundColor: "#14532d",
  color: "white",
  borderRadius: 8,
  textDecoration: "none",
};
