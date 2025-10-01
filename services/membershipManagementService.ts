// services/membershipManagementService.ts
import { 
  MembershipInfo, 
  RenewMembershipRequest, 
  SuspendMembershipRequest, 
  CancelMembershipRequest,
  MembershipOperationResponse,
  MembershipStatus
} from '@/types/membership';

interface ApiResponse<T = any> {
  success: boolean;
  timestamp?: number;
  error?: string;
  details?: string;
  message?: string;
  data?: T;
}

class MembershipManagementService {
  private baseURL: string;

  constructor() {
    this.baseURL = this.getBaseURL();
  }

  private getBaseURL(): string {
    if (process.env.NEXT_PUBLIC_API_URL) return process.env.NEXT_PUBLIC_API_URL;
    if (typeof window !== 'undefined' && window.location.hostname === 'localhost') {
      return 'http://localhost:8080';
    }
    return 'https://desplieguefitzone.onrender.com';
  }

  private getAccessToken(): string | null {
    if (typeof window !== 'undefined') return localStorage.getItem('accessToken');
    return null;
  }

  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const url = `${this.baseURL}${endpoint}`;
    console.log('🔗 [MembershipManagement] Request to:', url);

    const defaultOptions: RequestInit = {
      headers: { 'Content-Type': 'application/json', ...options.headers },
      ...options,
    };

    const token = this.getAccessToken();
    if (token) {
      defaultOptions.headers = { ...defaultOptions.headers, Authorization: `Bearer ${token}` };
    }

    try {
      const response = await fetch(url, defaultOptions);
      console.log('📥 [MembershipManagement] Response status:', response.status);

      if (response.status === 204) return {} as T;

      const text = await response.text();
      let data;
      
      try { 
        data = text ? JSON.parse(text) : { success: false, error: 'Empty response' }; 
      } catch (parseError) { 
        console.error('❌ [MembershipManagement] JSON parse error:', parseError);
        throw new Error(`Invalid JSON response: ${text.substring(0, 100)}`); 
      }

      if (!response.ok) {
        const errorMessage = data.error || data.message || `HTTP error! status: ${response.status}`;
        console.error('❌ [MembershipManagement] HTTP Error:', errorMessage);
        throw new Error(errorMessage);
      }

      return data;
    } catch (error) {
      console.error('❌ [MembershipManagement] Request failed:', error);
      throw error;
    }
  }

  // ---------------------------
  // Obtener información detallada de membresía
  // ---------------------------
  async getMembershipDetails(userId: number): Promise<MembershipInfo> {
    try {
      const response = await this.request<ApiResponse<MembershipInfo>>(`/memberships/details/${userId}`);
      return response.data || this.getInactiveMembershipInfo();
    } catch (error) {
      console.error('❌ Error getting membership details:', error);
      return this.getInactiveMembershipInfo();
    }
  }

  // ---------------------------
  // Renovar membresía
  // ---------------------------
  async renewMembership(request: RenewMembershipRequest): Promise<MembershipOperationResponse> {
    try {
      console.log('🔄 [MembershipManagement] Renovando membresía:', request);
      
      const response = await this.request<ApiResponse<MembershipInfo>>('/memberships/renew', {
        method: 'POST',
        body: JSON.stringify(request),
      });

      return {
        success: true,
        message: 'Membresía renovada exitosamente',
        membership: response.data,
      };
    } catch (error: any) {
      console.error('❌ Error al renovar membresía:', error);
      return {
        success: false,
        message: 'Error al renovar membresía',
        error: error.message || 'Error desconocido',
      };
    }
  }

  // ---------------------------
  // Suspender membresía temporalmente
  // ---------------------------
  async suspendMembership(request: SuspendMembershipRequest): Promise<MembershipOperationResponse> {
    try {
      console.log('⏸️ [MembershipManagement] Suspendiendo membresía:', request);
      
      // Validar días de suspensión
      if (request.suspensionDays < 15 || request.suspensionDays > 90) {
        return {
          success: false,
          message: 'El período de suspensión debe ser entre 15 y 90 días',
          error: 'Invalid suspension period',
        };
      }

      const response = await this.request<ApiResponse<MembershipInfo>>('/memberships/suspend', {
        method: 'POST',
        body: JSON.stringify(request),
      });

      return {
        success: true,
        message: `Membresía suspendida por ${request.suspensionDays} días`,
        membership: response.data,
      };
    } catch (error: any) {
      console.error('❌ Error al suspender membresía:', error);
      return {
        success: false,
        message: 'Error al suspender membresía',
        error: error.message || 'Error desconocido',
      };
    }
  }

  // ---------------------------
  // Reactivar membresía suspendida
  // ---------------------------
  async reactivateMembership(userId: number, membershipId: number): Promise<MembershipOperationResponse> {
    try {
      console.log('▶️ [MembershipManagement] Reactivando membresía');
      
      const response = await this.request<ApiResponse<MembershipInfo>>('/memberships/reactivate', {
        method: 'POST',
        body: JSON.stringify({ userId, membershipId }),
      });

      return {
        success: true,
        message: 'Membresía reactivada exitosamente',
        membership: response.data,
      };
    } catch (error: any) {
      console.error('❌ Error al reactivar membresía:', error);
      return {
        success: false,
        message: 'Error al reactivar membresía',
        error: error.message || 'Error desconocido',
      };
    }
  }

  // ---------------------------
  // Cancelar membresía
  // ---------------------------
  async cancelMembership(request: CancelMembershipRequest): Promise<MembershipOperationResponse> {
    try {
      console.log('❌ [MembershipManagement] Cancelando membresía:', request);
      
      const response = await this.request<ApiResponse<MembershipInfo>>('/memberships/cancel', {
        method: 'POST',
        body: JSON.stringify(request),
      });

      return {
        success: true,
        message: 'Membresía cancelada exitosamente',
        membership: response.data,
      };
    } catch (error: any) {
      console.error('❌ Error al cancelar membresía:', error);
      return {
        success: false,
        message: 'Error al cancelar membresía',
        error: error.message || 'Error desconocido',
      };
    }
  }

  // ---------------------------
  // Verificar si puede suspender
  // ---------------------------
  async canSuspendMembership(userId: number): Promise<{ canSuspend: boolean; reason?: string; suspensionsUsed: number }> {
    try {
      const membershipInfo = await this.getMembershipDetails(userId);
      
      if (!membershipInfo.isActive) {
        return { canSuspend: false, reason: 'La membresía no está activa', suspensionsUsed: 0 };
      }

      if (membershipInfo.status === MembershipStatus.SUSPENDED) {
        return { canSuspend: false, reason: 'La membresía ya está suspendida', suspensionsUsed: membershipInfo.suspensionsUsed || 0 };
      }

      const suspensionsUsed = membershipInfo.suspensionsUsed || 0;
      if (suspensionsUsed >= 2) {
        return { canSuspend: false, reason: 'Has alcanzado el límite de 2 suspensiones por año', suspensionsUsed };
      }

      return { canSuspend: true, suspensionsUsed };
    } catch (error) {
      console.error('Error checking suspension eligibility:', error);
      return { canSuspend: false, reason: 'Error al verificar elegibilidad', suspensionsUsed: 0 };
    }
  }

  // ---------------------------
  // Calcular días restantes
  // ---------------------------
  calculateDaysRemaining(expiryDate?: string): number {
    if (!expiryDate) return 0;
    
    const expiry = new Date(expiryDate);
    const today = new Date();
    const diffTime = expiry.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    return diffDays > 0 ? diffDays : 0;
  }

  // ---------------------------
  // Obtener estado descriptivo
  // ---------------------------
  getMembershipStatusMessage(membership: MembershipInfo): string {
    switch (membership.status) {
      case MembershipStatus.ACTIVE:
        const daysRemaining = this.calculateDaysRemaining(membership.endDate);
        if (daysRemaining <= 7) {
          return `Tu membresía expira en ${daysRemaining} día${daysRemaining !== 1 ? 's' : ''}`;
        }
        return 'Membresía activa y vigente';
      
      case MembershipStatus.SUSPENDED:
        return `Membresía suspendida hasta ${membership.suspensionEndDate ? new Date(membership.suspensionEndDate).toLocaleDateString('es-ES') : 'fecha no disponible'}`;
      
      case MembershipStatus.EXPIRED:
        return 'Membresía vencida - Renueva para seguir disfrutando los beneficios';
      
      case MembershipStatus.CANCELLED:
        return 'Membresía cancelada';
      
      case MembershipStatus.INACTIVE:
        return 'No tienes membresía activa';
      
      case MembershipStatus.PENDING:
        return 'Membresía pendiente de activación';
      
      default:
        return 'Estado desconocido';
    }
  }

  // ---------------------------
  // Helper: Membresía inactiva por defecto
  // ---------------------------
  private getInactiveMembershipInfo(): MembershipInfo {
    return {
      status: MembershipStatus.INACTIVE,
      isActive: false,
      statusMessage: 'No tienes membresía activa',
      daysRemaining: 0,
      suspensionsUsed: 0,
    };
  }

  // =================================================================
  // RENOVACIÓN AUTOMÁTICA
  // =================================================================

  /**
   * Verifica membresías próximas a vencer y genera notificaciones
   */
  async checkExpiringMemberships(
    userId: number, 
    daysBeforeExpiration: number = 7
  ): Promise<{ needsRenewal: boolean; daysRemaining: number; membershipType?: string }> {
    try {
      const response = await this.request<ApiResponse<{
        needsRenewal: boolean;
        daysRemaining: number;
        membershipType?: string;
      }>>(`/api/v1/users/${userId}/membership/check-expiration?days=${daysBeforeExpiration}`);

      return response.data || { needsRenewal: false, daysRemaining: 0 };
    } catch (error) {
      console.error('Error al verificar expiración:', error);
      return { needsRenewal: false, daysRemaining: 0 };
    }
  }

  /**
   * Genera notificaciones automáticas para renovación
   */
  async generateRenewalNotifications(
    userId: number,
    daysBeforeExpiration: number = 7
  ): Promise<number> {
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
      console.error('Error al generar notificaciones de renovación:', error);
      return 0;
    }
  }

  /**
   * Obtiene preferencias de auto-renovación del usuario
   */
  async getAutoRenewalPreferences(userId: number): Promise<{
    autoRenewalEnabled: boolean;
    notificationDays: number;
    paymentMethod?: string;
  }> {
    try {
      const response = await this.request<ApiResponse<{
        autoRenewalEnabled: boolean;
        notificationDays: number;
        paymentMethod?: string;
      }>>(`/api/v1/users/${userId}/auto-renewal-preferences`);

      return response.data || {
        autoRenewalEnabled: false,
        notificationDays: 7,
      };
    } catch (error) {
      console.error('Error al obtener preferencias de auto-renovación:', error);
      return {
        autoRenewalEnabled: false,
        notificationDays: 7,
      };
    }
  }

  /**
   * Actualiza preferencias de auto-renovación
   */
  async updateAutoRenewalPreferences(
    userId: number,
    preferences: {
      autoRenewalEnabled: boolean;
      notificationDays?: number;
      paymentMethod?: string;
    }
  ): Promise<boolean> {
    try {
      await this.request(`/api/v1/users/${userId}/auto-renewal-preferences`, {
        method: 'PUT',
        body: JSON.stringify(preferences),
      });
      return true;
    } catch (error) {
      console.error('Error al actualizar preferencias:', error);
      return false;
    }
  }

  /**
   * Procesa renovación automática si está habilitada
   */
  async processAutoRenewal(userId: number): Promise<MembershipOperationResponse> {
    try {
      // Verificar preferencias
      const preferences = await this.getAutoRenewalPreferences(userId);
      
      if (!preferences.autoRenewalEnabled) {
        return {
          success: false,
          message: 'Auto-renovación no está habilitada',
        };
      }

      // Verificar si necesita renovación
      const expirationCheck = await this.checkExpiringMemberships(
        userId,
        preferences.notificationDays
      );

      if (!expirationCheck.needsRenewal) {
        return {
          success: false,
          message: 'La membresía aún no necesita renovación',
        };
      }

      // Procesar renovación automática
      const response = await this.request<ApiResponse<MembershipInfo>>(
        `/api/v1/users/${userId}/membership/auto-renew`,
        {
          method: 'POST',
          body: JSON.stringify({
            paymentMethod: preferences.paymentMethod,
          }),
        }
      );

      return {
        success: response.success ?? true,
        message: response.message || 'Membresía renovada automáticamente',
        membership: response.data,
      };
    } catch (error) {
      console.error('Error en renovación automática:', error);
      return {
        success: false,
        message: 'Error al procesar renovación automática',
        error: error instanceof Error ? error.message : 'Error desconocido',
      };
    }
  }

  /**
   * Obtiene historial de renovaciones de un usuario
   */
  async getRenewalHistory(userId: number): Promise<Array<{
    id: string;
    date: string;
    membershipType: string;
    amount: number;
    automatic: boolean;
    status: string;
  }>> {
    try {
      const response = await this.request<ApiResponse<Array<{
        id: string;
        date: string;
        membershipType: string;
        amount: number;
        automatic: boolean;
        status: string;
      }>>>(`/api/v1/users/${userId}/renewal-history`);

      return response.data || [];
    } catch (error) {
      console.error('Error al obtener historial de renovaciones:', error);
      return [];
    }
  }

  /**
   * Programa recordatorio de renovación
   */
  async scheduleRenewalReminder(
    userId: number,
    reminderDate: string
  ): Promise<boolean> {
    try {
      await this.request(`/api/v1/users/${userId}/schedule-renewal-reminder`, {
        method: 'POST',
        body: JSON.stringify({ reminderDate }),
      });
      return true;
    } catch (error) {
      console.error('Error al programar recordatorio:', error);
      return false;
    }
  }
}

export const membershipManagementService = new MembershipManagementService();
export default membershipManagementService;
