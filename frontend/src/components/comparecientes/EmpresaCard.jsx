import { Card } from "../shared";
import { MapPin, Phone, Mail, User, Briefcase, Calendar } from "lucide-react";

const InfoRow = ({ icon: Icon, label, value }) => {
  if (!value) return null;
  return (
    <div className="flex items-start gap-3 py-2">
      <Icon className="w-5 h-5 text-gray-400 shrink-0 mt-0.5" />
      <div className="flex-1 min-w-0">
        <p className="text-xs text-gray-500">{label}</p>
        <p className="text-sm font-medium text-gray-900 wrap-break-words">
          {value}
        </p>
      </div>
    </div>
  );
};

const EmpresaCard = ({ data }) => {
  if (!data) return null;

  const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString + "T00:00:00");
    return date.toLocaleDateString("es-EC", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const getAddress = (prefix, d) => {
    const main = d[`${prefix}MainStreet`] || d.mainStreet;
    const num = d[`${prefix}NumberStreet`] || d.numberStreet;
    const sec = d[`${prefix}SecondaryStreet`] || d.secondaryStreet;
    const parts = [];
    if (main) parts.push(main);
    if (num) parts.push(`N° ${num}`);
    if (sec) parts.push(`y ${sec}`);
    return parts.join(" ");
  };

  return (
    <Card>
      {/* Encabezado empresa */}
      <div className="space-y-1 mb-4 pb-4 border-b">
        <h3 className="text-xl font-bold text-gray-900">{data.razonSocial}</h3>
        <div className="flex flex-wrap gap-2">
          <span className="px-2 py-1 bg-amber-100 text-amber-800 text-xs font-medium rounded">
            RUC: {data.ruc}
          </span>
          <span className="px-2 py-1 bg-green-100 text-green-800 text-xs font-medium rounded">
            Empresa
          </span>
        </div>
      </div>

      {/* Datos empresa */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 mb-6">
        <div className="space-y-1">
          <InfoRow icon={Mail} label="Correo electrónico" value={data.email} />
          <InfoRow icon={Phone} label="Teléfono" value={data.phone} />
        </div>
        <div className="space-y-1">
          <InfoRow
            icon={MapPin}
            label="Dirección"
            value={getAddress("", data)}
          />
          <InfoRow icon={MapPin} label="Sector" value={data.sector} />
          <InfoRow icon={MapPin} label="Parroquia" value={data.parroquia} />
          <InfoRow icon={MapPin} label="Cantón" value={data.canton} />
          <InfoRow icon={MapPin} label="Provincia" value={data.province} />
        </div>
      </div>

      {/* Representante legal */}
      <div className="mt-2 pt-4 border-t">
        <h4 className="text-base font-semibold text-gray-700 mb-3">
          Representante Legal
        </h4>

        <div className="space-y-1 mb-3 pb-3 border-b">
          <h5 className="text-base font-medium text-gray-900">
            {data.repNames} {data.repLastNames}
          </h5>
          <div className="flex flex-wrap gap-2">
            <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded">
              {data.repDocumentType === "cedula" ? "CI" : "Pasaporte"}:{" "}
              {data.repDocumentNumber}
            </span>
            <span
              className={`px-2 py-1 text-xs font-medium rounded ${
                data.repGender === "masculino"
                  ? "bg-indigo-100 text-indigo-800"
                  : "bg-pink-100 text-pink-800"
              }`}
            >
              {data.repGender === "masculino" ? "Masculino" : "Femenino"}
            </span>
            <span className="px-2 py-1 bg-purple-100 text-purple-800 text-xs font-medium rounded">
              {data.repPosition}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6">
          <div className="space-y-1">
            <InfoRow
              icon={Calendar}
              label="Fecha de Nacimiento"
              value={formatDate(data.repBirthDate)}
            />
            <InfoRow
              icon={User}
              label="Nacionalidad"
              value={data.repNationality}
            />
            <InfoRow
              icon={Briefcase}
              label="Ocupación"
              value={data.repOccupation}
            />
            {data.repProfession && (
              <InfoRow
                icon={Briefcase}
                label="Profesión"
                value={data.repProfession}
              />
            )}
            <InfoRow icon={Mail} label="Email" value={data.repEmail} />
            <InfoRow icon={Phone} label="Teléfono" value={data.repPhone} />
          </div>
          <div className="space-y-1">
            <InfoRow
              icon={MapPin}
              label="Dirección"
              value={getAddress("rep", data)}
            />
            <InfoRow icon={MapPin} label="Sector" value={data.repSector} />
            <InfoRow
              icon={MapPin}
              label="Parroquia"
              value={data.repParroquia}
            />
            <InfoRow icon={MapPin} label="Cantón" value={data.repCanton} />
            <InfoRow icon={MapPin} label="Provincia" value={data.repProvince} />
          </div>
        </div>
      </div>
    </Card>
  );
};

export default EmpresaCard;
