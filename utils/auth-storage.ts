// utils/auth-storage.ts
/**
 * Utilidades para manejar el almacenamiento local relacionado con autenticación
 */

/**
 * Claves de localStorage utilizadas por la aplicación FitZone
 */
export const STORAGE_KEYS = {
  // Tokens de autenticación
  FITZONE_TOKEN: 'fitzone_token',
  ACCESS_TOKEN: 'accessToken',
  
  // Datos de usuario
  FITZONE_USER: 'fitzone_user',
  USER: 'user',
  
  // Datos de notificaciones
  RESERVATION_NOTIFICATIONS: 'reservation-notifications',
  
  // Datos temporales
  TEMP_USER_DATA: 'temp_user_data',
  LAST_ACTIVITY: 'last_activity',
  
  // Credenciales y datos de formularios
  SAVED_EMAIL: 'fitzone_saved_email',
  REMEMBER_USER: 'fitzone_remember_user',
  LAST_LOGIN_EMAIL: 'fitzone_last_login_email',
  FORM_DATA: 'fitzone_form_data',
} as const

/**
 * Limpia completamente todos los datos de autenticación y sesión
 */
export function clearAuthStorage(): void {
  if (typeof window === 'undefined') return

  // Limpiar tokens específicos de localStorage
  Object.values(STORAGE_KEYS).forEach(key => {
    localStorage.removeItem(key)
  })
  
  // Limpiar cualquier clave que empiece con prefijos conocidos de FitZone en localStorage
  const localKeys = Object.keys(localStorage)
  localKeys.forEach(key => {
    if (
      key.startsWith('fitzone_') || 
      key.startsWith('reservation_') || 
      key.startsWith('worker_') ||
      key.startsWith('auth_') ||
      key.startsWith('user_') ||
      key.startsWith('login_') ||
      key.startsWith('form_') ||
      key.startsWith('remember_')
    ) {
      localStorage.removeItem(key)
    }
  })
  
  // También limpiar sessionStorage para eliminar datos temporales de sesión
  const sessionKeys = Object.keys(sessionStorage)
  sessionKeys.forEach(key => {
    if (
      key.startsWith('fitzone_') || 
      key.startsWith('reservation_') || 
      key.startsWith('worker_') ||
      key.startsWith('auth_') ||
      key.startsWith('user_') ||
      key.startsWith('login_') ||
      key.startsWith('form_') ||
      key.startsWith('remember_')
    ) {
      sessionStorage.removeItem(key)
    }
  })
  
  // Limpiar cookies de autenticación si existen (opcional)
  clearAuthCookies()
}

/**
 * Verifica si hay datos de sesión válidos en localStorage
 */
export function hasValidSession(): boolean {
  if (typeof window === 'undefined') return false
  
  const token = localStorage.getItem(STORAGE_KEYS.FITZONE_TOKEN)
  const user = localStorage.getItem(STORAGE_KEYS.FITZONE_USER)
  
  return !!(token && user)
}

/**
 * Obtiene el token de autenticación desde localStorage
 */
export function getAuthToken(): string | null {
  if (typeof window === 'undefined') return null
  
  return (
    localStorage.getItem(STORAGE_KEYS.FITZONE_TOKEN) ||
    localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN)
  )
}

/**
 * Guarda el token de autenticación en localStorage
 */
export function setAuthToken(token: string): void {
  if (typeof window === 'undefined') return
  
  localStorage.setItem(STORAGE_KEYS.FITZONE_TOKEN, token)
  localStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, token) // Compatibilidad
}

/**
 * Obtiene los datos del usuario desde localStorage
 */
export function getUserData(): any | null {
  if (typeof window === 'undefined') return null
  
  try {
    const userData = localStorage.getItem(STORAGE_KEYS.FITZONE_USER)
    return userData ? JSON.parse(userData) : null
  } catch (error) {
    console.error('Error parsing user data from localStorage:', error)
    return null
  }
}

/**
 * Guarda los datos del usuario en localStorage
 */
export function setUserData(userData: any): void {
  if (typeof window === 'undefined') return
  
  try {
    localStorage.setItem(STORAGE_KEYS.FITZONE_USER, JSON.stringify(userData))
    localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(userData)) // Compatibilidad
  } catch (error) {
    console.error('Error saving user data to localStorage:', error)
  }
}

/**
 * Limpia cookies de autenticación
 */
function clearAuthCookies(): void {
  if (typeof window === 'undefined') return
  
  // Lista de nombres de cookies relacionadas con autenticación
  const authCookieNames = [
    'fitzone_token',
    'fitzone_session',
    'auth_token',
    'session_id',
    'remember_token',
    'access_token'
  ]
  
  authCookieNames.forEach(cookieName => {
    // Eliminar cookie estableciendo fecha de expiración en el pasado
    document.cookie = `${cookieName}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`
    document.cookie = `${cookieName}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=.${window.location.hostname};`
  })
}

/**
 * Fuerza la limpieza completa del navegador para cerrar sesión
 */
export function forceCompleteLogout(): void {
  clearAuthStorage()
  
  // Forzar limpieza de cualquier dato de autocompletado del navegador
  if (typeof window !== 'undefined') {
    // Limpiar history state que pueda contener datos sensibles
    try {
      window.history.replaceState(null, '', window.location.pathname)
    } catch (error) {
      console.warn('No se pudo limpiar history state:', error)
    }
  }
}

/**
 * Limpia específicamente los datos de formularios de login
 */
export function clearLoginFormData(): void {
  if (typeof window === 'undefined') return
  
  const loginFormKeys = [
    'fitzone_saved_email',
    'fitzone_remember_user', 
    'fitzone_last_login_email',
    'fitzone_form_data',
    'login_email',
    'remember_me',
    'auto_login'
  ]
  
  loginFormKeys.forEach(key => {
    localStorage.removeItem(key)
    sessionStorage.removeItem(key)
  })
}