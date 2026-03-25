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
        className="w-full rounded-2xl p-8 bg-gradient-to-br from-blue-800 to-blue-600 text-white shadow-lg"
      >
        <h2 className="text-2xl font-bold mb-6">
          Ficha de Dilución
        </h2>

        <div className="grid grid-cols-2 gap-8">

          <div className="space-y-6">

            <div>
              <div className="text-base opacity-80">Dilución</div>
              <div className="text-3xl font-bold">
                1:{dilucion}
              </div>
            </div>

            <div>
              <div className="text-base opacity-80">Preparación</div>
              <div className="text-3xl font-bold">
                {litrosPreparar} L
              </div>
            </div>

            <div>
              <div className="text-base opacity-80">Producto</div>
              <div className="text-5xl font-extrabold leading-none">
                {Math.round(productoMl)} ml
              </div>
            </div>

            <div>
              <div className="text-base opacity-80">Agua</div>
              <div className="text-4xl font-bold">
                {Math.round(aguaMl)} ml
              </div>
            </div>

          </div>

          <div className="space-y-6">

            <div>
              <div className="text-base opacity-80">Precio bidón</div>
              <div className="text-3xl font-bold">
                ${formatoMoneda(precioBidon)}
              </div>
            </div>

            <div>
              <div className="text-base opacity-80">Costo por litro</div>
              <div className="text-5xl font-extrabold leading-none">
                ${formatoMoneda(costoPorLitro)}
              </div>
            </div>

          </div>

        </div>

        <div className="mt-8 flex justify-end opacity-80 text-base">
          Suñe Institucional
        </div>
      </div>
    );
  }
);

export default FichaDilucion;