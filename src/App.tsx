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
    // 1. Configuramos el lienzo de dibujo (900 de ancho por 600 de alto)
    const canvas = document.createElement("canvas");
    canvas.width = 900;
    canvas.height = 600;
    const ctx = canvas.getContext("2d")!;

    // 2. Pintamos el fondo de BLANCO sólido inmediatamente
    ctx.fillStyle = "#ffffff"; // Color blanco
    ctx.fillRect(0, 0, canvas.width, canvas.height); // Dibuja un rectángulo blanco en toda la ficha

    // 3. Preparamos el NUEVO logo (asegurate de tener el archivo "nuevo_logo.png" en la carpeta public)
    const logoNuevo = new Image();
    // Importante: El nombre del archivo debe ser exacto. Nosotros asumimos "nuevo_logo.png".
    logoNuevo.src = window.location.origin + "/nuevo_logo.png";

    // 4. El resto del dibujo solo ocurre CUANDO el logo termina de cargarse
    logoNuevo.onload = () => {
      // 1. OBTENEMOS EL TAMAÑO ORIGINAL DEL LOGO
      const anchoOriginal = logoNuevo.naturalWidth;
      const altoOriginal = logoNuevo.naturalHeight;

      // 2. DEFINIMOS EL TAMAÑO MÁXIMO QUE QUEREMOS EN LA FICHA
      // (Podés cambiar estos números si querés el logo más grande o chico)
      const anchoMaximo = 200; 
      const altoMaximo = 100;

      // 3. CALCULAMOS EL TAMAÑO FINAL MANTENIENDO LA PROPORCIÓN
      // (Esta es la parte "mágica" para que no se vea aplastado)
      let anchoFinal = anchoOriginal;
      let altoFinal = altoOriginal;

      // Si es más ancho que el máximo, lo achicamos proporcionalmente
      if (anchoFinal > anchoMaximo) {
        altoFinal = (anchoMaximo / anchoFinal) * altoFinal;
        anchoFinal = anchoMaximo;
      }
      // Si después de achicar el ancho, el alto sigue siendo muy grande, achicamos el alto proporcionalmente
      if (altoFinal > altoMaximo) {
        anchoFinal = (altoMaximo / altoFinal) * anchoFinal;
        altoFinal = altoMaximo;
      }

      // 4. CALCULAMOS LA POSICIÓN (ABAJO A LA DERECHA)
      const marginX = 50; // Separación del borde derecho
      const marginY = 50; // Separación del borde inferior

      const x = canvas.width - anchoFinal - marginX; // 900 - ancho - 50 = posición horizontal
      const y = canvas.height - altoFinal - marginY; // 600 - alto - 50 = posición vertical

      // 5. DIBUJAMOS EL LOGO EN SU POSICIÓN Y CON SU TAMAÑO PERFECTO
      ctx.drawImage(logoNuevo, x, y, anchoFinal, altoFinal);

      // --- El resto sigue igual que antes ---
      // IMPORTANTE: He cambiado los colores de texto a oscuro para que se vean en fondo blanco
      dibujarContenido();

      // --- Y finalmente, creamos la imagen final para que se vea en la app ---
      const dataUrl = canvas.toDataURL("image/png");
      setImagenGenerada(dataUrl);
    };

    // Manejo de error por si el logo no carga (dibuja la ficha pero sin logo)
    logoNuevo.onerror = () => {
      console.error("Error: No se pudo cargar el archivo 'nuevo_logo.png' de la carpeta public.");
      // Incluso sin logo, pintamos fondo blanco y dibujamos textos para que la app no falle
      dibujarContenido();
      const dataUrl = canvas.toDataURL("image/png");
      setImagenGenerada(dataUrl);
    };

    // Aquí definimos la función de dibujo de textos (esta es la misma que ya tenías, pero integrada)
    function dibujarContenido() {
      // --- (Misma lógica de cálculos original) ---
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

      // --- (Dibujo de textos con colores nuevos para fondo blanco) ---
      
      // TITULO: Cambiamos de blanco a verde oscuro (#14532d) para que se vea
      ctx.fillStyle = "#14532d"; 
      ctx.font = "bold 34px Arial";
      ctx.fillText("Ficha de Dilución", 50, 60);

      // COLUMNA IZQUIERDA
      let yLeft = 130;
      // Texto normal: Color gris oscuro (#333333) para mejor lectura en blanco
      ctx.fillStyle = "#333333"; 
      ctx.font = "bold 22px Arial";
      ctx.fillText("Dilución del producto", 50, yLeft);

      yLeft += 40;
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

      // COLUMNA DERECHA
      if (costoPorLitro !== null) {
        let yRight = 130;
        ctx.fillStyle = "#333333"; // Color gris oscuro

        ctx.font = "bold 22px Arial";
        ctx.fillText("Costos", 500, yRight);

        yRight += 40;
        ctx.font = "20px Arial";

        ctx.fillText(`Precio bidón: $${precioBidon}`, 500, yRight);
        yRight += 35;

        ctx.fillText(`Costo por litro: $${costoPorLitro.toFixed(2)}`, 500, yRight);
      }
    }
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


