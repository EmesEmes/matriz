import { useState } from "react";
import { Search } from "lucide-react";
import { Button, FormField } from "../shared";
import { validarCedula } from "../../utils/validarCedula";

const ComparecienteSearch = ({
  onSearch,
  loading,
  placeholder = "Ej: 1234567890",
  label = "Número de Cédula",
  mode = "cedula", // 'cedula' | 'ruc'
}) => {
  const [value, setValue] = useState("");
  const [error, setError] = useState("");

  const validate = (val) => {
    if (!val.trim()) return "Ingrese un valor para buscar";

    if (mode === "cedula") {
      if (!validarCedula(val)) return "Cédula inválida";
    } else {
      // RUC: 13 dígitos numéricos terminados en 001
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
    onSearch(value.trim());
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-3 items-end">
      <FormField label={label} error={error} className="flex-1">
        <input
          type="text"
          value={value}
          onChange={(e) => {
            setValue(e.target.value);
            setError("");
          }}
          className="input-field"
          placeholder={placeholder}
          maxLength={mode === "cedula" ? 10 : 13}
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
  );
};

export default ComparecienteSearch;
