import { useState } from "react";

export default function App() {
  const [nombreProducto, setNombreProducto] = useState("");
  const [dilucion, setDilucion] = useState(0);
  const [litros, setLitros] = useState(1);
  const [litrosBidon, setLitrosBidon] = useState(5);
  const [precioBidon, setPrecioBidon] = useState(0);
  const [imagenGenerada, setImagenGenerada] = useState<string | null>(null);

  const calcular = () => {
    if (dilucion <= 0 || litros <= 0) return;

    const totalMl = litros * 1000;
    const productoMl = Math.round(totalMl / dilucion);
    const aguaMl = totalMl - productoMl;

    const costoPorLitro =
      precioBidon > 0 && litrosBidon > 0
        ? Math.round((precioBidon / litrosBidon / dilucion) * 100) / 100
        : null;

    generarFicha(productoMl, aguaMl, costoPorLitro);
  };

  const generarFicha = (
    productoMl: number,
    aguaMl: number,
    costoPorLitro: number | null
  ) => {
    const canvas = document.createElement("canvas");
    canvas.width = 800;
    canvas.height = 650;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, 800, 650);

    ctx.fillStyle = "#14532d";
    ctx.font = "bold 36px Arial";
    ctx.fillText("Ficha de Dilución", 50, 80);

    ctx.fillStyle = "#000";
    ctx.font = "bold 22px Arial";
    ctx.fillText("Dilución del producto", 50, 140);

    ctx.font = "20px Arial";

    let y = 180;

    if (nombreProducto) {
      ctx.fillText(`Producto: ${nombreProducto}`, 50, y);
      y += 30;
    }

    ctx.fillText(`Dilución: 1:${dilucion}`, 50, y);
    y += 30;

    ctx.fillText(`Preparación: ${litros} L`, 50, y);
    y += 30;

    ctx.fillText(`Producto: ${productoMl} ml`, 50, y);
    y += 30;

    ctx.fillText(`Agua: ${aguaMl} ml`, 50, y);

    if (precioBidon > 0) {
      ctx.font = "bold 22px Arial";
      ctx.fillText("Costos", 450, 140);

      ctx.font = "20px Arial";
      ctx.fillText(`Precio bidón: $${precioBidon}`, 450, 180);

      if (costoPorLitro !== null) {
        ctx.fillText(`Costo por litro: $${costoPorLitro}`, 450, 210);
      }
    }

    const logo = new Image();
    logo.src = "/logo.png";

    logo.onload = () => {
      const ancho = 200;
      const alto = (logo.height / logo.width) * ancho;

      ctx.drawImage(logo, 800 - ancho - 40, 650 - alto - 30, ancho, alto);

      const dataUrl = canvas.toDataURL("image/png");
      setImagenGenerada(dataUrl);
    };

    logo.onerror = () => {
      const dataUrl = canvas.toDataURL("image/png");
      setImagenGenerada(dataUrl);
    };
  };

  return (
    <div style={{ padding: 30, fontFamily: "Arial", maxWidth: 600, margin: "auto" }}>
      <h2 style={{ color: "#14532d" }}>Calculadora de Diluciones</h2>

      <input
        type="text"
        placeholder="Nombre del producto (opcional)"
        value={nombreProducto}
        onChange={(e) => setNombreProducto(e.target.value)}
        style={{ width: "100%", padding: 10, marginBottom: 10 }}
      />

      <input
        type="number"
        placeholder="Dilución (1:X)"
        value={dilucion}
        onChange={(e) => setDilucion(Number(e.target.value))}
        style={{ width: "100%", padding: 10, marginBottom: 10 }}
      />

      <input
        type="number"
        placeholder="Litros a preparar"
        value={litros}
        onChange={(e) => setLitros(Number(e.target.value))}
        style={{ width: "100%", padding: 10, marginBottom: 10 }}
      />

      <input
        type="number"
        placeholder="Litros del bidón"
        value={litrosBidon}
        onChange={(e) => setLitrosBidon(Number(e.target.value))}
        style={{ width: "100%", padding: 10, marginBottom: 10 }}
      />

      <input
        type="number"
        placeholder="Precio del bidón"
        value={precioBidon}
        onChange={(e) => setPrecioBidon(Number(e.target.value))}
        style={{ width: "100%", padding: 10, marginBottom: 20 }}
      />

      <button
        onClick={calcular}
        style={{
          width: "100%",
          padding: 12,
          backgroundColor: "#14532d",
          color: "white",
          border: "none",
          borderRadius: 8,
          fontSize: 16,
          cursor: "pointer",
        }}
      >
        Calcular datos
      </button>

      {imagenGenerada && (
        <div style={{ marginTop: 20 }}>
          <a href={imagenGenerada} download="ficha.png">
            Descargar imagen
          </a>

          <img
            src={imagenGenerada}
            alt="Ficha"
            style={{ width: "100%", marginTop: 10 }}
          />
        </div>
      )}
    </div>
  );
}