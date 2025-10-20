/**
 * Configuración centralizada de API
 * FUERZA que TODOS los requests vayan a Render
 * NO localhost bajo ninguna circunstancia
 */

// URL base - SIN FALLBACK A LOCALHOST
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://repositoriodesplieguefitzone.onrender.com/api';

// Validar que NO sea localhost
if (typeof window !== 'undefined' && API_BASE_URL.includes('localhost')) {
  console.error('❌ FORBIDDEN: API URL contiene localhost. Debe usar Render en producción.');
  throw new Error('API URL inválida: localhost no permitido');
}

export const API_CONFIG = {
  BASE_URL: API_BASE_URL,
  TIMEOUT: 30000,
  RETRY_ATTEMPTS: 3,
} as const;

export default API_CONFIG;
