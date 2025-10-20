/**
 * MAPEO CENTRALIZADO DE ENDPOINTS - FITZONE
 * IMPORTANTE: API_CONFIG.BASE_URL = https://repositoriodesplieguefitzone.onrender.com/api
 * Todos los endpoints YA incluyen /api en su definición
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
  SEND_REGISTRATION_OTP: '/auth/send-registration-otp',
  VERIFY_REGISTRATION_OTP: '/auth/verify-registration-otp',
  RESEND_REGISTRATION_OTP: '/auth/resend-registration-otp',
} as const;

// ============================================
// MEMBERSHIP ENDPOINTS
// ============================================
export const MEMBERSHIP_ENDPOINTS = {
  GET_TYPES: '/membership-types',
  GET_TYPE_BY_ID: (id: string) => `/membership-types/${id}`,
  GET_TYPE_BY_NAME: (name: string) => `/membership-types/by-name?name=${name}`,
  GET_MY_STATUS: '/memberships/my-status',
  GET_STATUS: (userId: number) => `/memberships/status/${userId}`,
  GET_DETAILS: (userId: number) => `/memberships/details/${userId}`,
  GET_BY_ID: (userId: number) => `/memberships/${userId}`,
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
// LOCATION ENDPOINTS
// ============================================
export const LOCATION_ENDPOINTS = {
  GET_ALL: '/locations',
  GET_BY_ID: (id: number) => `/locations/${id}`,
  GET_BY_NAME: (name: string) => `/locations/by-name?name=${name}`,
  GET_BY_ADDRESS: (address: string) => `/locations/by-address?address=${address}`,
  GET_BY_PHONE: (phone: string) => `/locations/by-phone?phone=${phone}`,
  CREATE: '/locations',
  UPDATE: (id: number) => `/locations/${id}`,
  DELETE: (id: number) => `/locations/${id}`,
  DEACTIVATE: (id: number) => `/locations/${id}/deactivate`,
} as const;

// ============================================
// RESERVATION ENDPOINTS
// ============================================
export const RESERVATION_ENDPOINTS = {
  GET_ALL: '/reservations',
  GET_MY_RESERVATIONS: '/reservations/my',
  GET_UPCOMING: '/reservations/upcoming',
  GET_AVAILABILITY: '/reservations/availability',
  GET_GROUP_CLASSES: '/reservations/group-classes',
  JOIN_GROUP_CLASS: (id: string) => `/reservations/group-classes/${id}/join`,
  JOIN_GROUP_CLASS_WITH_PAYMENT: (id: string) => `/reservations/group-classes/${id}/join-with-payment`,
  CANCEL: (id: string) => `/reservations/${id}/cancel`,
} as const;

// ============================================
// INSTRUCTOR ENDPOINTS
// ============================================
export const INSTRUCTOR_ENDPOINTS = {
  GET_ALL: '/instructors',
  GET_BY_ID: (id: string) => `/instructors/${id}`,
} as const;

// ============================================
// PAYMENT ENDPOINTS (v1)
// ============================================
export const PAYMENT_ENDPOINTS = {
  CREATE_CHECKOUT_SESSION: '/v1/payments/create-checkout-session',
  CREATE_INTENT: '/v1/payments/create-intent',
  GET_STATUS: (id: string) => `/v1/payments/${id}/status`,
  CONFIRM: (id: string) => `/v1/payments/${id}/confirm`,
  ACTIVATE_MEMBERSHIP: (id: string) => `/v1/payments/${id}/activate-membership`,
  GET_PAYMENT_METHODS: (userId: number) => `/v1/payments/users/${userId}/payment-methods`,
  ADD_PAYMENT_METHOD: (userId: number) => `/v1/payments/users/${userId}/payment-methods`,
  DELETE_PAYMENT_METHOD: (userId: number, methodId: string) => `/v1/payments/users/${userId}/payment-methods/${methodId}`,
  CALCULATE_PRICING: '/pricing/calculate',
} as const;

// ============================================
// LOYALTY ENDPOINTS
// ============================================
export const LOYALTY_ENDPOINTS = {
  GET_DASHBOARD: '/loyalty/dashboard',
  GET_PROFILE: '/loyalty/profile',
  GET_REWARDS: '/loyalty/rewards',
  GET_AFFORDABLE_REWARDS: '/loyalty/rewards/affordable',
  GET_REWARD: (id: string) => `/loyalty/rewards/${id}`,
  REDEEM: '/loyalty/redeem',
  GET_REDEMPTIONS: '/loyalty/redemptions',
  VALIDATE_REDEMPTION: (code: string) => `/loyalty/redemptions/validate/${code}`,
  USE_REDEMPTION: (code: string) => `/loyalty/redemptions/${code}/use`,
  GET_ACTIVITIES: '/loyalty/activities',
  NOTIFY_REWARDS: '/loyalty/notify-rewards',
  GET_TIER_BENEFITS: (tier: string) => `/loyalty/tiers/${tier}/benefits`,
} as const;

// ============================================
// NOTIFICATION ENDPOINTS (v1)
// ============================================
export const NOTIFICATION_ENDPOINTS = {
  GET_ALL: '/v1/notifications',
  GET_BY_ID: (id: string) => `/v1/notifications/${id}`,
  GET_BY_USER: (userId: number) => `/v1/notifications/${userId}`,
  GET_USER_NOTIFICATIONS: (userId: number) => `/v1/users/${userId}/notifications`,
  MARK_AS_READ: (id: string) => `/v1/notifications/${id}/read`,
  CREATE: '/v1/notifications',
} as const;

// ============================================
// RECEIPT ENDPOINTS (v1)
// ============================================
export const RECEIPT_ENDPOINTS = {
  GET_ALL: '/v1/receipts',
  GET_BY_USER: (userId: number) => `/v1/receipts/user/${userId}`,
  GET_BY_NUMBER: (receiptNumber: string) => `/v1/receipts/${receiptNumber}`,
  CREATE: '/v1/receipts',
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
  ADMIN_KPI: '/v1/admin/reports/kpis',
} as const;

// ============================================
// RENEWAL PREFERENCE ENDPOINTS (v1)
// ============================================
export const RENEWAL_ENDPOINTS = {
  GET_AUTO_RENEWAL: (userId: number) => `/v1/users/${userId}/membership/auto-renewal-preferences`,
  UPDATE_AUTO_RENEWAL: (userId: number) => `/v1/users/${userId}/membership/auto-renewal-preferences`,
  CHECK_EXPIRATION: (userId: number) => `/v1/users/${userId}/membership/check-expiration`,
} as const;

// ============================================
// FRANCHISE ENDPOINTS
// ============================================
export const FRANCHISE_ENDPOINTS = {
  GET_TIMESLOTS: '/franchises/timeslots',
} as const;

/**
 * Función auxiliar para construir URLs completas
 * @param endpoint - Endpoint sin /api (es agregado por API_CONFIG.BASE_URL)
 * @returns URL completa: https://repositoriodesplieguefitzone.onrender.com/api + endpoint
 * 
 * EJEMPLO:
 * buildUrl(AUTH_ENDPOINTS.LOGIN) 
 * => https://repositoriodesplieguefitzone.onrender.com/api/auth/login
 */
export function buildUrl(endpoint: string): string {
  return `${API_CONFIG.BASE_URL}${endpoint}`;
}
