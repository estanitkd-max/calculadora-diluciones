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

  const logo = new Image();
  logo.src = window.location.origin + "/logo.png";

  logo.onload = () => {
    ctx.drawImage(logo, canvas.width - 320, 20, 280, 120);
    dibujarTexto();
  };

  logo.onerror = () => {
    dibujarTexto();
  };

  function dibujarTexto() {
    ctx.fillStyle = "#14532d";
    ctx.font = "bold 36px Arial";
    ctx.fillText("Ficha Técnica", 50, 80);

    ctx.fillStyle = "#000000";
    ctx.font = "22px Arial";

    let y = 180;

    if (nombreProducto) {
      ctx.fillText(`Producto: ${nombreProducto}`, 50, y);
      y += 40;
    }

    if (tipoProducto === "diluir" && resultadoDilucion) {
      ctx.fillText(`Producto: ${resultadoDilucion.productoMl} ml`, 50, y);
      y += 40;
      ctx.fillText(`Agua: ${resultadoDilucion.aguaMl} ml`, 50, y);
      y += 40;
      ctx.fillText(`Costo x litro: $${resultadoDilucion.costoPorLitro}`, 50, y);
      y += 40;

      ctx.fillStyle = "#b91c1c";
      ctx.font = "bold 18px Arial";
      ctx.fillText(
        "Siempre se agrega primero el agua, por cuestiones de seguridad",
        50,
        y
      );
    }

    if (tipoProducto === "puro" && resultadoPuro) {
      ctx.fillText(`m² totales: ${resultadoPuro.m2Totales}`, 50, y);
      y += 40;
      ctx.fillText(`Costo x m²: $${resultadoPuro.costoPorM2}`, 50, y);
    }

    const dataUrl = canvas.toDataURL("image/png");
    setImagenGenerada(dataUrl);
  }
};
