import { useState, useEffect } from "react";
import { useParams } from "react-router";

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:8000";

const PROVINCIAS_ECUADOR = [
  "Azuay",
  "Bolívar",
  "Cañar",
  "Carchi",
  "Chimborazo",
  "Cotopaxi",
  "El Oro",
  "Esmeraldas",
  "Galápagos",
  "Guayas",
  "Imbabura",
  "Loja",
  "Los Ríos",
  "Manabí",
  "Morona Santiago",
  "Napo",
  "Orellana",
  "Pastaza",
  "Pichincha",
  "Santa Elena",
  "Santo Domingo de los Tsáchilas",
  "Sucumbíos",
  "Tungurahua",
  "Zamora Chinchipe",
];

// ============================================
// ESTADOS INICIALES
// ============================================
const personaInicial = () => ({
  document_type: "cedula",
  document_number: "",
  names: "",
  last_names: "",
  gender: "",
  marital_status: "",
  partner_document_number: "",
  nationality: "ecuatoriana",
  birth_date: "",
  email: "",
  phone: "",
  province: "",
  canton: "",
  parroquia: "",
  sector: "",
  main_street: "",
  secondary_street: "",
  number_street: "",
  occupation: "",
  profession: "",
  actividad_economica: "",
  empresa_trabajo: "",
  ingreso_mensual: "",
  es_pep: "",
  origen_fondos: "",
  pep_nombre: "",
  pep_institucion: "",
  pep_fecha_inicio: "",
  pep_cargo: "",
  pep_anios_trabajo: "",
  pep_grado_relacion: "",
});

const empresaInicial = () => ({
  ruc: "",
  razon_social: "",
  email: "",
  phone: "",
  province: "",
  canton: "",
  parroquia: "",
  sector: "",
  main_street: "",
  secondary_street: "",
  number_street: "",
  ingreso_mensual: "",
  egreso_mensual: "",
  // Representante legal
  rep_document_type: "cedula",
  rep_document_number: "",
  rep_names: "",
  rep_last_names: "",
  rep_gender: "",
  rep_nationality: "ecuatoriana",
  rep_birth_date: "",
  rep_email: "",
  rep_phone: "",
  rep_province: "",
  rep_canton: "",
  rep_parroquia: "",
  rep_sector: "",
  rep_main_street: "",
  rep_secondary_street: "",
  rep_number_street: "",
  rep_occupation: "",
  rep_profession: "",
  rep_position: "",
  // UAFE representante legal
  rep_actividad_economica: "",
  rep_empresa_trabajo: "",
  rep_ingreso_mensual: "",
  rep_origen_fondos: "",
  rep_es_pep: "",
  rep_pep_nombre: "",
  rep_pep_institucion: "",
  rep_pep_fecha_inicio: "",
  rep_pep_cargo: "",
  rep_pep_anios_trabajo: "",
  rep_pep_grado_relacion: "",
});

// ============================================
// CAMPOS REUTILIZABLES
// ============================================
const inputClass = (errors, field) =>
  `w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm ${
    errors[field] ? "border-red-400 bg-red-50" : "border-gray-300"
  }`;

const SeccionDireccion = ({
  datos,
  onChange,
  errors,
  prefijo = "",
  titulo = "Dirección",
}) => (
  <>
    <h3 className="font-medium text-gray-700 pt-2 border-t">{titulo}</h3>
    <div className="grid grid-cols-2 gap-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Provincia
        </label>
        <select
          value={datos[`${prefijo}province`]}
          onChange={(e) => onChange(`${prefijo}province`, e.target.value)}
          className={inputClass(errors, `${prefijo}province`)}
        >
          <option value="">Seleccione</option>
          {PROVINCIAS_ECUADOR.map((p) => (
            <option key={p} value={p}>
              {p}
            </option>
          ))}
        </select>
        {errors[`${prefijo}province`] && (
          <p className="text-red-500 text-xs mt-1">
            {errors[`${prefijo}province`]}
          </p>
        )}
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Cantón
        </label>
        <input
          type="text"
          value={datos[`${prefijo}canton`]}
          onChange={(e) => onChange(`${prefijo}canton`, e.target.value)}
          className={inputClass(errors, `${prefijo}canton`)}
          placeholder="Ej: Quito"
        />
        {errors[`${prefijo}canton`] && (
          <p className="text-red-500 text-xs mt-1">
            {errors[`${prefijo}canton`]}
          </p>
        )}
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Parroquia
        </label>
        <input
          type="text"
          value={datos[`${prefijo}parroquia`]}
          onChange={(e) => onChange(`${prefijo}parroquia`, e.target.value)}
          className={inputClass(errors, `${prefijo}parroquia`)}
          placeholder="Ej: Nayón"
        />
        {errors[`${prefijo}parroquia`] && (
          <p className="text-red-500 text-xs mt-1">
            {errors[`${prefijo}parroquia`]}
          </p>
        )}
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Sector / Urbanización (opcional)
        </label>
        <input
          type="text"
          value={datos[`${prefijo}sector`]}
          onChange={(e) => onChange(`${prefijo}sector`, e.target.value)}
          className={inputClass(errors, `${prefijo}sector`)}
          placeholder="Ej: Valle Colores"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Calle Principal
        </label>
        <input
          type="text"
          value={datos[`${prefijo}main_street`]}
          onChange={(e) => onChange(`${prefijo}main_street`, e.target.value)}
          className={inputClass(errors, `${prefijo}main_street`)}
          placeholder="Ej: Av. Los Eucaliptos"
        />
        {errors[`${prefijo}main_street`] && (
          <p className="text-red-500 text-xs mt-1">
            {errors[`${prefijo}main_street`]}
          </p>
        )}
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Calle Secundaria
        </label>
        <input
          type="text"
          value={datos[`${prefijo}secondary_street`]}
          onChange={(e) =>
            onChange(`${prefijo}secondary_street`, e.target.value)
          }
          className={inputClass(errors, `${prefijo}secondary_street`)}
          placeholder="Ej: Calle Eugenio Espejo"
        />
        {errors[`${prefijo}secondary_street`] && (
          <p className="text-red-500 text-xs mt-1">
            {errors[`${prefijo}secondary_street`]}
          </p>
        )}
      </div>
      <div className="col-span-2">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Número / Referencia
        </label>
        <input
          type="text"
          value={datos[`${prefijo}number_street`]}
          onChange={(e) => onChange(`${prefijo}number_street`, e.target.value)}
          className={inputClass(errors, `${prefijo}number_street`)}
          placeholder="Ej: E4-23, Casa 2"
        />
        {errors[`${prefijo}number_street`] && (
          <p className="text-red-500 text-xs mt-1">
            {errors[`${prefijo}number_street`]}
          </p>
        )}
      </div>
    </div>
  </>
);

const SeccionUAFE = ({
  datos,
  onChange,
  errors,
  prefijo = "",
  mostrarOrigenFondos = false,
}) => (
  <>
    <h3 className="font-medium text-gray-700 pt-2 border-t">
      Información Financiera
    </h3>
    <div className="grid grid-cols-2 gap-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Actividad Económica
        </label>
        <select
          value={datos[`${prefijo}actividad_economica`]}
          onChange={(e) =>
            onChange(`${prefijo}actividad_economica`, e.target.value)
          }
          className={inputClass(errors, `${prefijo}actividad_economica`)}
        >
          <option value="">Seleccione</option>
          <option value="independiente">Independiente</option>
          <option value="empleado">Empleado</option>
        </select>
        {errors[`${prefijo}actividad_economica`] && (
          <p className="text-red-500 text-xs mt-1">
            {errors[`${prefijo}actividad_economica`]}
          </p>
        )}
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Ingreso Mensual (USD)
        </label>
        <input
          type="number"
          min="0"
          step="0.01"
          value={datos[`${prefijo}ingreso_mensual`]}
          onChange={(e) =>
            onChange(`${prefijo}ingreso_mensual`, e.target.value)
          }
          className={inputClass(errors, `${prefijo}ingreso_mensual`)}
          placeholder="Ej: 1500"
        />
        {errors[`${prefijo}ingreso_mensual`] && (
          <p className="text-red-500 text-xs mt-1">
            {errors[`${prefijo}ingreso_mensual`]}
          </p>
        )}
      </div>
      <div className="col-span-2">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Empresa o Institución de Trabajo
        </label>
        <input
          type="text"
          value={datos[`${prefijo}empresa_trabajo`]}
          onChange={(e) =>
            onChange(`${prefijo}empresa_trabajo`, e.target.value)
          }
          className={inputClass(errors, `${prefijo}empresa_trabajo`)}
          placeholder="Ej: Empresa XYZ S.A."
        />
      </div>
    </div>

    {/* Origen de fondos — solo para persona natural */}
    {mostrarOrigenFondos && (
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Origen de los fondos con los que el tradente adquirió los bienes que
          transfiere
        </label>
        <textarea
          value={datos[`${prefijo}origen_fondos`] || ""}
          onChange={(e) => onChange(`${prefijo}origen_fondos`, e.target.value)}
          className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm resize-none ${errors[`${prefijo}origen_fondos`] ? "border-red-400 bg-red-50" : "border-gray-300"}`}
          rows={3}
          placeholder="Ej: Ahorros personales, préstamo bancario, herencia, etc."
        />
        {errors[`${prefijo}origen_fondos`] && (
          <p className="text-red-500 text-xs mt-1">
            {errors[`${prefijo}origen_fondos`]}
          </p>
        )}
      </div>
    )}

    <div className="space-y-3">
      <label className="block text-sm font-medium text-gray-700">
        ¿Es usted una Persona Políticamente Expuesta (PEP)?
      </label>
      <div className="flex gap-3">
        <button
          type="button"
          onClick={() => onChange(`${prefijo}es_pep`, "si")}
          className={`px-4 py-2 rounded-lg text-sm font-medium ${datos[`${prefijo}es_pep`] === "si" ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"}`}
        >
          Sí
        </button>
        <button
          type="button"
          onClick={() => onChange(`${prefijo}es_pep`, "no")}
          className={`px-4 py-2 rounded-lg text-sm font-medium ${datos[`${prefijo}es_pep`] === "no" ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"}`}
        >
          No
        </button>
      </div>
      {errors[`${prefijo}es_pep`] && (
        <p className="text-red-500 text-xs mt-1">
          {errors[`${prefijo}es_pep`]}
        </p>
      )}
    </div>

    {datos[`${prefijo}es_pep`] === "si" && (
      <div className="p-4 bg-amber-50 border-2 border-amber-200 rounded-lg space-y-4">
        <p className="text-sm text-amber-800 font-medium leading-relaxed">
          ¿Los accionistas, representantes legales, miembros del directorio o
          sus familiares comprendidos hasta el segundo grado de consanguinidad o
          primero de afinidad, desempeñan o ha desempeñado funciones públicas de
          alto grado en los últimos 4 años? Por ejemplo (Presidente, Ministros,
          Gobernadores, Secretarios, Director General, Alcaldes, Policía
          Nacional, Fuerzas Armadas, dignatarios elegidos por voto popular,
          etc.) (SI USTED ES UNA PERSONA EXPUESTA POLÍTICAMENTE) LLENAR LA
          INFORMACIÓN:
        </p>
        <div className="grid grid-cols-2 gap-4">
          <div className="col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Nombre PEP
            </label>
            <input
              type="text"
              value={datos[`${prefijo}pep_nombre`]}
              onChange={(e) =>
                onChange(`${prefijo}pep_nombre`, e.target.value.toUpperCase())
              }
              className={inputClass(errors, `${prefijo}pep_nombre`)}
              placeholder="Nombre completo"
            />
            {errors[`${prefijo}pep_nombre`] && (
              <p className="text-red-500 text-xs mt-1">
                {errors[`${prefijo}pep_nombre`]}
              </p>
            )}
          </div>
          <div className="col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Institución en la que trabaja
            </label>
            <input
              type="text"
              value={datos[`${prefijo}pep_institucion`]}
              onChange={(e) =>
                onChange(`${prefijo}pep_institucion`, e.target.value)
              }
              className={inputClass(errors, `${prefijo}pep_institucion`)}
              placeholder="Ej: Ministerio de Finanzas"
            />
            {errors[`${prefijo}pep_institucion`] && (
              <p className="text-red-500 text-xs mt-1">
                {errors[`${prefijo}pep_institucion`]}
              </p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Fecha de Inicio
            </label>
            <input
              type="date"
              value={datos[`${prefijo}pep_fecha_inicio`]}
              onChange={(e) =>
                onChange(`${prefijo}pep_fecha_inicio`, e.target.value)
              }
              className={inputClass(errors, `${prefijo}pep_fecha_inicio`)}
            />
            {errors[`${prefijo}pep_fecha_inicio`] && (
              <p className="text-red-500 text-xs mt-1">
                {errors[`${prefijo}pep_fecha_inicio`]}
              </p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Años de Trabajo
            </label>
            <input
              type="number"
              min="0"
              step="1"
              value={datos[`${prefijo}pep_anios_trabajo`]}
              onChange={(e) =>
                onChange(
                  `${prefijo}pep_anios_trabajo`,
                  Math.floor(Number(e.target.value)).toString(),
                )
              }
              className={inputClass(errors, `${prefijo}pep_anios_trabajo`)}
              placeholder="Ej: 3"
            />
            {errors[`${prefijo}pep_anios_trabajo`] && (
              <p className="text-red-500 text-xs mt-1">
                {errors[`${prefijo}pep_anios_trabajo`]}
              </p>
            )}
          </div>
          <div className="col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Cargo que Desempeña
            </label>
            <input
              type="text"
              value={datos[`${prefijo}pep_cargo`]}
              onChange={(e) => onChange(`${prefijo}pep_cargo`, e.target.value)}
              className={inputClass(errors, `${prefijo}pep_cargo`)}
              placeholder="Ej: Director General"
            />
            {errors[`${prefijo}pep_cargo`] && (
              <p className="text-red-500 text-xs mt-1">
                {errors[`${prefijo}pep_cargo`]}
              </p>
            )}
          </div>
          <div className="col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Grado de Consanguinidad, Afinidad o Relación de Colaboración
            </label>
            <input
              type="text"
              value={datos[`${prefijo}pep_grado_relacion`]}
              onChange={(e) =>
                onChange(`${prefijo}pep_grado_relacion`, e.target.value)
              }
              className={inputClass(errors, `${prefijo}pep_grado_relacion`)}
              placeholder="Ej: Primer grado de consanguinidad"
            />
            {errors[`${prefijo}pep_grado_relacion`] && (
              <p className="text-red-500 text-xs mt-1">
                {errors[`${prefijo}pep_grado_relacion`]}
              </p>
            )}
          </div>
        </div>
      </div>
    )}
  </>
);

// ============================================
// FORMULARIO PERSONA NATURAL
// ============================================
const FormularioPersona = ({
  titulo,
  datos,
  onChange,
  errors,
  mostrarEstadoCivil = true,
  mismaDir,
  onToggleMismaDir,
}) => (
  <div className="bg-white rounded-xl shadow-sm p-6 space-y-4">
    <h2 className="font-semibold text-gray-800 text-lg border-b pb-2">
      {titulo}
    </h2>

    <div className="grid grid-cols-2 gap-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Tipo de Documento
        </label>
        <select
          value={datos.document_type}
          onChange={(e) => onChange("document_type", e.target.value)}
          className={inputClass(errors, "document_type")}
        >
          <option value="cedula">Cédula</option>
          <option value="pasaporte">Pasaporte</option>
        </select>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {datos.document_type === "cedula"
            ? "Número de Cédula"
            : "Número de Pasaporte"}
        </label>
        <input
          type="text"
          value={datos.document_number}
          onChange={(e) => onChange("document_number", e.target.value)}
          className={inputClass(errors, "document_number")}
          placeholder={
            datos.document_type === "cedula" ? "0000000000" : "AB123456"
          }
          maxLength={datos.document_type === "cedula" ? 10 : 13}
        />
        {errors.document_number && (
          <p className="text-red-500 text-xs mt-1">{errors.document_number}</p>
        )}
      </div>
    </div>

    <div className="grid grid-cols-2 gap-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Nombres
        </label>
        <input
          type="text"
          value={datos.names}
          onChange={(e) => onChange("names", e.target.value.toUpperCase())}
          className={inputClass(errors, "names")}
          placeholder="NOMBRES"
        />
        {errors.names && (
          <p className="text-red-500 text-xs mt-1">{errors.names}</p>
        )}
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Apellidos
        </label>
        <input
          type="text"
          value={datos.last_names}
          onChange={(e) => onChange("last_names", e.target.value.toUpperCase())}
          className={inputClass(errors, "last_names")}
          placeholder="APELLIDOS"
        />
        {errors.last_names && (
          <p className="text-red-500 text-xs mt-1">{errors.last_names}</p>
        )}
      </div>
    </div>

    <div className="grid grid-cols-2 gap-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Género
        </label>
        <select
          value={datos.gender}
          onChange={(e) => onChange("gender", e.target.value)}
          className={inputClass(errors, "gender")}
        >
          <option value="">Seleccione</option>
          <option value="masculino">Masculino</option>
          <option value="femenino">Femenino</option>
        </select>
        {errors.gender && (
          <p className="text-red-500 text-xs mt-1">{errors.gender}</p>
        )}
      </div>
      {mostrarEstadoCivil && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Estado Civil
          </label>
          <select
            value={datos.marital_status}
            onChange={(e) => onChange("marital_status", e.target.value)}
            className={inputClass(errors, "marital_status")}
          >
            <option value="">Seleccione</option>
            <option value="soltero">Soltero/a</option>
            <option value="casado">Casado/a</option>
            <option value="divorciado">Divorciado/a</option>
            <option value="viudo">Viudo/a</option>
          </select>
          {errors.marital_status && (
            <p className="text-red-500 text-xs mt-1">{errors.marital_status}</p>
          )}
        </div>
      )}
    </div>

    <div className="grid grid-cols-2 gap-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Nacionalidad
        </label>
        <input
          type="text"
          value={datos.nationality}
          onChange={(e) =>
            onChange("nationality", e.target.value.toLowerCase())
          }
          className={inputClass(errors, "nationality")}
          placeholder="ecuatoriana"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Fecha de Nacimiento
        </label>
        <input
          type="date"
          value={datos.birth_date}
          onChange={(e) => onChange("birth_date", e.target.value)}
          className={inputClass(errors, "birth_date")}
        />
        {errors.birth_date && (
          <p className="text-red-500 text-xs mt-1">{errors.birth_date}</p>
        )}
      </div>
    </div>

    <h3 className="font-medium text-gray-700 pt-2 border-t">Contacto</h3>
    <div className="grid grid-cols-2 gap-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Correo Electrónico
        </label>
        <input
          type="email"
          value={datos.email}
          onChange={(e) => onChange("email", e.target.value)}
          className={inputClass(errors, "email")}
          placeholder="correo@ejemplo.com"
        />
        {errors.email && (
          <p className="text-red-500 text-xs mt-1">{errors.email}</p>
        )}
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Teléfono Celular
        </label>
        <input
          type="text"
          value={datos.phone}
          onChange={(e) => onChange("phone", e.target.value)}
          className={inputClass(errors, "phone")}
          placeholder="0987654321"
          maxLength={10}
        />
        {errors.phone && (
          <p className="text-red-500 text-xs mt-1">{errors.phone}</p>
        )}
      </div>
    </div>

    {onToggleMismaDir !== undefined && (
      <label className="flex items-center gap-2 cursor-pointer pt-2 border-t">
        <input
          type="checkbox"
          checked={mismaDir}
          onChange={onToggleMismaDir}
          className="w-4 h-4 rounded text-blue-600"
        />
        <span className="text-sm text-gray-700">
          Misma dirección que el titular
        </span>
      </label>
    )}

    {!onToggleMismaDir || !mismaDir ? (
      <SeccionDireccion datos={datos} onChange={onChange} errors={errors} />
    ) : (
      <div className="p-3 bg-gray-50 border border-gray-200 rounded-lg">
        <p className="text-sm text-gray-500">
          ✓ Usando la misma dirección del titular
        </p>
      </div>
    )}

    <h3 className="font-medium text-gray-700 pt-2 border-t">Ocupación</h3>
    <div className="grid grid-cols-2 gap-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Ocupación
        </label>
        <input
          type="text"
          value={datos.occupation}
          onChange={(e) => onChange("occupation", e.target.value)}
          className={inputClass(errors, "occupation")}
          placeholder="Ej: comerciante"
        />
        {errors.occupation && (
          <p className="text-red-500 text-xs mt-1">{errors.occupation}</p>
        )}
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Profesión (opcional)
        </label>
        <input
          type="text"
          value={datos.profession}
          onChange={(e) => onChange("profession", e.target.value)}
          className={inputClass(errors, "profession")}
          placeholder="Ej: Ingeniero Civil"
        />
      </div>
    </div>

    <SeccionUAFE
      datos={datos}
      onChange={onChange}
      errors={errors}
      mostrarOrigenFondos={true}
    />
  </div>
);

// ============================================
// FORMULARIO EMPRESA
// ============================================
const FormularioEmpresa = ({ datos, onChange, errors }) => (
  <div className="bg-white rounded-xl shadow-sm p-6 space-y-4">
    <h2 className="font-semibold text-gray-800 text-lg border-b pb-2">
      Datos de la Empresa
    </h2>

    <div className="grid grid-cols-2 gap-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          RUC
        </label>
        <input
          type="text"
          value={datos.ruc}
          onChange={(e) => onChange("ruc", e.target.value)}
          className={inputClass(errors, "ruc")}
          placeholder="0000000000001"
          maxLength={13}
        />
        {errors.ruc && (
          <p className="text-red-500 text-xs mt-1">{errors.ruc}</p>
        )}
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Razón Social
        </label>
        <input
          type="text"
          value={datos.razon_social}
          onChange={(e) =>
            onChange("razon_social", e.target.value.toUpperCase())
          }
          className={inputClass(errors, "razon_social")}
          placeholder="EMPRESA XYZ S.A."
        />
        {errors.razon_social && (
          <p className="text-red-500 text-xs mt-1">{errors.razon_social}</p>
        )}
      </div>
    </div>

    <h3 className="font-medium text-gray-700 pt-2 border-t">
      Contacto de la Empresa
    </h3>
    <div className="grid grid-cols-2 gap-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Correo Electrónico
        </label>
        <input
          type="email"
          value={datos.email}
          onChange={(e) => onChange("email", e.target.value)}
          className={inputClass(errors, "email")}
          placeholder="empresa@ejemplo.com"
        />
        {errors.email && (
          <p className="text-red-500 text-xs mt-1">{errors.email}</p>
        )}
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Teléfono
        </label>
        <input
          type="text"
          value={datos.phone}
          onChange={(e) => onChange("phone", e.target.value)}
          className={inputClass(errors, "phone")}
          placeholder="0987654321"
          maxLength={10}
        />
        {errors.phone && (
          <p className="text-red-500 text-xs mt-1">{errors.phone}</p>
        )}
      </div>
    </div>

    <SeccionDireccion
      datos={datos}
      onChange={onChange}
      errors={errors}
      titulo="Dirección de la Empresa"
    />

    {/* Ingreso y egreso mensual de la empresa */}
    <h3 className="font-medium text-gray-700 pt-2 border-t">
      Información Financiera de la Empresa
    </h3>
    <div className="grid grid-cols-2 gap-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Ingreso Mensual (USD)
        </label>
        <input
          type="number"
          min="0"
          step="0.01"
          value={datos.ingreso_mensual}
          onChange={(e) => onChange("ingreso_mensual", e.target.value)}
          className={inputClass(errors, "ingreso_mensual")}
          placeholder="Ej: 50000"
        />
        {errors.ingreso_mensual && (
          <p className="text-red-500 text-xs mt-1">{errors.ingreso_mensual}</p>
        )}
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Egreso Mensual (USD)
        </label>
        <input
          type="number"
          min="0"
          step="0.01"
          value={datos.egreso_mensual}
          onChange={(e) => onChange("egreso_mensual", e.target.value)}
          className={inputClass(errors, "egreso_mensual")}
          placeholder="Ej: 35000"
        />
        {errors.egreso_mensual && (
          <p className="text-red-500 text-xs mt-1">{errors.egreso_mensual}</p>
        )}
      </div>
    </div>

    {/* REPRESENTANTE LEGAL */}
    <div className="border-t-2 border-blue-200 pt-4">
      <h2 className="font-semibold text-blue-900 text-lg mb-4">
        Representante Legal
      </h2>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Tipo de Documento
          </label>
          <select
            value={datos.rep_document_type}
            onChange={(e) => onChange("rep_document_type", e.target.value)}
            className={inputClass(errors, "rep_document_type")}
          >
            <option value="cedula">Cédula</option>
            <option value="pasaporte">Pasaporte</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            {datos.rep_document_type === "cedula"
              ? "Número de Cédula"
              : "Número de Pasaporte"}
          </label>
          <input
            type="text"
            value={datos.rep_document_number}
            onChange={(e) => onChange("rep_document_number", e.target.value)}
            className={inputClass(errors, "rep_document_number")}
            placeholder="0000000000"
            maxLength={datos.rep_document_type === "cedula" ? 10 : 13}
          />
          {errors.rep_document_number && (
            <p className="text-red-500 text-xs mt-1">
              {errors.rep_document_number}
            </p>
          )}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Nombres
          </label>
          <input
            type="text"
            value={datos.rep_names}
            onChange={(e) =>
              onChange("rep_names", e.target.value.toUpperCase())
            }
            className={inputClass(errors, "rep_names")}
            placeholder="NOMBRES"
          />
          {errors.rep_names && (
            <p className="text-red-500 text-xs mt-1">{errors.rep_names}</p>
          )}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Apellidos
          </label>
          <input
            type="text"
            value={datos.rep_last_names}
            onChange={(e) =>
              onChange("rep_last_names", e.target.value.toUpperCase())
            }
            className={inputClass(errors, "rep_last_names")}
            placeholder="APELLIDOS"
          />
          {errors.rep_last_names && (
            <p className="text-red-500 text-xs mt-1">{errors.rep_last_names}</p>
          )}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Género
          </label>
          <select
            value={datos.rep_gender}
            onChange={(e) => onChange("rep_gender", e.target.value)}
            className={inputClass(errors, "rep_gender")}
          >
            <option value="">Seleccione</option>
            <option value="masculino">Masculino</option>
            <option value="femenino">Femenino</option>
          </select>
          {errors.rep_gender && (
            <p className="text-red-500 text-xs mt-1">{errors.rep_gender}</p>
          )}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Cargo
          </label>
          <input
            type="text"
            value={datos.rep_position}
            onChange={(e) => onChange("rep_position", e.target.value)}
            className={inputClass(errors, "rep_position")}
            placeholder="Ej: Gerente General"
          />
          {errors.rep_position && (
            <p className="text-red-500 text-xs mt-1">{errors.rep_position}</p>
          )}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Nacionalidad
          </label>
          <input
            type="text"
            value={datos.rep_nationality}
            onChange={(e) =>
              onChange("rep_nationality", e.target.value.toLowerCase())
            }
            className={inputClass(errors, "rep_nationality")}
            placeholder="ecuatoriana"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Fecha de Nacimiento
          </label>
          <input
            type="date"
            value={datos.rep_birth_date}
            onChange={(e) => onChange("rep_birth_date", e.target.value)}
            className={inputClass(errors, "rep_birth_date")}
          />
          {errors.rep_birth_date && (
            <p className="text-red-500 text-xs mt-1">{errors.rep_birth_date}</p>
          )}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Correo Electrónico
          </label>
          <input
            type="email"
            value={datos.rep_email}
            onChange={(e) => onChange("rep_email", e.target.value)}
            className={inputClass(errors, "rep_email")}
            placeholder="rep@empresa.com"
          />
          {errors.rep_email && (
            <p className="text-red-500 text-xs mt-1">{errors.rep_email}</p>
          )}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Teléfono
          </label>
          <input
            type="text"
            value={datos.rep_phone}
            onChange={(e) => onChange("rep_phone", e.target.value)}
            className={inputClass(errors, "rep_phone")}
            placeholder="0987654321"
            maxLength={10}
          />
          {errors.rep_phone && (
            <p className="text-red-500 text-xs mt-1">{errors.rep_phone}</p>
          )}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Ocupación
          </label>
          <input
            type="text"
            value={datos.rep_occupation}
            onChange={(e) => onChange("rep_occupation", e.target.value)}
            className={inputClass(errors, "rep_occupation")}
            placeholder="Ej: empresario"
          />
          {errors.rep_occupation && (
            <p className="text-red-500 text-xs mt-1">{errors.rep_occupation}</p>
          )}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Profesión (opcional)
          </label>
          <input
            type="text"
            value={datos.rep_profession}
            onChange={(e) => onChange("rep_profession", e.target.value)}
            className={inputClass(errors, "rep_profession")}
            placeholder="Ej: Ingeniero"
          />
        </div>
      </div>

      <SeccionDireccion
        datos={datos}
        onChange={onChange}
        errors={errors}
        prefijo="rep_"
        titulo="Dirección del Representante Legal"
      />

      <SeccionUAFE
        datos={datos}
        onChange={onChange}
        errors={errors}
        prefijo="rep_"
        mostrarOrigenFondos={true}
      />
    </div>
  </div>
);

// ============================================
// VALIDACIONES
// ============================================
const validarPersona = (datos, prefijo = "") => {
  const e = {};
  const p = prefijo;
  if (!datos[`${p}document_number`]) e[`${p}document_number`] = "Requerido";
  else if (
    datos[`${p}document_type`] === "cedula" &&
    !/^\d{10}$/.test(datos[`${p}document_number`])
  )
    e[`${p}document_number`] = "Cédula debe tener 10 dígitos";
  if (!datos[`${p}names`]?.trim()) e[`${p}names`] = "Requerido";
  if (!datos[`${p}last_names`]?.trim()) e[`${p}last_names`] = "Requerido";
  if (!datos[`${p}gender`]) e[`${p}gender`] = "Requerido";
  if (!datos[`${p}birth_date`]) e[`${p}birth_date`] = "Requerido";
  if (!datos[`${p}email`]) e[`${p}email`] = "Requerido";
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(datos[`${p}email`]))
    e[`${p}email`] = "Email inválido";
  if (!datos[`${p}phone`]) e[`${p}phone`] = "Requerido";
  if (!datos[`${p}province`]) e[`${p}province`] = "Requerido";
  if (!datos[`${p}canton`]) e[`${p}canton`] = "Requerido";
  if (!datos[`${p}parroquia`]) e[`${p}parroquia`] = "Requerido";
  if (!datos[`${p}main_street`]) e[`${p}main_street`] = "Requerido";
  if (!datos[`${p}secondary_street`]) e[`${p}secondary_street`] = "Requerido";
  if (!datos[`${p}number_street`]) e[`${p}number_street`] = "Requerido";
  if (!datos[`${p}occupation`]) e[`${p}occupation`] = "Requerido";
  return e;
};

const validarUAFE = (datos, prefijo = "", validarOrigenFondos = false) => {
  const e = {};
  const p = prefijo;
  if (!datos[`${p}actividad_economica`])
    e[`${p}actividad_economica`] = "Requerido";
  if (!datos[`${p}ingreso_mensual`]) e[`${p}ingreso_mensual`] = "Requerido";
  if (validarOrigenFondos && !datos[`${p}origen_fondos`]?.trim())
    e[`${p}origen_fondos`] = "Requerido";
  if (!datos[`${p}es_pep`]) e[`${p}es_pep`] = "Requerido";
  if (datos[`${p}es_pep`] === "si") {
    if (!datos[`${p}pep_nombre`]) e[`${p}pep_nombre`] = "Requerido";
    if (!datos[`${p}pep_institucion`]) e[`${p}pep_institucion`] = "Requerido";
    if (!datos[`${p}pep_fecha_inicio`]) e[`${p}pep_fecha_inicio`] = "Requerido";
    if (!datos[`${p}pep_cargo`]) e[`${p}pep_cargo`] = "Requerido";
    if (!datos[`${p}pep_anios_trabajo`])
      e[`${p}pep_anios_trabajo`] = "Requerido";
    if (!datos[`${p}pep_grado_relacion`])
      e[`${p}pep_grado_relacion`] = "Requerido";
  }
  return e;
};

const validarEmpresa = (datos) => {
  const e = {};
  if (!datos.ruc) e.ruc = "Requerido";
  else if (!/^\d{13}$/.test(datos.ruc)) e.ruc = "RUC debe tener 13 dígitos";
  if (!datos.razon_social?.trim()) e.razon_social = "Requerido";
  if (!datos.email) e.email = "Requerido";
  if (!datos.phone) e.phone = "Requerido";
  if (!datos.province) e.province = "Requerido";
  if (!datos.canton) e.canton = "Requerido";
  if (!datos.parroquia) e.parroquia = "Requerido";
  if (!datos.main_street) e.main_street = "Requerido";
  if (!datos.secondary_street) e.secondary_street = "Requerido";
  if (!datos.number_street) e.number_street = "Requerido";
  if (!datos.ingreso_mensual) e.ingreso_mensual = "Requerido";
  if (!datos.egreso_mensual) e.egreso_mensual = "Requerido";
  // Representante legal
  const errorsRep = validarPersona(datos, "rep_");
  if (!datos.rep_position) errorsRep.rep_position = "Requerido";
  const errorsRepUAFE = validarUAFE(datos, "rep_", true);
  return { ...e, ...errorsRep, ...errorsRepUAFE };
};

// ============================================
// PÁGINA PRINCIPAL
// ============================================
const RegistroClientePage = () => {
  const { token } = useParams();

  const [tokenValido, setTokenValido] = useState(null);
  const [tipoRegistro, setTipoRegistro] = useState("persona"); // "persona" | "empresa"
  const [titular, setTitular] = useState(personaInicial());
  const [conyugue, setConyugue] = useState(personaInicial());
  const [empresa, setEmpresa] = useState(empresaInicial());
  const [mismaDir, setMismaDir] = useState(true);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [enviado, setEnviado] = useState(false);
  const [aceptaPrivacidad, setAceptaPrivacidad] = useState(false);

  const esCasado = titular.marital_status === "casado";

  useEffect(() => {
    const verificar = async () => {
      try {
        const res = await fetch(
          `${API_BASE}/api/public/registro/verificar/${token}`,
        );
        const data = await res.json();
        setTokenValido(data.valido);
      } catch {
        setTokenValido(false);
      }
    };
    verificar();
  }, [token]);

  // Sincronizar dirección del cónyuge
  useEffect(() => {
    if (mismaDir && esCasado) {
      setConyugue((prev) => ({
        ...prev,
        province: titular.province,
        canton: titular.canton,
        parroquia: titular.parroquia,
        sector: titular.sector,
        main_street: titular.main_street,
        secondary_street: titular.secondary_street,
        number_street: titular.number_street,
      }));
    }
  }, [
    mismaDir,
    esCasado,
    titular.province,
    titular.canton,
    titular.parroquia,
    titular.sector,
    titular.main_street,
    titular.secondary_street,
    titular.number_street,
  ]);

  const handleTitularChange = (field, value) => {
    setTitular((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: "" }));
  };

  const handleConyugueChange = (field, value) => {
    setConyugue((prev) => ({ ...prev, [field]: value }));
    if (errors[`c_${field}`])
      setErrors((prev) => ({ ...prev, [`c_${field}`]: "" }));
  };

  const handleEmpresaChange = (field, value) => {
    setEmpresa((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: "" }));
  };

  const validar = () => {
    let e = {};

    if (tipoRegistro === "empresa") {
      e = { ...e, ...validarEmpresa(empresa) };
    } else {
      e = { ...e, ...validarPersona(titular) };
      e = { ...e, ...validarUAFE(titular, "", true) };
      if (!titular.marital_status) e.marital_status = "Requerido";

      if (esCasado) {
        const errC = {
          ...validarPersona(conyugue, "c_"),
          ...validarUAFE(conyugue, "c_", true),
        };
        if (mismaDir) {
          [
            "c_province",
            "c_canton",
            "c_parroquia",
            "c_main_street",
            "c_secondary_street",
            "c_number_street",
          ].forEach((k) => delete errC[k]);
        }
        if (
          titular.document_number &&
          conyugue.document_number &&
          titular.document_number === conyugue.document_number
        )
          errC.c_document_number =
            "La cédula del cónyuge no puede ser igual a la del titular";
        e = { ...e, ...errC };
      }
    }

    if (!aceptaPrivacidad)
      e.privacidad = "Debe aceptar el tratamiento de sus datos";
    return e;
  };

  const prepararPersona = (datos, esPep) => ({
    ...datos,
    es_pep: esPep === "si",
    pep_nombre: esPep === "si" ? datos.pep_nombre : null,
    pep_institucion: esPep === "si" ? datos.pep_institucion : null,
    pep_fecha_inicio: esPep === "si" ? datos.pep_fecha_inicio : null,
    pep_cargo: esPep === "si" ? datos.pep_cargo : null,
    pep_anios_trabajo:
      esPep === "si" ? parseInt(datos.pep_anios_trabajo) : null,
    pep_grado_relacion: esPep === "si" ? datos.pep_grado_relacion : null,
  });

  const handleSubmit = async () => {
    const e = validar();
    if (Object.keys(e).length > 0) {
      setErrors(e);
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }

    setLoading(true);
    try {
      let payload;

      if (tipoRegistro === "empresa") {
        payload = {
          tipo: "empresa",
          empresa: {
            ...empresa,
            rep_es_pep: empresa.rep_es_pep === "si",
            rep_pep_nombre:
              empresa.rep_es_pep === "si" ? empresa.rep_pep_nombre : null,
            rep_pep_institucion:
              empresa.rep_es_pep === "si" ? empresa.rep_pep_institucion : null,
            rep_pep_fecha_inicio:
              empresa.rep_es_pep === "si" ? empresa.rep_pep_fecha_inicio : null,
            rep_pep_cargo:
              empresa.rep_es_pep === "si" ? empresa.rep_pep_cargo : null,
            rep_pep_anios_trabajo:
              empresa.rep_es_pep === "si"
                ? parseInt(empresa.rep_pep_anios_trabajo)
                : null,
            rep_pep_grado_relacion:
              empresa.rep_es_pep === "si"
                ? empresa.rep_pep_grado_relacion
                : null,
          },
        };
      } else {
        payload = {
          tipo: "persona",
          titular: prepararPersona(
            {
              ...titular,
              partner_document_number: esCasado
                ? conyugue.document_number
                : null,
            },
            titular.es_pep,
          ),
          conyugue: esCasado
            ? prepararPersona(
                {
                  ...conyugue,
                  marital_status: "casado",
                  partner_document_number: titular.document_number,
                },
                conyugue.es_pep,
              )
            : null,
        };
      }

      const res = await fetch(`${API_BASE}/api/public/registro/${token}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        setEnviado(true);
        window.scrollTo({ top: 0, behavior: "smooth" });
      } else {
        const data = await res.json();
        setErrors({
          general:
            data.detail || "Error al guardar los datos. Intente nuevamente.",
        });
      }
    } catch {
      setErrors({ general: "Error de conexión. Intente nuevamente." });
    } finally {
      setLoading(false);
    }
  };

  // ---- ESTADOS DE PANTALLA ----
  if (tokenValido === null) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Verificando enlace...</p>
        </div>
      </div>
    );
  }

  if (!tokenValido) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
        <div className="bg-white rounded-xl shadow-md p-8 max-w-md w-full text-center">
          <div className="text-5xl mb-4">⚠️</div>
          <h1 className="text-xl font-bold text-gray-900 mb-2">
            Enlace no válido
          </h1>
          <p className="text-gray-600">
            Este enlace no es válido, ya fue utilizado o ha expirado. Por favor
            contacte a la notaría para obtener un nuevo enlace.
          </p>
        </div>
      </div>
    );
  }

  if (enviado) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
        <div className="bg-white rounded-xl shadow-md p-8 max-w-md w-full text-center">
          <div className="text-5xl mb-4">✅</div>
          <h1 className="text-xl font-bold text-gray-900 mb-2">
            ¡Datos registrados!
          </h1>
          <p className="text-gray-600">
            Sus datos han sido guardados correctamente. Al momento de su cita,
            el personal de la notaría ya tendrá su información disponible.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-gray-900">
            Registro de Datos
          </h1>
          <p className="text-gray-600 mt-1">
            Complete sus datos para agilizar su trámite notarial
          </p>
        </div>

        {errors.general && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
            {errors.general}
          </div>
        )}
        {Object.keys(errors).filter(
          (k) => k !== "general" && k !== "privacidad",
        ).length > 0 && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
            Por favor corrija los campos marcados en rojo antes de continuar.
          </div>
        )}

        <div className="space-y-6">
          {/* TOGGLE PERSONA / EMPRESA */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <label className="block text-sm font-medium text-gray-700 mb-3">
              ¿Cómo va a participar en el trámite?
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => {
                  setTipoRegistro("persona");
                  setErrors({});
                }}
                className={`p-4 rounded-lg border-2 text-left transition-colors ${tipoRegistro === "persona" ? "border-blue-500 bg-blue-50" : "border-gray-200 hover:border-gray-300"}`}
              >
                <div className="text-2xl mb-1">👤</div>
                <div className="font-semibold text-gray-900 text-sm">
                  Persona Natural
                </div>
                <div className="text-xs text-gray-500 mt-0.5">
                  Como individuo
                </div>
              </button>
              <button
                type="button"
                onClick={() => {
                  setTipoRegistro("empresa");
                  setErrors({});
                }}
                className={`p-4 rounded-lg border-2 text-left transition-colors ${tipoRegistro === "empresa" ? "border-blue-500 bg-blue-50" : "border-gray-200 hover:border-gray-300"}`}
              >
                <div className="text-2xl mb-1">🏢</div>
                <div className="font-semibold text-gray-900 text-sm">
                  Persona Jurídica
                </div>
                <div className="text-xs text-gray-500 mt-0.5">
                  En representación de una empresa
                </div>
              </button>
            </div>
          </div>

          {/* FORMULARIO SEGÚN TIPO */}
          {tipoRegistro === "persona" && (
            <>
              <FormularioPersona
                titulo="Sus datos personales"
                datos={titular}
                onChange={handleTitularChange}
                errors={errors}
                mostrarEstadoCivil={true}
              />

              {esCasado && (
                <div className="border-2 border-blue-200 rounded-xl overflow-hidden">
                  <div className="bg-blue-50 px-6 py-3 border-b border-blue-200">
                    <p className="text-sm font-medium text-blue-800">
                      👫 Como está casado/a, necesitamos también los datos de su
                      cónyuge
                    </p>
                  </div>
                  <FormularioPersona
                    titulo="Datos del cónyuge"
                    datos={conyugue}
                    onChange={handleConyugueChange}
                    errors={Object.fromEntries(
                      Object.entries(errors)
                        .filter(([k]) => k.startsWith("c_"))
                        .map(([k, v]) => [k.replace("c_", ""), v]),
                    )}
                    mostrarEstadoCivil={false}
                    mismaDir={mismaDir}
                    onToggleMismaDir={() => setMismaDir((prev) => !prev)}
                  />
                </div>
              )}
            </>
          )}

          {tipoRegistro === "empresa" && (
            <FormularioEmpresa
              datos={empresa}
              onChange={handleEmpresaChange}
              errors={errors}
            />
          )}

          {/* PRIVACIDAD */}
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
            <h2 className="font-semibold text-blue-900 mb-3">
              Protección de Datos Personales
            </h2>
            <p className="text-sm text-blue-800 mb-4">
              Sus datos personales serán tratados por la notaría exclusivamente
              para la celebración del instrumento público solicitado, en
              cumplimiento de la{" "}
              <strong>
                Ley Orgánica de Protección de Datos Personales del Ecuador
                (LOPDP)
              </strong>
              . Usted tiene derecho a acceder, rectificar, cancelar u oponerse
              al tratamiento de sus datos contactando directamente a la notaría.
            </p>
            <label className="flex items-start gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={aceptaPrivacidad}
                onChange={(e) => {
                  setAceptaPrivacidad(e.target.checked);
                  if (errors.privacidad)
                    setErrors((prev) => ({ ...prev, privacidad: "" }));
                }}
                className="w-4 h-4 mt-0.5 rounded text-blue-600"
              />
              <span className="text-sm text-blue-800">
                Acepto el tratamiento de mis datos personales para los fines
                notariales descritos.
              </span>
            </label>
            {errors.privacidad && (
              <p className="text-red-500 text-xs mt-2">{errors.privacidad}</p>
            )}
          </div>

          {/* BOTÓN */}
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Guardando...
              </>
            ) : (
              "Enviar mis datos"
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default RegistroClientePage;
