import { useState, useEffect } from "react";

function redondear5ml(valor: number) {
  return Math.round(valor / 5) * 5;
}

function calcularDilucion(totalLitros: number, dilucion: number) {
  const totalMl = totalLitros * 1000;
  const productoMl = totalMl / dilucion;
  const aguaMl = totalMl - productoMl;

  return {
    productoMl: redondear5ml(productoMl),
    aguaMl: redondear5ml(aguaMl),
  };
}

function calcularRendimiento(presentacionLitros: number, dilucion: number) {
  const presentacionMl = presentacionLitros * 1000;
  const totalSolucionMl = presentacionMl * dilucion;
  return totalSolucionMl;
}

export default function App() {
  const [dilucion, setDilucion] = useState(50);
  const [volumen, setVolumen] = useState(1);
  const [presentacion, setPresentacion] = useState(5);
  const [resultado, setResultado] = useState<any>(null);
  const [rendimiento, setRendimiento] = useState<number | null>(null);

  useEffect(() => {
    if ("serviceWorker" in navigator) {
      window.addEventListener("load", () => {
        navigator.serviceWorker.register("/sw.js").catch(() => {});
      });
    }
  }, []);

  const calcular = () => {
    const res = calcularDilucion(volumen, dilucion);
    setResultado(res);

    const rend = calcularRendimiento(presentacion, dilucion);
    setRendimiento(rend);
  };

  const copiarResultado = () => {
    if (!resultado) return;

    const texto = `Para preparar ${volumen}L a dilución 1:${dilucion} necesitás ${resultado.productoMl}ml de producto y ${resultado.aguaMl}ml de agua.`;

    navigator.clipboard.writeText(texto).catch(() => {
      alert("No se pudo copiar automáticamente.");
    });
  };

  return (
    <div style={{ padding: 20, maxWidth: 500, margin: "auto", fontFamily: "Arial" }}>
      <h2>Calculadora de Diluciones</h2>

      <div style={{ marginBottom: 10 }}>
        <label>Dilución (ej: 50 para 1:50)</label>
        <input
          type="number"
          value={dilucion}
          onChange={(e) => setDilucion(Number(e.target.value))}
          style={{ width: "100%", padding: 8 }}
        />
      </div>

      <div style={{ marginBottom: 10 }}>
        <label>Volumen final (L)</label>
        <select
          value={volumen}
          onChange={(e) => setVolumen(Number(e.target.value))}
          style={{ width: "100%", padding: 8 }}
        >
          <option value={1}>1 L</option>
          <option value={5}>5 L</option>
          <option value={10}>10 L</option>
        </select>
      </div>

      <div style={{ marginBottom: 10 }}>
        <label>Presentación del químico (L)</label>
        <input
          type="number"
          value={presentacion}
          onChange={(e) => setPresentacion(Number(e.target.value))}
          style={{ width: "100%", padding: 8 }}
        />
      </div>

      <button onClick={calcular} style={{ width: "100%", padding: 10 }}>
        Calcular
      </button>

      {resultado && (
        <div style={{ marginTop: 20, background: "#e0f2fe", padding: 15 }}>
          <p>
            Para preparar {volumen}L a dilución 1:{dilucion} necesitás:
          </p>
          <p><b>{resultado.productoMl} ml de producto</b></p>
          <p><b>{resultado.aguaMl} ml de agua</b></p>
          <button onClick={copiarResultado} style={{ width: "100%", padding: 8, marginTop: 10 }}>
            Copiar resultado
          </button>
        </div>
      )}

      {rendimiento && (
        <div style={{ marginTop: 20, background: "#dcfce7", padding: 15 }}>
          <p>Con esta presentación podés generar un total de:</p>
          <p style={{ textAlign: "center", fontWeight: "bold" }}>
            {(rendimiento / 1000).toFixed(2)} L de solución lista
          </p>
        </div>
      )}
    </div>
  );
}