// services/receiptService.ts
import {
  Receipt,
  CreateReceiptRequest,
  ReceiptFilters,
  TransactionSummary,
  PaymentStats,
  ReceiptOperationResponse,
} from '@/types/receipt';
import { pdfGeneratorService } from './pdfGeneratorService';
import { API_CONFIG } from '@/lib/api-config';

interface ApiResponse<T = any> {
  success: boolean;
  timestamp?: number;
  error?: string;
  details?: string;
  message?: string;
  data?: T;
}

/**
 * Servicio para gestión de recibos y pagos conectado al backend
 */
class ReceiptService {
  private baseURL: string = API_CONFIG.BASE_URL;

  constructor() {
    // Configurado desde API_CONFIG
  }

  private getAccessToken(): string | null {
    if (typeof window !== 'undefined') return localStorage.getItem('accessToken');
    return null;
  }

  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const url = `${this.baseURL}${endpoint}`;
    console.log('🔗 [ReceiptService] Request to:', url);

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
      console.log('📡 [ReceiptService] Response status:', response.status);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `Error ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      console.log('✅ [ReceiptService] Success:', data);
      return data;
    } catch (error) {
      console.error('❌ [ReceiptService] Error:', error);
      throw error;
    }
  }

  /**
   * Crea un nuevo recibo en el backend
   */
  async generateReceipt(request: CreateReceiptRequest): Promise<ReceiptOperationResponse> {
    try {
      const response = await this.request<ApiResponse<Receipt>>('/api/v1/receipts', {
        method: 'POST',
        body: JSON.stringify(request),
      });

      return {
        success: response.success ?? true,
        message: response.message || 'Recibo generado exitosamente',
        receipt: response.data,
      };
    } catch (error) {
      console.error('Error al generar recibo:', error);
      return {
        success: false,
        message: 'Error al generar recibo',
        error: error instanceof Error ? error.message : 'Error desconocido',
      };
    }
  }

  /**
   * Obtiene todos los recibos de un usuario desde el backend
   */
  async getUserReceipts(userId: number, filters?: ReceiptFilters): Promise<Receipt[]> {
    try {
      const queryParams = new URLSearchParams();
      if (filters) {
        if (filters.status) queryParams.append('status', filters.status);
        if (filters.type) queryParams.append('type', filters.type);
        if (filters.dateFrom) queryParams.append('dateFrom', filters.dateFrom);
        if (filters.dateTo) queryParams.append('dateTo', filters.dateTo);
        if (filters.minAmount) queryParams.append('minAmount', filters.minAmount.toString());
        if (filters.maxAmount) queryParams.append('maxAmount', filters.maxAmount.toString());
      }

      const queryString = queryParams.toString();
      const endpoint = `/api/v1/users/${userId}/receipts${queryString ? `?${queryString}` : ''}`;

      const response = await this.request<ApiResponse<Receipt[]>>(endpoint);
      return response.data || [];
    } catch (error) {
      console.error('Error al obtener recibos:', error);
      return [];
    }
  }

  /**
   * Obtiene un recibo específico por ID desde el backend
   */
  async getReceiptById(receiptId: string): Promise<Receipt | null> {
    try {
      const response = await this.request<ApiResponse<Receipt>>(`/api/v1/receipts/${receiptId}`);
      return response.data || null;
    } catch (error) {
      console.error('Error al obtener recibo:', error);
      return null;
    }
  }

  /**
   * Obtiene el resumen de transacciones desde el backend
   */
  async getTransactionSummaries(userId: number): Promise<TransactionSummary[]> {
    try {
      const response = await this.request<ApiResponse<TransactionSummary[]>>(
        `/api/v1/users/${userId}/transactions`
      );
      return response.data || [];
    } catch (error) {
      console.error('Error al obtener transacciones:', error);
      return [];
    }
  }

  /**
   * Obtiene estadísticas de pagos desde el backend
   */
  async getPaymentStats(userId: number): Promise<PaymentStats> {
    try {
      const response = await this.request<ApiResponse<PaymentStats>>(
        `/api/v1/users/${userId}/payment-stats`
      );
      
      return response.data || {
        totalTransactions: 0,
        totalAmount: 0,
        successfulTransactions: 0,
        failedTransactions: 0,
        refundedAmount: 0,
        averageTransactionAmount: 0,
        byPaymentMethod: {},
        byMembershipType: {},
      };
    } catch (error) {
      console.error('Error al obtener estadísticas:', error);
      return {
        totalTransactions: 0,
        totalAmount: 0,
        successfulTransactions: 0,
        failedTransactions: 0,
        refundedAmount: 0,
        averageTransactionAmount: 0,
        byPaymentMethod: {},
        byMembershipType: {},
      };
    }
  }

  /**
   * Marca un recibo como enviado por email en el backend
   */
  async markAsEmailSent(receiptId: string): Promise<boolean> {
    try {
      await this.request(`/api/v1/receipts/${receiptId}/mark-sent`, {
        method: 'PATCH',
      });
      return true;
    } catch (error) {
      console.error('Error al marcar como enviado:', error);
      return false;
    }
  }

  /**
   * Genera URL de descarga de PDF usando jsPDF
   */
  async generatePdfUrl(receiptId: string): Promise<string | null> {
    const receipt = await this.getReceiptById(receiptId);
    if (!receipt) return null;
    
    try {
      // Generar PDF real
      const pdfBlob = await pdfGeneratorService.generateReceiptPDF(receipt);
      const url = URL.createObjectURL(pdfBlob);
      return url;
    } catch (error) {
      console.error('Error al generar PDF:', error);
      return null;
    }
  }

  /**
   * Descarga un recibo como PDF
   */
  async downloadReceiptPdf(receiptId: string): Promise<void> {
    try {
      const receipt = await this.getReceiptById(receiptId);
      if (!receipt) {
        throw new Error('Recibo no encontrado');
      }

      // Generar y descargar PDF real usando jsPDF
      await pdfGeneratorService.downloadReceiptPDF(receipt);
    } catch (error) {
      console.error('Error al descargar PDF:', error);
      throw error;
    }
  }

  /**
   * Envía un recibo por email a través del backend
   */
  async sendReceiptByEmail(receiptId: string, email: string): Promise<boolean> {
    try {
      await this.request(`/api/v1/receipts/${receiptId}/send-email`, {
        method: 'POST',
        body: JSON.stringify({ email }),
      });
      return true;
    } catch (error) {
      console.error('Error al enviar email:', error);
      return false;
    }
  }

  /**
   * Busca recibos en el backend
   */
  async searchReceipts(query: string): Promise<Receipt[]> {
    try {
      const response = await this.request<ApiResponse<Receipt[]>>(
        `/api/v1/receipts/search?q=${encodeURIComponent(query)}`
      );
      return response.data || [];
    } catch (error) {
      console.error('Error al buscar recibos:', error);
      return [];
    }
  }
}

export const receiptService = new ReceiptService();
