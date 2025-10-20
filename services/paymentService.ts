// services/paymentService.ts
/**
 * Servicio para procesar pagos con Stripe a través del backend
 */
import { API_CONFIG } from '@/lib/api-config';

export interface PaymentIntentRequest {
  amount: number;
  currency?: string;
  membershipType: string;
  userId: number;
  description?: string;
  metadata?: Record<string, string>;
}

export interface PaymentIntentResponse {
  success: boolean;
  clientSecret?: string;
  paymentIntentId?: string;
  error?: string;
  message?: string;
}

export interface ProcessPaymentRequest {
  userId: number;
  amount: number;
  paymentMethod: string;
  paymentMethodId?: string; // Stripe payment method ID
  membershipType: string;
  membershipStartDate?: string;
  membershipEndDate?: string;
  billingInfo: {
    name: string;
    email: string;
    phone?: string;
    address?: string;
    city?: string;
    country?: string;
  };
}

export interface ProcessPaymentResponse {
  success: boolean;
  transactionId?: string;
  receiptId?: string;
  error?: string;
  message?: string;
}

export interface StripeCheckoutSessionRequest {
  membershipType: string;
  userId: number;
  successUrl: string;
  cancelUrl: string;
  billingInfo: {
    name: string;
    email: string;
    phone?: string;
    address?: string;
    city?: string;
    country?: string;
  };
}

export interface StripeCheckoutSessionResponse {
  success: boolean;
  sessionId?: string;
  sessionUrl?: string;
  error?: string;
}

class PaymentService {
  private baseURL: string = API_CONFIG.BASE_URL;

  constructor() {
    // Configurado desde API_CONFIG
  }

  private getAccessToken(): string | null {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('accessToken');
    }
    return null;
  }

  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const url = `${this.baseURL}${endpoint}`;
    console.log('🔗 [PaymentService] Request to:', url);

    const defaultOptions: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    const token = this.getAccessToken();
    if (token) {
      (defaultOptions.headers as Record<string, string>)['Authorization'] = `Bearer ${token}`;
    }

    try {
      const response = await fetch(url, defaultOptions);
      console.log('📡 [PaymentService] Response status:', response.status);

      // Intentar parsear la respuesta como JSON
      let data;
      try {
        data = await response.json();
      } catch (parseError) {
        console.error('❌ [PaymentService] Error parsing JSON:', parseError);
        // Si no se puede parsear, obtener el texto plano
        const text = await response.text();
        console.error('📄 [PaymentService] Response text:', text);
        throw new Error(`Error ${response.status}: ${response.statusText || 'Error del servidor'}`);
      }

      console.log('📥 [PaymentService] Response data:', data);

      if (!response.ok) {
        // Extraer mensaje de error más detallado
        const errorMessage = data.error || data.message || data.details || 
                            `Error ${response.status}: ${response.statusText}`;
        console.error('❌ [PaymentService] Error message from backend:', errorMessage);
        console.error('❌ [PaymentService] Full error data:', data);
        throw new Error(errorMessage);
      }

      console.log('✅ [PaymentService] Success:', data);
      return data;
    } catch (error) {
      console.error('❌ [PaymentService] Error:', error);
      throw error;
    }
  }

  /**
   * Crea un Payment Intent de Stripe
   * Este endpoint debe estar implementado en el backend como: POST /api/v1/payments/create-intent
   */
  async createPaymentIntent(request: PaymentIntentRequest): Promise<PaymentIntentResponse> {
    try {
      const response = await this.request<PaymentIntentResponse>('/api/v1/payments/create-intent', {
        method: 'POST',
        body: JSON.stringify({
          amount: request.amount,
          currency: request.currency || 'cop',
          membershipType: request.membershipType,
          userId: request.userId,
          description: request.description,
          metadata: request.metadata,
        }),
      });

      return response;
    } catch (error) {
      console.error('Error creating payment intent:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Error desconocido',
      };
    }
  }

  /**
   * Procesa un pago completo con Stripe
   * Este endpoint debe estar implementado en el backend como: POST /api/v1/payments/process
   */
  async processPayment(request: ProcessPaymentRequest): Promise<ProcessPaymentResponse> {
    try {
      const response = await this.request<ProcessPaymentResponse>('/api/v1/payments/process', {
        method: 'POST',
        body: JSON.stringify(request),
      });

      return response;
    } catch (error) {
      console.error('Error processing payment:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Error procesando el pago',
      };
    }
  }

  /**
   * Crea una sesión de Checkout de Stripe
   * Este endpoint debe estar implementado en el backend como: POST /api/v1/payments/create-checkout-session
   */
  async createCheckoutSession(request: StripeCheckoutSessionRequest): Promise<StripeCheckoutSessionResponse> {
    try {
      const response = await this.request<StripeCheckoutSessionResponse>(
        '/api/v1/payments/create-checkout-session',
        {
          method: 'POST',
          body: JSON.stringify(request),
        }
      );

      return response;
    } catch (error) {
      console.error('Error creating checkout session:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Error creando sesión de checkout',
      };
    }
  }

  /**
   * Verifica el estado de un pago
   * Este endpoint debe estar implementado en el backend como: GET /api/v1/payments/{paymentId}/status
   */
  async getPaymentStatus(paymentId: string): Promise<{ success: boolean; status?: string; error?: string }> {
    try {
      const response = await this.request<{ success: boolean; status: string }>(
        `/api/v1/payments/${paymentId}/status`,
        {
          method: 'GET',
        }
      );

      return response;
    } catch (error) {
      console.error('Error getting payment status:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Error obteniendo estado del pago',
      };
    }
  }

  /**
   * Confirma un pago
   * Este endpoint debe estar implementado en el backend como: POST /api/v1/payments/{paymentIntentId}/confirm
   */
  async confirmPayment(paymentIntentId: string): Promise<{ success: boolean; receiptId?: string; error?: string }> {
    try {
      const response = await this.request<{ success: boolean; receiptId?: string }>(
        `/api/v1/payments/${paymentIntentId}/confirm`,
        {
          method: 'POST',
        }
      );

      return response;
    } catch (error) {
      console.error('Error confirming payment:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Error confirmando el pago',
      };
    }
  }

  /**
   * Activa la membresía después de un pago exitoso
   * Este endpoint debe estar implementado en el backend como: POST /api/v1/payments/{paymentIntentId}/activate-membership
   */
  async activateMembership(
    paymentIntentId: string,
    userId: number,
    membershipType: string
  ): Promise<{
    success: boolean;
    message?: string;
    data?: {
      membershipId: number;
      transactionId: string;
      membershipType: string;
      startDate: string;
      endDate: string;
    };
    error?: string;
  }> {
    try {
      console.log('🔄 Activando membresía...');
      console.log('📋 Parámetros:', { 
        paymentIntentId, 
        userId, 
        membershipType,
        userIdType: typeof userId,
        membershipTypeType: typeof membershipType 
      });
      
      const endpoint = `/api/v1/payments/${paymentIntentId}/activate-membership?userId=${userId}&membershipType=${membershipType}`;
      console.log('🌐 URL completa:', `${this.baseURL}${endpoint}`);
      
      const response = await this.request<any>(endpoint, {
        method: 'POST',
      });

      console.log('📥 Respuesta de activate-membership:', response);

      // El backend puede devolver diferentes formatos
      // Formato 1: { success: true, data: {...} }
      // Formato 2: { membershipId: ..., ... } directamente
      
      const hasSuccessField = 'success' in response;
      const isSuccess = hasSuccessField ? response.success : !!response.membershipId || !!response.message;
      
      if (isSuccess) {
        console.log('✅ Membresía activada exitosamente:', response.data || response);
        return {
          success: true,
          message: response.message,
          data: response.data || response,
        };
      } else {
        console.error('❌ Error activando membresía:', response.error || response);
        return {
          success: false,
          error: response.error || 'No se pudo activar la membresía',
        };
      }
    } catch (error) {
      console.error('❌ Error en activateMembership:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Error activando la membresía',
      };
    }
  }

  /**
   * Obtiene los métodos de pago guardados del usuario
   * Este endpoint debe estar implementado en el backend como: GET /api/v1/users/{userId}/payment-methods
   */
  async getSavedPaymentMethods(userId: number): Promise<{
    success: boolean;
    paymentMethods?: Array<{
      id: string;
      type: string;
      last4: string;
      brand: string;
      expiryMonth: number;
      expiryYear: number;
    }>;
    error?: string;
  }> {
    try {
      const response = await this.request<any>(`/api/v1/users/${userId}/payment-methods`, {
        method: 'GET',
      });

      return response;
    } catch (error) {
      console.error('Error getting saved payment methods:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Error obteniendo métodos de pago',
      };
    }
  }

  /**
   * Guarda un método de pago para uso futuro
   * Este endpoint debe estar implementado en el backend como: POST /api/v1/users/{userId}/payment-methods
   */
  async savePaymentMethod(
    userId: number,
    paymentMethodId: string
  ): Promise<{ success: boolean; error?: string }> {
    try {
      const response = await this.request<{ success: boolean }>(
        `/api/v1/users/${userId}/payment-methods`,
        {
          method: 'POST',
          body: JSON.stringify({ paymentMethodId }),
        }
      );

      return response;
    } catch (error) {
      console.error('Error saving payment method:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Error guardando método de pago',
      };
    }
  }

  /**
   * Elimina un método de pago guardado
   * Este endpoint debe estar implementado en el backend como: DELETE /api/v1/users/{userId}/payment-methods/{paymentMethodId}
   */
  async deletePaymentMethod(
    userId: number,
    paymentMethodId: string
  ): Promise<{ success: boolean; error?: string }> {
    try {
      const response = await this.request<{ success: boolean }>(
        `/api/v1/users/${userId}/payment-methods/${paymentMethodId}`,
        {
          method: 'DELETE',
        }
      );

      return response;
    } catch (error) {
      console.error('Error deleting payment method:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Error eliminando método de pago',
      };
    }
  }
}

export const paymentService = new PaymentService();
export default paymentService;
