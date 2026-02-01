import { useState } from 'react';
import { Search } from 'lucide-react';
import { Button, FormField } from '../shared';
import { validarCedula } from '../../utils/validarCedula';

const ComparecienteSearch = ({ onSearch, loading }) => {
  const [documentNumber, setDocumentNumber] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    if (!documentNumber.trim()) {
      setError('Ingrese un número de cédula');
      return;
    }

    if (!validarCedula(documentNumber)) {
      setError('Cédula inválida');
      return;
    }

    onSearch(documentNumber);
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-3 items-end">
      <FormField 
        label="Número de Cédula" 
        error={error}
        className="flex-1"
      >
        <input
          type="text"
          value={documentNumber}
          onChange={(e) => {
            setDocumentNumber(e.target.value);
            setError('');
          }}
          className="input-field"
          placeholder="Ej: 1234567890"
          maxLength="10"
          disabled={loading}
        />
      </FormField>
      
      <Button
        type="submit"
        variant="primary"
        icon={<Search className="w-5 h-5" />}
        loading={loading}
        disabled={loading}
      >
        Buscar
      </Button>
    </form>
  );
};

export default ComparecienteSearch;