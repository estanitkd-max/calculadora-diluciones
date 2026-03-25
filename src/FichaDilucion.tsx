type FichaDilucionProps = {
  dilucion: number;
  litrosPreparar: number;
  productoMl: number;
  aguaMl: number;
  precioBidon: number;
  costoPorLitro: number;
};

export default function FichaDilucion({
  dilucion,
  litrosPreparar,
  productoMl,
  aguaMl,
  precioBidon,
  costoPorLitro,
}: FichaDilucionProps) {

  const formatoMoneda = (valor: number) =>
    valor.toLocaleString("es-AR", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });

  return (
    <div className="w-full max-w-md rounded-2xl p-6 bg-gradient-to-br from-blue-800 to-blue-600 text-white shadow-lg">
      
      <h2 className="text-xl font-semibold mb-4">
        Ficha de Dilución
      </h2>

      <div className="grid grid-cols-2 gap-6">

        {/* IZQUIERDA */}
        <div>
          <h3 className="text-sm font-semibold mb-3 opacity-90">
            Dilución del producto
          </h3>

          <div className="space-y-3">

            <div>
              <div className="text-xs opacity-80">Dilución</div>
              <div className="text-lg font-semibold">
                1:{dilucion}
              </div>
            </div>

            <div>
              <div className="text-xs opacity-80">Preparación</div>
              <div className="text-lg font-semibold">
                {litrosPreparar} L
              </div>
            </div>

            <div>
              <div className="text-xs opacity-80">Producto</div>
              <div className="text-2xl font-bold">
                {Math.round(productoMl)} ml
              </div>
            </div>

            <div>
              <div className="text-xs opacity-80">Agua</div>
              <div className="text-xl font-semibold">
                {Math.round(aguaMl)} ml
              </div>
            </div>

          </div>
        </div>

        {/* DERECHA */}
        <div>
          <h3 className="text-sm font-semibold mb-3 opacity-90">
            Costos
          </h3>

          <div className="space-y-3">

            <div>
              <div className="text-xs opacity-80">Precio bidón</div>
              <div className="text-lg font-semibold">
                ${formatoMoneda(precioBidon)}
              </div>
            </div>

            <div>
              <div className="text-xs opacity-80">Costo por litro</div>
              <div className="text-2xl font-bold">
                ${formatoMoneda(costoPorLitro)}
              </div>
            </div>

          </div>
        </div>

      </div>

      <div className="mt-6 flex justify-end opacity-80 text-sm">
        Suñe Institucional
      </div>
    </div>
  );
}