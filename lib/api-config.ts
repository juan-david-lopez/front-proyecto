/**
 * Configuración centralizada de API
 * GARANTIZA que /api está presente en la URL base
 */

// Obtener la URL sin /api si la tiene
const getRawUrl = (): string => {
  const url = process.env.NEXT_PUBLIC_API_URL || 
    (typeof window !== 'undefined' && window.location.hostname === 'localhost'
      ? 'http://localhost:8080'
      : 'https://repositoriodesplieguefitzone.onrender.com');
  
  // Remover /api al final si existe (para normalizarla)
  return url.replace(/\/api\/?$/, '');
};

// URL final: siempre con /api
const API_BASE_URL = `${getRawUrl()}/api`;

export const API_CONFIG = {
  BASE_URL: API_BASE_URL,
  TIMEOUT: 30000,
  RETRY_ATTEMPTS: 3,
} as const;

// Log para debug (solo en desarrollo)
if (typeof window !== 'undefined' && process.env.NODE_ENV === 'development') {
  console.log('🔗 [API Config]', {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
    BASE_URL: API_BASE_URL,
    ENV: process.env.NODE_ENV,
  });
}

export default API_CONFIG;
