// types/notification.ts

/**
 * Tipos de notificaciones del sistema
 */
export enum NotificationType {
  // Notificaciones de Membresía
  MEMBERSHIP_EXPIRING_SOON = "MEMBERSHIP_EXPIRING_SOON",           // Expira pronto (30, 7, 1 día)
  MEMBERSHIP_EXPIRED = "MEMBERSHIP_EXPIRED",                        // Membresía expirada
  MEMBERSHIP_RENEWED = "MEMBERSHIP_RENEWED",                        // Renovación exitosa
  MEMBERSHIP_SUSPENDED = "MEMBERSHIP_SUSPENDED",                    // Suspensión activada
  MEMBERSHIP_REACTIVATED = "MEMBERSHIP_REACTIVATED",               // Reactivación exitosa
  MEMBERSHIP_CANCELLED = "MEMBERSHIP_CANCELLED",                    // Cancelación procesada
  MEMBERSHIP_SUSPENSION_ENDING = "MEMBERSHIP_SUSPENSION_ENDING",   // Suspensión termina pronto
  
  // Notificaciones de Pago
  PAYMENT_SUCCESSFUL = "PAYMENT_SUCCESSFUL",                        // Pago exitoso
  PAYMENT_FAILED = "PAYMENT_FAILED",                               // Fallo en pago
  PAYMENT_UPCOMING = "PAYMENT_UPCOMING",                           // Próximo pago programado
  CARD_EXPIRING = "CARD_EXPIRING",                                 // Tarjeta por vencer
  
  // Notificaciones Promocionales
  UPGRADE_SUGGESTION = "UPGRADE_SUGGESTION",                        // Sugerencia de upgrade
  RENEWAL_DISCOUNT = "RENEWAL_DISCOUNT",                           // Descuento por renovación
  SPECIAL_OFFER = "SPECIAL_OFFER",                                 // Oferta especial
  
  // Notificaciones de Sistema
  SYSTEM_MAINTENANCE = "SYSTEM_MAINTENANCE",                        // Mantenimiento programado
  NEW_FEATURE = "NEW_FEATURE",                                     // Nueva funcionalidad
  
  // Notificaciones de Reservas
  RESERVATION_CONFIRMED = "RESERVATION_CONFIRMED",                  // Reserva confirmada
  RESERVATION_REMINDER = "RESERVATION_REMINDER",                    // Recordatorio de reserva
  RESERVATION_CANCELLED = "RESERVATION_CANCELLED",                  // Reserva cancelada
}

/**
 * Prioridades de notificaciones
 */
export enum NotificationPriority {
  LOW = "LOW",           // Informativa
  MEDIUM = "MEDIUM",     // Importante
  HIGH = "HIGH",         // Urgente
  CRITICAL = "CRITICAL"  // Crítica (requiere acción inmediata)
}

/**
 * Categorías de notificaciones para filtrado
 */
export enum NotificationCategory {
  MEMBERSHIP = "MEMBERSHIP",
  PAYMENT = "PAYMENT",
  RESERVATION = "RESERVATION",
  PROMOTION = "PROMOTION",
  SYSTEM = "SYSTEM"
}

/**
 * Interface principal de notificación
 */
export interface MembershipNotification {
  id: string;
  userId: number;
  type: NotificationType;
  category: NotificationCategory;
  priority: NotificationPriority;
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  actionUrl?: string;          // URL para acción (ej: /dashboard/membresia/renovar)
  actionLabel?: string;        // Texto del botón de acción
  metadata?: {                 // Datos adicionales específicos del tipo
    membershipId?: number;
    daysRemaining?: number;
    amount?: number;
    expiryDate?: string;
    [key: string]: any;
  };
  expiresAt?: string;          // Fecha de expiración de la notificación
}

/**
 * Configuración de notificaciones del usuario
 */
export interface NotificationPreferences {
  userId: number;
  emailNotifications: boolean;
  pushNotifications: boolean;
  smsNotifications: boolean;
  notificationTypes: {
    [key in NotificationType]?: boolean;
  };
  quietHoursStart?: string;    // Hora de inicio de modo silencio (ej: "22:00")
  quietHoursEnd?: string;      // Hora de fin de modo silencio (ej: "08:00")
}

/**
 * Estadísticas de notificaciones
 */
export interface NotificationStats {
  total: number;
  unread: number;
  byCategory: {
    [key in NotificationCategory]?: number;
  };
  byPriority: {
    [key in NotificationPriority]?: number;
  };
}

/**
 * Request para marcar notificaciones como leídas
 */
export interface MarkAsReadRequest {
  userId: number;
  notificationIds: string[];
}

/**
 * Request para eliminar notificaciones
 */
export interface DeleteNotificationsRequest {
  userId: number;
  notificationIds: string[];
}

/**
 * Response de operaciones de notificaciones
 */
export interface NotificationOperationResponse {
  success: boolean;
  message: string;
  affectedCount?: number;
  error?: string;
}

/**
 * Request para crear notificaciones
 */
export interface CreateNotificationRequest {
  userId: number;
  type: NotificationType;
  category: NotificationCategory;
  priority: NotificationPriority;
  title: string;
  message: string;
  actionUrl?: string;
  actionLabel?: string;
  metadata?: Record<string, any>;
  expiresAt?: string;
}

/**
 * Request para actualizar notificaciones
 */
export interface UpdateNotificationRequest {
  type?: NotificationType;
  category?: NotificationCategory;
  priority?: NotificationPriority;
  title?: string;
  message?: string;
  read?: boolean;
  actionUrl?: string;
  actionLabel?: string;
  metadata?: Record<string, any>;
  expiresAt?: string;
}
