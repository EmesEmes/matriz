import { useNavigate } from "react-router";
import { FileText, FileSignature, Scale } from "lucide-react";

const tiposContrato = [
  {
    id: "compraventa",
    nombre: "Compraventa",
    descripcion:
      "Transferencia de dominio de bienes inmuebles entre vendedor y comprador.",
    icon: FileText,
    path: "/minutas/compraventa",
    disponible: true,
    color: "blue",
  },
  {
    id: "promesa",
    nombre: "Promesa de Compraventa",
    descripcion:
      "Compromiso de celebrar un contrato de compraventa en fecha futura.",
    icon: FileSignature,
    path: "/minutas/promesa",
    disponible: false,
    color: "amber",
  },
  {
    id: "poder",
    nombre: "Poder",
    descripcion: "Autorización para que una persona actúe en nombre de otra.",
    icon: Scale,
    path: "/minutas/poder",
    disponible: false,
    color: "purple",
  },
];

const colorMap = {
  blue: {
    bg: "bg-blue-50",
    icon: "text-blue-600",
    border: "border-blue-200",
    hover: "hover:border-blue-400 hover:bg-blue-50",
  },
  amber: {
    bg: "bg-amber-50",
    icon: "text-amber-600",
    border: "border-amber-200",
    hover: "hover:border-amber-400 hover:bg-amber-50",
  },
  purple: {
    bg: "bg-purple-50",
    icon: "text-purple-600",
    border: "border-purple-200",
    hover: "hover:border-purple-400 hover:bg-purple-50",
  },
};

const MinutasIndexPage = () => {
  const navigate = useNavigate();

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Generar Minuta</h1>
        <p className="text-gray-500 mt-1">
          Seleccione el tipo de contrato que desea redactar.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {tiposContrato.map((tipo) => {
          const Icon = tipo.icon;
          const colors = colorMap[tipo.color];

          return (
            <button
              key={tipo.id}
              onClick={() => tipo.disponible && navigate(tipo.path)}
              disabled={!tipo.disponible}
              className={`
                relative text-left p-6 rounded-xl border-2 transition-all duration-200
                ${
                  tipo.disponible
                    ? `bg-white ${colors.border} ${colors.hover} cursor-pointer shadow-sm hover:shadow-md`
                    : "bg-gray-50 border-gray-200 cursor-not-allowed opacity-60"
                }
              `}
            >
              {!tipo.disponible && (
                <span className="absolute top-3 right-3 text-xs font-medium bg-gray-200 text-gray-500 px-2 py-0.5 rounded-full">
                  Próximamente
                </span>
              )}

              <div
                className={`w-12 h-12 rounded-lg ${colors.bg} flex items-center justify-center mb-4`}
              >
                <Icon className={`w-6 h-6 ${colors.icon}`} />
              </div>

              <h3 className="text-base font-semibold text-gray-900 mb-1">
                {tipo.nombre}
              </h3>
              <p className="text-sm text-gray-500 leading-relaxed">
                {tipo.descripcion}
              </p>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default MinutasIndexPage;
