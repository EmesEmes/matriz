import React, { useState } from "react";
import Compareciente from "./components/Compareciente";
import MinutaForm from "./components/MinutaForm";
import { generarMinutaTexto } from "./utils/generarMinutaTexto";
import { exportarMinutaAWord } from "./utils/exportarMinutaAWord";

const App = () => {
  const [vendedor, setVendedor] = useState(null);
  const [comprador, setComprador] = useState(null);
  const [minutaGenerada, setMinutaGenerada] = useState(null);

  return (
    <div className="p-6 space-y-8">
      <h1 className="text-2xl font-bold">Registro de Comparecientes</h1>

      <Compareciente title="Compareciente Vendedor" onUserReady={setVendedor} />
      <Compareciente
        title="Compareciente Comprador"
        onUserReady={setComprador}
      />

      {vendedor && comprador && (
        <MinutaForm
          vendedores={[vendedor]}
          compradores={[comprador]}
          onGenerar={(data) => {
            const texto = generarMinutaTexto(data);
            setMinutaGenerada(texto);
          }}
        />
      )}

      {minutaGenerada && (
        <div className="mt-8 space-y-4">
          <textarea
            readOnly
            value={minutaGenerada}
            className="w-full h-[500px] border rounded p-4 font-mono text-sm whitespace-pre-wrap"
          />
          <div className="flex gap-4 justify-end">
            <button
              onClick={() => window.print()}
              className="bg-gray-500 text-white px-4 py-2 rounded"
            >
              Imprimir
            </button>
            <button
              onClick={() => exportarMinutaAWord(minutaGenerada)}
              className="bg-blue-600 text-white px-4 py-2 rounded"
            >
              Descargar Word
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
