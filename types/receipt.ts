// types/receipt.ts
import { MembershipTypeName } from './membership';

/**
 * Métodos de pago soportados
 */
export enum PaymentMethod {
  CREDIT_CARD = "CREDIT_CARD",
  DEBIT_CARD = "DEBIT_CARD",
  CASH = "CASH",
  TRANSFER = "TRANSFER",
  PSE = "PSE"
}

/**
 * Estado de la transacción
 */
export enum TransactionStatus {
  PENDING = "PENDING",
  COMPLETED = "COMPLETED",
  FAILED = "FAILED",
  REFUNDED = "REFUNDED",
  CANCELLED = "CANCELLED"
}

/**
 * Tipos de transacción
 */
export enum TransactionType {
  MEMBERSHIP_PURCHASE = "MEMBERSHIP_PURCHASE",      // Compra inicial
  MEMBERSHIP_RENEWAL = "MEMBERSHIP_RENEWAL",        // Renovación
  MEMBERSHIP_UPGRADE = "MEMBERSHIP_UPGRADE",        // Upgrade de plan
  REFUND = "REFUND",                               // Reembolso
  ADJUSTMENT = "ADJUSTMENT"                        // Ajuste
}

/**
 * Información de pago
 */
export interface PaymentInfo {
  method: PaymentMethod;
  cardLastFour?: string;          // Últimos 4 dígitos de tarjeta
  cardBrand?: string;             // Visa, Mastercard, etc.
  transactionId: string;          // ID de transacción de pasarela
  authorizationCode?: string;     // Código de autorización
  reference?: string;             // Referencia adicional
}

/**
 * Item de recibo (línea de detalle)
 */
export interface ReceiptItem {
  description: string;
  quantity: number;
  unitPrice: number;
  subtotal: number;
  tax?: number;
  discount?: number;
}

/**
 * Información de billing/facturación
 */
export interface BillingInfo {
  name: string;
  email: string;
  phone?: string;
  address?: string;
  city?: string;
  country: string;
  taxId?: string;                 // NIT o RUT
}

/**
 * Recibo completo
 */
export interface Receipt {
  id: string;                      // ID único del recibo
  receiptNumber: string;           // Número de recibo (ej: REC-2025-00001)
  userId: number;
  
  // Información de la transacción
  transactionType: TransactionType;
  transactionStatus: TransactionStatus;
  transactionDate: string;         // ISO date
  
  // Información de membresía
  membershipType: MembershipTypeName;
  membershipStartDate?: string;
  membershipEndDate?: string;
  
  // Detalles del pago
  items: ReceiptItem[];
  subtotal: number;
  tax: number;
  discount: number;
  total: number;
  currency: string;                // COP, USD, etc.
  
  // Información de pago
  paymentInfo: PaymentInfo;
  
  // Información de facturación
  billingInfo: BillingInfo;
  
  // Notas y términos
  notes?: string;
  terms?: string;
  
  // Metadata
  createdAt: string;
  updatedAt?: string;
  pdfUrl?: string;                 // URL del PDF generado
  emailSent?: boolean;             // Si se envió por email
}

/**
 * Request para crear recibo
 */
export interface CreateReceiptRequest {
  userId: number;
  transactionType: TransactionType;
  membershipType: MembershipTypeName;
  membershipStartDate?: string;
  membershipEndDate?: string;
  amount: number;
  paymentMethod: PaymentMethod;
  paymentInfo: Partial<PaymentInfo>;
  billingInfo: BillingInfo;
  notes?: string;
}

/**
 * Resumen de transacción para listado
 */
export interface TransactionSummary {
  id: string;
  receiptNumber: string;
  date: string;
  type: TransactionType;
  status: TransactionStatus;
  amount: number;
  currency: string;
  membershipType: MembershipTypeName;
  paymentMethod: PaymentMethod;
}

/**
 * Filtros para búsqueda de recibos
 */
export interface ReceiptFilters {
  userId?: number;
  status?: TransactionStatus;
  type?: TransactionType;
  dateFrom?: string;
  dateTo?: string;
  minAmount?: number;
  maxAmount?: number;
}

/**
 * Estadísticas de pagos
 */
export interface PaymentStats {
  totalTransactions: number;
  totalAmount: number;
  successfulTransactions: number;
  failedTransactions: number;
  refundedAmount: number;
  averageTransactionAmount: number;
  byPaymentMethod: {
    [key in PaymentMethod]?: number;
  };
  byMembershipType: {
    [key in MembershipTypeName]?: number;
  };
}

/**
 * Response de operaciones con recibos
 */
export interface ReceiptOperationResponse {
  success: boolean;
  message: string;
  receipt?: Receipt;
  pdfUrl?: string;
  error?: string;
}
