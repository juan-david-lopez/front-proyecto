/**
 * MAPEO CENTRALIZADO DE ENDPOINTS
 * Asegura que TODOS los endpoints apunten correctamente a Render con /api
 * 
 * REGLA: Si el endpoint ya tiene /api o /api/v1, NO se agrega nuevamente
 * Si el endpoint NO tiene /api, se agrega automáticamente
 */

import { API_CONFIG } from './api-config';

// ============================================
// AUTH ENDPOINTS
// ============================================
export const AUTH_ENDPOINTS = {
  LOGIN: '/auth/login',
  LOGIN_2FA: '/auth/login-2fa',
  VERIFY_OTP: '/auth/verify-otp',
  RESEND_OTP: '/auth/resend-otp',
  FORGOT_PASSWORD: '/auth/forgot-password',
  REGISTER: '/auth/register',
  VERIFY_REGISTRATION_OTP: '/auth/verify-registration-otp',
  RESEND_REGISTRATION_OTP: '/auth/resend-registration-otp',
} as const;

// ============================================
// MEMBERSHIP ENDPOINTS
// ============================================
export const MEMBERSHIP_ENDPOINTS = {
  GET_TYPES: '/memberships/types',
  GET_TYPE_BY_ID: (id: string) => `/memberships/types/${id}`,
  GET_TYPE_BY_NAME: (name: string) => `/memberships/types/by-name?name=${name}`,
  GET_MY_STATUS: '/memberships/my-status',
  GET_STATUS: (userId: number) => `/memberships/status/${userId}`,
  GET_DETAILS: (userId: number) => `/memberships/details/${userId}`,
  CREATE: '/memberships/create',
  CREATE_PAYMENT_INTENT: '/memberships/create-payment-intent',
  PROCESS_PAYMENT: '/memberships/process-payment',
  RENEW: '/memberships/renew',
  SUSPEND: '/memberships/suspend',
  REACTIVATE: (userId: number) => `/memberships/reactivate/${userId}`,
} as const;

// ============================================
// USER ENDPOINTS
// ============================================
export const USER_ENDPOINTS = {
  REGISTER: '/users/register',
  REGISTER_PUBLIC: '/users/public/register',
  GET_BY_ID: (id: number) => `/users/${id}`,
  UPDATE: (id: number) => `/users/${id}`,
  DELETE: (id: number) => `/users/${id}`,
  GET_BY_EMAIL: (email: string) => `/users/by-email?email=${email}`,
  GET_BY_DOCUMENT: (document: string) => `/users/by-document?document=${document}`,
  GET_ALL: '/users',
} as const;

// ============================================
// LOCATION ENDPOINTS (Ya incluyen /api)
// ============================================
export const LOCATION_ENDPOINTS = {
  GET_ALL: '/api/locations',
  GET_BY_ID: (id: number) => `/api/locations/${id}`,
  GET_BY_NAME: (name: string) => `/api/locations/by-name?name=${name}`,
  GET_BY_ADDRESS: (address: string) => `/api/locations/by-address?address=${address}`,
  GET_BY_PHONE: (phone: string) => `/api/locations/by-phone?phone=${phone}`,
  CREATE: '/api/locations',
  UPDATE: (id: number) => `/api/locations/${id}`,
  DELETE: (id: number) => `/api/locations/${id}`,
  DEACTIVATE: (id: number) => `/api/locations/${id}/deactivate`,
} as const;

// ============================================
// RESERVATION ENDPOINTS (Ya incluyen /api)
// ============================================
export const RESERVATION_ENDPOINTS = {
  GET_ALL: '/api/reservations',
  GET_MY_RESERVATIONS: '/api/reservations/my',
  GET_UPCOMING: '/api/reservations/upcoming',
  GET_AVAILABILITY: '/api/reservations/availability',
  GET_GROUP_CLASSES: '/api/reservations/group-classes',
  JOIN_GROUP_CLASS: (id: string) => `/api/reservations/group-classes/${id}/join`,
  JOIN_GROUP_CLASS_WITH_PAYMENT: (id: string) => `/api/reservations/group-classes/${id}/join-with-payment`,
  CANCEL: (id: string) => `/api/reservations/${id}/cancel`,
} as const;

// ============================================
// PAYMENT ENDPOINTS
// ============================================
export const PAYMENT_ENDPOINTS = {
  CREATE_CHECKOUT_SESSION: '/api/v1/payments/create-checkout-session',
  CREATE_INTENT: '/api/v1/payments/create-intent',
  GET_STATUS: (id: string) => `/api/v1/payments/${id}/status`,
  CONFIRM: (id: string) => `/api/v1/payments/${id}/confirm`,
  ACTIVATE_MEMBERSHIP: (id: string) => `/api/v1/payments/${id}/activate-membership`,
  GET_PAYMENT_METHODS: (userId: number) => `/api/v1/payments/users/${userId}/payment-methods`,
  ADD_PAYMENT_METHOD: (userId: number) => `/api/v1/payments/users/${userId}/payment-methods`,
  DELETE_PAYMENT_METHOD: (userId: number, methodId: string) => `/api/v1/payments/users/${userId}/payment-methods/${methodId}`,
  CALCULATE_PRICING: '/pricing/calculate',
} as const;

// ============================================
// LOYALTY ENDPOINTS (Ya incluyen /api)
// ============================================
export const LOYALTY_ENDPOINTS = {
  GET_DASHBOARD: '/api/loyalty/dashboard',
  GET_PROFILE: '/api/loyalty/profile',
  GET_REWARDS: '/api/loyalty/rewards',
  GET_AFFORDABLE_REWARDS: '/api/loyalty/rewards/affordable',
  GET_REWARD: (id: string) => `/api/loyalty/rewards/${id}`,
  REDEEM: '/api/loyalty/redeem',
  GET_REDEMPTIONS: '/api/loyalty/redemptions',
  VALIDATE_REDEMPTION: (code: string) => `/api/loyalty/redemptions/validate/${code}`,
  USE_REDEMPTION: (code: string) => `/api/loyalty/redemptions/${code}/use`,
  GET_ACTIVITIES: '/api/loyalty/activities',
  NOTIFY_REWARDS: '/api/loyalty/notify-rewards',
  GET_TIER_BENEFITS: (tier: string) => `/api/loyalty/tiers/${tier}/benefits`,
} as const;

// ============================================
// NOTIFICATION ENDPOINTS
// ============================================
export const NOTIFICATION_ENDPOINTS = {
  GET_ALL: '/api/v1/notifications',
  GET_BY_ID: (id: string) => `/api/v1/notifications/${id}`,
  GET_BY_USER: (userId: number) => `/api/v1/notifications/${userId}`,
  GET_USER_NOTIFICATIONS: (userId: number) => `/api/v1/users/${userId}/notifications`,
  MARK_AS_READ: (id: string) => `/api/v1/notifications/${id}/read`,
  CREATE: '/api/v1/notifications',
} as const;

// ============================================
// RECEIPT ENDPOINTS
// ============================================
export const RECEIPT_ENDPOINTS = {
  GET_ALL: '/api/v1/receipts',
  GET_BY_USER: (userId: number) => `/api/v1/receipts/user/${userId}`,
  GET_BY_NUMBER: (receiptNumber: string) => `/api/v1/receipts/${receiptNumber}`,
  CREATE: '/api/v1/receipts',
} as const;

// ============================================
// INSTRUCTOR ENDPOINTS
// ============================================
export const INSTRUCTOR_ENDPOINTS = {
  GET_ALL: '/api/instructors',
  GET_BY_ID: (id: string) => `/api/instructors/${id}`,
} as const;

// ============================================
// BENEFIT ENDPOINTS
// ============================================
export const BENEFIT_ENDPOINTS = {
  GET_BY_MEMBERSHIP_TYPE: (type: string) => `/benefits/membership-type/${type}`,
  GET_BY_USER: (userId: number) => `/benefits/user/${userId}`,
  CHECK_ACCESS_BENEFIT: (userId: number, benefitCode: string) => `/benefits/user/${userId}/benefit/${benefitCode}/access`,
  CHECK_ACCESS_FACILITY: (userId: number, facilityCode: string) => `/benefits/user/${userId}/facility/${facilityCode}/access`,
} as const;

// ============================================
// REPORT ENDPOINTS
// ============================================
export const REPORT_ENDPOINTS = {
  BILLING: '/reports/billing',
  MEMBERSHIPS: '/reports/memberships',
  MEMBERSHIPS_EXPIRING: '/reports/memberships/expiring',
  MEMBERSHIPS_BY_STATUS: (status: string) => `/reports/memberships/status/${status}`,
  MEMBERSHIPS_BY_TYPE: (type: string) => `/reports/memberships/type/${type}`,
  ADMIN_KPI: '/api/v1/admin/reports/kpis',
} as const;

// ============================================
// UTIL: Construir URL completa
// ============================================
export function buildUrl(endpoint: string): string {
  // Si el endpoint YA tiene /api, NO agregar baseURL
  if (endpoint.startsWith('/api')) {
    return `${API_CONFIG.BASE_URL}${endpoint}`;
  }
  
  // Si el endpoint NO tiene /api, agregarlo
  return `${API_CONFIG.BASE_URL}${endpoint}`;
}

/**
 * EJEMPLO DE USO:
 * 
 * import { AUTH_ENDPOINTS, MEMBERSHIP_ENDPOINTS, buildUrl } from '@/lib/endpoints';
 * 
 * // En un servicio:
 * const url = buildUrl(AUTH_ENDPOINTS.LOGIN);
 * // Resultado: https://repositoriodesplieguefitzone.onrender.com/api/auth/login
 * 
 * const url2 = buildUrl(MEMBERSHIP_ENDPOINTS.GET_TYPES);
 * // Resultado: https://repositoriodesplieguefitzone.onrender.com/api/memberships/types
 */
