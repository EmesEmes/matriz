import TextNumberTransformer from "../minute/Minute";

const MinutaForm = ({ value, onChange }) => {
  const tipoMatricula = value.tipoMatricula || "cj";

  const handleInputChange = (e) => {
    const { name, value: val } = e.target;

    let newVal = val
    if (name === 'nombreAbogado') {
      newVal = val.toUpperCase()
    }

    onChange((prev) => ({
      ...prev,
      [name]: newVal,
    }));
  };

  const handleMinutaTextChange = (plainText) => {
    onChange((prev) => ({
      ...prev,
      minutaTexto: plainText,
    }));
  };

  return (
    <div className="py-6 bg-white">
      <div className="flex flex-col gap-5">
        <div className="mb-2">
          <TextNumberTransformer onChange={handleMinutaTextChange} />
        </div>

        <div className="mt-4 pt-4 border-t border-gray-100">
          <h4 className="text-xl font-bold mb-3 text-gray-700">
            Datos del Abogado
          </h4>
        </div>
        <div className="flex flex-col">
          <label
            htmlFor="nombreAbogado"
            className="text-sm font-medium text-gray-700 mb-1"
          >
            Nombre del abogado patrocinador:
          </label>
          <input
            id="nombreAbogado"
            type="text"
            name="nombreAbogado"
            value={value.nombreAbogado || ""}
            onChange={handleInputChange}
            className="p-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 transition duration-150 uppercase"
            required
          />
        </div>
        <div className="flex flex-col">
          <label
            htmlFor="generoAbogado"
            className="text-sm font-medium text-gray-700 mb-1"
          >
            Género:
          </label>
          <select
            id="generoAbogado"
            name="generoAbogado"
            value={value.generoAbogado || ""}
            onChange={handleInputChange}
            className="p-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 bg-white transition duration-150"
          >
            <option value="">Seleccione género</option>
            <option value="masculino">Masculino</option>
            <option value="femenino">Femenino</option>
          </select>
        </div>
        <div className="flex flex-col">
          <label
            htmlFor="tipoMatricula"
            className="text-sm font-medium text-gray-700 mb-1"
          >
            Tipo de Matrícula:
          </label>
          <select
            id="tipoMatricula"
            name="tipoMatricula"
            value={tipoMatricula}
            onChange={handleInputChange}
            className="p-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 bg-white transition duration-150"
          >
            <option value="cj">Foro del Consejo de la Judicatura</option>
            <option value="colegio">Colegio de Abogados</option>
          </select>
        </div>
        {tipoMatricula === "colegio" && (
          <div className="flex flex-col">
            <label
              htmlFor="provincia"
              className="text-sm font-medium text-gray-700 mb-1"
            >
              Provincia del Colegio:
            </label>
            <select
              id="provincia"
              name="provinciaAbogado"
              value={value.provinciaAbogado || ""}
              onChange={handleInputChange}
              className="p-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 bg-white transition duration-150"
            >
              <option value="">Seleccione Provincia</option>
              <option value="Azuay">Azuay</option>
              <option value="Bolivar">Bolívar</option>
              <option value="Cañar">Cañar</option>
              <option value="Carchi">Carchi</option>
              <option value="Chimborazo">Chimborazo</option>
              <option value="Cotopaxi">Cotopaxi</option>
              <option value="El Oro">El Oro</option>
              <option value="Esmeraldas">Esmeraldas</option>
              <option value="Galápagos">Galápagos</option>
              <option value="Guayas">Guayas</option>
              <option value="Imbabura">Imbabura</option>
              <option value="Loja">Loja</option>
              <option value="Los Ríos">Los Ríos</option>
              <option value="Manabí">Manabí</option>
              <option value="Morona Santiago">Morona Santiago</option>
              <option value="Napo">Napo</option>
              <option value="Orellana">Orellana</option>
              <option value="Pastaza">Pastaza</option>
              <option value="Pichincha">Pichincha</option>
              <option value="Santa Elena">Santa Elena</option>
              <option value="Santo Domingo">
                Santo Domingo de los Tsáchilas
              </option>
              <option value="Sucumbíos">Sucumbíos</option>
              <option value="Tungurahua">Tungurahua</option>
              <option value="Zamora Chinchipe">Zamora Chinchipe</option>
            </select>
          </div>
        )}
        <div className="flex flex-col">
          <label
            htmlFor="numeroMatricula"
            className="text-sm font-medium text-gray-700 mb-1"
          >
            Número de Matrícula:
          </label>
          <input
            id="numeroMatricula"
            type="text"
            name="numeroMatricula"
            value={value.numeroMatricula || ""}
            onChange={handleInputChange}
            placeholder="Número de matrícula"
            className="p-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 bg-white transition duration-150"
          />
        </div>
      </div>
    </div>
  );
};

export default MinutaForm;
