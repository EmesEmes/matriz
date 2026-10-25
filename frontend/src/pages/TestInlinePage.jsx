import { useState } from 'react';
import { ComparecienteInline } from '../components/comparecientes';

const TestInlinePage = () => {
  const [vendedor, setVendedor] = useState(null);
  const [comprador, setComprador] = useState(null);

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900 mb-6">
        Prueba de Componente Inline
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ComparecienteInline
          title="Vendedor"
          onComparecienteReady={setVendedor}
        />

        <ComparecienteInline
          title="Comprador"
          onComparecienteReady={setComprador}
        />
      </div>

      {/* Debug info */}
      <div className="mt-8 p-4 bg-gray-100 rounded-lg">
        <h3 className="font-semibold mb-2">Estado actual:</h3>
        <p className="text-sm">
          Vendedor: {vendedor ? `${vendedor.names} ${vendedor.lastNames}` : 'No seleccionado'}
        </p>
        <p className="text-sm">
          Comprador: {comprador ? `${comprador.names} ${comprador.lastNames}` : 'No seleccionado'}
        </p>
      </div>
    </div>
  );
};

export default TestInlinePage;