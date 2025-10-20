// services/membershipNotificationService.ts
import {
  MembershipNotification,
  NotificationType,
  NotificationPriority,
  CreateNotificationRequest,
  UpdateNotificationRequest,
} from '@/types/notification';

interface ApiResponse<T = any> {
  success: boolean;
  timestamp?: number;
  error?: string;
  details?: string;
  message?: string;
  data?: T;
}

/**
 * Servicio para gestión de notificaciones de membresía conectado al backend
 */
class MembershipNotificationService {
  private baseURL: string;

  constructor() {
    this.baseURL = this.getBaseURL();
  }

  private getBaseURL(): string {
    if (process.env.NEXT_PUBLIC_API_URL) return process.env.NEXT_PUBLIC_API_URL;
    if (typeof window !== 'undefined' && window.location.hostname === 'localhost') {
      return 'http://localhost:8080/api';
    }
    return 'https://desplieguefitzone.onrender.com/api';
  }

  private getAccessToken(): string | null {
    if (typeof window !== 'undefined') return localStorage.getItem('accessToken');
    return null;
  }

  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const url = `${this.baseURL}${endpoint}`;
    console.log('🔗 [NotificationService] Request to:', url);

    const defaultOptions: RequestInit = {
      headers: { 'Content-Type': 'application/json', ...options.headers },
      ...options,
    };

    const token = this.getAccessToken();
    if (token) {
      (defaultOptions.headers as Record<string, string>)['Authorization'] = `Bearer ${token}`;
    }

    try {
      const response = await fetch(url, defaultOptions);
      console.log('📡 [NotificationService] Response status:', response.status);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `Error ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      console.log('✅ [NotificationService] Success:', data);
      return data;
    } catch (error) {
      console.error('❌ [NotificationService] Error:', error);
      throw error;
    }
  }

  /**
   * Obtiene todas las notificaciones de un usuario desde el backend
   */
  async getNotifications(userId: number): Promise<MembershipNotification[]> {
    try {
      const response = await this.request<ApiResponse<MembershipNotification[]>>(
        `/api/v1/users/${userId}/notifications`
      );
      return response.data || [];
    } catch (error) {
      console.error('Error al obtener notificaciones:', error);
      return [];
    }
  }

  /**
   * Obtiene notificaciones no leídas desde el backend
   */
  async getUnreadNotifications(userId: number): Promise<MembershipNotification[]> {
    try {
      const response = await this.request<ApiResponse<MembershipNotification[]>>(
        `/api/v1/users/${userId}/notifications?unread=true`
      );
      return response.data || [];
    } catch (error) {
      console.error('Error al obtener notificaciones no leídas:', error);
      return [];
    }
  }

  /**
   * Cuenta las notificaciones no leídas desde el backend
   */
  async getUnreadCount(userId: number): Promise<number> {
    try {
      const response = await this.request<ApiResponse<{ count: number }>>(
        `/api/v1/users/${userId}/notifications/unread-count`
      );
      return response.data?.count || 0;
    } catch (error) {
      console.error('Error al contar notificaciones no leídas:', error);
      return 0;
    }
  }

  /**
   * Marca una notificación como leída en el backend
   */
  async markAsRead(notificationId: string): Promise<boolean> {
    try {
      await this.request(`/api/v1/notifications/${notificationId}/read`, {
        method: 'PATCH',
      });
      return true;
    } catch (error) {
      console.error('Error al marcar como leída:', error);
      return false;
    }
  }

  /**
   * Marca todas las notificaciones como leídas en el backend
   */
  async markAllAsRead(userId: number): Promise<boolean> {
    try {
      await this.request(`/api/v1/users/${userId}/notifications/read-all`, {
        method: 'PATCH',
      });
      return true;
    } catch (error) {
      console.error('Error al marcar todas como leídas:', error);
      return false;
    }
  }

  /**
   * Crea una nueva notificación en el backend
   */
  async createNotification(request: CreateNotificationRequest): Promise<MembershipNotification | null> {
    try {
      const response = await this.request<ApiResponse<MembershipNotification>>(
        '/api/v1/notifications',
        {
          method: 'POST',
          body: JSON.stringify(request),
        }
      );
      return response.data || null;
    } catch (error) {
      console.error('Error al crear notificación:', error);
      return null;
    }
  }

  /**
   * Actualiza una notificación en el backend
   */
  async updateNotification(
    notificationId: string,
    request: UpdateNotificationRequest
  ): Promise<boolean> {
    try {
      await this.request(`/api/v1/notifications/${notificationId}`, {
        method: 'PATCH',
        body: JSON.stringify(request),
      });
      return true;
    } catch (error) {
      console.error('Error al actualizar notificación:', error);
      return false;
    }
  }

  /**
   * Elimina una notificación del backend
   */
  async deleteNotification(notificationId: string): Promise<boolean> {
    try {
      await this.request(`/api/v1/notifications/${notificationId}`, {
        method: 'DELETE',
      });
      return true;
    } catch (error) {
      console.error('Error al eliminar notificación:', error);
      return false;
    }
  }

  /**
   * Elimina todas las notificaciones de un usuario del backend
   */
  async clearAllNotifications(userId: number): Promise<boolean> {
    try {
      await this.request(`/api/v1/users/${userId}/notifications`, {
        method: 'DELETE',
      });
      return true;
    } catch (error) {
      console.error('Error al eliminar todas las notificaciones:', error);
      return false;
    }
  }

  /**
   * Genera notificaciones automáticas para membresías próximas a vencer
   */
  async generateExpirationNotifications(userId: number, daysBeforeExpiration: number = 7): Promise<number> {
    try {
      const response = await this.request<ApiResponse<{ count: number }>>(
        `/api/v1/users/${userId}/notifications/generate-expiration`,
        {
          method: 'POST',
          body: JSON.stringify({ daysBeforeExpiration }),
        }
      );
      return response.data?.count || 0;
    } catch (error) {
      console.error('Error al generar notificaciones de expiración:', error);
      return 0;
    }
  }

  /**
   * Obtiene configuración de preferencias de notificación del usuario
   */
  async getNotificationPreferences(userId: number): Promise<any> {
    try {
      const response = await this.request<ApiResponse<any>>(
        `/api/v1/users/${userId}/notification-preferences`
      );
      return response.data || {
        emailEnabled: true,
        pushEnabled: true,
        smsEnabled: false,
        expirationReminder: true,
        renewalReminder: true,
        promotions: true,
      };
    } catch (error) {
      console.error('Error al obtener preferencias:', error);
      return {
        emailEnabled: true,
        pushEnabled: true,
        smsEnabled: false,
        expirationReminder: true,
        renewalReminder: true,
        promotions: true,
      };
    }
  }

  /**
   * Actualiza las preferencias de notificación del usuario
   */
  async updateNotificationPreferences(userId: number, preferences: any): Promise<boolean> {
    try {
      await this.request(`/api/v1/users/${userId}/notification-preferences`, {
        method: 'PUT',
        body: JSON.stringify(preferences),
      });
      return true;
    } catch (error) {
      console.error('Error al actualizar preferencias:', error);
      return false;
    }
  }
}

export const membershipNotificationService = new MembershipNotificationService();
