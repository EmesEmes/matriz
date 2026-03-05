import { useState } from "react";
import { Button } from "../components/shared";
import ComparecienteSearch from "../components/comparecientes/ComparecienteSearch";
import ComparecienteForm from "../components/comparecientes/ComparecienteForm";
import ComparecienteCard from "../components/comparecientes/ComparecienteCard";
import EmpresaForm from "../components/comparecientes/EmpresaForm";
import EmpresaCard from "../components/comparecientes/EmpresaCard";
import { apiFetch } from "../config/api";
import API_CONFIG from "../config/api";
import { useToast } from "../hooks/useToast";
import { transformToCamelCase } from "../utils/transformPartyData";
import { Plus, Edit, ArrowLeft, User, Building2 } from "lucide-react";

const ComparecientesPage = () => {
  // 'persona' | 'empresa'
  const [entityType, setEntityType] = useState("persona");

  // Estados compartidos por los dos modos
  const [view, setView] = useState("search"); // 'search' | 'create' | 'edit' | 'view'
  const [loading, setLoading] = useState(false);
  const [currentPersona, setCurrentPersona] = useState(null);
  const [currentEmpresa, setCurrentEmpresa] = useState(null);
  const toast = useToast();

  // ─── Helpers de navegación ───────────────────────────────────────────────
  const handleBackToSearch = () => {
    setView("search");
    if (entityType === "persona") setCurrentPersona(null);
    else setCurrentEmpresa(null);
  };

  const handleSwitchType = (type) => {
    if (type === entityType) return;
    setEntityType(type);
    setView("search");
    setCurrentPersona(null);
    setCurrentEmpresa(null);
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
        setCurrentPersona(transformToCamelCase(data));
        setView("view");
      } else if (response.status === 404) {
        toast.info("Compareciente no encontrado. Puede crear uno nuevo.");
        setCurrentPersona(null);
      } else {
        const err = await response.json();
        toast.error(err.detail || "Error al buscar compareciente");
      }
    } catch {
      toast.error("Error al buscar compareciente");
    } finally {
      setLoading(false);
    }
  };

  const handlePersonaSuccess = (data) => {
    setCurrentPersona(transformToCamelCase(data));
    setView("view");
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
        setCurrentEmpresa(transformToCamelCase(data));
        setView("view");
      } else if (response.status === 404) {
        toast.info("Empresa no encontrada. Puede registrar una nueva.");
        setCurrentEmpresa(null);
      } else {
        const err = await response.json();
        toast.error(err.detail || "Error al buscar empresa");
      }
    } catch {
      toast.error("Error al buscar empresa");
    } finally {
      setLoading(false);
    }
  };

  const handleEmpresaSuccess = (data) => {
    setCurrentEmpresa(transformToCamelCase(data));
    setView("view");
  };

  // ─── Render ──────────────────────────────────────────────────────────────
  const isPersona = entityType === "persona";
  const currentItem = isPersona ? currentPersona : currentEmpresa;

  return (
    <div>
      {/* Encabezado */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Gestión de Comparecientes
          </h1>
          <p className="text-gray-600 mt-1">
            Buscar, crear y editar personas naturales y empresas
          </p>
        </div>

        {view === "search" && (
          <Button
            variant="primary"
            icon={<Plus className="w-5 h-5" />}
            onClick={() => setView("create")}
          >
            {isPersona ? "Nuevo Compareciente" : "Nueva Empresa"}
          </Button>
        )}

        {(view === "view" || view === "edit") && (
          <Button
            variant="secondary"
            icon={<ArrowLeft className="w-5 h-5" />}
            onClick={handleBackToSearch}
          >
            Volver a Búsqueda
          </Button>
        )}
      </div>

      {/* Toggle Persona / Empresa */}
      <div className="flex gap-1 p-1 bg-gray-100 rounded-lg w-fit mb-6">
        <button
          onClick={() => handleSwitchType("persona")}
          className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all ${
            isPersona
              ? "bg-white text-gray-900 shadow-sm"
              : "text-gray-500 hover:text-gray-700"
          }`}
        >
          <User className="w-4 h-4" />
          Persona Natural
        </button>
        <button
          onClick={() => handleSwitchType("empresa")}
          className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all ${
            !isPersona
              ? "bg-white text-gray-900 shadow-sm"
              : "text-gray-500 hover:text-gray-700"
          }`}
        >
          <Building2 className="w-4 h-4" />
          Empresa
        </button>
      </div>

      {/* ── BÚSQUEDA ── */}
      {view === "search" && (
        <div className="max-w-2xl">
          {isPersona ? (
            <>
              <ComparecienteSearch
                onSearch={handleSearchPersona}
                loading={loading}
              />
              <div className="mt-8 p-6 bg-blue-50 rounded-lg border border-blue-200">
                <h3 className="font-semibold text-blue-900 mb-2">
                  ℹ️ Instrucciones
                </h3>
                <ul className="text-sm text-blue-800 space-y-1">
                  <li>
                    • Busque un compareciente existente por número de cédula
                  </li>
                  <li>• Si no existe, podrá crear uno nuevo</li>
                  <li>• Puede editar los datos de comparecientes existentes</li>
                </ul>
              </div>
            </>
          ) : (
            <>
              <ComparecienteSearch
                onSearch={handleSearchEmpresa}
                loading={loading}
                placeholder="Ej: 1790012345001"
                label="Buscar por RUC"
                mode="ruc"
              />
              <div className="mt-8 p-6 bg-amber-50 rounded-lg border border-amber-200">
                <h3 className="font-semibold text-amber-900 mb-2">
                  ℹ️ Instrucciones
                </h3>
                <ul className="text-sm text-amber-800 space-y-1">
                  <li>• Busque una empresa existente por RUC</li>
                  <li>• Si no existe, podrá registrar una nueva</li>
                  <li>
                    • El representante legal debe estar registrado como
                    compareciente
                  </li>
                </ul>
              </div>
            </>
          )}
        </div>
      )}

      {/* ── CREAR ── */}
      {view === "create" &&
        (isPersona ? (
          <ComparecienteForm
            onSuccess={handlePersonaSuccess}
            onCancel={() => setView("search")}
          />
        ) : (
          <EmpresaForm
            onSuccess={handleEmpresaSuccess}
            onCancel={() => setView("search")}
          />
        ))}

      {/* ── EDITAR ── */}
      {view === "edit" &&
        (isPersona ? (
          <ComparecienteForm
            initialData={currentPersona}
            onSuccess={handlePersonaSuccess}
            onCancel={() => setView("view")}
          />
        ) : (
          <EmpresaForm
            initialData={currentEmpresa}
            onSuccess={handleEmpresaSuccess}
            onCancel={() => setView("view")}
          />
        ))}

      {/* ── VER ── */}
      {view === "view" && currentItem && (
        <div className="space-y-4">
          <div className="flex justify-end">
            <Button
              variant="primary"
              icon={<Edit className="w-5 h-5" />}
              onClick={() => setView("edit")}
            >
              {isPersona ? "Editar Compareciente" : "Editar Empresa"}
            </Button>
          </div>

          {isPersona ? (
            <ComparecienteCard data={currentPersona} showPartner={true} />
          ) : (
            <EmpresaCard data={currentEmpresa} />
          )}
        </div>
      )}
    </div>
  );
};

export default ComparecientesPage;
