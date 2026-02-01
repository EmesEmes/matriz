import { FormField } from '../shared';

const ComparecienteOptions = ({ options, onChange }) => {
  const handleChange = (field, value) => {
    onChange({ ...options, [field]: value });
  };

  return (
    <div className="bg-blue-50 p-4 rounded-lg border border-blue-200 space-y-3">
      <h4 className="font-semibold text-blue-900">Opciones Especiales</h4>

      {/* Cónyuge no comparece */}
      {options.estadoCivil === 'casado' && (
        <div className="space-y-2">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={!options.conyugueComparece}
              onChange={(e) => handleChange('conyugueComparece', !e.target.checked)}
              className="w-4 h-4 text-blue-600 rounded"
            />
            <span className="text-sm font-medium text-gray-700">
              Cónyuge no comparece
            </span>
          </label>

          {!options.conyugueComparece && (
            <FormField label="Razón de exclusión">
              <select
                value={options.razonExclusionConyugue || ''}
                onChange={(e) => handleChange('razonExclusionConyugue', e.target.value)}
                className="input-field text-sm"
              >
                <option value="">Seleccione una razón</option>
                <option value="disolucion">Disolución de sociedad conyugal</option>
                <option value="capitulacion">Capitulación matrimonial</option>
                <option value="adquirido_solo">Bien adquirido soltero/viudo/divorciado</option>
              </select>
            </FormField>
          )}
        </div>
      )}

      {/* Discapacidad Intelectual */}
      <div className="space-y-2">
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={options.hasDiscapacidadIntelectual || false}
            onChange={(e) => handleChange('hasDiscapacidadIntelectual', e.target.checked)}
            className="w-4 h-4 text-blue-600 rounded"
          />
          <span className="text-sm font-medium text-gray-700">
            Tiene discapacidad intelectual
          </span>
        </label>

        {options.hasDiscapacidadIntelectual && (
          <FormField label="Tipo de discapacidad">
            <input
              type="text"
              value={options.tipoDiscapacidad || ''}
              onChange={(e) => handleChange('tipoDiscapacidad', e.target.value.toUpperCase())}
              className="input-field text-sm uppercase"
              placeholder="Ej: INTELECTUAL LEVE"
            />
          </FormField>
        )}
      </div>

      {/* No Vidente */}
      <div className="space-y-2">
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={options.isNoVidente || false}
            onChange={(e) => handleChange('isNoVidente', e.target.checked)}
            className="w-4 h-4 text-blue-600 rounded"
          />
          <span className="text-sm font-medium text-gray-700">
            Es no vidente
          </span>
        </label>

        {options.isNoVidente && (
          <FormField label="Persona de confianza">
            <input
              type="text"
              value={options.personaConfianzaNoVidente || ''}
              onChange={(e) => handleChange('personaConfianzaNoVidente', e.target.value.toUpperCase())}
              className="input-field text-sm uppercase"
              placeholder="NOMBRE COMPLETO"
            />
          </FormField>
        )}
      </div>

      {/* Analfabeta */}
      <div className="space-y-2">
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={options.isAnalfabeta || false}
            onChange={(e) => handleChange('isAnalfabeta', e.target.checked)}
            className="w-4 h-4 text-blue-600 rounded"
          />
          <span className="text-sm font-medium text-gray-700">
            Es analfabeta
          </span>
        </label>

        {options.isAnalfabeta && (
          <FormField label="Persona de confianza">
            <input
              type="text"
              value={options.personaConfianzaAnalfabeta || ''}
              onChange={(e) => handleChange('personaConfianzaAnalfabeta', e.target.value.toUpperCase())}
              className="input-field text-sm uppercase"
              placeholder="NOMBRE COMPLETO"
            />
          </FormField>
        )}
      </div>

      {/* Intérprete */}
      <div className="space-y-2">
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={options.needsInterpreter || false}
            onChange={(e) => handleChange('needsInterpreter', e.target.checked)}
            className="w-4 h-4 text-blue-600 rounded"
          />
          <span className="text-sm font-medium text-gray-700">
            Requiere intérprete (no habla español)
          </span>
        </label>

        {options.needsInterpreter && (
          <div className="pl-6 space-y-3 pt-2 border-l-2 border-blue-200">
            <FormField label="Nombre del intérprete" required>
              <input
                type="text"
                value={options.nombreInterprete || ''}
                onChange={(e) => handleChange('nombreInterprete', e.target.value.toUpperCase())}
                className="input-field text-sm uppercase"
                placeholder="NOMBRE COMPLETO"
              />
            </FormField>

            <div className="grid grid-cols-2 gap-3">
              <FormField label="Género" required>
                <select
                  value={options.generoInterprete || ''}
                  onChange={(e) => handleChange('generoInterprete', e.target.value)}
                  className="input-field text-sm"
                >
                  <option value="">Seleccione</option>
                  <option value="masculino">Masculino</option>
                  <option value="femenino">Femenino</option>
                </select>
              </FormField>

              <FormField label="Cédula" required>
                <input
                  type="text"
                  value={options.cedulaInterprete || ''}
                  onChange={(e) => handleChange('cedulaInterprete', e.target.value)}
                  className="input-field text-sm"
                  placeholder="1234567890"
                  maxLength="10"
                />
              </FormField>
            </div>

            <FormField label="Idioma" required>
              <input
                type="text"
                value={options.idiomaInterprete || ''}
                onChange={(e) => handleChange('idiomaInterprete', e.target.value)}
                className="input-field text-sm"
                placeholder="Ej: Inglés, Francés, etc."
              />
            </FormField>
          </div>
        )}
      </div>
    </div>
  );
};

export default ComparecienteOptions;