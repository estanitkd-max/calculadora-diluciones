import FichaDilucion from "./FichaDilucion";

export default function App() {
  return (
    <div className="p-6">
      <FichaDilucion
        dilucion={10}
        litrosPreparar={1}
        productoMl={100}
        aguaMl={900}
        precioBidon={233}
        costoPorLitro={46.6}
      />
    </div>
  );
}