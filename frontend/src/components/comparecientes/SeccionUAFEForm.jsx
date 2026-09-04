import { FormField, Card } from "../shared";

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
          <input
            type="text"
            value={get("origenFondos")}
            onChange={(e) => set("origenFondos", e.target.value)}
            className="input-field"
            placeholder="Ej: Ahorros personales, sueldo, herencia"
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
            <FormField label="Años de Trabajo">
              <input
                type="number"
                min="0"
                step="1"
                value={get("pepAniosTrabajo")}
                onChange={(e) => set("pepAniosTrabajo", e.target.value)}
                className="input-field"
              />
            </FormField>
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
          </div>
        )}
      </div>
    </Card>
  );
};

export default SeccionUAFEForm;
