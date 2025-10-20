/**
 * Configuración centralizada de API
 * FUERZA que TODOS los requests vayan a Render en producción
 * En desarrollo, permite localhost solo si está explícitamente configurado
 */

// URL base - Prioridad:
// 1. NEXT_PUBLIC_API_URL si está definida
// 2. En desarrollo: http://localhost:8080/api
// 3. En producción: https://repositoriodesplieguefitzone.onrender.com/api
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL 
  ? process.env.NEXT_PUBLIC_API_URL
  : process.env.NODE_ENV === 'development'
    ? 'http://localhost:8080/api'
    : 'https://repositoriodesplieguefitzone.onrender.com/api';

// Validar en PRODUCCIÓN
if (typeof window !== 'undefined' && process.env.NODE_ENV === 'production' && API_BASE_URL.includes('localhost')) {
  console.error('❌ FORBIDDEN: API URL contiene localhost en producción. Debe usar Render.');
  throw new Error('API URL inválida: localhost no permitido en producción');
}

// Log informativo (solo en desarrollo)
if (typeof window !== 'undefined' && process.env.NODE_ENV === 'development') {
  console.log('🔗 [API Config] URL:', API_BASE_URL);
}

export const API_CONFIG = {
  BASE_URL: API_BASE_URL,
  TIMEOUT: 30000,
  RETRY_ATTEMPTS: 3,
} as const;

export default API_CONFIG;
