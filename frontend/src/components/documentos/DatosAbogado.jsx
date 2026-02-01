import { useState, useEffect } from 'react';
import { Card, FormField } from '../shared';

const DatosAbogado = ({ onChange }) => {
  const [formData, setFormData] = useState({
    nombreAbogado: '',
    generoAbogado: '',
    tipoMatricula: 'cj',
    provinciaAbogado: '',
    numeroMatricula: ''
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (onChange) {
      onChange(formData);
    }
  }, [formData, onChange]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    let newValue = value;
    if (name === 'nombreAbogado') {
      newValue = value.toUpperCase();
    }
    
    setFormData(prev => {
      const updated = { ...prev, [name]: newValue };
      
      // Limpiar provincia si cambió a 'cj'
      if (name === 'tipoMatricula' && newValue === 'cj') {
        updated.provinciaAbogado = '';
      }
      
      return updated;
    });

    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  return (
    <Card title="Datos del Abogado Patrocinador">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField label="Nombre del Abogado" required error={errors.nombreAbogado}>
          <input
            type="text"
            name="nombreAbogado"
            value={formData.nombreAbogado}
            onChange={handleChange}
            className="input-field uppercase"
            placeholder="NOMBRES Y APELLIDOS"
          />
        </FormField>

        <FormField label="Género" required error={errors.generoAbogado}>
          <select
            name="generoAbogado"
            value={formData.generoAbogado}
            onChange={handleChange}
            className="input-field"
          >
            <option value="">Seleccione género</option>
            <option value="masculino">Masculino</option>
            <option value="femenino">Femenino</option>
          </select>
        </FormField>

        <FormField label="Tipo de Matrícula" required>
          <select
            name="tipoMatricula"
            value={formData.tipoMatricula}
            onChange={handleChange}
            className="input-field"
          >
            <option value="cj">Foro del Consejo de la Judicatura</option>
            <option value="colegio">Colegio de Abogados</option>
          </select>
        </FormField>

        {formData.tipoMatricula === 'colegio' && (
          <FormField label="Provincia del Colegio" required error={errors.provinciaAbogado}>
            <select
              name="provinciaAbogado"
              value={formData.provinciaAbogado}
              onChange={handleChange}
              className="input-field"
            >
              <option value="">Seleccione Provincia</option>
              <option value="Azuay">Azuay</option>
              <option value="Bolívar">Bolívar</option>
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
              <option value="Santo Domingo">Santo Domingo de los Tsáchilas</option>
              <option value="Sucumbíos">Sucumbíos</option>
              <option value="Tungurahua">Tungurahua</option>
              <option value="Zamora Chinchipe">Zamora Chinchipe</option>
            </select>
          </FormField>
        )}

        <FormField label="Número de Matrícula" required error={errors.numeroMatricula}>
          <input
            type="text"
            name="numeroMatricula"
            value={formData.numeroMatricula}
            onChange={handleChange}
            className="input-field"
            placeholder="Ej: 12345"
          />
        </FormField>
      </div>
    </Card>
  );
};

export default DatosAbogado;