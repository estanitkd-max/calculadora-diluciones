import { useState } from "react";

export default function App() {
  const [nombreProducto, setNombreProducto] = useState("");
  const [modoDilucion, setModoDilucion] = useState<"proporcion" | "porcentaje">("proporcion");
  const [dilucion, setDilucion] = useState(0);
  const [litrosPreparar, setLitrosPreparar] = useState(1);
  const [litrosBidon, setLitrosBidon] = useState(5);
  const [precioBidon, setPrecioBidon] = useState(0);
  const [imagenGenerada, setImagenGenerada] = useState<string | null>(null);
  const [redondear10ml, setRedondear10ml] = useState(false);

  const generarFicha = () => {
    const canvas = document.createElement("canvas");
    canvas.width = 800;
    canvas.height = 650;

    const ctx = canvas.getContext("2d")!;
    if (!ctx) return;

    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    let productoLitros = 0;
    let aguaLitros = 0;

    // 🔥 LÓGICA SEGÚN MODO
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

    // Redondeo
    if (redondear10ml) {
      productoMl = Math.round(productoMl / 10) * 10;
      aguaMl = Math.round(aguaMl / 10) * 10;
    } else {
      productoMl = Math.round(productoMl);
      aguaMl = Math.round(aguaMl);
    }

    const costoPorLitro = (precioBidon / litrosBidon) * productoLitros;

    // Logo
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

      const textoDilucion =
        modoDilucion === "proporcion"
          ? `1:${dilucion}`
          : `${dilucion}%`;

      ctx.fillText(`Dilución: ${textoDilucion}`, 50, y);
      y += 40;

      ctx.fillText(`Preparación total: ${litrosPreparar} L`, 50, y);
      y += 40;

      ctx.fillText(`Producto necesario: ${productoMl} ml`, 50, y);
      y += 40;

      ctx.fillText(`Agua necesaria: ${aguaMl} ml`, 50, y);
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

      <div style={{ marginBottom: 10 }}>
        <label>Nombre del producto</label>
        <input
          type="text"
          value={nombreProducto}
          onChange={(e) => setNombreProducto(e.target.value)}
          style={{ width: "100%", padding: 10, marginTop: 5 }}
        />
      </div>

      {/* 🔥 SELECTOR DE MODO */}
      <div style={{ marginBottom: 10 }}>
        <label>Tipo de dilución</label><br />
        <label>
          <input
            type="radio"
            checked={modoDilucion === "proporcion"}
            onChange={() => setModoDilucion("proporcion")}
          /> 1:X
        </label>
        <br />
        <label>
          <input
            type="radio"
            checked={modoDilucion === "porcentaje"}
            onChange={() => setModoDilucion("porcentaje")}
          /> %
        </label>
      </div>

      <div style={{ marginBottom: 10 }}>
        <label>
          {modoDilucion === "proporcion"
            ? "Dilución (1:X)"
            : "Porcentaje (%)"}
        </label>
        <input
          type="number"
          value={dilucion}
          onChange={(e) => setDilucion(Number(e.target.value))}
          style={{ width: "100%", padding: 10, marginTop: 5 }}
        />
      </div>

      <div style={{ marginBottom: 10 }}>
        <label>Litros a preparar</label>
        <input
          type="number"
          value={litrosPreparar}
          onChange={(e) => setLitrosPreparar(Number(e.target.value))}
          style={{ width: "100%", padding: 10, marginTop: 5 }}
        />
      </div>

      <div style={{ marginBottom: 10 }}>
        <label>Litros del bidón</label>
        <input
          type="number"
          value={litrosBidon}
          onChange={(e) => setLitrosBidon(Number(e.target.value))}
          style={{ width: "100%", padding: 10, marginTop: 5 }}
        />
      </div>

      <div style={{ marginBottom: 10 }}>
        <label>Precio del bidón</label>
        <input
          type="number"
          value={precioBidon}
          onChange={(e) => setPrecioBidon(Number(e.target.value))}
          style={{ width: "100%", padding: 10, marginTop: 5 }}
        />
      </div>

      <div style={{ marginBottom: 20 }}>
        <label>
          <input
            type="checkbox"
            checked={redondear10ml}
            onChange={(e) => setRedondear10ml(e.target.checked)}
            style={{ marginRight: 8 }}
          />
          Redondear a múltiplos de 10 ml
        </label>
      </div>

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