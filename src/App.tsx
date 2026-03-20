import { useState } from "react";

export default function App() {
  const [nombreProducto, setNombreProducto] = useState("");
  const [modoDilucion, setModoDilucion] = useState<"proporcion" | "porcentaje">("proporcion");
  const [dilucion, setDilucion] = useState(0);
  const [litrosPreparar, setLitrosPreparar] = useState(1);
  const [litrosBidon, setLitrosBidon] = useState(5);
  const [precioBidon, setPrecioBidon] = useState(0);
  const [redondear10ml, setRedondear10ml] = useState(false);
  const [copiado, setCopiado] = useState(false);

  const calcular = () => {
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

    return { productoMl, aguaMl, costoPorLitro };
  };

  const copiarTextoSeguro = (texto: string) => {
    try {
      navigator.clipboard.writeText(texto);
    } catch {
      const textarea = document.createElement("textarea");
      textarea.value = texto;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand("copy");
      document.body.removeChild(textarea);
    }
  };

  const copiarWhatsApp = () => {
    const { productoMl, aguaMl, costoPorLitro } = calcular();

    const texto = `📦 Producto: ${nombreProducto || "-"}\n🧪 Dilución: ${modoDilucion === "proporcion" ? `1:${dilucion}` : `${dilucion}%`}\n🪣 Preparación: ${litrosPreparar} L\n\n🔹 Producto: ${productoMl} ml\n🔹 Agua: ${aguaMl} ml\n\n💰 Costo por litro: $${costoPorLitro.toFixed(2)}`;

    copiarTextoSeguro(texto);

    setCopiado(true);
    setTimeout(() => setCopiado(false), 2000);

    const url = `https://wa.me/?text=${encodeURIComponent(texto)}`;
    window.open(url, "_blank");
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

        <div style={{ marginBottom: 15 }}>
          <label style={{ fontSize: 13, color: "#555" }}>Nombre del producto</label>
          <input
            type="text"
            value={nombreProducto}
            onChange={(e) => setNombreProducto(e.target.value)}
            style={inputStyle}
          />
        </div>

        <div style={{ marginBottom: 15 }}>
          <label style={{ fontSize: 13, color: "#555" }}>Tipo de dilución</label>
          <div style={{ display: "flex", gap: 15, marginTop: 5 }}>
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
        </div>

        <div style={{ marginBottom: 15 }}>
          <label style={{ fontSize: 13, color: "#555" }}>
            {modoDilucion === "proporcion" ? "Dilución (1:X)" : "Porcentaje (%)"}
          </label>
          <input
            type="number"
            value={dilucion}
            onChange={(e) => setDilucion(Number(e.target.value))}
            style={inputStyle}
          />
        </div>

        <div style={{ marginBottom: 15 }}>
          <label style={{ fontSize: 13, color: "#555" }}>Litros a preparar</label>
          <input
            type="number"
            value={litrosPreparar}
            onChange={(e) => setLitrosPreparar(Number(e.target.value))}
            style={inputStyle}
          />
        </div>

        <div style={{ marginBottom: 15 }}>
          <label style={{ fontSize: 13, color: "#555" }}>Litros del bidón</label>
          <input
            type="number"
            value={litrosBidon}
            onChange={(e) => setLitrosBidon(Number(e.target.value))}
            style={inputStyle}
          />
        </div>

        <div style={{ marginBottom: 15 }}>
          <label style={{ fontSize: 13, color: "#555" }}>Precio del bidón</label>
          <input
            type="number"
            value={precioBidon}
            onChange={(e) => setPrecioBidon(Number(e.target.value))}
            style={inputStyle}
          />
        </div>

        <div style={{ marginBottom: 20 }}>
          <label>
            <input
              type="checkbox"
              checked={redondear10ml}
              onChange={(e) => setRedondear10ml(e.target.checked)}
              style={{ marginRight: 6 }}
            />
            Redondear a múltiplos de 10 ml
          </label>
        </div>

        <button onClick={copiarWhatsApp} style={buttonStyle}>
          📲 Compartir por WhatsApp
        </button>

        {copiado && (
          <p style={{ color: "green", textAlign: "center", marginTop: 10 }}>
            ✔ Copiado correctamente
          </p>
        )}
      </div>
    </div>
  );
}

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
