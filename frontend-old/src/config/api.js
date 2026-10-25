// Configuración centralizada de la API
const API_CONFIG = {
  BASE_URL: import.meta.env.VITE_API_URL || 'http://localhost:8000',
  ENDPOINTS: {
    // Auth
    LOGIN: '/api/auth/login',
    VERIFY: '/api/auth/verify',
    LOGOUT: '/api/auth/logout',
    
    // System Users
    SYSTEM_USERS: '/api/system-users',
    
    // Comparecientes (Parties)
    USERS: '/api/users',
  }
};

// Helper para construir URLs completas
export const getApiUrl = (endpoint) => {
  return `${API_CONFIG.BASE_URL}${endpoint}`;
};

// Helper para hacer fetch con token automático
export const apiFetch = async (endpoint, options = {}) => {
  const token = document.cookie
    .split('; ')
    .find(row => row.startsWith('token='))
    ?.split('=')[1];

  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(getApiUrl(endpoint), {
    ...options,
    headers,
  });

  return response;
};

export default API_CONFIG;