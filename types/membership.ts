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

/**
 * Tipos de notificación
 */
export enum NotificationType {
  EXPIRATION_WARNING = "EXPIRATION_WARNING",     // Advertencia de expiración
  RENEWAL_REMINDER = "RENEWAL_REMINDER",         // Recordatorio de renovación
  PAYMENT_SUCCESS = "PAYMENT_SUCCESS",           // Pago exitoso
  PAYMENT_FAILED = "PAYMENT_FAILED",             // Pago fallido
  MEMBERSHIP_SUSPENDED = "MEMBERSHIP_SUSPENDED", // Membresía suspendida
  MEMBERSHIP_CANCELLED = "MEMBERSHIP_CANCELLED", // Membresía cancelada
  MEMBERSHIP_UPGRADED = "MEMBERSHIP_UPGRADED",   // Membresía mejorada
  PROMOTION = "PROMOTION",                       // Promoción o descuento
  SYSTEM_MESSAGE = "SYSTEM_MESSAGE"              // Mensaje del sistema
}

/**
 * Prioridad de la notificación
 */
export enum NotificationPriority {
  LOW = "LOW",
  MEDIUM = "MEDIUM",
  HIGH = "HIGH",
  URGENT = "URGENT"
}

/**
 * Notificación de membresía
 */
export interface MembershipNotification {
  id: string;
  userId: number;
  type: NotificationType;
  priority: NotificationPriority;
  title: string;
  message: string;
  actionUrl?: string;              // URL para acción (ej: renovar)
  actionLabel?: string;            // Etiqueta del botón de acción
  isRead: boolean;
  createdAt: string;
  readAt?: string;
  expiresAt?: string;              // Fecha de expiración de la notificación
  metadata?: Record<string, any>;  // Datos adicionales
}

/**
 * Request para crear notificación
 */
export interface CreateNotificationRequest {
  userId: number;
  type: NotificationType;
  priority?: NotificationPriority;
  title: string;
  message: string;
  actionUrl?: string;
  actionLabel?: string;
  expiresAt?: string;
  metadata?: Record<string, any>;
}

/**
 * Request para actualizar notificación
 */
export interface UpdateNotificationRequest {
  isRead?: boolean;
  readAt?: string;
}
