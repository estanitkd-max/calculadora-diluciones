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
    canvas.width = 800;
    canvas.height = 650;

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

    const costoPorLitro = (precioBidon / litrosBidon) * productoLitros;

    ctx.fillStyle = "#14532d";
    ctx.font = "bold 36px Arial";
    ctx.fillText("Ficha Técnica", 50, 80);

    ctx.fillStyle = "#000";
    ctx.font = "22px Arial";

    let y = 150;

    if (nombreProducto) {
      ctx.fillText(`Producto: ${nombreProducto}`, 50, y);
      y += 40;
    }

    const textoDilucion =
      modoDilucion === "proporcion" ? `1:${dilucion}` : `${dilucion}%`;

    ctx.fillText(`Dilución: ${textoDilucion}`, 50, y);
    y += 40;

    ctx.fillText(`Preparación: ${litrosPreparar} L`, 50, y);
    y += 40;

    ctx.fillText(`Producto: ${productoMl} ml`, 50, y);
    y += 40;

    ctx.fillText(`Agua: ${aguaMl} ml`, 50, y);
    y += 40;

    ctx.fillText(`Costo por litro: $${costoPorLitro.toFixed(2)}`, 50, y);
    y += 50;

    ctx.fillStyle = "#b91c1c";
    ctx.font = "bold 18px Arial";
    ctx.fillText(
      "Siempre agregar primero el agua por seguridad",
      50,
      y
    );

    const dataUrl = canvas.toDataURL("image/png");
    setImagenGenerada(dataUrl);
  };

  return (
    <div
      style={{
        background: "#f5f5f5",
        minHeight: "100vh",
        padding: 20,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: 500,
          background: "white",
          padding: 25,
          borderRadius: 16,
          boxShadow: "0 8px 25px rgba(0,0,0,0.08)",
        }}
      >
        <div style={{ textAlign: "center", marginBottom: 20 }}>
          <h2 style={{ color: "#14532d", margin: 0 }}>Suñé Distribuciones</h2>
          <p style={{ fontSize: 14, color: "#777" }}>
            Calculadora profesional de diluciones
          </p>
        </div>

        {/** Inputs */}
        <Input label="Nombre del producto">
          <input
            type="text"
            value={nombreProducto}
            onChange={(e) => setNombreProducto(e.target.value)}
            style={inputStyle}
          />
        </Input>

        <Input label="Tipo de dilución">
          <div style={{ display: "flex", gap: 15 }}>
            <label>
              <input
                type="radio"
                checked={modoDilucion === "proporcion"}
                onChange={() => setModoDilucion("proporcion")}
              /> 1:X
            </label>
            <label>
              <input
                type="radio"
                checked={modoDilucion === "porcentaje"}
                onChange={() => setModoDilucion("porcentaje")}
              /> %
            </label>
          </div>
        </Input>

        <Input label={modoDilucion === "proporcion" ? "Dilución (1:X)" : "Porcentaje (%)"}>
          <input
            type="number"
            value={dilucion}
            onChange={(e) => setDilucion(Number(e.target.value))}
            style={inputStyle}
          />
        </Input>

        <Input label="Litros a preparar">
          <input
            type="number"
            value={litrosPreparar}
            onChange={(e) => setLitrosPreparar(Number(e.target.value))}
            style={inputStyle}
          />
        </Input>

        <Input label="Litros del bidón">
          <input
            type="number"
            value={litrosBidon}
            onChange={(e) => setLitrosBidon(Number(e.target.value))}
            style={inputStyle}
          />
        </Input>

        <Input label="Precio del bidón">
          <input
            type="number"
            value={precioBidon}
            onChange={(e) => setPrecioBidon(Number(e.target.value))}
            style={inputStyle}
          />
        </Input>

        <label style={{ display: "block", marginBottom: 20 }}>
          <input
            type="checkbox"
            checked={redondear10ml}
            onChange={(e) => setRedondear10ml(e.target.checked)}
            style={{ marginRight: 6 }}
          />
          Redondear a múltiplos de 10 ml
        </label>

        <button onClick={generarFicha} style={buttonStyle}>
          Generar ficha técnica
        </button>

        {imagenGenerada && (
          <div style={{ marginTop: 20 }}>
            <a
              href={imagenGenerada}
              download="ficha-tecnica.png"
              style={downloadStyle}
            >
              Descargar imagen
            </a>

            <img
              src={imagenGenerada}
              alt="Ficha"
              style={{ width: "100%", marginTop: 10, borderRadius: 10 }}
            />
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
  fontSize: 14,
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
  fontWeight: "bold" as const,
};

const downloadStyle = {
  display: "inline-block",
  padding: "10px 15px",
  backgroundColor: "#14532d",
  color: "white",
  textDecoration: "none",
  borderRadius: 8,
};
