import { useState } from "react";

export default function App() {
  const [nombreProducto, setNombreProducto] = useState("");
  const [dilucion, setDilucion] = useState(0);
  const [litrosPreparar, setLitrosPreparar] = useState(1);
  const [litrosBidon, setLitrosBidon] = useState(5);
  const [precioBidon, setPrecioBidon] = useState(0);
  const [imagenGenerada, setImagenGenerada] = useState<string | null>(null);

  const generarFicha = () => {
    const canvas = document.createElement("canvas");
    canvas.width = 800;
    canvas.height = 650;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // 🔢 CÁLCULOS
    const totalPartes = dilucion + 1;

    const producto = litrosPreparar / totalPartes;
    const agua = litrosPreparar - producto;

    const costoPorLitro = (precioBidon / litrosBidon) * producto;

    // 🖼️ LOGO
    const logo = new Image();
    logo.src = window.location.origin + "/logo.png";

    logo.onload = () => {
      ctx.drawImage(logo, 600, 30, 160, 90);
      dibujarContenido();
    };

    logo.onerror = () => {
      dibujarContenido();
    };

    function dibujarContenido() {
      ctx.fillStyle = "#14532d";
      ctx.font = "bold 36px Arial";
      ctx.fillText("Ficha Técnica", 50, 80);

      ctx.fillStyle = "#000000";
      ctx.font = "22px Arial";

      let y = 150;

      if (nombreProducto) {
        ctx.fillText(`Producto: ${nombreProducto}`, 50, y);
        y += 40;
      }

      ctx.fillText(`Dilución: 1:${dilucion}`, 50, y);
      y += 40;

      ctx.fillText(`Preparación total: ${litrosPreparar} L`, 50, y);
      y += 40;

      ctx.fillText(`Producto necesario: ${producto.toFixed(2)} L`, 50, y);
      y += 40;

      ctx.fillText(`Agua necesaria: ${agua.toFixed(2)} L`, 50, y);
      y += 40;

      ctx.fillText(`Costo por litro listo: $${costoPorLitro.toFixed(2)}`, 50, y);
      y += 50;

      ctx.fillStyle = "#b91c1c";
      ctx.font = "bold 18px Arial";
      ctx.fillText(
        "Siempre agregar primero el agua por cuestiones de seguridad",
        50,
        y
      );

      const dataUrl = canvas.toDataURL("image/png");
      setImagenGenerada(dataUrl);
    }
  };

  return (
    <div style={{ padding: 30, fontFamily: "Arial" }}>
      <h2>Calculadora de Diluciones</h2>

      <input
        type="text"
        placeholder="Nombre del producto"
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
        value={litrosPreparar}
        onChange={(e) => setLitrosPreparar(Number(e.target.value))}
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
        onClick={generarFicha}
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
        Generar ficha técnica
      </button>

      {imagenGenerada && (
        <div style={{ marginTop: 20 }}>
          <a
            href={imagenGenerada}
            download="ficha-tecnica.png"
            style={{
              display: "inline-block",
              padding: "10px 15px",
              backgroundColor: "#14532d",
              color: "white",
              textDecoration: "none",
              borderRadius: 6,
              marginBottom: 10,
            }}
          >
            Descargar ficha
          </a>

          <img
            src={imagenGenerada}
            alt="Ficha generada"
            style={{ width: "100%" }}
          />
        </div>
      )}
    </div>
  );
}