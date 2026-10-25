import { useState, useEffect } from "react";

const NOTARIOS = {
  "alex-mejia": {
    nombre: "ALEX DAVID MEJÍA VITERI",
    titulo: "Notario Público Vigésimo Segundo del Cantón Quito",
  },
  "cristiana-casa": {
    nombre: "CRISTINA ELIZABETH CASA LLUMIQUINGA",
    titulo: "Notaria Pública Suplente Vigésima Segunda del Cantón Quito",
  },
};

const MATRIZADORES = [
  { value: "M.V.S", label: "Mariela Vera" },
  { value: "A.C", label: "Andrés Chiriboga" },
  { value: "R.G", label: "Roberto Gabela" },
  { value: "M.D.M", label: "Martha Donoso" },
  { value: "C.C", label: "Cristiana Casa" },
  { value: "S.R.L.B", label: "Paúl Robalino" },
  { value: "A.M.V", label: "Alex Mejía" },
];

const InputStyle =
  "mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2 border";

const Field = ({ label, children, className = "" }) => (
  <div className={`flex flex-col gap-1 ${className}`}>
    <label className="text-sm font-medium text-gray-700">{label}</label>
    {children}
  </div>
);

const MatrizForm = ({ onChange }) => {
  const [newConcuerdo, setNewConcuerdo] = useState(false);
  const [form, setForm] = useState({
    numeroProtocolo: "",
    tipoContrato: "compraventa",
    cuantia: "",
    notarioKey: "",
    matrizador: "",
    fechaEscritura: new Date().toISOString().split("T")[0],
    nuevoConcuerdo: {
      numeroProtocolo: "",
      names: "",
      lastNames: "",
      documentNumber: "",
      fecha: new Date().toISOString().split("T")[0],
    },
  });

  useEffect(() => {
    const notario = NOTARIOS[form.notarioKey] || null;
    onChange &&
      onChange({
        ...form,
        notario,
        needsConcuerdo: newConcuerdo,
      });
  }, [form, onChange, newConcuerdo]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleConcuerdoChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      nuevoConcuerdo: {
        ...prev.nuevoConcuerdo,
        [name]: value,
      },
    }));
  };

  const handleToggleConcuerdo = () => {
    setNewConcuerdo((prev) => {
      const newState = !prev;
      if (!newState) {
        setForm((currentForm) => ({
          ...currentForm,
          nuevoConcuerdo: {
            numeroProtocolo: "",
            names: "",
            lastNames: "",
            documentNumber: "",
            fecha: new Date().toISOString().split("T")[0],
          },
        }));
      }
      return newState;
    });
  };

  return (
    <div className="space-y-5 p-4 rounded-lg shadow-md bg-white">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Field label="Notario">
          <select
            name="notarioKey"
            value={form.notarioKey}
            onChange={handleChange}
            className={InputStyle}
          >
            <option value="">Seleccione un notario</option>
            <option value="alex-mejia">ALEX DAVID MEJÍA VITERI</option>
            <option value="cristiana-casa">
              CRISTINA ELIZABETH CASA LLUMIQUINGA
            </option>
          </select>
        </Field>

        <Field label="Matrizador">
          <select
            name="matrizador"
            value={form.matrizador}
            onChange={handleChange}
            className={InputStyle}
          >
            <option value="">Seleccione un matrizador</option>
            {MATRIZADORES.map((m) => (
              <option key={m.value} value={m.value}>
                {m.label}
              </option>
            ))}
          </select>
        </Field>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Field label="Número de Protocolo">
          <input
            className={InputStyle}
            placeholder="Número de protocolo"
            type="text"
            name="numeroProtocolo"
            value={form.numeroProtocolo}
            onChange={handleChange}
            required
          />
        </Field>

        <Field label="Tipo de Contrato">
          <select
            name="tipoContrato"
            value={form.tipoContrato}
            onChange={handleChange}
            className={InputStyle}
          >
            <option value="compraventa">Compraventa</option>
          </select>
        </Field>

        <Field label="Cuantía">
          <input
            type="number"
            name="cuantia"
            value={form.cuantia}
            onChange={handleChange}
            className={InputStyle}
            required
          />
        </Field>

        <Field label="Fecha de la Escritura">
          <input
            type="date"
            name="fechaEscritura"
            value={form.fechaEscritura}
            onChange={handleChange}
            className={InputStyle}
            required
          />
        </Field>
      </div>

      {newConcuerdo && (
        <div className="border border-blue-200 p-4 rounded-md bg-blue-50 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Field label="N° Protocolo" className="col-span-1">
              <input
                className={InputStyle}
                placeholder="Protocolo"
                type="text"
                name="numeroProtocolo"
                value={form.nuevoConcuerdo.numeroProtocolo}
                onChange={handleConcuerdoChange}
                required={newConcuerdo}
              />
            </Field>
            <Field label="Fecha de la Solicitud" className="col-span-1">
              <input
                type="date"
                name="fecha"
                value={form.nuevoConcuerdo.fecha}
                onChange={handleConcuerdoChange}
                className={InputStyle}
                required={newConcuerdo}
              />
            </Field>
            <div className="md:col-span-2"></div> {/* Espaciador */}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Field label="Nombres del Solicitante">
              <input
                className={InputStyle}
                placeholder="Nombres Completos"
                type="text"
                name="names"
                value={form.nuevoConcuerdo.names}
                onChange={handleConcuerdoChange}
                required={newConcuerdo}
              />
            </Field>

            <Field label="Apellidos del Solicitante">
              <input
                className={InputStyle}
                placeholder="Apellidos Completos"
                type="text"
                name="lastNames"
                value={form.nuevoConcuerdo.lastNames}
                onChange={handleConcuerdoChange}
                required={newConcuerdo}
              />
            </Field>

            <Field label="Documento del Solicitante">
              <input
                className={InputStyle}
                placeholder="CI o Pasaporte"
                type="text"
                name="documentNumber"
                value={form.nuevoConcuerdo.documentNumber}
                onChange={handleConcuerdoChange}
                required={newConcuerdo}
              />
            </Field>
          </div>
        </div>
      )}
    </div>
  );
};

export default MatrizForm;
