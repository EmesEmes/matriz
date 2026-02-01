import { useAuth } from '../context/AuthContext';
import { Card } from '../components/shared';
import { FileText, FileEdit, History, Users } from 'lucide-react';

const HomePage = () => {
  const { user, hasLexdataAccess, isAdmin } = useAuth();

  const stats = [
    {
      title: 'Matrices Generadas',
      value: '0',
      icon: FileText,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100',
      show: true
    },
    {
      title: 'Minutas Generadas',
      value: '0',
      icon: FileEdit,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100',
      show: hasLexdataAccess
    },
    {
      title: 'Documentos Totales',
      value: '0',
      icon: History,
      color: 'text-green-600',
      bgColor: 'bg-green-100',
      show: true
    },
    {
      title: 'Usuarios del Sistema',
      value: '0',
      icon: Users,
      color: 'text-orange-600',
      bgColor: 'bg-orange-100',
      show: isAdmin
    }
  ].filter(stat => stat.show);

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">
          Bienvenido, {user?.nombre}
        </h1>
        <p className="text-gray-600 mt-2">
          Sistema de generación de matrices y minutas notariales
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Card key={index} padding="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">
                    {stat.title}
                  </p>
                  <p className="text-3xl font-bold text-gray-900">
                    {stat.value}
                  </p>
                </div>
                <div className={`w-12 h-12 ${stat.bgColor} rounded-full flex items-center justify-center`}>
                  <Icon className={`w-6 h-6 ${stat.color}`} />
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      {/* Quick Actions */}
      <Card title="Acciones Rápidas">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <button className="p-6 border-2 border-dashed border-gray-300 rounded-lg hover:border-primary-500 hover:bg-primary-50 transition-all text-left">
            <FileText className="w-8 h-8 text-primary-600 mb-3" />
            <h3 className="font-semibold text-gray-900 mb-1">
              Nueva Matriz
            </h3>
            <p className="text-sm text-gray-600">
              Generar matriz de compraventa
            </p>
          </button>

          {hasLexdataAccess && (
            <button className="p-6 border-2 border-dashed border-gray-300 rounded-lg hover:border-purple-500 hover:bg-purple-50 transition-all text-left">
              <FileEdit className="w-8 h-8 text-purple-600 mb-3" />
              <h3 className="font-semibold text-gray-900 mb-1">
                Nueva Minuta
              </h3>
              <p className="text-sm text-gray-600">
                Generar minuta notarial
              </p>
            </button>
          )}
        </div>
      </Card>
    </div>
  );
};

export default HomePage;