import { Navigate } from 'react-router';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ children, requireAdmin = false, requireLexdataAccess = false }) => {
  const { isAuthenticated, loading, isAdmin, hasLexdataAccess } = useAuth();

  // Mostrar loading mientras verifica la autenticación
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">Cargando...</div>
      </div>
    );
  }

  // Si no está autenticado, redirigir al login
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Si requiere admin y no lo es, redirigir
  if (requireAdmin && !isAdmin) {
    return <Navigate to="/" replace />;
  }

  // Si requiere acceso a Lexdata y no lo tiene, redirigir
  if (requireLexdataAccess && !hasLexdataAccess) {
    return <Navigate to="/" replace />;
  }

  // Si pasó todas las validaciones, mostrar el contenido
  return children;
};

export default ProtectedRoute;