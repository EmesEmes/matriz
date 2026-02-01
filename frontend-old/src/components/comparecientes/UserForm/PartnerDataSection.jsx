import { useMemo } from "react";
import {
  getProvincias,
  getCantones,
  getParroquias,
} from "../../../utils/datosProvincias";

const Input = ({
  label,
  name,
  type = "text",
  value,
  onChange,
  placeholder,
  required = false,
  upperCase = false,
  lowerCase = false,
  children,
  className = "",
}) => {
  const handleInputChange = (e) => {
    if (upperCase) {
      const upperValue = e.target.value.toUpperCase();
      e.target.value = upperValue;
    }
    if (lowerCase) {
      const lowerValue = e.target.value.toLowerCase();
      e.target.value = lowerValue;
    }
    onChange(e);
  };
  return (
    <div className={`flex flex-col ${className}`}>
      {label && (
        <label htmlFor={name} className="text-sm font-medium text-gray-700">
          {label}
        </label>
      )}
      {type === "select" ? (
        <select
          id={name}
          name={name}
          value={value}
          onChange={onChange}
          required={required}
          className="mt-1 p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
        >
          {children}
        </select>
      ) : (
        <input
          id={name}
          type={type}
          name={name}
          placeholder={placeholder || label}
          value={value}
          onChange={handleInputChange}
          required={required}
          className={`mt-1 p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 ${
            upperCase ? "uppercase" : ""
          }`}
        />
      )}
    </div>
  );
};

const FormSection = ({ title, children }) => (
  <div className="border border-gray-200 p-4 rounded-lg bg-gray-50">
    <h3 className="text-lg font-semibold mb-3 text-gray-800">{title}</h3>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">{children}</div>
  </div>
);

export const PartnerDataSection = ({
  partnerData,
  handlePartnerChange,
  showPartner,
  useSameAdress,
  handleSameAdressToggle,
}) => {
  const provincias = useMemo(() => getProvincias(), []);

  const cantones = useMemo(() => {
    return partnerData.province ? getCantones(partnerData.province) : [];
  }, [partnerData.province]);

  const parroquias = useMemo(() => {
    return partnerData.province && partnerData.canton
      ? getParroquias(partnerData.province, partnerData.canton)
      : [];
  }, [partnerData.province, partnerData.canton]);

  if (!showPartner) return null;

  return (
    <>
      <FormSection title="Datos del Cónyuge">
        <Input
          label="Cédula/Documento"
          name="documentNumber"
          value={partnerData.documentNumber}
          onChange={handlePartnerChange}
          required
        />
        <Input
          type="select"
          label="Tipo de Documento"
          name="documentType"
          value={partnerData.documentType}
          onChange={handlePartnerChange}
        >
          <option value="cedula">Cédula</option>
          <option value="pasaporte">Pasaporte</option>
        </Input>
        <Input
          label="Nombres"
          name="names"
          value={partnerData.names}
          onChange={handlePartnerChange}
          upperCase={true}
          required
        />
        <Input
          label="Apellidos"
          name="lastNames"
          value={partnerData.lastNames}
          onChange={handlePartnerChange}
          upperCase={true}
          required
        />
        <Input
          type="select"
          label="Género"
          name="gender"
          value={partnerData.gender}
          onChange={handlePartnerChange}
          required
        >
          <option value="" disabled>
            Seleccione género
          </option>
          <option value="Femenino">Femenino</option>
          <option value="Masculino">Masculino</option>
        </Input>
        <Input
          label="Nacionalidad"
          name="nationality"
          value={partnerData.nationality}
          onChange={handlePartnerChange}
          lowerCase={true}
          required
        />
        <Input
          type="date"
          label="Fecha de Nacimiento"
          name="birthDate"
          value={partnerData.birthDate}
          onChange={handlePartnerChange}
          required
        />
        <Input
          type="email"
          label="Correo Electrónico"
          name="email"
          value={partnerData.email}
          onChange={handlePartnerChange}
          required
        />
        <Input
          type="tel"
          label="Teléfono"
          name="phone"
          value={partnerData.phone}
          onChange={handlePartnerChange}
          required
        />
        <Input
          label="Ocupación"
          name="occupation"
          value={partnerData.occupation}
          onChange={handlePartnerChange}
          required
        />
        <Input
          label="Profesión"
          name="profession"
          value={partnerData.profession}
          onChange={handlePartnerChange}
        />
      </FormSection>
      <div className="border border-gray-200 p-4 rounded-lg bg-gray-50 space-y-4">
        <div className="flex gap-2 items-center pb-3">
          <input
            type="checkbox"
            id="use-same-adress"
            checked={useSameAdress}
            onChange={handleSameAdressToggle}
            className="h-4 w-4 text-blue-600 border-gray-300 rounded"
          />
          <label
            htmlFor="use-same-adress"
            className="text-sm font-medium text-gray-700"
          >
            ¿Usar la misma dirección del conyugue?
          </label>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            type="select"
            label="Provincia"
            name="province"
            value={partnerData.province}
            onChange={handlePartnerChange}
            required
            disabled={useSameAdress} 
          >
            <option value="" disabled>
              Seleccione Provincia
            </option>
            {provincias.map((provincia) => (
              <option key={provincia} value={provincia}>
                {provincia}
              </option>
            ))}
          </Input>
          <Input
            type="select"
            label="Cantón"
            name="canton"
            value={partnerData.canton}
            onChange={handlePartnerChange}
            required
            disabled={useSameAdress || !partnerData.province} 
          >
            <option value="" disabled>
              Seleccione Cantón
            </option>
            {cantones.map((canton) => (
              <option key={canton} value={canton}>
                {canton}
              </option>
            ))}
          </Input>
          <Input
            type="select"
            label="Parroquia"
            name="parroquia"
            value={partnerData.parroquia}
            onChange={handlePartnerChange}
            required
            disabled={useSameAdress || !partnerData.canton} 
          >
            <option value="" disabled>
              Seleccione Parroquia
            </option>
            {parroquias.map((parroquia) => (
              <option key={parroquia} value={parroquia}>
                {parroquia}
              </option>
            ))}
          </Input>
          <Input
            label="Sector"
            name="sector"
            value={partnerData.sector}
            onChange={handlePartnerChange}
            required
            disabled={useSameAdress}
          />
          <Input
            label="Calle Principal"
            name="mainStreet"
            value={partnerData.mainStreet}
            onChange={handlePartnerChange}
            required
            disabled={useSameAdress}
          />
          <Input
            label="Número de Calle/Lote"
            name="numberStreet"
            value={partnerData.numberStreet}
            onChange={handlePartnerChange}
            required
            disabled={useSameAdress}
          />
          <Input
            label="Calle Secundaria"
            name="secondaryStreet"
            value={partnerData.secondaryStreet}
            onChange={handlePartnerChange}
            required
            disabled={useSameAdress}
          />
        </div>
      </div>
    </>
  );
};
