import { useState } from "react";
import { useParams, useNavigate } from "react-router";
import { Button } from "../../../components/shared";
import {
  DatosAdministrativos,
  DatosAbogado,
  TextNumberTransformer,
} from "../../../components/documentos";
import { ComparecienteInline } from "../../../components/comparecientes";
import { FileText, ArrowLeft } from "lucide-react";
import { useToast } from "../../../hooks/useToast";
import { TIPOS_PODER } from "./SeleccionTipoPoderPage";

const TIPOS_COMPARECENCIA = [
  {
    id: "un_poderdante",
    nombre: "Un Poderdante",
    descripcion: "Una sola persona otorga el poder.",
  },
  {
    id: "poderdantes_conyuges",
    nombre: "Dos o más Poderdantes Cónyuges",
    descripcion: "Marido y mujer otorgan el poder conjuntamente.",
  },
  {
    id: "poderdantes_comunes",
    nombre: "Dos o más Poderdantes Comunes",
    descripcion: "Varias personas sin relación conyugal otorgan el poder.",
  },
  {
    id: "poderdante_juridica",
    nombre: "Poderdante Persona Jurídica",
    descripcion:
      "Una empresa otorga el poder, representada por su representante legal.",
  },
  {
    id: "poderdante_juridica_propios",
    nombre:
      "Poderdante Persona Jurídica y Representante por sus Propios Derechos",
    descripcion:
      "El representante legal otorga el poder a la vez por sí mismo y por la empresa.",
  },
];

const esTelematico = (tipoId) => tipoId.includes("telematico");
const esProcuracionJudicial = (tipoId) =>
  tipoId.includes("procuracion") || tipoId.includes("procuracion_judicial");

const FormularioPoder = () => {
  const { tipoPoderId } = useParams();
  const navigate = useNavigate();
  const toast = useToast();

  const tipoPoder = TIPOS_PODER.find((t) => t.id === tipoPoderId);
  const esTelematicoFlag = tipoPoderId ? esTelematico(tipoPoderId) : false;
  const esProcuracionFlag = tipoPoderId
    ? esProcuracionJudicial(tipoPoderId)
    : false;

  const [tipoComparecencia, setTipoComparecencia] = useState("");
  const [datosAdministrativos, setDatosAdministrativos] = useState(null);
  const [poderdantes, setPoderdantes] = useState([]);
  const [apoderados, setApoderados] = useState([]);
  const [esAbogadoApoderado, setEsAbogadoApoderado] = useState({});
  const [minuta, setMinuta] = useState("");
  const [datosAbogado, setDatosAbogado] = useState(null);
  const [loading, setLoading] = useState(false);

  if (!tipoPoder) {
    return (
      <div className="max-w-2xl mx-auto text-center py-12">
        <p className="text-gray-600">Tipo de poder no reconocido.</p>
        <Button
          variant="outline"
          onClick={() => navigate("/minutas/poder")}
          className="mt-4"
        >
          Volver
        </Button>
      </div>
    );
  }

  const handleAgregarPoderdante = () => setPoderdantes([...poderdantes, null]);
  const handlePoderdanteReady = (index, data) => {
    const arr = [...poderdantes];
    arr[index] = data;
    setPoderdantes(arr);
  };
  const handleEliminarPoderdante = (index) =>
    setPoderdantes(poderdantes.filter((_, i) => i !== index));

  const handleAgregarApoderado = () => setApoderados([...apoderados, null]);
  const handleApoderadoReady = (index, data) => {
    const arr = [...apoderados];
    arr[index] = data;
    setApoderados(arr);
  };
  const handleEliminarApoderado = (index) =>
    setApoderados(apoderados.filter((_, i) => i !== index));

  // Número de poderdantes según el tipo de comparecencia elegido
  const requiereMultiplesPoderdantes =
    tipoComparecencia === "poderdantes_conyuges" ||
    tipoComparecencia === "poderdantes_comunes";
  const esPersonaJuridica =
    tipoComparecencia === "poderdante_juridica" ||
    tipoComparecencia === "poderdante_juridica_propios";

  const handleGenerar = () => {
    // Validaciones básicas de maqueta
    if (!tipoComparecencia) {
      toast.error("Seleccione el tipo de comparecencia del poderdante");
      return;
    }
    if (!datosAdministrativos?.notarioKey) {
      toast.error("Seleccione un notario");
      return;
    }
    if (poderdantes.length === 0 || poderdantes.some((p) => p === null)) {
      toast.error("Complete los datos de todos los poderdantes");
      return;
    }
    if (apoderados.length === 0 || apoderados.some((a) => a === null)) {
      toast.error("Complete los datos de todos los apoderados");
      return;
    }
    if (!minuta.trim()) {
      toast.error("Ingrese el texto de las facultades / minuta del poder");
      return;
    }

    setLoading(true);

    // Payload de ejemplo — esto es solo una maqueta de frontend, no hay backend conectado todavía
    const payload = {
      tipo_poder: tipoPoderId,
      tipo_comparecencia: tipoComparecencia,
      es_telematico: esTelematicoFlag,
      es_procuracion_judicial: esProcuracionFlag,
      datos_administrativos: datosAdministrativos,
      poderdantes,
      apoderados,
      es_abogado_apoderado: esAbogadoApoderado,
      minuta,
      datos_abogado: datosAbogado,
    };

    console.log("Payload del Poder (maqueta — sin backend):", payload);

    setTimeout(() => {
      setLoading(false);
      toast.success(
        "Vista previa generada — revisa la consola del navegador (aún no hay backend conectado)",
      );
    }, 600);
  };

  return (
    <div className="max-w-7xl mx-auto">
      <button
        onClick={() => navigate("/minutas/poder")}
        className="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700 mb-4"
      >
        <ArrowLeft className="w-4 h-4" /> Volver a Tipos de Poder
      </button>

      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">
          Generar {tipoPoder.nombre}
        </h1>
        <p className="text-gray-600 mt-1">
          Complete todos los datos para generar el instrumento notarial
        </p>
        {esProcuracionFlag && (
          <div className="mt-3 p-3 bg-amber-50 border border-amber-200 rounded-lg">
            <p className="text-sm text-amber-800">
              <strong>Nota:</strong> en procuraciones judiciales, quien actúa
              como procurador/a debe ser abogado/a.
            </p>
          </div>
        )}
      </div>

      <div className="space-y-6">
        {/* TIPO DE COMPARECENCIA */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Tipo de Comparecencia del Poderdante
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {TIPOS_COMPARECENCIA.map((tc) => (
              <button
                key={tc.id}
                type="button"
                onClick={() => {
                  setTipoComparecencia(tc.id);
                  setPoderdantes([]);
                }}
                className={`text-left p-4 rounded-lg border-2 transition-colors ${
                  tipoComparecencia === tc.id
                    ? "border-blue-500 bg-blue-50"
                    : "border-gray-200 hover:border-gray-300"
                }`}
              >
                <div className="font-semibold text-gray-900 text-sm">
                  {tc.nombre}
                </div>
                <div className="text-xs text-gray-500 mt-0.5">
                  {tc.descripcion}
                </div>
              </button>
            ))}
          </div>
        </div>

        {tipoComparecencia && (
          <>
            {/* DATOS ADMINISTRATIVOS */}
            <DatosAdministrativos
              onChange={setDatosAdministrativos}
              tipoContrato={tipoPoderId}
            />

            {/* PODERDANTE(S) */}
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold text-gray-900">
                  {esPersonaJuridica
                    ? "Representante Legal / Poderdante"
                    : requiereMultiplesPoderdantes
                      ? "Poderdantes"
                      : "Poderdante"}
                </h2>
                {requiereMultiplesPoderdantes && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleAgregarPoderdante}
                  >
                    + Agregar Poderdante
                  </Button>
                )}
              </div>

              {esPersonaJuridica && (
                <div className="p-3 bg-purple-50 border border-purple-200 rounded-lg">
                  <p className="text-sm text-purple-800">
                    Use el toggle "Persona Jurídica" dentro del compareciente
                    para capturar los datos de la empresa y su representante
                    legal.
                    {tipoComparecencia === "poderdante_juridica_propios" &&
                      " El representante legal comparece también por sus propios derechos."}
                  </p>
                </div>
              )}

              {poderdantes.length === 0 && (
                <div className="p-6 bg-gray-50 border-2 border-dashed border-gray-300 rounded-lg text-center">
                  <p className="text-gray-600">
                    No hay poderdantes agregados todavía.
                  </p>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleAgregarPoderdante}
                    className="mt-3"
                  >
                    + Agregar Poderdante
                  </Button>
                </div>
              )}

              {poderdantes.map((p, index) => (
                <div key={index} className="relative">
                  <ComparecienteInline
                    title={`Poderdante ${index + 1}`}
                    initialData={p || null}
                    onComparecienteReady={(data) =>
                      handlePoderdanteReady(index, data)
                    }
                  />
                  {poderdantes.length > 1 && (
                    <button
                      onClick={() => handleEliminarPoderdante(index)}
                      className="absolute top-4 right-4 text-red-600 hover:text-red-800 font-medium text-sm"
                    >
                      Eliminar
                    </button>
                  )}
                </div>
              ))}
            </div>

            {/* APODERADO(S) */}
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold text-gray-900">
                  {esProcuracionFlag
                    ? "Procurador(es) Judicial(es)"
                    : "Apoderado(s) / Mandatario(s)"}
                </h2>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleAgregarApoderado}
                >
                  + Agregar {esProcuracionFlag ? "Procurador" : "Apoderado"}
                </Button>
              </div>

              {apoderados.length === 0 && (
                <div className="p-6 bg-gray-50 border-2 border-dashed border-gray-300 rounded-lg text-center">
                  <p className="text-gray-600">
                    No hay {esProcuracionFlag ? "procuradores" : "apoderados"}{" "}
                    agregados. Click en "Agregar" para comenzar.
                  </p>
                </div>
              )}

              {apoderados.map((a, index) => (
                <div key={index} className="relative space-y-2">
                  <ComparecienteInline
                    title={`${esProcuracionFlag ? "Procurador" : "Apoderado"} ${index + 1}`}
                    initialData={a || null}
                    onComparecienteReady={(data) =>
                      handleApoderadoReady(index, data)
                    }
                  />
                  {esProcuracionFlag && (
                    <label className="flex items-center gap-2 px-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={esAbogadoApoderado[index] || false}
                        onChange={(e) =>
                          setEsAbogadoApoderado((prev) => ({
                            ...prev,
                            [index]: e.target.checked,
                          }))
                        }
                        className="w-4 h-4 rounded text-blue-600"
                      />
                      <span className="text-sm text-gray-700">
                        Confirmo que esta persona es abogado/a (requisito para
                        procuración judicial)
                      </span>
                    </label>
                  )}
                  {apoderados.length > 1 && (
                    <button
                      onClick={() => handleEliminarApoderado(index)}
                      className="absolute top-4 right-4 text-red-600 hover:text-red-800 font-medium text-sm"
                    >
                      Eliminar
                    </button>
                  )}
                </div>
              ))}
            </div>

            {esTelematicoFlag && (
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-2">
                  Comparecencia Telemática
                </h2>
                <p className="text-sm text-gray-600">
                  Este poder se otorga mediante comparecencia telemática.
                  Verifique que cuenta con los medios técnicos habilitados para
                  la firma electrónica y videoconferencia notarial antes de
                  continuar.
                </p>
              </div>
            )}

            {/* MINUTA / FACULTADES */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Facultades del Poder
              </h2>
              <TextNumberTransformer onChange={setMinuta} />
            </div>

            {/* DATOS DEL ABOGADO */}
            <DatosAbogado
              onChange={setDatosAbogado}
              initialData={datosAbogado}
            />

            {/* BOTÓN */}
            <div className="sticky bottom-0 bg-white border-t border-gray-200 p-4 shadow-lg">
              <div className="flex justify-end">
                <Button
                  variant="primary"
                  size="lg"
                  icon={<FileText className="w-5 h-5" />}
                  onClick={handleGenerar}
                  loading={loading}
                  disabled={loading}
                >
                  {loading ? "Generando..." : "Generar Poder (vista previa)"}
                </Button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default FormularioPoder;
