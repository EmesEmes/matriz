import React from "react";

const ComparecienteOptions = ({
  user,
  needsConyugue,
  razonExclusionConyugue,
  isNoVidente,
  isAnalfabeta,
  personaConfianzaAnalfabeta,
  personaConfianzaNoVidente,
  hasDiscapacidadIntelectual,
  needsInterpreter,
  nombreInterprete,
  handleConyugueChange,
  handleRazonExclusionChange,
  handleDiscapacidadIntelectualChange,
  handleNoVidenteChange,
  handleAnalfabetaChange,
  handlePersonaConfianzaNoVidenteChange,
  handlePersonaConfianzaAnalfabetaChange,
  handleInterpreterNameChange,
  handleInterpreterChange,
}) => {
  return (
    <div className="bg-blue-50/70 p-6 rounded-xl shadow-inner border-blue-200 space-y-3">
      <h3 className="font-bold text-xl text-blue-800 border-b-2 border-blue-300 pb-2 mb-4">
        Opciones Especiales
      </h3>

      {user.maritalStatus.toLowerCase() === "casado" && (
        <div className="p-3 bg-white rounded-lg border border-gray-100 transition duration-150 hover:border-blue-300 shadow-sm">
          <div className="space-y-3">
            <div className="flex gap-2 items-center">
              <input
                type="checkbox"
                id={`no-conyugue-${user.documentNumber}`}
                checked={needsConyugue}
                onChange={handleConyugueChange}
                className="mt-1 h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 cursor-pointer"
              />
              <label htmlFor={`no-conyugue-${user.documentNumber}`} className="font-medium text-gray-700 cursor-pointer">
                ¿Cónyugue debe comparecer?
              </label>
            </div>

            {!needsConyugue && (
              <div className="ml-7 space-y-2 pt-2 border-t border-gray-100">
                <label className="block text-sm font-medium text-gray-700">
                  Razón de exclusión del cónyuge:
                </label>
                <select
                  value={razonExclusionConyugue}
                  onChange={handleRazonExclusionChange}
                  className="border border-gray-300 rounded-lg px-3 py-2 w-full text-sm  bg-white"
                >
                  <option value="">Seleccione una razón</option>
                  <option value="disolucion">Disolución de sociedad conyugal</option>
                  <option value="capitulacion">Capitulación matrimonial</option>
                  <option value="adquirido_solo">Bien adquirido soltero/viudo/divorciado</option>
                </select>
              </div>
            )}
          </div>
        </div>

      )}
      <div className="p-3 bg-white rounded-lg border border-gray-100 transition duration-150 hover:border-blue-300 shadow-sm">
        <div className="flex gap-2 items-center">
          <input
            type="checkbox"
            id={`discapacidad-${user.documentNumber}`}
            checked={hasDiscapacidadIntelectual}
            onChange={handleDiscapacidadIntelectualChange}
            className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 cursor-pointer"
          />
          <label htmlFor={`discapacidad-${user.documentNumber}`} className="font-medium text-gray-700 cursor-pointer">
            ¿Tiene discapacidad intelectual?
          </label>
        </div>
      </div>

      <div className="p-3 bg-white rounded-lg border border-gray-100 transition duration-150 hover:border-blue-300 shadow-sm">
        <div className="flex flex-col gap-2">
          <div className="flex gap-2 items-center">
            <input
              type="checkbox"
              id={`no-vidente-${user.documentNumber}`}
              checked={isNoVidente}
              onChange={handleNoVidenteChange}
              className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 cursor-pointer"
            />
            <label htmlFor={`no-vidente-${user.documentNumber}`} className="font-medium text-gray-700 cursor-pointer">
              ¿Es No vidente?
            </label>
          </div>
          {isNoVidente && (
            <input
              type="text"
              placeholder="Nombre de persona de confianza"
              className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-blue-500 focus:border-blue-500 w-full uppercase"
              value={personaConfianzaNoVidente}
              onChange={(e) =>
                handlePersonaConfianzaNoVidenteChange(e.target.value)
              }
            />
          )}
        </div>
      </div>
      
      <div className="p-3 bg-white rounded-lg border border-gray-100 transition duration-150 hover:border-blue-300 shadow-sm">
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id={`analfabeta-${user.documentNumber}`}
              checked={isAnalfabeta}
              onChange={handleAnalfabetaChange}
              className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 cursor-pointer"
            />
            <label htmlFor={`analfabeta-${user.documentNumber}`} className="font-medium text-gray-700 cursor-pointer">
              ¿Es analfabeta?
            </label> 
          </div>

          {isAnalfabeta && (
            <input
              type="text"
              placeholder="Nombre de persona de confianza"
              className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-blue-500 focus:border-blue-500 w-full uppercase"
              value={personaConfianzaAnalfabeta}
              onChange={(e) =>
                handlePersonaConfianzaAnalfabetaChange(e.target.value)
              }
            />
          )}
        </div>
      </div>
      
      <div className="p-3 bg-white rounded-lg border border-gray-100 transition duration-150 hover:border-blue-300 shadow-sm">
        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            id={`interpreter-${user.documentNumber}`}
            checked={needsInterpreter}
            onChange={handleInterpreterChange}
            className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 cursor-pointer"
          />
          <label htmlFor={`interpreter-${user.documentNumber}`} className="font-medium text-gray-700 cursor-pointer">
            ¿No habla español? (Requiere Intérprete)
          </label>
        </div>

        {needsInterpreter && (
          <div className="mt-4 space-y-2">
            <input
              type="text"
              placeholder="Nombre del intérprete"
              value={nombreInterprete}
              onChange={(e) => handleInterpreterNameChange(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-blue-500 focus:border-blue-500 w-full uppercase"
            />

            {/* <select
              name="genero"
              value={interpreter.genero}
              onChange={handleInterpreterChange}
              className="border rounded px-2 py-1 w-full"
            >
              <option value="">Seleccione género</option>
              <option value="femenino">Femenino</option>
              <option value="masculino">Masculino</option>
            </select>

            <input
              type="text"
              name="nacionalidad"
              placeholder="Nacionalidad"
              value={interpreter.nacionalidad}
              onChange={handleInterpreterChange}
              className="border rounded px-2 py-1 w-full"
            />

            <input
              type="text"
              name="tipoDocumento"
              placeholder="Tipo de documento"
              value={interpreter.tipoDocumento}
              onChange={handleInterpreterChange}
              className="border rounded px-2 py-1 w-full"
            />

            <input
              type="text"
              name="numeroDocumento"
              placeholder="Número de documento"
              value={interpreter.numeroDocumento}
              onChange={handleInterpreterChange}
              className="border rounded px-2 py-1 w-full"
            /> */}
          </div>
        )}
      </div>
    </div>
  );
};

export default ComparecienteOptions;
