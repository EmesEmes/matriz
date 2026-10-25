import { useState } from "react";
import { Button, Card, RichTextEditor } from "../shared";

const SeccionFormularioRedactar = ({
  titulo,
  onModoChange,
  renderFormulario,
  onTextoManualChange,
  placeholderTexto = "Escriba aquí...",
  modoInicial = "formulario",
}) => {
  const [modo, setModo] = useState(modoInicial);

  const handleToggle = () => {
    const nuevoModo = modo === "formulario" ? "redactar" : "formulario";
    setModo(nuevoModo);
    if (onModoChange) {
      onModoChange(nuevoModo);
    }
  };

  return (
    <>
      <div className="border-t-4 border-primary-500 pt-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-gray-900">{titulo}</h2>
          <Button
            variant={modo === "redactar" ? "primary" : "outline"}
            size="sm"
            onClick={handleToggle}
          >
            {modo === "formulario" ? "Redactar Manualmente" : "Usar Formulario"}
          </Button>
        </div>
      </div>

      <Card>
        {modo === "redactar" ? (
          <div>
            <p className="text-sm text-gray-600 mb-3">
              Redacte manualmente {titulo.toLowerCase()}:
            </p>
            <RichTextEditor
              onChange={onTextoManualChange}
              placeholder={placeholderTexto}
            />
          </div>
        ) : (
          renderFormulario()
        )}
      </Card>
    </>
  );
};

export default SeccionFormularioRedactar;
