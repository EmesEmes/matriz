import { useNavigate } from "react-router";
import { FileText, Gavel, Scale, ArrowLeft } from "lucide-react";

const TIPOS_PODER = [
  {
    id: "poder_general",
    nombre: "Poder General",
    grupo: "Poderes y Procuraciones",
  },
  {
    id: "poder_general_facultades",
    nombre: "Poder General con Facultades Especiales",
    grupo: "Poderes y Procuraciones",
  },
  {
    id: "poder_especial",
    nombre: "Poder Especial",
    grupo: "Poderes y Procuraciones",
  },
  {
    id: "procuracion_judicial",
    nombre: "Procuración Judicial",
    grupo: "Poderes y Procuraciones",
  },
  {
    id: "procuracion_poder_especial",
    nombre: "Procuración Judicial y Poder Especial",
    grupo: "Poderes y Procuraciones",
  },
  {
    id: "procuracion_poder_general",
    nombre: "Procuración Judicial y Poder General",
    grupo: "Poderes y Procuraciones",
  },
  {
    id: "poder_general_telematico",
    nombre: "Poder General (Telemático)",
    grupo: "Modalidad Telemática",
  },
  {
    id: "poder_general_facultades_telematico",
    nombre: "Poder General con Facultades Especiales (Telemático)",
    grupo: "Modalidad Telemática",
  },
  {
    id: "poder_especial_telematico",
    nombre: "Poder Especial (Telemático)",
    grupo: "Modalidad Telemática",
  },
  {
    id: "procuracion_judicial_telematico",
    nombre: "Procuración Judicial (Telemático)",
    grupo: "Modalidad Telemática",
  },
  {
    id: "procuracion_poder_especial_telematico",
    nombre: "Procuración Judicial y Poder Especial (Telemático)",
    grupo: "Modalidad Telemática",
  },
  {
    id: "procuracion_poder_general_telematico",
    nombre: "Procuración Judicial y Poder General (Telemático)",
    grupo: "Modalidad Telemática",
  },
  {
    id: "delegacion_poder_general",
    nombre: "Delegación de Poder General",
    grupo: "Delegaciones",
  },
  {
    id: "delegacion_poder_especial",
    nombre: "Delegación de Poder Especial",
    grupo: "Delegaciones",
  },
  {
    id: "delegacion_procuracion_judicial",
    nombre: "Delegación de Procuración Judicial",
    grupo: "Delegaciones",
  },
  {
    id: "delegacion_poder_general_telematico",
    nombre: "Delegación de Poder General (Telemático)",
    grupo: "Delegaciones",
  },
  {
    id: "delegacion_poder_especial_telematico",
    nombre: "Delegación de Poder Especial (Telemático)",
    grupo: "Delegaciones",
  },
  {
    id: "delegacion_procuracion_judicial_telematico",
    nombre: "Delegación de Procuración Judicial (Telemático)",
    grupo: "Delegaciones",
  },
];

const GRUPOS = [
  "Poderes y Procuraciones",
  "Modalidad Telemática",
  "Delegaciones",
];

const iconoGrupo = {
  "Poderes y Procuraciones": FileText,
  "Modalidad Telemática": Scale,
  Delegaciones: Gavel,
};

const SeleccionTipoPoderPage = () => {
  const navigate = useNavigate();

  return (
    <div className="max-w-4xl mx-auto">
      <button
        onClick={() => navigate("/minutas")}
        className="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700 mb-4"
      >
        <ArrowLeft className="w-4 h-4" /> Volver a Minutas
      </button>

      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Generar Poder</h1>
        <p className="text-gray-500 mt-1">
          Seleccione el tipo de poder, procuración o delegación que desea
          generar.
        </p>
      </div>

      {GRUPOS.map((grupo) => {
        const Icon = iconoGrupo[grupo];
        const tipos = TIPOS_PODER.filter((t) => t.grupo === grupo);
        return (
          <div key={grupo} className="mb-8">
            <div className="flex items-center gap-2 mb-4">
              <Icon className="w-5 h-5 text-gray-500" />
              <h2 className="text-lg font-semibold text-gray-800">{grupo}</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {tipos.map((tipo) => (
                <button
                  key={tipo.id}
                  onClick={() => navigate(`/minutas/poder/${tipo.id}`)}
                  className="text-left p-5 rounded-xl border-2 border-gray-200 bg-white hover:border-blue-400 hover:bg-blue-50 transition-all duration-200 shadow-sm hover:shadow-md"
                >
                  <h3 className="text-sm font-semibold text-gray-900">
                    {tipo.nombre}
                  </h3>
                </button>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default SeleccionTipoPoderPage;
export { TIPOS_PODER };
