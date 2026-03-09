import { useState, useEffect } from "react";
import { Card, Button } from "../shared";
import ComparecienteSearch from "./ComparecienteSearch";
import ComparecienteForm from "./ComparecienteForm";
import ComparecienteCard from "./ComparecienteCard";
import ComparecienteOptions from "./ComparecienteOptions";
import EmpresaCard from "./EmpresaCard";
import { apiFetch } from "../../config/api";
import API_CONFIG from "../../config/api";
import { useToast } from "../../hooks/useToast";
import { transformToCamelCase } from "../../utils/transformPartyData";
import { Edit, CheckCircle, PlusCircle, User, Building2 } from "lucide-react";

const INITIAL_OPCIONES = {
  conyugueComparece: true,
  razonExclusionConyugue: "",
  hasDiscapacidadIntelectual: false,
  tipoDiscapacidad: "",
  isNoVidente: false,
  personaConfianzaNoVidente: "",
  isAnalfabeta: false,
  personaConfianzaAnalfabeta: "",
  needsInterpreter: false,
  generoInterprete: "",
  cedulaInterprete: "",
  nombreInterprete: "",
  idiomaInterprete: "",
};

const ComparecienteInline = ({
  title,
  onComparecienteReady,
  initialData = null,
}) => {
  const [entityType, setEntityType] = useState("persona"); // 'persona' | 'empresa'
  const [mode, setMode] = useState("search");
  const [loading, setLoading] = useState(false);
  const [compareciente, setCompareciente] = useState(null);
  const [opcionesEspeciales, setOpcionesEspeciales] =
    useState(INITIAL_OPCIONES);
  const toast = useToast();

  // Precargar datos desde plantilla
  useEffect(() => {
    if (!initialData) return;
    const esEmpresa = initialData.esEmpresa === true || !!initialData.ruc;
    setEntityType(esEmpresa ? "empresa" : "persona");
    setCompareciente(initialData);
    setMode("selected");
    // Restaurar opciones especiales si vienen en el initialData
    const opciones = {};
    Object.keys(INITIAL_OPCIONES).forEach((key) => {
      if (initialData[key] !== undefined) opciones[key] = initialData[key];
    });
    if (Object.keys(opciones).length > 0) {
      setOpcionesEspeciales((prev) => ({ ...prev, ...opciones }));
    }
    if (onComparecienteReady) onComparecienteReady(initialData);
  }, [initialData]); // eslint-disable-line react-hooks/exhaustive-deps

  const notifyParent = (comp, opciones) => {
    if (onComparecienteReady) {
      onComparecienteReady({ ...comp, ...opciones });
    }
  };

  // ─── Lógica Persona Natural ──────────────────────────────────────────────
  const handleSearchPersona = async (documentNumber) => {
    setLoading(true);
    try {
      const response = await apiFetch(
        `${API_CONFIG.ENDPOINTS.PARTIES}/${documentNumber}`,
      );
      if (response.ok) {
        const data = await response.json();
        const transformed = transformToCamelCase(data);
        setCompareciente(transformed);
        setMode("selected");
        const nuevasOpciones = {
          ...opcionesEspeciales,
          estadoCivil: transformed.maritalStatus,
        };
        setOpcionesEspeciales(nuevasOpciones);
        notifyParent(transformed, nuevasOpciones);
        toast.success("Compareciente encontrado");
      } else if (response.status === 404) {
        toast.info("Compareciente no encontrado. Crear uno nuevo.");
        setCompareciente(null);
        setMode("create");
      } else {
        const errorData = await response.json();
        toast.error(errorData.detail || "Error al buscar");
      }
    } catch {
      toast.error("Error al buscar compareciente");
    } finally {
      setLoading(false);
    }
  };

  const handleSuccessPersona = (data) => {
    const transformed = transformToCamelCase(data);
    setCompareciente(transformed);
    setMode("selected");
    const nuevasOpciones = {
      ...opcionesEspeciales,
      estadoCivil: transformed.maritalStatus,
    };
    setOpcionesEspeciales(nuevasOpciones);
    notifyParent(transformed, nuevasOpciones);
    toast.success("Compareciente guardado exitosamente");
  };

  // ─── Lógica Empresa ──────────────────────────────────────────────────────
  const handleSearchEmpresa = async (ruc) => {
    setLoading(true);
    try {
      const response = await apiFetch(
        `${API_CONFIG.ENDPOINTS.COMPANIES}/${ruc}`,
      );
      if (response.ok) {
        const data = await response.json();
        const transformed = transformToCamelCase(data);
        const empresaData = { ...transformed, esEmpresa: true };
        setCompareciente(empresaData);
        setMode("selected");
        notifyParent(empresaData, {});
        toast.success("Empresa encontrada");
      } else if (response.status === 404) {
        toast.info("Empresa no encontrada. Verifique el RUC.");
      } else {
        const errorData = await response.json();
        toast.error(errorData.detail || "Error al buscar empresa");
      }
    } catch {
      toast.error("Error al buscar empresa");
    } finally {
      setLoading(false);
    }
  };

  // ─── Cambiar tipo ────────────────────────────────────────────────────────
  const handleSwitchType = (type) => {
    if (type === entityType) return;
    setEntityType(type);
    setMode("search");
    setCompareciente(null);
    setOpcionesEspeciales(INITIAL_OPCIONES);
    if (onComparecienteReady) onComparecienteReady(null);
  };

  const handleOpcionesChange = (nuevasOpciones) => {
    setOpcionesEspeciales(nuevasOpciones);
    if (compareciente) notifyParent(compareciente, nuevasOpciones);
  };

  const handleEdit = () => setMode("edit");
  const handleCancelEdit = () => setMode("selected");

  const handleChange = () => {
    setCompareciente(null);
    setOpcionesEspeciales(INITIAL_OPCIONES);
    setMode("search");
    if (onComparecienteReady) onComparecienteReady(null);
  };

  const isPersona = entityType === "persona";

  return (
    <Card title={title}>
      {/* Toggle Persona / Empresa — solo visible en búsqueda o cuando no hay selección */}
      {(mode === "search" || mode === "create") && (
        <div className="flex gap-1 p-1 bg-gray-100 rounded-lg w-fit mb-4">
          <button
            type="button"
            onClick={() => handleSwitchType("persona")}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium transition-all ${
              isPersona
                ? "bg-white text-gray-900 shadow-sm"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            <User className="w-4 h-4" />
            Persona Natural
          </button>
          <button
            type="button"
            onClick={() => handleSwitchType("empresa")}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium transition-all ${
              !isPersona
                ? "bg-white text-gray-900 shadow-sm"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            <Building2 className="w-4 h-4" />
            Empresa
          </button>
        </div>
      )}

      {/* MODO BÚSQUEDA */}
      {mode === "search" && (
        <div className="space-y-4">
          {isPersona ? (
            <>
              <ComparecienteSearch
                onSearch={handleSearchPersona}
                loading={loading}
              />
              <div className="text-center">
                <p className="text-sm text-gray-600 mb-2">o</p>
                <Button
                  variant="outline"
                  icon={<PlusCircle className="w-5 h-5" />}
                  onClick={() => setMode("create")}
                >
                  Crear Nuevo Compareciente
                </Button>
              </div>
            </>
          ) : (
            <ComparecienteSearch
              onSearch={handleSearchEmpresa}
              loading={loading}
              mode="ruc"
              label="Buscar por RUC"
              placeholder="Ej: 1790012345001"
            />
          )}
        </div>
      )}

      {/* MODO CREAR (solo persona natural) */}
      {mode === "create" && isPersona && (
        <ComparecienteForm
          onSuccess={handleSuccessPersona}
          onCancel={() => setMode("search")}
        />
      )}

      {/* MODO EDITAR (solo persona natural) */}
      {mode === "edit" && isPersona && (
        <ComparecienteForm
          initialData={compareciente}
          onSuccess={handleSuccessPersona}
          onCancel={handleCancelEdit}
        />
      )}

      {/* MODO SELECCIONADO */}
      {mode === "selected" && compareciente && (
        <div className="space-y-4">
          <div className="flex items-center gap-2 p-3 bg-green-50 border border-green-200 rounded-lg">
            <CheckCircle className="w-5 h-5 text-green-600 shrink-0" />
            <span className="text-sm font-medium text-green-800 flex-1">
              {isPersona
                ? "Compareciente seleccionado"
                : "Empresa seleccionada"}
            </span>
          </div>

          {isPersona ? (
            <>
              <ComparecienteCard data={compareciente} showPartner={true} />
              <ComparecienteOptions
                options={opcionesEspeciales}
                onChange={handleOpcionesChange}
              />
              <div className="flex gap-3">
                <Button
                  variant="secondary"
                  icon={<Edit className="w-5 h-5" />}
                  onClick={handleEdit}
                >
                  Editar
                </Button>
                <Button variant="outline" onClick={handleChange}>
                  Cambiar Compareciente
                </Button>
              </div>
            </>
          ) : (
            <>
              <EmpresaCard data={compareciente} />
              <div className="flex gap-3">
                <Button variant="outline" onClick={handleChange}>
                  Cambiar Empresa
                </Button>
              </div>
            </>
          )}
        </div>
      )}
    </Card>
  );
};

export default ComparecienteInline;
