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

export const MainUserDataSection = ({ formData, handleChange }) => {
  const provincias = useMemo(() => getProvincias(), []);

  const cantones = useMemo(() => {
    return formData.province ? getCantones(formData.province) : [];
  }, [formData.province]);

  const parroquias = useMemo(() => {
    return formData.province && formData.canton
      ? getParroquias(formData.province, formData.canton)
      : [];
  }, [formData.province, formData.canton]);

  return (
    <FormSection title="Datos">
      <Input
        label="Cédula/Documento"
        name="documentNumber"
        value={formData.documentNumber}
        onChange={handleChange}
        required
      />
      <Input
        type="select"
        label="Tipo de Documento"
        name="documentType"
        value={formData.documentType}
        onChange={handleChange}
      >
        <option value="cedula">Cédula</option>
        <option value="pasaporte">Pasaporte</option>
      </Input>
      <Input
        label="Nombres"
        name="names"
        value={formData.names}
        onChange={handleChange}
        upperCase={true}
        required
      />
      <Input
        label="Apellidos"
        name="lastNames"
        value={formData.lastNames}
        onChange={handleChange}
        upperCase={true}
        required
      />
      <Input
        type="select"
        label="Género"
        name="gender"
        value={formData.gender}
        onChange={handleChange}
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
        value={formData.nationality}
        onChange={handleChange}
        lowerCase={true}
        required
      />
      <Input
        type="date"
        label="Fecha de Nacimiento"
        name="birthDate"
        value={formData.birthDate}
        onChange={handleChange}
        required
      />
      <Input
        type="email"
        label="Correo Electrónico"
        name="email"
        value={formData.email}
        onChange={handleChange}
        required
      />
      <Input
        type="tel"
        label="Teléfono"
        name="phone"
        value={formData.phone}
        onChange={handleChange}
        required
      />
      <Input
        type="select"
        label="Provincia"
        name="province"
        value={formData.province}
        onChange={handleChange}
        required
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
        value={formData.canton}
        onChange={handleChange}
        required
        disabled={!formData.province}
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
        value={formData.parroquia}
        onChange={handleChange}
        required
        disabled={!formData.canton}
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
        value={formData.sector}
        onChange={handleChange}
        upperCase
        required
      />
      <Input
        label="Calle Principal"
        name="mainStreet"
        value={formData.mainStreet}
        onChange={handleChange}
        required
      />
      <Input
        label="Número de Calle/Lote"
        name="numberStreet"
        value={formData.numberStreet}
        onChange={handleChange}
        required
      />
      <Input
        label="Calle Secundaria"
        name="secondaryStreet"
        value={formData.secondaryStreet}
        onChange={handleChange}
        required
      />
      <Input
        label="Ocupación"
        name="occupation"
        value={formData.occupation}
        onChange={handleChange}
        required
      />
      <Input
        label="Profesión"
        name="profession"
        value={formData.profession}
        onChange={handleChange}
      />
      <Input
        type="select"
        label="Estado Civil"
        name="maritalStatus"
        value={(formData.maritalStatus || "").toLowerCase()}
        onChange={handleChange}
        className="col-span-2"
        required
      >
        <option value="" disabled>
          Seleccione Estado Civil
        </option>
        <option value="soltero">Soltero</option>
        <option value="casado">Casado</option>
        <option value="union libre">Unión Libre</option>
        <option value="divorciado">Divorciado</option>
        <option value="viudo">Viudo</option>
      </Input>
    </FormSection>
  );
};
