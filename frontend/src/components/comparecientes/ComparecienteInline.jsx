import { useState } from 'react';
import { Card, Button } from '../shared';
import ComparecienteSearch from './ComparecienteSearch';
import ComparecienteForm from './ComparecienteForm';
import ComparecienteCard from './ComparecienteCard';
import ComparecienteOptions from './ComparecienteOptions';
import { apiFetch } from '../../config/api';
import API_CONFIG from '../../config/api';
import { useToast } from '../../hooks/useToast';
import { transformToCamelCase } from '../../utils/transformPartyData';
import { Edit, CheckCircle, PlusCircle } from 'lucide-react';

const ComparecienteInline = ({ title, onComparecienteReady }) => {
  const [mode, setMode] = useState('search');
  const [loading, setLoading] = useState(false);
  const [compareciente, setCompareciente] = useState(null);
  const [opcionesEspeciales, setOpcionesEspeciales] = useState({
    conyugueComparece: true,
    razonExclusionConyugue: '',
    hasDiscapacidadIntelectual: false,
    tipoDiscapacidad: '',
    isNoVidente: false,
    personaConfianzaNoVidente: '',
    isAnalfabeta: false,
    personaConfianzaAnalfabeta: '',
    needsInterpreter: false,
    generoInterprete: '',
    cedulaInterprete: '',
    nombreInterprete: '',
    idiomaInterprete: ''
  });
  const toast = useToast();

  const notifyParent = (comp, opciones) => {
    if (onComparecienteReady) {
      onComparecienteReady({
        ...comp,
        ...opciones
      });
    }
  };

  const handleSearch = async (documentNumber) => {
    setLoading(true);
    try {
      const response = await apiFetch(
        `${API_CONFIG.ENDPOINTS.PARTIES}/${documentNumber}`
      );

      if (response.ok) {
        const data = await response.json();
        const transformed = transformToCamelCase(data);
        setCompareciente(transformed);
        setMode('selected');
        
        // Inicializar opciones según el estado civil
        const nuevasOpciones = {
          ...opcionesEspeciales,
          estadoCivil: transformed.maritalStatus
        };
        setOpcionesEspeciales(nuevasOpciones);
        notifyParent(transformed, nuevasOpciones);
        
        toast.success('Compareciente encontrado');
      } else if (response.status === 404) {
        toast.info('Compareciente no encontrado. Crear uno nuevo.');
        setCompareciente(null);
        setMode('create');
      } else {
        const errorData = await response.json();
        toast.error(errorData.detail || 'Error al buscar');
      }
    } catch (error) {
      console.error('Error:', error);
      toast.error('Error al buscar compareciente');
    } finally {
      setLoading(false);
    }
  };

  const handleSuccess = (data) => {
    const transformed = transformToCamelCase(data);
    setCompareciente(transformed);
    setMode('selected');
    
    const nuevasOpciones = {
      ...opcionesEspeciales,
      estadoCivil: transformed.maritalStatus
    };
    setOpcionesEspeciales(nuevasOpciones);
    notifyParent(transformed, nuevasOpciones);
    
    toast.success('Compareciente guardado exitosamente');
  };

  const handleOpcionesChange = (nuevasOpciones) => {
    setOpcionesEspeciales(nuevasOpciones);
    if (compareciente) {
      notifyParent(compareciente, nuevasOpciones);
    }
  };

  const handleEdit = () => {
    setMode('edit');
  };

  const handleCancelEdit = () => {
    setMode('selected');
  };

  const handleChangeCompareciente = () => {
    setCompareciente(null);
    setOpcionesEspeciales({
      conyugueComparece: true,
      razonExclusionConyugue: '',
      hasDiscapacidadIntelectual: false,
      tipoDiscapacidad: '',
      isNoVidente: false,
      personaConfianzaNoVidente: '',
      isAnalfabeta: false,
      personaConfianzaAnalfabeta: '',
      needsInterpreter: false,
      nombreInterprete: '',
      generoInterprete: '',
      cedulaInterprete: '',
      idiomaInterprete: ''
    });
    setMode('search');
    if (onComparecienteReady) {
      onComparecienteReady(null);
    }
  };

  return (
    <Card title={title}>
      {/* MODO BÚSQUEDA */}
      {mode === 'search' && (
        <div className="space-y-4">
          <ComparecienteSearch
            onSearch={handleSearch}
            loading={loading}
          />
          
          <div className="text-center">
            <p className="text-sm text-gray-600 mb-2">o</p>
            <Button
              variant="outline"
              icon={<PlusCircle className="w-5 h-5" />}
              onClick={() => setMode('create')}
            >
              Crear Nuevo Compareciente
            </Button>
          </div>
        </div>
      )}

      {/* MODO CREAR */}
      {mode === 'create' && (
        <ComparecienteForm
          onSuccess={handleSuccess}
          onCancel={() => setMode('search')}
        />
      )}

      {/* MODO EDITAR */}
      {mode === 'edit' && (
        <ComparecienteForm
          initialData={compareciente}
          onSuccess={handleSuccess}
          onCancel={handleCancelEdit}
        />
      )}

      {/* MODO SELECCIONADO */}
      {mode === 'selected' && compareciente && (
        <div className="space-y-4">
          <div className="flex items-center gap-2 p-3 bg-green-50 border border-green-200 rounded-lg">
            <CheckCircle className="w-5 h-5 text-green-600 shrink-0" />
            <span className="text-sm font-medium text-green-800 flex-1">
              Compareciente seleccionado
            </span>
          </div>

          <ComparecienteCard
            data={compareciente}
            showPartner={true}
          />

          {/* OPCIONES ESPECIALES */}
          <ComparecienteOptions
            options={opcionesEspeciales}
            onChange={handleOpcionesChange}
          />

          <div className="flex gap-3">
            <Button
              variant="secondary"
              icon={<Edit className="w-5 h-5" />}
              onClick={handleEdit}
            >
              Editar
            </Button>
            <Button
              variant="outline"
              onClick={handleChangeCompareciente}
            >
              Cambiar Compareciente
            </Button>
          </div>
        </div>
      )}
    </Card>
  );
};

export default ComparecienteInline;