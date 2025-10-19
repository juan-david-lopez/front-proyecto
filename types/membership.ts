// types/membership.ts
export enum MembershipTypeName {
  BASIC = "BASIC",
  PREMIUM = "PREMIUM",
  ELITE = "ELITE",
  NONE = "NONE"   // 👈 extra por si no hay membresía
}

export interface MembershipType {
  idMembershipType: number;
  name: MembershipTypeName;
  description: string;
  monthlyPrice: number;
  accessToAllLocation: boolean;
  groupClassesSessionsIncluded: number;
  personalTrainingIncluded: number;
  specializedClassesIncluded: boolean;
}

export interface MembershipTypeResponse extends MembershipType {}

// Para crear membresías
export interface CreateMembershipRequest {
  userId: number;
  membershipTypeId: number;
  mainLocationId: number;
  paymentIntentId: string;
}

/**
 * Estados posibles de una membresía
 */
export enum MembershipStatus {
  ACTIVE = "ACTIVE",           // Membresía activa y vigente
  INACTIVE = "INACTIVE",       // Sin membresía
  EXPIRED = "EXPIRED",         // Membresía vencida
  SUSPENDED = "SUSPENDED",     // Membresía suspendida temporalmente
  CANCELLED = "CANCELLED",     // Membresía cancelada
  PENDING = "PENDING"          // Pendiente de activación/pago
}

/**
 * Respuesta ligera para el estado de membresía (ej: para validaciones rápidas).
 */
export interface MembershipStatusResponse {
  isActive: boolean;
  status: "ACTIVE" | "INACTIVE";
  membershipType: MembershipTypeName;
  expiryDate?: string; 
}

/**
 * Información completa de la membresía (ej: para dashboard detallado).
 */
export interface MembershipInfo {
  id?: number;
  type?: MembershipType;     // objeto completo con detalles
  startDate?: string;        // inicio (ISO)
  endDate?: string;          // fin (ISO)
  status: MembershipStatus;
  statusMessage?: string;
  daysRemaining?: number;
  isActive: boolean;
  suspensionStartDate?: string;    // Fecha inicio de suspensión
  suspensionEndDate?: string;      // Fecha fin de suspensión
  suspensionReason?: string;       // Motivo de suspensión
  cancellationDate?: string;       // Fecha de cancelación
  cancellationReason?: string;     // Motivo de cancelación
  autoRenewal?: boolean;           // Renovación automática activa
  suspensionsUsed?: number;        // Número de suspensiones usadas este año
}

/**
 * Respuesta del endpoint /memberships/details/{userId}
 * Maneja tanto usuarios CON membresía como usuarios SIN membresía
 */
export interface MembershipDetailsResponse {
  hasMembership: boolean;           // true = tiene membresía, false = no tiene membresía
  membershipId?: number;            // ID de la membresía (solo si hasMembership = true)
  userId: number;                   // ID del usuario
  membershipTypeName?: string;      // Tipo de membresía: BASIC, PREMIUM, ELITE
  locationId?: number;              // ID de la ubicación principal
  startDate?: string;               // Fecha de inicio (ISO)
  endDate?: string;                 // Fecha de vencimiento (ISO)
  status?: string;                  // Estado: ACTIVE, EXPIRED, SUSPENDED
  message: string;                  // Mensaje descriptivo del estado
  needsLocation: boolean;           // true = debe asignar ubicación antes de comprar
}

/**
 * Request para renovar membresía
 */
export interface RenewMembershipRequest {
  userId: number;
  membershipId: number;
  paymentIntentId: string;
  autoRenewal?: boolean;
}

/**
 * Request para suspender membresía
 */
export interface SuspendMembershipRequest {
  userId: number;
  membershipId: number;
  suspensionDays: number;        // Días de suspensión (15-90)
  reason: string;                // Motivo de suspensión
}

/**
 * Request para cancelar membresía
 */
export interface CancelMembershipRequest {
  userId: number;
  membershipId: number;
  reason: string;                // Motivo de cancelación
  feedback?: string;             // Comentarios adicionales
  requestRefund?: boolean;       // Solicitar reembolso
}

/**
 * Response para operaciones de gestión
 */
export interface MembershipOperationResponse {
  success: boolean;
  message: string;
  membership?: MembershipInfo;
  error?: string;
}
