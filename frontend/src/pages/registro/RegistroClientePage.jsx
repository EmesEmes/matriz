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

const RAZONES_EXCLUSION_CONYUGUE = [
  { value: "disolucion", label: "Disolución de sociedad conyugal" },
  { value: "capitulacion", label: "Capitulación matrimonial" },
  { value: "adquirido_solo", label: "Bien adquirido soltero/viudo/divorciado" },
];

const RELACIONES_PEP = [
  "Cónyuge/Conviviente",
  "Ascendiente/Padres/Abuelos/Suegros",
  "Descendientes/Hijos/Nietos/Yerno-Nuera",
  "Hermanos/Cuñados",
  "Tíos directos",
  "Primos directos",
  "Colaborador",
  "Amigo",
];

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
  rol_tramite: "",
  origen_fondos: "",
  conyugue_comparece: true,
  razon_exclusion_conyugue: "",
  es_pep: "",
  es_pep_indirecto: "",
  pep_relacion_tipo: "",
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
  rep_actividad_economica: "",
  rep_empresa_trabajo: "",
  rep_ingreso_mensual: "",
  rep_rol_tramite: "",
  rep_origen_fondos: "",
  rep_es_pep: "",
  rep_es_pep_indirecto: "",
  rep_pep_relacion_tipo: "",
  rep_pep_nombre: "",
  rep_pep_institucion: "",
  rep_pep_fecha_inicio: "",
  rep_pep_cargo: "",
  rep_pep_anios_trabajo: "",
  rep_pep_grado_relacion: "",
});

// ============================================
// HELPERS
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

// Checkbox cónyuge no comparece
const SeccionConyugue = ({ datos, onChange, errors, prefijo = "" }) => {
  if (datos[`${prefijo}marital_status`] !== "casado") return null;
  return (
    <div className="border border-gray-200 rounded-lg overflow-hidden">
      <div className="bg-gray-50 px-4 py-3 border-b border-gray-200">
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={!datos[`${prefijo}conyugue_comparece`]}
            onChange={(e) =>
              onChange(`${prefijo}conyugue_comparece`, !e.target.checked)
            }
            className="w-4 h-4 text-gray-600 rounded"
          />
          <span className="text-sm font-medium text-gray-700">
            El cónyuge no comparece en este trámite
          </span>
        </label>
      </div>
      {!datos[`${prefijo}conyugue_comparece`] && (
        <div className="p-4 bg-white">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Razón de no comparecencia
          </label>
          <select
            value={datos[`${prefijo}razon_exclusion_conyugue`] || ""}
            onChange={(e) =>
              onChange(`${prefijo}razon_exclusion_conyugue`, e.target.value)
            }
            className={inputClass(errors, `${prefijo}razon_exclusion_conyugue`)}
          >
            <option value="">Seleccione una razón</option>
            {RAZONES_EXCLUSION_CONYUGUE.map((r) => (
              <option key={r.value} value={r.value}>
                {r.label}
              </option>
            ))}
          </select>
          {errors[`${prefijo}razon_exclusion_conyugue`] && (
            <p className="text-red-500 text-xs mt-1">
              {errors[`${prefijo}razon_exclusion_conyugue`]}
            </p>
          )}
        </div>
      )}
    </div>
  );
};

const FormularioPEP = ({
  datos,
  onChange,
  errors,
  prefijo = "",
  mostrarGrado = false,
  mostrarNombre = true,
}) => (
  <div className="grid grid-cols-2 gap-4">
    {mostrarNombre && (
      <div className="col-span-2">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Nombre del PEP
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
    )}
    <div className="col-span-2">
      <label className="block text-sm font-medium text-gray-700 mb-1">
        Institución en la que trabaja el PEP
      </label>
      <input
        type="text"
        value={datos[`${prefijo}pep_institucion`]}
        onChange={(e) => onChange(`${prefijo}pep_institucion`, e.target.value)}
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
        onChange={(e) => onChange(`${prefijo}pep_fecha_inicio`, e.target.value)}
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
        Cargo que Desempeña el PEP
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
    {mostrarGrado && (
      <>
        <div className="col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Relación con el PEP
          </label>
          <select
            value={datos[`${prefijo}pep_relacion_tipo`] || ""}
            onChange={(e) =>
              onChange(`${prefijo}pep_relacion_tipo`, e.target.value)
            }
            className={inputClass(errors, `${prefijo}pep_relacion_tipo`)}
          >
            <option value="">Seleccione</option>
            {RELACIONES_PEP.map((r) => (
              <option key={r} value={r}>
                {r}
              </option>
            ))}
          </select>
          {errors[`${prefijo}pep_relacion_tipo`] && (
            <p className="text-red-500 text-xs mt-1">
              {errors[`${prefijo}pep_relacion_tipo`]}
            </p>
          )}
        </div>
        <div className="col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Grado de Consanguinidad, Afinidad o Relación de Colaboración que
            tiene con el PEP
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
      </>
    )}
  </div>
);

const SeccionUAFE = ({
  datos,
  onChange,
  errors,
  prefijo = "",
  mostrarOrigenFondos = false,
}) => {
  const esPepDirecto = datos[`${prefijo}es_pep`] === "si";
  const noesPep = datos[`${prefijo}es_pep`] === "no";
  const esPepIndirecto =
    noesPep && datos[`${prefijo}es_pep_indirecto`] === "si";
  const noEsPepIndirecto =
    noesPep && datos[`${prefijo}es_pep_indirecto`] === "no";
  const actEco = datos[`${prefijo}actividad_economica`];
  const labelOrigenFondos =
    datos[`${prefijo}rol_tramite`] === "adquirente"
      ? "Origen de los fondos con los que pagará el bien que adquiere"
      : "Origen de los fondos con los que adquirió el bien que transfiere";

  return (
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
            <option value="jubilado">Jubilado</option>
            <option value="quehaceres_domesticos">Quehaceres Domésticos</option>
            <option value="cuidador_hogar">Cuidador del Hogar</option>
            <option value="estudiante">Estudiante</option>
            <option value="ninguna">Ninguna</option>
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
        {(actEco === "empleado" || actEco === "independiente") && (
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
        )}
      </div>

      {mostrarOrigenFondos && (
        <div className="space-y-3">
          <label className="block text-sm font-medium text-gray-700">
            ¿En qué calidad participa en el trámite?
          </label>
          <div className="flex flex-col gap-2">
            <button
              type="button"
              onClick={() => onChange(`${prefijo}rol_tramite`, "vendedor")}
              className={`px-3 py-2 rounded-lg text-xs font-medium text-left ${datos[`${prefijo}rol_tramite`] === "vendedor" ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"}`}
            >
              TRADENTE/S – VENDEDOR/ES – DONANTE/S – CEDENTE/S – ADJUDICANTE/S -
              ACREEDORES - OTORGANTES
            </button>
            <button
              type="button"
              onClick={() => onChange(`${prefijo}rol_tramite`, "adquirente")}
              className={`px-3 py-2 rounded-lg text-xs font-medium text-left ${datos[`${prefijo}rol_tramite`] === "adquirente" ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"}`}
            >
              ADQUIRIENTE/S – COMPRADOR/ES – DONATARIO/S – CESIONARIO/S –
              ADJUDICATARIO/S - DEUDORES - BENEFICIARIOS
            </button>
          </div>
          {errors[`${prefijo}rol_tramite`] && (
            <p className="text-red-500 text-xs mt-1">
              {errors[`${prefijo}rol_tramite`]}
            </p>
          )}
          {datos[`${prefijo}rol_tramite`] && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {labelOrigenFondos}
              </label>
              <textarea
                value={datos[`${prefijo}origen_fondos`] || ""}
                onChange={(e) =>
                  onChange(`${prefijo}origen_fondos`, e.target.value)
                }
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 text-sm resize-none ${errors[`${prefijo}origen_fondos`] ? "border-red-400 bg-red-50" : "border-gray-300"}`}
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
        </div>
      )}

      <div className="space-y-3">
        <label className="block text-sm font-medium text-gray-700">
          ¿Es usted una Persona Políticamente Expuesta (PEP)?
        </label>
        <div className="flex gap-3">
          <button
            type="button"
            onClick={() => {
              onChange(`${prefijo}es_pep`, "si");
              onChange(`${prefijo}es_pep_indirecto`, "");
            }}
            className={`px-4 py-2 rounded-lg text-sm font-medium ${esPepDirecto ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"}`}
          >
            Sí
          </button>
          <button
            type="button"
            onClick={() => onChange(`${prefijo}es_pep`, "no")}
            className={`px-4 py-2 rounded-lg text-sm font-medium ${noesPep ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"}`}
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

      {esPepDirecto && (
        <div className="p-4 bg-amber-50 border-2 border-amber-200 rounded-lg space-y-4">
          <p className="text-sm text-amber-800 font-medium">
            (SI USTED ES UNA PERSONA EXPUESTA POLÍTICAMENTE) Complete la
            siguiente información:
          </p>
          <FormularioPEP
            datos={datos}
            onChange={onChange}
            errors={errors}
            prefijo={prefijo}
            mostrarGrado={false}
            mostrarNombre={false}
          />
        </div>
      )}

      {noesPep && (
        <div className="space-y-3">
          <label className="block text-sm font-medium text-gray-700">
            ¿Es pariente, amigo o colaborador de una Persona Políticamente
            Expuesta?
          </label>
          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => onChange(`${prefijo}es_pep_indirecto`, "si")}
              className={`px-4 py-2 rounded-lg text-sm font-medium ${esPepIndirecto ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"}`}
            >
              Sí
            </button>
            <button
              type="button"
              onClick={() => onChange(`${prefijo}es_pep_indirecto`, "no")}
              className={`px-4 py-2 rounded-lg text-sm font-medium ${noEsPepIndirecto ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"}`}
            >
              No
            </button>
          </div>
          {errors[`${prefijo}es_pep_indirecto`] && (
            <p className="text-red-500 text-xs mt-1">
              {errors[`${prefijo}es_pep_indirecto`]}
            </p>
          )}
        </div>
      )}

      {esPepIndirecto && (
        <div className="p-4 bg-orange-50 border-2 border-orange-200 rounded-lg space-y-4">
          <p className="text-sm text-orange-800 font-medium">
            Complete los datos de la Persona Políticamente Expuesta (PEP) con
            quien tiene relación:
          </p>
          <FormularioPEP
            datos={datos}
            onChange={onChange}
            errors={errors}
            prefijo={prefijo}
            mostrarGrado={true}
            mostrarNombre={true}
          />
        </div>
      )}
    </>
  );
};

// ============================================
// FORMULARIO PERSONA NATURAL
// ============================================
const FormularioPersona = ({
  titulo,
  datos,
  onChange,
  errors,
  mostrarEstadoCivil = true,
  mostrarRolTramite = true,
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
      mostrarOrigenFondos={mostrarRolTramite}
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
  if (validarOrigenFondos) {
    if (!datos[`${p}rol_tramite`]) e[`${p}rol_tramite`] = "Requerido";
    if (datos[`${p}rol_tramite`] && !datos[`${p}origen_fondos`]?.trim())
      e[`${p}origen_fondos`] = "Requerido";
  }
  if (!datos[`${p}es_pep`]) e[`${p}es_pep`] = "Requerido";
  if (datos[`${p}es_pep`] === "si") {
    if (!datos[`${p}pep_institucion`]) e[`${p}pep_institucion`] = "Requerido";
    if (!datos[`${p}pep_fecha_inicio`]) e[`${p}pep_fecha_inicio`] = "Requerido";
    if (!datos[`${p}pep_cargo`]) e[`${p}pep_cargo`] = "Requerido";
    if (!datos[`${p}pep_anios_trabajo`])
      e[`${p}pep_anios_trabajo`] = "Requerido";
  }
  if (datos[`${p}es_pep`] === "no") {
    if (!datos[`${p}es_pep_indirecto`]) e[`${p}es_pep_indirecto`] = "Requerido";
    if (datos[`${p}es_pep_indirecto`] === "si") {
      if (!datos[`${p}pep_nombre`]) e[`${p}pep_nombre`] = "Requerido";
      if (!datos[`${p}pep_institucion`]) e[`${p}pep_institucion`] = "Requerido";
      if (!datos[`${p}pep_fecha_inicio`])
        e[`${p}pep_fecha_inicio`] = "Requerido";
      if (!datos[`${p}pep_cargo`]) e[`${p}pep_cargo`] = "Requerido";
      if (!datos[`${p}pep_anios_trabajo`])
        e[`${p}pep_anios_trabajo`] = "Requerido";
      if (!datos[`${p}pep_relacion_tipo`])
        e[`${p}pep_relacion_tipo`] = "Requerido";
      if (!datos[`${p}pep_grado_relacion`])
        e[`${p}pep_grado_relacion`] = "Requerido";
    }
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
  const [tipoRegistro, setTipoRegistro] = useState("persona");
  const [calidadParticipacion, setCalidadParticipacion] = useState("");
  const [representadoEsConyugue, setRepresentadoEsConyugue] = useState(null);
  const [titular, setTitular] = useState(personaInicial());
  const [conyugue, setConyugue] = useState(personaInicial());
  const [representado, setRepresentado] = useState(personaInicial());
  const [conyugueRepresentado, setConyugueRepresentado] =
    useState(personaInicial());
  const [empresa, setEmpresa] = useState(empresaInicial());
  const [mismaDir, setMismaDir] = useState(true);
  const [mismaDirRepresentado, setMismaDirRepresentado] = useState(true);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [enviado, setEnviado] = useState(false);
  const [aceptaPrivacidad, setAceptaPrivacidad] = useState(false);
  const [aceptaCondiciones, setAceptaCondiciones] = useState(false);
  const [modalCondiciones, setModalCondiciones] = useState(false);

  const esCasadoTitular = titular.marital_status === "casado";
  const esCasadoRepresentado = representado.marital_status === "casado";
  const titularConyugueComparece = titular.conyugue_comparece !== false;
  const representadoConyugueComparece =
    representado.conyugue_comparece !== false;

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

  // Sincronizar dirección del cónyuge del titular
  useEffect(() => {
    if (
      mismaDir &&
      esCasadoTitular &&
      calidadParticipacion === "propios_derechos"
    ) {
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
    esCasadoTitular,
    calidadParticipacion,
    titular.province,
    titular.canton,
    titular.parroquia,
    titular.sector,
    titular.main_street,
    titular.secondary_street,
    titular.number_street,
  ]);

  // Sincronizar dirección del cónyuge del representado
  useEffect(() => {
    if (mismaDirRepresentado && esCasadoRepresentado) {
      setConyugueRepresentado((prev) => ({
        ...prev,
        province: representado.province,
        canton: representado.canton,
        parroquia: representado.parroquia,
        sector: representado.sector,
        main_street: representado.main_street,
        secondary_street: representado.secondary_street,
        number_street: representado.number_street,
      }));
    }
  }, [
    mismaDirRepresentado,
    esCasadoRepresentado,
    representado.province,
    representado.canton,
    representado.parroquia,
    representado.sector,
    representado.main_street,
    representado.secondary_street,
    representado.number_street,
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
  const handleRepresentadoChange = (field, value) => {
    setRepresentado((prev) => ({ ...prev, [field]: value }));
    if (errors[`r_${field}`])
      setErrors((prev) => ({ ...prev, [`r_${field}`]: "" }));
  };
  const handleConyugueRepresentadoChange = (field, value) => {
    setConyugueRepresentado((prev) => ({ ...prev, [field]: value }));
    if (errors[`cr_${field}`])
      setErrors((prev) => ({ ...prev, [`cr_${field}`]: "" }));
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
      if (!calidadParticipacion) e.calidadParticipacion = "Requerido";

      // Validar titular siempre
      e = { ...e, ...validarPersona(titular) };
      e = {
        ...e,
        ...validarUAFE(titular, "", calidadParticipacion !== "representando"),
      };
      if (
        calidadParticipacion === "propios_derechos" ||
        calidadParticipacion === "propios_y_representando"
      ) {
        if (!titular.marital_status) e.marital_status = "Requerido";
      }

      // Cónyuge del titular
      if (
        (calidadParticipacion === "propios_derechos" ||
          calidadParticipacion === "propios_y_representando") &&
        esCasadoTitular &&
        titularConyugueComparece
      ) {
        if (
          calidadParticipacion === "propios_y_representando" &&
          representadoEsConyugue
        ) {
          // No validar cónyuge separado
        } else {
          const errC = {
            ...validarPersona(conyugue, "c_"),
            ...validarUAFE(conyugue, "c_", false),
          };
          if (mismaDir)
            [
              "c_province",
              "c_canton",
              "c_parroquia",
              "c_main_street",
              "c_secondary_street",
              "c_number_street",
            ].forEach((k) => delete errC[k]);
          e = { ...e, ...errC };
        }
      }

      // Validar representado
      if (
        calidadParticipacion === "representando" ||
        calidadParticipacion === "propios_y_representando"
      ) {
        if (
          calidadParticipacion === "propios_y_representando" &&
          representadoEsConyugue === null
        )
          e.representadoEsConyugue = "Requerido";

        const usarRepresentadoSeparado = !(
          calidadParticipacion === "propios_y_representando" &&
          representadoEsConyugue
        );
        if (usarRepresentadoSeparado) {
          const errR = {
            ...validarPersona(representado, "r_"),
            ...validarUAFE(representado, "r_", true),
          };
          e = { ...e, ...errR };
          // Cónyuge del representado
          if (esCasadoRepresentado && representadoConyugueComparece) {
            const errCR = {
              ...validarPersona(conyugueRepresentado, "cr_"),
              ...validarUAFE(conyugueRepresentado, "cr_", false),
            };
            if (mismaDirRepresentado)
              [
                "cr_province",
                "cr_canton",
                "cr_parroquia",
                "cr_main_street",
                "cr_secondary_street",
                "cr_number_street",
              ].forEach((k) => delete errCR[k]);
            e = { ...e, ...errCR };
          }
        }
      }
    }
    if (!aceptaPrivacidad)
      e.privacidad = "Debe aceptar el tratamiento de sus datos";
    if (!aceptaCondiciones)
      e.condiciones = "Debe aceptar las condiciones jurídicas";
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
        const titularPrep = prepararPersona(titular, titular.es_pep);
        let conyuguePrep = null;
        let representadoPrep = null;
        let conyugueRepresentadoPrep = null;

        if (
          (calidadParticipacion === "propios_derechos" ||
            calidadParticipacion === "propios_y_representando") &&
          esCasadoTitular &&
          titularConyugueComparece
        ) {
          if (
            !(
              calidadParticipacion === "propios_y_representando" &&
              representadoEsConyugue
            )
          ) {
            conyuguePrep = {
              ...prepararPersona(conyugue, conyugue.es_pep),
              marital_status: "casado",
              partner_document_number: titular.document_number,
            };
            titularPrep.partner_document_number = conyugue.document_number;
          }
        }

        if (
          calidadParticipacion === "representando" ||
          calidadParticipacion === "propios_y_representando"
        ) {
          if (
            calidadParticipacion === "propios_y_representando" &&
            representadoEsConyugue
          ) {
            // El representado es el cónyuge del titular
            conyuguePrep = prepararPersona(conyugue, conyugue.es_pep);
            titularPrep.partner_document_number = conyugue.document_number;
          } else {
            representadoPrep = prepararPersona(
              representado,
              representado.es_pep,
            );
            if (esCasadoRepresentado && representadoConyugueComparece) {
              conyugueRepresentadoPrep = {
                ...prepararPersona(
                  conyugueRepresentado,
                  conyugueRepresentado.es_pep,
                ),
                marital_status: "casado",
                partner_document_number: representado.document_number,
              };
              representadoPrep.partner_document_number =
                conyugueRepresentado.document_number;
            }
          }
        }

        payload = {
          tipo: "persona",
          calidad_participacion: calidadParticipacion,
          titular: titularPrep,
          conyugue: conyuguePrep,
          representado: representadoPrep,
          conyugue_representado: conyugueRepresentadoPrep,
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
          <div className="text-5xl mb-4"></div>
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
          <div className="text-5xl mb-4"></div>
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
        {/* ENCABEZADO */}
        <div className="text-center mb-8">
          <img
            src="/logo.svg"
            alt="Notaría Vigésimo Segunda"
            className="h-20 mx-auto mb-4 object-contain"
            onError={(e) => {
              e.target.style.display = "none";
            }}
          />
          <h1 className="text-xl font-bold text-gray-900 uppercase">
            Notaría Vigésimo Segunda del Cantón Quito
          </h1>
          <p className="text-sm text-gray-700 mt-2 font-medium leading-relaxed">
            FORMULARIO QUE REGISTRA INFORMACIÓN CUMPLIENDO LO DISPUESTO EN EL
            ART. 58 DE LA LEY PREVENCIÓN DE LAVADO DE ACTIVOS Y DE LA
            FINANCIACIÓN DE DELITOS Y ART. 3 NUMERAL 5 DE SU REGLAMENTO.
          </p>
        </div>

        {errors.general && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
            {errors.general}
          </div>
        )}
        {Object.keys(errors).filter(
          (k) => k !== "general" && k !== "privacidad" && k !== "condiciones",
        ).length > 0 && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
            Por favor corrija los campos marcados en rojo antes de continuar.
          </div>
        )}

        <div className="space-y-6">
          {/* MODAL CONDICIONES */}
          {modalCondiciones && (
            <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
              <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                <div className="p-6">
                  <div className="flex justify-between items-center mb-4">
                    <h2 className="text-lg font-bold text-gray-900">
                      Condiciones Jurídicas
                    </h2>
                    <button
                      onClick={() => setModalCondiciones(false)}
                      className="text-gray-400 hover:text-gray-600 text-2xl font-bold"
                    >
                      ×
                    </button>
                  </div>
                  <div className="text-sm text-gray-700 space-y-4 leading-relaxed">
                    <p>
                      <strong>1.-</strong> Conforme a los principios de la
                      administración pública garantizados en el artículo 227 de
                      la Constitución de la República que guardan relación con
                      el principio de no duplicidad de información determinado
                      en el artículo 3 numeral 13 de la Ley Orgánica Para La
                      Optimización y Eficiencia de Trámites Administrativos, así
                      como con la prohibición establecida en el artículo 11 de
                      la referida normativa que impide a quienes prestamos un
                      servicio público exigir a los usuarios información que ya
                      disponemos en nuestras bases de datos, quienes hacemos
                      esta dependencia dejamos constancia que respecto a
                      personas naturales los datos tales como: a) Nombres y
                      apellidos completos, b) Número de Registro Único de
                      Contribuyentes, c) Domicilio, d) Cédula de identidad para
                      ecuatorianos, pasaporte o documento de identificación en
                      caso de persona extranjera, e) Actividad ocupacional y
                      cargo, f) Sexo; y, g) Nacionalidad; así como, respecto a
                      personas jurídicas datos tales como: a) Razón social, b)
                      Número de Registro Único de Contribuyentes, c)
                      Nacionalidad, d) Dirección domiciliaria, e) Provincia,
                      ciudad, cantón; y, f) Actividad económica; y, sus
                      representantes legales respecto con: a) Nombres y
                      apellidos completos, b) Cédula de identidad para
                      ecuatorianos, pasaporte o documento de identificación en
                      caso de persona extranjera, c) Sexo, d) Nacionalidad; y,
                      e) Escritura pública del poder respectivo constan
                      plenamente detallados en el texto de la escritura pública
                      y o actuación notarial cuyo número específico está en la
                      parte superior de este formulario y además los documentos
                      originales, copias certificadas, compulsas y
                      materializaciones de respaldo están habilitados a dicho
                      instrumento notarial.
                    </p>
                    <p>
                      <strong>2.</strong> La información respecto al contrato o
                      acto notarial que comprenda: a) Valor de la operación,
                      transacción económica, acto o contratos realizados, b)
                      Fecha de su realización, c) Moneda en la que se realizó la
                      transacción; y, d) Ciudad y fecha de pago también constan
                      detallados en la escritura pública o actuación notarial
                      cuyo número específico se encuentra en la parte superior
                      de este formulario.
                    </p>
                    <p>
                      <strong>3.</strong> La información respecto al detalle de
                      los accionistas o socios de empresas que permita obtener
                      los datos hasta llegar a las personas naturales debe ser
                      proporcionada por los usuarios y en la medida de lo
                      posible podrá ser contrastada con las bases de datos de la
                      Superintendencia de Compañías. De la misma forma, toda la
                      información que identifique al fideicomitente, fiduciario,
                      beneficiarios, clase de fideicomisos, hasta llegar a las
                      personas naturales que ejerzan el control efectivo y
                      definitivo sobre el mismo debe ser proporcionada por los
                      usuarios del servicio.
                    </p>
                    <p>
                      <strong>4.-</strong> Como persona legalmente capaz que soy
                      manifiesto que estoy enterado(a) de todos los detalles de
                      la negociación o pretensión que antecede a la firma de
                      este instrumento, y en consecuencia lo realizo sin presión
                      de ninguna naturaleza en beneficio de mis intereses.
                      Manifiesto que he recibido explicaciones y asesoría
                      jurídica de parte del abogado que patrocina la minuta o
                      petición y directamente del Notario que interviene
                      autorizando el otorgamiento de este instrumento.
                    </p>
                    <p>
                      <strong>5.-</strong> Declaro que los fondos con los que se
                      ejecuta esta negociación no provienen de actividades
                      ilícitas ni vinculadas con la producción, consumo,
                      comercialización de sustancias estupefacientes y
                      psicotrópicas, ni el lavado de activos fijos, ni
                      recolección de fondos de financiamiento de terrorismo o
                      cualquier otra actividad tipificada en la normativa
                      vigente ya sea relacionada con los delitos de narcotráfico
                      u otro tipo de delitos, por lo que me hago absolutamente
                      responsable de cualquier tipo de imputaciones que el
                      Estado Ecuatoriano a través de sus instituciones de
                      control ejecute como resultado de sus investigaciones,
                      expresando con claridad que la intervención del Notario
                      que autoriza el otorgamiento de este instrumento es
                      únicamente de tipo legal conforme a sus facultades e
                      investidura.
                    </p>
                    <p>
                      <strong>6.-</strong> Manifiesto que tanto la persona
                      dependiente de la Notaría Vigésimo Segunda del cantón
                      Quito que me ha atendido, al igual que el Notario en forma
                      personal me han explicado sobre los riesgos que existen al
                      hacer negociaciones con personas a quienes no conozco
                      directamente o de las que no tengo referencias, en
                      especial cuando los contratos a otorgarse son producto de
                      avisos publicados en la prensa o los precios están por
                      debajo del mercado, por lo tanto sé y conozco claramente
                      la importancia de informarme sobre los antecedentes
                      personales de quienes han ofertado el bien que estoy
                      adquiriendo o a quienes deseo transferirlo.
                    </p>
                    <p>
                      <strong>7.-</strong> (NUMERAL APLICABLE PARA PERSONAS QUE
                      NO SABEN LEER Y ESCRIBIR) Como persona que no sé leer y
                      escribir, manifiesto que este documento me fue leído por
                      el testigo de confianza por mi presentado y que recibí las
                      explicaciones adecuadas y claras tanto del personal de la
                      Notaría Vigésima Segunda del cantón Quito y del Notario,
                      en consecuencia, coloco la huella digital de mi pulgar
                      derecho al pie de este documento.
                    </p>
                  </div>
                  <button
                    onClick={() => {
                      setAceptaCondiciones(true);
                      setModalCondiciones(false);
                    }}
                    className="mt-6 w-full py-2 bg-amber-600 hover:bg-amber-700 text-white font-semibold rounded-lg transition-colors"
                  >
                    He leído y acepto estas condiciones
                  </button>
                </div>
              </div>
            </div>
          )}

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
                <div className="text-2xl mb-1"></div>
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
                <div className="text-2xl mb-1"></div>
                <div className="font-semibold text-gray-900 text-sm">
                  Persona Jurídica
                </div>
                <div className="text-xs text-gray-500 mt-0.5">
                  En representación de una empresa
                </div>
              </button>
            </div>
          </div>

          {/* PERSONA NATURAL */}
          {tipoRegistro === "persona" && (
            <>
              {/* CALIDAD DE PARTICIPACIÓN */}
              <div className="bg-white rounded-xl shadow-sm p-6 space-y-3">
                <label className="block text-sm font-medium text-gray-700">
                  Calidad en la que participa en el trámite
                </label>
                <div className="flex flex-col gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setCalidadParticipacion("propios_derechos");
                      setErrors({});
                    }}
                    className={`p-4 rounded-lg border-2 text-left transition-colors ${calidadParticipacion === "propios_derechos" ? "border-blue-500 bg-blue-50" : "border-gray-200 hover:border-gray-300"}`}
                  >
                    <div className="font-semibold text-gray-900 text-sm">
                      Por sus propios derechos
                    </div>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setCalidadParticipacion("representando");
                      setErrors({});
                    }}
                    className={`p-4 rounded-lg border-2 text-left transition-colors ${calidadParticipacion === "representando" ? "border-blue-500 bg-blue-50" : "border-gray-200 hover:border-gray-300"}`}
                  >
                    <div className="font-semibold text-gray-900 text-sm">
                      Representando a:
                    </div>
                    <div className="text-xs text-gray-500 mt-0.5">
                      Mandatario, apoderado, representante
                    </div>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setCalidadParticipacion("propios_y_representando");
                      setErrors({});
                    }}
                    className={`p-4 rounded-lg border-2 text-left transition-colors ${calidadParticipacion === "propios_y_representando" ? "border-blue-500 bg-blue-50" : "border-gray-200 hover:border-gray-300"}`}
                  >
                    <div className="font-semibold text-gray-900 text-sm">
                      Por sus propios derechos y representando a:
                    </div>
                    <div className="text-xs text-gray-500 mt-0.5">
                      Comparece en doble calidad
                    </div>
                  </button>
                </div>
                {errors.calidadParticipacion && (
                  <p className="text-red-500 text-xs">
                    {errors.calidadParticipacion}
                  </p>
                )}
              </div>

              {/* DATOS DEL COMPARECIENTE */}
              {calidadParticipacion && (
                <FormularioPersona
                  titulo={
                    calidadParticipacion === "propios_derechos"
                      ? "Sus datos personales"
                      : "Datos del Apoderado, Mandatario, Representante (quien firma)"
                  }
                  datos={titular}
                  onChange={handleTitularChange}
                  errors={errors}
                  mostrarEstadoCivil={true}
                  mostrarRolTramite={
                    calidadParticipacion === "propios_derechos"
                  }
                />
              )}

              {/* CÓNYUGE NO COMPARECE — titular por propios derechos o propios+representando */}
              {calidadParticipacion &&
                calidadParticipacion !== "representando" &&
                esCasadoTitular && (
                  <SeccionConyugue
                    datos={titular}
                    onChange={handleTitularChange}
                    errors={errors}
                  />
                )}

              {/* CÓNYUGE DEL TITULAR */}
              {calidadParticipacion &&
                calidadParticipacion !== "representando" &&
                esCasadoTitular &&
                titularConyugueComparece &&
                !(
                  calidadParticipacion === "propios_y_representando" &&
                  representadoEsConyugue
                ) && (
                  <div className="border-2 border-blue-200 rounded-xl overflow-hidden">
                    <div className="bg-blue-50 px-6 py-3 border-b border-blue-200">
                      <p className="text-sm font-medium text-blue-800">
                        {" "}
                        Como está casado/a, necesitamos también los datos de su
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
                      mostrarRolTramite={false}
                      mismaDir={mismaDir}
                      onToggleMismaDir={() => setMismaDir((prev) => !prev)}
                    />
                  </div>
                )}

              {/* ¿EL REPRESENTADO ES SU CÓNYUGE? — solo para propios_y_representando */}
              {calidadParticipacion === "propios_y_representando" && (
                <div className="bg-white rounded-xl shadow-sm p-6 space-y-3">
                  <label className="block text-sm font-medium text-gray-700">
                    ¿El representado es su cónyuge?
                  </label>
                  <div className="flex gap-3">
                    <button
                      type="button"
                      onClick={() => setRepresentadoEsConyugue(true)}
                      className={`px-4 py-2 rounded-lg text-sm font-medium ${representadoEsConyugue === true ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"}`}
                    >
                      Sí
                    </button>
                    <button
                      type="button"
                      onClick={() => setRepresentadoEsConyugue(false)}
                      className={`px-4 py-2 rounded-lg text-sm font-medium ${representadoEsConyugue === false ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"}`}
                    >
                      No
                    </button>
                  </div>
                  {errors.representadoEsConyugue && (
                    <p className="text-red-500 text-xs">
                      {errors.representadoEsConyugue}
                    </p>
                  )}

                  {/* Si es su cónyuge — formulario del cónyuge con rol en trámite */}
                  {representadoEsConyugue === true && (
                    <div className="border-2 border-purple-200 rounded-xl overflow-hidden mt-4">
                      <FormularioPersona
                        titulo="Datos del Poderdante, Mandante, Representado (cónyuge)"
                        datos={conyugue}
                        onChange={handleConyugueChange}
                        errors={Object.fromEntries(
                          Object.entries(errors)
                            .filter(([k]) => k.startsWith("c_"))
                            .map(([k, v]) => [k.replace("c_", ""), v]),
                        )}
                        mostrarEstadoCivil={false}
                        mostrarRolTramite={true}
                        mismaDir={mismaDir}
                        onToggleMismaDir={() => setMismaDir((prev) => !prev)}
                      />
                    </div>
                  )}
                </div>
              )}

              {/* FORMULARIO DEL REPRESENTADO — cuando no es el cónyuge */}
              {(calidadParticipacion === "representando" ||
                (calidadParticipacion === "propios_y_representando" &&
                  representadoEsConyugue === false)) && (
                <div className="border-2 border-purple-200 rounded-xl overflow-hidden">
                  <FormularioPersona
                    titulo="Datos del Poderdante, Mandante, Representado"
                    datos={representado}
                    onChange={handleRepresentadoChange}
                    errors={Object.fromEntries(
                      Object.entries(errors)
                        .filter(([k]) => k.startsWith("r_"))
                        .map(([k, v]) => [k.replace("r_", ""), v]),
                    )}
                    mostrarEstadoCivil={true}
                    mostrarRolTramite={true}
                  />

                  {/* Cónyuge no comparece — representado */}
                  {esCasadoRepresentado && (
                    <div className="px-6 pb-4">
                      <SeccionConyugue
                        datos={representado}
                        onChange={handleRepresentadoChange}
                        errors={Object.fromEntries(
                          Object.entries(errors)
                            .filter(([k]) => k.startsWith("r_"))
                            .map(([k, v]) => [k.replace("r_", ""), v]),
                        )}
                      />
                    </div>
                  )}

                  {/* Cónyuge del representado */}
                  {esCasadoRepresentado && representadoConyugueComparece && (
                    <div className="border-t-2 border-purple-200">
                      <FormularioPersona
                        titulo="Datos del cónyuge del representado"
                        datos={conyugueRepresentado}
                        onChange={handleConyugueRepresentadoChange}
                        errors={Object.fromEntries(
                          Object.entries(errors)
                            .filter(([k]) => k.startsWith("cr_"))
                            .map(([k, v]) => [k.replace("cr_", ""), v]),
                        )}
                        mostrarEstadoCivil={false}
                        mostrarRolTramite={false}
                        mismaDir={mismaDirRepresentado}
                        onToggleMismaDir={() =>
                          setMismaDirRepresentado((prev) => !prev)
                        }
                      />
                    </div>
                  )}
                </div>
              )}
            </>
          )}

          {/* EMPRESA */}
          {tipoRegistro === "empresa" && (
            <FormularioEmpresa
              datos={empresa}
              onChange={handleEmpresaChange}
              errors={errors}
            />
          )}

          {/* CONDICIONES JURÍDICAS */}
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-6">
            <h2 className="font-semibold text-amber-900 mb-3">
              Condiciones Jurídicas
            </h2>
            <button
              type="button"
              onClick={() => setModalCondiciones(true)}
              className="text-sm text-amber-700 underline hover:text-amber-900 mb-3 block"
            >
              Ver condiciones jurídicas completas
            </button>
            <label className="flex items-start gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={aceptaCondiciones}
                onChange={(e) => {
                  setAceptaCondiciones(e.target.checked);
                  if (errors.condiciones)
                    setErrors((prev) => ({ ...prev, condiciones: "" }));
                }}
                className="w-4 h-4 mt-0.5 rounded text-amber-600"
              />
              <span className="text-sm text-amber-800">
                He leído y acepto las condiciones jurídicas establecidas por la
                Notaría Vigésimo Segunda del Cantón Quito.
              </span>
            </label>
            {errors.condiciones && (
              <p className="text-red-500 text-xs mt-2">{errors.condiciones}</p>
            )}
          </div>

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
