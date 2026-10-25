import { useState } from "react";
import { Search } from "lucide-react";
import { Button, FormField } from "../shared";
import { validarCedula } from "../../utils/validarCedula";

const ComparecienteSearch = ({
  onSearch,
  loading,
  mode = "cedula", // 'cedula' | 'ruc'
}) => {
  const [value, setValue] = useState("");
  const [error, setError] = useState("");
  const [tipoDoc, setTipoDoc] = useState("cedula"); // 'cedula' | 'pasaporte'

  const validate = (val) => {
    if (!val.trim()) return "Ingrese un valor para buscar";

    if (mode === "cedula") {
      if (tipoDoc === "cedula") {
        if (!/^\d{10}$/.test(val)) return "La cédula debe tener 10 dígitos";
        if (!validarCedula(val)) return "Cédula ecuatoriana inválida";
      }
      // Pasaporte: cualquier combinación alfanumérica de 5 a 20 caracteres
      if (tipoDoc === "pasaporte") {
        if (val.trim().length < 4)
          return "El pasaporte debe tener al menos 4 caracteres";
      }
    } else {
      if (!/^\d{13}$/.test(val))
        return "El RUC debe tener 13 dígitos numéricos";
      if (!val.endsWith("001")) return "El RUC de empresa debe terminar en 001";
    }

    return "";
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const validationError = validate(value);
    if (validationError) {
      setError(validationError);
      return;
    }
    setError("");
    onSearch(value.trim(), tipoDoc);
  };

  return (
    <div className="space-y-2">
      {mode === "cedula" && (
        <div className="flex gap-2 mb-2">
          <button
            type="button"
            onClick={() => {
              setTipoDoc("cedula");
              setError("");
            }}
            className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
              tipoDoc === "cedula"
                ? "bg-blue-100 text-blue-700"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
          >
            Cédula
          </button>
          <button
            type="button"
            onClick={() => {
              setTipoDoc("pasaporte");
              setError("");
            }}
            className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
              tipoDoc === "pasaporte"
                ? "bg-blue-100 text-blue-700"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
          >
            Pasaporte
          </button>
        </div>
      )}
      <form onSubmit={handleSubmit} className="flex gap-3 items-end">
        <FormField
          label={
            mode === "ruc"
              ? "RUC"
              : tipoDoc === "cedula"
                ? "Número de Cédula"
                : "Número de Pasaporte"
          }
          error={error}
          className="flex-1"
        >
          <input
            type="text"
            value={value}
            onChange={(e) => {
              setValue(e.target.value);
              setError("");
            }}
            className={`input-field ${error ? "border-red-500 bg-red-50" : ""}`}
            placeholder={
              mode === "ruc"
                ? "Ej: 1234567890001"
                : tipoDoc === "cedula"
                  ? "Ej: 1234567890"
                  : "Ej: PA123456"
            }
            maxLength={mode === "ruc" ? 13 : tipoDoc === "cedula" ? 10 : 20}
            disabled={loading}
          />
        </FormField>

        <Button
          type="submit"
          variant="primary"
          icon={<Search className="w-5 h-5" />}
          loading={loading}
          disabled={loading}
        >
          Buscar
        </Button>
      </form>
    </div>
  );
};

export default ComparecienteSearch;
