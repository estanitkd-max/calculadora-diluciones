import { forwardRef } from "react";

type FichaDilucionProps = {
  dilucion: number;
  litrosPreparar: number;
  productoMl: number;
  aguaMl: number;
  precioBidon: number;
  costoPorLitro: number;
};

const FichaDilucion = forwardRef<HTMLDivElement, FichaDilucionProps>(
  (
    {
      dilucion,
      litrosPreparar,
      productoMl,
      aguaMl,
      precioBidon,
      costoPorLitro,
    },
    ref
  ) => {
    const formatoMoneda = (valor: number) =>
      valor.toLocaleString("es-AR", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      });

    return (
      <div
        ref={ref}
        className="w-full rounded-2xl p-6 bg-gradient-to-br from-blue-800 to-blue-600 text-white shadow-lg"
      >
        {/* TÍTULO */}
        <h2 className="text-xl font-semibold mb-5">
          Ficha de Dilución
        </h2>

        <div className="grid grid-cols-2 gap-6">

          {/* IZQUIERDA */}
          <div className="space-y-4">

            <div>
              <div className="text-sm opacity-80">Dilución</div>
              <div className="text-2xl font-bold">
                1:{dilucion}
              </div>
            </div>

            <div>
              <div className="text-sm opacity-80">Preparación</div>
              <div className="text-2xl font-bold">
                {litrosPreparar} L
              </div>
            </div>

            <div>
              <div className="text-sm opacity-80">Producto</div>
              <div className="text-4xl font-extrabold">
                {Math.round(productoMl)} ml
              </div>
            </div>

            <div>
              <div className="text-sm opacity-80">Agua</div>
              <div className="text-3xl font-bold">
                {Math.round(aguaMl)} ml
              </div>
            </div>

          </div>

          {/* DERECHA */}
          <div className="space-y-4">

            <div>
              <div className="text-sm opacity-80">Precio bidón</div>
              <div className="text-2xl font-bold">
                ${formatoMoneda(precioBidon)}
              </div>
            </div>

            <div>
              <div className="text-sm opacity-80">Costo por litro</div>
              <div className="text-4xl font-extrabold">
                ${formatoMoneda(costoPorLitro)}
              </div>
            </div>

          </div>

        </div>

        {/* FOOTER */}
        <div className="mt-6 flex justify-end opacity-80 text-sm">
          Suñe Institucional
        </div>
      </div>
    );
  }
);

export default FichaDilucion;