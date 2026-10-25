import { FormField, Card } from "../shared";

const TIPOS_INMUEBLE = {
  casa: "Casa",
  terreno: "Terreno",
  solar: "Solar",
  departamento: "Departamento",
  suite: "Suite",
  oficina: "Oficina",
};

/** "¿Ya no ejerce el cargo?" + fecha de finalización */
const CamposFinCargo = ({ get, set }) => {
  const yaNoEjerce = get("pepYaNoEjerce") === true;
  return (
    <>
      <FormField label="¿Ya no ejerce el cargo?">
        <label className="flex items-center gap-2 mt-2 text-sm">
          <input
            type="checkbox"
            checked={yaNoEjerce}
            onChange={(e) => {
              set("pepYaNoEjerce", e.target.checked);
              if (!e.target.checked) set("pepFechaFin", "");
            }}
          />
          Ya no desempeña el cargo
        </label>
      </FormField>
      {yaNoEjerce && (
        <FormField label="Fecha de finalización del cargo">
          <input
            type="date"
            value={get("pepFechaFin")}
            onChange={(e) => set("pepFechaFin", e.target.value)}
            className="input-field"
          />
        </FormField>
      )}
    </>
  );
};

const formatoValor = (v) =>
  v === "" || v === null || v === undefined
    ? ""
    : `$${Number(v).toLocaleString("es-EC")}`;

/** Situación patrimonial declarada en el formulario público (solo lectura). */
export const ResumenPatrimonio = ({ patrimonio, nota = true }) => {
  if (!patrimonio || typeof patrimonio !== "object") return null;
  const p = patrimonio;
  // Formato anterior: inmuebles como lista de tipos y vehículos como texto
  const inmuebles = (p.inmuebles || []).map((i) =>
    typeof i === "string" ? { tipo: i } : i,
  );
  const vehiculos = Array.isArray(p.vehiculos)
    ? p.vehiculos
    : p.vehiculos
      ? [{ marca: p.vehiculos }]
      : [];

  const titulo = (texto) => (
    <p className="font-medium text-gray-700 mt-2">{texto}</p>
  );

  return (
    <div className="col-span-2 mt-2 p-3 bg-white border border-gray-200 rounded-lg text-sm">
      <p className="font-semibold text-gray-800">
        Situación patrimonial (declarada por el cliente)
      </p>

      {titulo("Inmuebles")}
      {p.no_posee_inmuebles || inmuebles.length === 0 ? (
        <p className="text-gray-600">No posee</p>
      ) : (
        <ul className="list-disc pl-5 text-gray-800">
          {inmuebles.map((i, idx) => (
            <li key={idx}>
              {TIPOS_INMUEBLE[i.tipo] || i.tipo}
              {i.ciudad && ` en ${i.ciudad}`}
              {i.valor !== undefined &&
                i.valor !== "" &&
                ` — ${formatoValor(i.valor)}`}
            </li>
          ))}
        </ul>
      )}
      {/* Datos del formato anterior */}
      {p.ciudades_inmuebles && (
        <p className="text-gray-600">Ciudades: {p.ciudades_inmuebles}</p>
      )}
      {p.valor_inmuebles && (
        <p className="text-gray-600">
          Valoración total: {formatoValor(p.valor_inmuebles)}
        </p>
      )}

      {titulo("Vehículos")}
      {p.no_posee_vehiculos || vehiculos.length === 0 ? (
        <p className="text-gray-600">No posee</p>
      ) : (
        <ul className="list-disc pl-5 text-gray-800">
          {vehiculos.map((v, idx) => (
            <li key={idx}>
              {[v.marca, v.modelo].filter(Boolean).join(" ")}
              {v.placa && ` — placa ${v.placa}`}
              {v.valor !== undefined &&
                v.valor !== "" &&
                ` — ${formatoValor(v.valor)}`}
            </li>
          ))}
        </ul>
      )}
      {p.valor_vehiculos && (
        <p className="text-gray-600">
          Valoración total: {formatoValor(p.valor_vehiculos)}
        </p>
      )}

      {titulo("Inversiones, pólizas, fondos o fideicomisos")}
      <p className="text-gray-800">
        {p.no_posee_inversiones || !p.inversiones ? "No posee" : p.inversiones}
      </p>

      {nota && (
        <p className="text-xs text-gray-500 pt-2">
          Se edita desde el formulario de registro del cliente.
        </p>
      )}
    </div>
  );
};

/**
 * Sección de datos UAFE reutilizable — para el compareciente principal o su cónyuge.
 * El padre controla dónde viven los valores mediante get/set, así este componente
 * no necesita saber si está editando `formData.x` o `formData.partnerX`.
 */
const SeccionUAFEForm = ({
  titulo = "Información UAFE (opcional)",
  descripcion = "Estos datos son requeridos para el cumplimiento de la Ley de Prevención de Lavado de Activos. No son necesarios para generar minutas o matrices.",
  get,
  set,
}) => {
  const actividadEconomica = get("actividadEconomica");
  const esPep = get("esPep");
  const esPepIndirecto = get("esPepIndirecto");

  return (
    <Card title={titulo}>
      <p className="text-sm text-gray-500 mb-4">{descripcion}</p>

      <div className="grid grid-cols-2 gap-4">
        <FormField label="Actividad Económica">
          <select
            value={actividadEconomica}
            onChange={(e) => set("actividadEconomica", e.target.value)}
            className="input-field"
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
        </FormField>

        <FormField label="Ingreso Mensual (USD)">
          <input
            type="number"
            value={get("ingresoMensual")}
            onChange={(e) => set("ingresoMensual", e.target.value)}
            className="input-field"
            min="0"
            step="0.01"
            placeholder="Ej: 1500"
          />
        </FormField>

        {(actividadEconomica === "empleado" ||
          actividadEconomica === "independiente") && (
          <FormField
            label="Empresa o Institución de Trabajo"
            className="col-span-2"
          >
            <input
              type="text"
              value={get("empresaTrabajo")}
              onChange={(e) => set("empresaTrabajo", e.target.value)}
              className="input-field"
              placeholder="Ej: Empresa XYZ S.A."
            />
          </FormField>
        )}

        <FormField label="Origen de los Fondos" className="col-span-2">
          <textarea
            rows={2}
            value={get("origenFondos")}
            onChange={(e) => set("origenFondos", e.target.value)}
            className="input-field"
            placeholder="Ej: Ahorro; Venta de propiedad (casa en Cumbayá, vendida hace 2 años, precio de venta $80000)"
          />
        </FormField>
      </div>

      {/* PEP */}
      <div className="mt-4 space-y-3">
        <FormField label="¿Es Persona Políticamente Expuesta (PEP)?">
          <div className="flex gap-3 mt-1">
            {["si", "no"].map((v) => (
              <button
                key={v}
                type="button"
                onClick={() => {
                  set("esPep", v);
                  set("esPepIndirecto", "");
                }}
                className={`px-4 py-1.5 rounded-lg text-sm font-medium ${
                  esPep === v
                    ? "bg-blue-600 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                {v === "si" ? "Sí" : "No"}
              </button>
            ))}
          </div>
        </FormField>

        {esPep === "si" && (
          <div className="grid grid-cols-2 gap-4 p-4 bg-amber-50 border border-amber-200 rounded-lg">
            <FormField label="Institución" className="col-span-2">
              <input
                type="text"
                value={get("pepInstitucion")}
                onChange={(e) => set("pepInstitucion", e.target.value)}
                className="input-field"
                placeholder="Ej: Ministerio de Finanzas"
              />
            </FormField>
            <FormField label="Cargo">
              <input
                type="text"
                value={get("pepCargo")}
                onChange={(e) => set("pepCargo", e.target.value)}
                className="input-field"
                placeholder="Ej: Director General"
              />
            </FormField>
            <FormField label="Fecha de Inicio">
              <input
                type="date"
                value={get("pepFechaInicio")}
                onChange={(e) => set("pepFechaInicio", e.target.value)}
                className="input-field"
              />
            </FormField>
            <CamposFinCargo get={get} set={set} />
            <ResumenPatrimonio patrimonio={get("patrimonio")} />
          </div>
        )}

        {esPep === "no" && (
          <FormField label="¿Es pariente, amigo o colaborador de un PEP?">
            <div className="flex gap-3 mt-1">
              {["si", "no"].map((v) => (
                <button
                  key={v}
                  type="button"
                  onClick={() => set("esPepIndirecto", v)}
                  className={`px-4 py-1.5 rounded-lg text-sm font-medium ${
                    esPepIndirecto === v
                      ? "bg-blue-600 text-white"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  {v === "si" ? "Sí" : "No"}
                </button>
              ))}
            </div>
          </FormField>
        )}

        {esPep === "no" && esPepIndirecto === "si" && (
          <div className="grid grid-cols-2 gap-4 p-4 bg-orange-50 border border-orange-200 rounded-lg">
            <FormField label="Nombre del PEP" className="col-span-2">
              <input
                type="text"
                value={get("pepNombre")}
                onChange={(e) => set("pepNombre", e.target.value)}
                className="input-field"
                placeholder="Nombre completo del PEP"
              />
            </FormField>
            <FormField label="Institución del PEP" className="col-span-2">
              <input
                type="text"
                value={get("pepInstitucion")}
                onChange={(e) => set("pepInstitucion", e.target.value)}
                className="input-field"
              />
            </FormField>
            <FormField label="Cargo del PEP">
              <input
                type="text"
                value={get("pepCargo")}
                onChange={(e) => set("pepCargo", e.target.value)}
                className="input-field"
              />
            </FormField>
            <FormField label="Grado de Relación">
              <input
                type="text"
                value={get("pepGradoRelacion")}
                onChange={(e) => set("pepGradoRelacion", e.target.value)}
                className="input-field"
                placeholder="Ej: Primer grado de consanguinidad"
              />
            </FormField>
            <FormField label="Tipo de relación con el PEP">
              <input
                type="text"
                value={get("pepRelacionTipo")}
                onChange={(e) => set("pepRelacionTipo", e.target.value)}
                className="input-field"
                placeholder="Ej: Hermano, colaborador, amigo"
              />
            </FormField>
            <FormField label="Fecha de inicio del cargo">
              <input
                type="date"
                value={get("pepFechaInicio")}
                onChange={(e) => set("pepFechaInicio", e.target.value)}
                className="input-field"
              />
            </FormField>
            <CamposFinCargo get={get} set={set} />
            <ResumenPatrimonio patrimonio={get("patrimonio")} />
          </div>
        )}
      </div>
    </Card>
  );
};

export default SeccionUAFEForm;
