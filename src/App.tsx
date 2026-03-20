import { useState } from "react";

export default function App() {
  const [nombreProducto, setNombreProducto] = useState("");
  const [tipoProducto] = useState("diluir");
  const [productoMl, setProductoMl] = useState(0);
  const [aguaMl, setAguaMl] = useState(0);
  const [costo, setCosto] = useState(0);
  const [imagenGenerada, setImagenGenerada] = useState<string | null>(null);

  const generarFicha = () => {
    const canvas = document.createElement("canvas");
    canvas.width = 800;
    canvas.height = 650;

    const ctx = canvas.getContext("2d")!;
    if (!ctx) return;

    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    const logo = new Image();
    logo.src = window.location.origin + "/logo.png";

    logo.onload = () => {
      ctx.drawImage(logo, 600, 40, 150, 80);
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

      if (tipoProducto === "diluir") {
        ctx.fillText(`Producto: ${productoMl} ml`, 50, y);
        y += 40;
        ctx.fillText(`Agua: ${aguaMl} ml`, 50, y);
        y += 40;
        ctx.fillText(`Costo: $${costo}`, 50, y);
        y += 40;

        ctx.fillStyle = "#b91c1c";
        ctx.font = "bold 18px Arial";
        ctx.fillText(
          "Siempre se agrega primero el agua, por cuestiones de seguridad",
          50,
          y
        );
      }

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
        placeholder="Producto (ml)"
        value={productoMl}
        onChange={(e) => setProductoMl(Number(e.target.value))}
        style={{ width: "100%", padding: 10, marginBottom: 10 }}
      />

      <input
        type="number"
        placeholder="Agua (ml)"
        value={aguaMl}
        onChange={(e) => setAguaMl(Number(e.target.value))}
        style={{ width: "100%", padding: 10, marginBottom: 10 }}
      />

      <input
        type="number"
        placeholder="Costo"
        value={costo}
        onChange={(e) => setCosto(Number(e.target.value))}
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
          <a href={imagenGenerada} download="ficha-tecnica.png">
            Descargar imagen
          </a>
          <div>
            <img src={imagenGenerada} alt="Ficha generada" style={{ width: "100%", marginTop: 10 }} />
          </div>
        </div>
      )}
    </div>
  );
}