import { useState } from "react";

function redondear(valor: number, decimales: number) {
  return Number(valor.toFixed(decimales));
}

function redondear5ml(valor: number) {
  return Math.round(valor / 5) * 5;
}

export default function App() {
  const [tipoProducto, setTipoProducto] = useState<"diluir" | "puro">("diluir");
  const [modoDilucion, setModoDilucion] = useState<"proporcion" | "porcentaje">("proporcion");

  const [nombreProducto, setNombreProducto] = useState("");
  const [valorDilucion, setValorDilucion] = useState(0);
  const [litrosPreparar, setLitrosPreparar] = useState(1);
  const [litrosBidon, setLitrosBidon] = useState(5);
  const [precioBidon, setPrecioBidon] = useState(0);
  const [m2PorLitro, setM2PorLitro] = useState(50);
  const [imagenGenerada, setImagenGenerada] = useState<string | null>(null);

  const limpiarTodo = () => {
    setTipoProducto("diluir");
    setModoDilucion("proporcion");
    setNombreProducto("");
    setValorDilucion(0);
    setLitrosPreparar(1);
    setLitrosBidon(5);
    setPrecioBidon(0);
    setM2PorLitro(50);
    setImagenGenerada(null);
  };

  const calcularDilucion = () => {
    if (valorDilucion <= 0) return null;

    const factor =
      modoDilucion === "proporcion"
        ? valorDilucion
        : 1 / (valorDilucion / 100);

    const litrosFinalesBidon = litrosBidon * factor;
    const costoPorLitro =
      litrosFinalesBidon > 0 ? precioBidon / litrosFinalesBidon : 0;

    const totalMlPreparar = litrosPreparar * 1000;
    const productoMl = redondear5ml(totalMlPreparar / factor);
    const aguaMl = redondear5ml(totalMlPreparar - productoMl);

    return {
      costoPorLitro: redondear(costoPorLitro, 2),
      productoMl,
      aguaMl,
    };
  };

  const calcularPuro = () => {
    const m2Totales = litrosBidon * m2PorLitro;
    const costoPorM2 =
      m2Totales > 0 ? precioBidon / m2Totales : 0;

    return {
      m2Totales: redondear(m2Totales, 2),
      costoPorM2: redondear(costoPorM2, 4),
    };
  };

  const resultadoDilucion =
    tipoProducto === "diluir" ? calcularDilucion() : null;

  const resultadoPuro =
    tipoProducto === "puro" ? calcularPuro() : null;

  const generarFicha = () => {
    const canvas = document.createElement("canvas");
    canvas.width = 800;
    canvas.height = 650;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

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

    if (tipoProducto === "diluir" && resultadoDilucion) {
      const textoDilucion =
        modoDilucion === "proporcion"
          ? `1:${valorDilucion}`
          : `${valorDilucion}%`;

      ctx.fillText(`Dilución: ${textoDilucion}`, 50, y);
      y += 40;

      ctx.fillText(`Preparar: ${litrosPreparar} L`, 50, y);
      y += 40;

      ctx.fillText(`Producto: ${resultadoDilucion.productoMl} ml`, 50, y);
      y += 40;

      ctx.fillText(`Agua: ${resultadoDilucion.aguaMl} ml`, 50, y);
      y += 40;

      ctx.fillText(
        `Costo por litro listo: $${resultadoDilucion.costoPorLitro}`,
        50,
        y
      );
      y += 60;

      // Leyenda de seguridad
      ctx.fillStyle = "#b91c1c";
      ctx.font = "bold 20px Arial";
      ctx.fillText(
        "Siempre se agrega primero el agua, por cuestiones de seguridad.",
        50,
        y
      );
    }

    if (tipoProducto === "puro" && resultadoPuro) {
      ctx.fillText(`m² totales: ${resultadoPuro.m2Totales}`, 50, y);
      y += 40;
      ctx.fillText(`Costo por m²: $${resultadoPuro.costoPorM2}`, 50, y);
    }

    const dataUrl = canvas.toDataURL("image/png");
    setImagenGenerada(dataUrl);
  };

  return (
    <div
      style={{
        padding: 24,
        maxWidth: 650,
        margin: "auto",
        fontFamily: "Arial",
      }}
    >
      <h2 style={{ color: "#14532d" }}>Calculadora Profesional</h2>

      <button
        onClick={limpiarTodo}
        style={{
          marginBottom: 20,
          padding: 8,
          backgroundColor: "#6b7280",
          color: "white",
          border: "none",
          borderRadius: 6,
          cursor: "pointer",
        }}
      >
        Limpiar todo
      </button>

      <div style={{ marginBottom: 20 }}>
        <label><b>Tipo de producto:</b></label><br />
        <label>
          <input
            type="radio"
            checked={tipoProducto === "diluir"}
            onChange={() => setTipoProducto("diluir")}
          /> Producto para diluir
        </label>
        <br />
        <label>
          <input
            type="radio"
            checked={tipoProducto === "puro"}
            onChange={() => setTipoProducto("puro")}
          /> Producto puro / Cera
        </label>
      </div>

      <div style={{ marginBottom: 15 }}>
        <label>Nombre del producto (opcional)</label>
        <input
          type="text"
          value={nombreProducto}
          onChange={(e) => setNombreProducto(e.target.value)}
          style={{ width: "100%", padding: 8 }}
        />
      </div>

      {tipoProducto === "diluir" && (
        <>
          <div style={{ marginBottom: 15 }}>
            <label><b>Modo:</b></label><br />
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

          <div style={{ marginBottom: 15 }}>
            <label>Valor de dilución</label>
            <input
              type="number"
              value={valorDilucion}
              onChange={(e) => setValorDilucion(Number(e.target.value))}
              style={{ width: "100%", padding: 8 }}
            />
          </div>

          <div style={{ marginBottom: 15 }}>
            <label>Litros a preparar</label>
            <input
              type="number"
              value={litrosPreparar}
              onChange={(e) => setLitrosPreparar(Number(e.target.value))}
              style={{ width: "100%", padding: 8 }}
            />
          </div>
        </>
      )}

      <div style={{ marginBottom: 15 }}>
        <label>Litros del bidón</label>
        <input
          type="number"
          value={litrosBidon}
          onChange={(e) => setLitrosBidon(Number(e.target.value))}
          style={{ width: "100%", padding: 8 }}
        />
      </div>

      <div style={{ marginBottom: 15 }}>
        <label>Precio del bidón</label>
        <input
          type="number"
          value={precioBidon}
          onChange={(e) => setPrecioBidon(Number(e.target.value))}
          style={{ width: "100%", padding: 8 }}
        />
      </div>

      {tipoProducto === "puro" && (
        <div style={{ marginBottom: 15 }}>
          <label>m² que cubre 1 litro</label>
          <input
            type="number"
            value={m2PorLitro}
            onChange={(e) => setM2PorLitro(Number(e.target.value))}
            style={{ width: "100%", padding: 8 }}
          />
        </div>
      )}

      <div
        style={{
          marginTop: 30,
          padding: 20,
          backgroundColor: "#f3f4f6",
          borderRadius: 10,
        }}
      >
        <h3 style={{ color: "#14532d" }}>Resultado</h3>

        {tipoProducto === "diluir" && resultadoDilucion && (
          <>
            <p><b>Producto:</b> {resultadoDilucion.productoMl} ml</p>
            <p><b>Agua:</b> {resultadoDilucion.aguaMl} ml</p>
            <p><b>Costo por litro listo:</b> ${resultadoDilucion.costoPorLitro}</p>
          </>
        )}

        {tipoProducto === "puro" && resultadoPuro && (
          <>
            <p><b>m² totales:</b> {resultadoPuro.m2Totales}</p>
            <p><b>Costo por m²:</b> ${resultadoPuro.costoPorM2}</p>
          </>
        )}
      </div>

      <button
        onClick={generarFicha}
        style={{
          marginTop: 20,
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
        <div style={{ marginTop: 30 }}>
          <h4>Vista previa:</h4>
          <img
            src={imagenGenerada}
            alt="Ficha técnica"
            style={{ width: "100%", marginTop: 10, borderRadius: 8 }}
          />
          <a
            href={imagenGenerada}
            download="ficha-tecnica.png"
            style={{
              display: "inline-block",
              marginTop: 15,
              padding: 10,
              backgroundColor: "#14532d",
              color: "white",
              textDecoration: "none",
              borderRadius: 6,
            }}
          >
            Descargar imagen
          </a>
        </div>
      )}
    </div>
  );
}