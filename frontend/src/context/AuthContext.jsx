import { createContext, useContext, useState, useEffect } from 'react';
import Cookies from 'js-cookie';
import { apiFetch } from '../config/api';
import API_CONFIG from '../config/api';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe usarse dentro de AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    const token = Cookies.get('token');
    
    if (!token) {
      setLoading(false);
      return;
    }

    try {
      const response = await apiFetch(API_CONFIG.ENDPOINTS.VERIFY);

      if (response.ok) {
        const data = await response.json();
        setUser(data.user);
      } else {
        Cookies.remove('token');
        setUser(null);
      }
    } catch (error) {
      console.error('Error verificando auth:', error);
      Cookies.remove('token');
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const login = async (username, password) => {
    try {
      const response = await apiFetch(API_CONFIG.ENDPOINTS.LOGIN, {
        method: 'POST',
        body: JSON.stringify({ username, password })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.detail || data.message || 'Error al iniciar sesión');
      }

      Cookies.set('token', data.token, { expires: 1/3 });
      setUser(data.user);

      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  const logout = () => {
    Cookies.remove('token');
    setUser(null);
  };

  const value = {
    user,
    loading,
    login,
    logout,
    isAuthenticated: !!user,
    isAdmin: user?.rol === 'admin',
    isNotaria: user?.rol === 'notaria',
    isLexdata: user?.rol === 'lexdata',
    hasLexdataAccess: user?.rol === 'admin' || user?.rol === 'lexdata'
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};