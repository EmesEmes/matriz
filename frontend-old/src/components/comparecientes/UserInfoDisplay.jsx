import { useState } from "react";
import { ChevronDown, ChevronUp, Edit } from "lucide-react";

const formatDateToCalendar = (isoDateString) => {
  if (!isoDateString) return "";

  const date = new Date(isoDateString);
  const options = {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  };

  const formattedDate = date.toLocaleDateString("es-EC", options);
  return formattedDate.replace(/\//g, "-");
};

const UserInfoDisplay = ({ user, onEdit }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  if (!user) return null;

  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  const essentialFields = [
    { label: "Nombres", value: user.names?.toUpperCase() || "" },
    { label: "Apellidos", value: user.lastNames?.toUpperCase() || "" },
    { label: "Cédula", value: user.documentNumber || "" },
    { label: "Género", value: user.gender || "" },
    { label: "Teléfono", value: user.phone || "" },
    { label: "Correo", value: user.email || "", isEmail: true },
  ];

  const additionalFields = [
    { label: "Estado civil", value: user.maritalStatus || "" },
    { label: "Ocupación", value: user.occupation || "" },
    { label: "Nacionalidad", value: user.nationality?.toLowerCase() || "" },
    {
      label: "Fecha de nacimiento",
      value: formatDateToCalendar(user.birthDate),
    },
    { label: "Provincia", value: user.province || "" },
    { label: "Cantón", value: user.canton || "" },
  ];

  const addressField = {
    label: "Dirección",
    value: `${user.parroquia || ""} Calle ${user.mainStreet || ""} número ${user.numberStreet || ""} y calle ${user.secondaryStreet || ""}`,
  };

  let partnerFields = [];
  let partneraddressField = null;

  if (user?.partner) {
    partnerFields = [
      { label: "Nombres", value: user.partner.names?.toUpperCase() || "" },
      { label: "Apellidos", value: user.partner.lastNames?.toUpperCase() || "" },
      { label: "Cédula", value: user.partner.documentNumber || "" },
      { label: "Género", value: user.partner.gender || "" },
      { label: "Teléfono", value: user.partner.phone || "" },
      { label: "Correo", value: user.partner.email || "", isEmail: true },
      { label: "Estado civil", value: user.partner.maritalStatus || "" },
      { label: "Ocupación", value: user.partner.occupation || "" },
      {
        label: "Nacionalidad",
        value: user.partner.nationality?.toLowerCase() || "",
        capitalize: true,
      },
      { label: "Fecha de nacimiento", value: formatDateToCalendar(user.partner.birthDate) },
      { label: "Provincia", value: user.partner.province || "" },
      { label: "Cantón", value: user.partner.canton || "" },
    ];

    partneraddressField = {
      label: "Dirección",
      value: `${user.partner.parroquia || ""} Calle ${user.partner.mainStreet || ""} número ${user.partner.numberStreet || ""} y calle ${user.partner.secondaryStreet || ""}`,
    };
  }

  const renderField = (item) => {
    if (!item.value) {
      return null;
    }
    return (
      <div key={item.label}>
        <p className="text-xs text-gray-600">{item.label}:</p>
        <p className={`font-medium ${item.isEmail ? "text-sm break-all" : ""}`}>
          {item.value}
        </p>
      </div>
    );
  };

  return (
    <div className="bg-gray-100 p-4 rounded space-y-3">
      <div className="flex justify-between items-center border-b pb-2">
        <h3 className="font-semibold text-lg">Información Personal</h3>
        <button
          className="cursor-pointer flex items-center gap-1 bg-yellow-500 text-white px-3 py-1 rounded text-sm hover:bg-yellow-600"
          onClick={onEdit}
        >
          <Edit size={16} />
          Editar
        </button>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {essentialFields.map(renderField)}
      </div>

      <div className="pt-2">
        <button
          onClick={toggleExpand}
          className="w-full text-blue-600 hover:text-blue-800 font-medium text-sm flex items-center justify-center gap-1 transition duration-150"
        >
          {isExpanded ? "Mostrar menos" : "Mostrar más detalles"}
          {isExpanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
        </button>
      </div>

      {isExpanded && (
        <div className="pt-3 space-y-3 border-t border-gray-200">
          <div className="grid grid-cols-2 gap-3">
            {additionalFields.map(renderField)}
          </div>
          <div>{renderField(addressField)}</div>
          {user.partner && (
            <div className="mt-4 pt-4 space-y-3">
              <h4 className="font-semibold text-lg text-gray-700">
                Información del Cónyuge
              </h4>
              <div className="pt-3 space-y-3 border-t">
                <div className="grid grid-cols-2 gap-3">
                  {partnerFields.map(renderField)}
                </div>
                <div>{renderField(partneraddressField)}</div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default UserInfoDisplay;