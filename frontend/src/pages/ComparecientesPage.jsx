import { useState } from 'react';
import { Button } from '../components/shared';
import ComparecienteSearch from '../components/comparecientes/ComparecienteSearch';
import ComparecienteForm from '../components/comparecientes/ComparecienteForm';
import ComparecienteCard from '../components/comparecientes/ComparecienteCard';
import { apiFetch } from '../config/api';
import API_CONFIG from '../config/api';
import { useToast } from '../hooks/useToast';
import { transformToCamelCase } from '../utils/transformPartyData';
import { Plus, Edit, ArrowLeft } from 'lucide-react';

const ComparecientesPage = () => {
  const [view, setView] = useState('search'); // 'search' | 'create' | 'edit' | 'view'
  const [loading, setLoading] = useState(false);
  const [currentCompareciente, setCurrentCompareciente] = useState(null);
  const toast = useToast();

  const handleSearch = async (documentNumber) => {
    setLoading(true);
    try {
      const response = await apiFetch(
        `${API_CONFIG.ENDPOINTS.PARTIES}/${documentNumber}`
      );

      if (response.ok) {
        const data = await response.json();
        const transformed = transformToCamelCase(data);
        setCurrentCompareciente(transformed);
        setView('view');
      } else if (response.status === 404) {
        toast.info('Compareciente no encontrado. Puede crear uno nuevo.');
        setCurrentCompareciente(null);
      } else {
        const errorData = await response.json();
        toast.error(errorData.detail || 'Error al buscar compareciente');
      }
    } catch (error) {
      console.error('Error:', error);
      toast.error('Error al buscar compareciente');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateNew = () => {
    setCurrentCompareciente(null);
    setView('create');
  };

  const handleEdit = () => {
    setView('edit');
  };

  const handleSuccess = (data) => {
    const transformed = transformToCamelCase(data);
    setCurrentCompareciente(transformed);
    setView('view');
  };

  const handleCancel = () => {
    if (currentCompareciente) {
      setView('view');
    } else {
      setView('search');
    }
  };

  const handleBackToSearch = () => {
    setCurrentCompareciente(null);
    setView('search');
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Gestión de Comparecientes
          </h1>
          <p className="text-gray-600 mt-1">
            Buscar, crear y editar datos de comparecientes
          </p>
        </div>
        
        {view === 'search' && (
          <Button
            variant="primary"
            icon={<Plus className="w-5 h-5" />}
            onClick={handleCreateNew}
          >
            Nuevo Compareciente
          </Button>
        )}

        {(view === 'view' || view === 'edit') && (
          <Button
            variant="secondary"
            icon={<ArrowLeft className="w-5 h-5" />}
            onClick={handleBackToSearch}
          >
            Volver a Búsqueda
          </Button>
        )}
      </div>

      {/* VISTA DE BÚSQUEDA */}
      {view === 'search' && (
        <div className="max-w-2xl">
          <ComparecienteSearch
            onSearch={handleSearch}
            loading={loading}
          />
          
          <div className="mt-8 p-6 bg-blue-50 rounded-lg border border-blue-200">
            <h3 className="font-semibold text-blue-900 mb-2">
              ℹ️ Instrucciones
            </h3>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>• Busque un compareciente existente por número de cédula</li>
              <li>• Si no existe, podrá crear uno nuevo</li>
              <li>• Puede editar los datos de comparecientes existentes</li>
            </ul>
          </div>
        </div>
      )}

      {/* VISTA DE CREAR */}
      {view === 'create' && (
        <ComparecienteForm
          onSuccess={handleSuccess}
          onCancel={handleCancel}
        />
      )}

      {/* VISTA DE EDITAR */}
      {view === 'edit' && (
        <ComparecienteForm
          initialData={currentCompareciente}
          onSuccess={handleSuccess}
          onCancel={handleCancel}
        />
      )}

      {/* VISTA DE VISUALIZACIÓN */}
      {view === 'view' && currentCompareciente && (
        <div className="space-y-4">
          <div className="flex justify-end">
            <Button
              variant="primary"
              icon={<Edit className="w-5 h-5" />}
              onClick={handleEdit}
            >
              Editar Compareciente
            </Button>
          </div>
          
          <ComparecienteCard
            data={currentCompareciente}
            showPartner={true}
          />
        </div>
      )}
    </div>
  );
};

export default ComparecientesPage;