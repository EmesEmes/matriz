import { useState, useEffect, useCallback, useRef } from "react";
import { apiFetch } from "../../config/api";
import { Card, Button } from "../../components/shared";
import { useToast } from "../../hooks/useToast";

const GestionTokensPage = () => {
  const toast = useToast();
  const toastRef = useRef(toast);
  const [tokens, setTokens] = useState([]);
  const [loading, setLoading] = useState(false);
  const [generando, setGenerando] = useState(false);
  const [linkGenerado, setLinkGenerado] = useState(null);

  const cargarTokens = useCallback(async () => {
    setLoading(true);
    try {
      const res = await apiFetch("/api/registro/tokens");
      if (res.ok) {
        const data = await res.json();
        setTokens(data);
      }
    } catch {
      toastRef.current.error("Error al cargar los tokens");
    } finally {
      setLoading(false);
    }
  }, []); // sin dependencias — estable para siempre

  useEffect(() => {
    cargarTokens();
  }, [cargarTokens]);

  const generarToken = async () => {
    setGenerando(true);
    setLinkGenerado(null);
    try {
      const res = await apiFetch("/api/registro/generar-token", {
        method: "POST",
      });
      if (res.ok) {
        const data = await res.json();
        setLinkGenerado(data.link);
        toast.success("Enlace generado correctamente");
        cargarTokens();
      } else {
        toast.error("Error al generar el enlace");
      }
    } catch {
      toast.error("Error al generar el enlace");
    } finally {
      setGenerando(false);
    }
  };

  const copiarLink = (link) => {
    navigator.clipboard.writeText(link);
    toast.success("Enlace copiado al portapapeles");
  };

  const eliminarToken = async (tkn) => {
    if (!confirm("¿Eliminar este enlace?")) return;
    try {
      const res = await apiFetch(`/api/registro/tokens/${tkn}`, {
        method: "DELETE",
      });
      if (res.ok || res.status === 204) {
        toast.success("Enlace eliminado");
        cargarTokens();
      } else {
        const data = await res.json();
        toast.error(data.detail || "Error al eliminar");
      }
    } catch {
      toast.error("Error al eliminar el enlace");
    }
  };

  const formatearFecha = (fechaStr) => {
    if (!fechaStr) return "-";
    const fecha = new Date(fechaStr);
    return fecha.toLocaleDateString("es-EC", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const estaExpirado = (fechaStr) => {
    if (!fechaStr) return false;
    return new Date(fechaStr) < new Date();
  };

  const getEstado = (tkn) => {
    if (tkn.usado)
      return { texto: "Usado", color: "bg-green-100 text-green-700" };
    if (estaExpirado(tkn.expira_en))
      return { texto: "Expirado", color: "bg-red-100 text-red-700" };
    return { texto: "Pendiente", color: "bg-yellow-100 text-yellow-700" };
  };

  return (
    <div className="max-w-5xl mx-auto">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">
          Registro de Clientes
        </h1>
        <p className="text-gray-600 mt-1">
          Genera enlaces únicos para que los clientes registren sus datos antes
          de su cita.
        </p>
      </div>

      <Card title="Generar nuevo enlace" className="mb-6">
        <div className="space-y-4">
          <p className="text-sm text-gray-600">
            Al generar un enlace, el cliente podrá registrar sus datos
            personales sin necesidad de iniciar sesión. El enlace es válido por{" "}
            <strong>72 horas</strong> y solo puede usarse{" "}
            <strong>una vez</strong>.
          </p>

          <Button
            onClick={generarToken}
            loading={generando}
            variant="primary"
            size="lg"
          >
            🔗 Generar nuevo enlace
          </Button>

          {linkGenerado && (
            <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
              <p className="text-sm font-medium text-green-800 mb-2">
                ✅ Enlace generado — compártelo con el cliente por WhatsApp o
                email:
              </p>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  readOnly
                  value={linkGenerado}
                  className="flex-1 px-3 py-2 bg-white border border-green-300 rounded-lg text-sm text-gray-700 focus:outline-none"
                />
                <Button
                  onClick={() => copiarLink(linkGenerado)}
                  variant="outline"
                  size="sm"
                >
                  Copiar
                </Button>
              </div>
              <div className="mt-3">
                <a
                  href={`https://wa.me/?text=${encodeURIComponent(`Estimado cliente, por favor complete sus datos antes de su cita en la notaría usando el siguiente enlace: ${linkGenerado}`)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 px-3 py-1.5 bg-green-600 text-white text-sm rounded-lg hover:bg-green-700 transition-colors"
                >
                  📱 Enviar por WhatsApp
                </a>
              </div>
            </div>
          )}
        </div>
      </Card>

      <Card title="Historial de enlaces">
        {loading ? (
          <div className="flex items-center justify-center py-8">
            <div className="w-8 h-8 border-4 border-primary-600 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : tokens.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            No hay enlaces generados todavía.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b text-left text-gray-500">
                  <th className="pb-3 pr-4">Estado</th>
                  <th className="pb-3 pr-4">Creado por</th>
                  <th className="pb-3 pr-4">Creado el</th>
                  <th className="pb-3 pr-4">Expira el</th>
                  <th className="pb-3 pr-4">Cédula cliente</th>
                  <th className="pb-3">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {tokens.map((tkn) => {
                  const estado = getEstado(tkn);
                  return (
                    <tr key={tkn.id} className="hover:bg-gray-50">
                      <td className="py-3 pr-4">
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium ${estado.color}`}
                        >
                          {estado.texto}
                        </span>
                      </td>
                      <td className="py-3 pr-4 text-gray-700">
                        {tkn.creado_por || "-"}
                      </td>
                      <td className="py-3 pr-4 text-gray-600">
                        {formatearFecha(tkn.creado_en)}
                      </td>
                      <td
                        className={`py-3 pr-4 ${estaExpirado(tkn.expira_en) && !tkn.usado ? "text-red-500" : "text-gray-600"}`}
                      >
                        {formatearFecha(tkn.expira_en)}
                      </td>
                      <td className="py-3 pr-4 text-gray-700">
                        {tkn.party_document_number || "-"}
                      </td>
                      <td className="py-3">
                        <div className="flex items-center gap-2">
                          {!tkn.usado && !estaExpirado(tkn.expira_en) && (
                            <button
                              onClick={() =>
                                copiarLink(
                                  `${window.location.origin}/registro/${tkn.token}`,
                                )
                              }
                              className="text-blue-600 hover:text-blue-800 text-xs underline"
                            >
                              Copiar link
                            </button>
                          )}
                          {!tkn.usado && (
                            <button
                              onClick={() => eliminarToken(tkn.token)}
                              className="text-red-500 hover:text-red-700 text-xs underline"
                            >
                              Eliminar
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </div>
  );
};

export default GestionTokensPage;
