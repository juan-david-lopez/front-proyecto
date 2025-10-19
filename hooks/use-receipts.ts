// hooks/use-receipts.ts
'use client';

import { useState, useEffect, useCallback } from 'react';
import { receiptService } from '@/services/receiptService';
import {
  Receipt,
  TransactionSummary,
  PaymentStats,
  ReceiptFilters,
  CreateReceiptRequest,
  ReceiptOperationResponse
} from '@/types/receipt';

interface UseReceiptsOptions {
  userId?: number;
  autoLoad?: boolean;
  filters?: ReceiptFilters;
}

interface UseReceiptsReturn {
  // Data
  receipts: Receipt[];
  transactions: TransactionSummary[];
  stats: PaymentStats | null;
  
  // Loading states
  loading: boolean;
  creating: boolean;
  downloading: boolean;
  sendingEmail: boolean;
  
  // Error handling
  error: string | null;
  
  // Actions
  loadReceipts: () => Promise<void>;
  loadTransactions: () => Promise<void>;
  loadStats: () => Promise<void>;
  loadAll: () => Promise<void>;
  createReceipt: (request: CreateReceiptRequest) => Promise<ReceiptOperationResponse>;
  getReceipt: (receiptId: string) => Promise<Receipt | null>;
  searchReceipts: (filters: ReceiptFilters) => Promise<Receipt[]>;
  downloadPdf: (receiptId: string) => Promise<void>;
  sendEmail: (receiptId: string, email: string) => Promise<boolean>;
  refresh: () => Promise<void>;
  clearError: () => void;
}

/**
 * Hook personalizado para gestionar recibos y transacciones
 */
export function useReceipts(options: UseReceiptsOptions = {}): UseReceiptsReturn {
  const { userId, autoLoad = false, filters } = options;

  // State
  const [receipts, setReceipts] = useState<Receipt[]>([]);
  const [transactions, setTransactions] = useState<TransactionSummary[]>([]);
  const [stats, setStats] = useState<PaymentStats | null>(null);
  const [loading, setLoading] = useState(false);
  const [creating, setCreating] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const [sendingEmail, setSendingEmail] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * Carga todos los recibos del usuario
   */
  const loadReceipts = useCallback(async () => {
    if (!userId) return;

    try {
      setLoading(true);
      setError(null);
      
      const data = filters
        ? await receiptService.searchReceipts({ ...filters, userId })
        : await receiptService.getReceiptsByUser(userId);
      
      setReceipts(data);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al cargar recibos';
      setError(errorMessage);
      console.error('Error loading receipts:', err);
    } finally {
      setLoading(false);
    }
  }, [userId, filters]);

  /**
   * Carga el resumen de transacciones
   */
  const loadTransactions = useCallback(async () => {
    if (!userId) return;

    try {
      setLoading(true);
      setError(null);
      const data = await receiptService.getTransactionSummaries(userId);
      setTransactions(data);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al cargar transacciones';
      setError(errorMessage);
      console.error('Error loading transactions:', err);
    } finally {
      setLoading(false);
    }
  }, [userId]);

  /**
   * Carga las estadísticas de pagos
   */
  const loadStats = useCallback(async () => {
    if (!userId) return;

    try {
      setLoading(true);
      setError(null);
      const data = await receiptService.getPaymentStats(userId);
      setStats(data);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al cargar estadísticas';
      setError(errorMessage);
      console.error('Error loading stats:', err);
    } finally {
      setLoading(false);
    }
  }, [userId]);

  /**
   * Carga todos los datos simultáneamente
   */
  const loadAll = useCallback(async () => {
    if (!userId) return;

    try {
      setLoading(true);
      setError(null);
      
      const [receiptsData, transactionsData, statsData] = await Promise.all([
        filters
          ? receiptService.searchReceipts({ ...filters, userId })
          : receiptService.getReceiptsByUser(userId),
        receiptService.getTransactionSummaries(userId),
        receiptService.getPaymentStats(userId)
      ]);
      
      setReceipts(receiptsData);
      setTransactions(transactionsData);
      setStats(statsData);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al cargar datos';
      setError(errorMessage);
      console.error('Error loading all data:', err);
    } finally {
      setLoading(false);
    }
  }, [userId, filters]);

  /**
   * Crea un nuevo recibo
   */
  const createReceipt = useCallback(async (
    request: CreateReceiptRequest
  ): Promise<ReceiptOperationResponse> => {
    try {
      setCreating(true);
      setError(null);
      
      const result = await receiptService.generateReceipt(request);
      
      if (result.success && result.receipt) {
        // Actualizar la lista de recibos
        setReceipts(prev => [result.receipt!, ...prev]);
        
        // Recargar estadísticas
        if (userId) {
          loadStats();
        }
      }
      
      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al crear recibo';
      setError(errorMessage);
      console.error('Error creating receipt:', err);
      
      return {
        success: false,
        message: 'Error al crear el recibo',
        error: errorMessage
      };
    } finally {
      setCreating(false);
    }
  }, [userId, loadStats]);

  /**
   * Obtiene un recibo por ID
   */
  const getReceipt = useCallback(async (receiptId: string): Promise<Receipt | null> => {
    try {
      setError(null);
      return await receiptService.getReceiptById(receiptId);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al obtener recibo';
      setError(errorMessage);
      console.error('Error getting receipt:', err);
      return null;
    }
  }, []);

  /**
   * Busca recibos con filtros
   */
  const searchReceipts = useCallback(async (
    searchFilters: ReceiptFilters
  ): Promise<Receipt[]> => {
    try {
      setLoading(true);
      setError(null);
      
      const results = await receiptService.searchReceipts({
        ...searchFilters,
        userId: userId || searchFilters.userId
      });
      
      setReceipts(results);
      return results;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al buscar recibos';
      setError(errorMessage);
      console.error('Error searching receipts:', err);
      return [];
    } finally {
      setLoading(false);
    }
  }, [userId]);

  /**
   * Descarga un recibo como PDF
   */
  const downloadPdf = useCallback(async (receiptId: string): Promise<void> => {
    try {
      setDownloading(true);
      setError(null);
      await receiptService.downloadReceiptPdf(receiptId);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al descargar PDF';
      setError(errorMessage);
      console.error('Error downloading PDF:', err);
      throw err;
    } finally {
      setDownloading(false);
    }
  }, []);

  /**
   * Envía un recibo por email
   */
  const sendEmail = useCallback(async (
    receiptId: string,
    email: string
  ): Promise<boolean> => {
    try {
      setSendingEmail(true);
      setError(null);
      
      const sent = await receiptService.sendReceiptByEmail(receiptId, email);
      
      if (sent) {
        // Actualizar el recibo en la lista local
        setReceipts(prev =>
          prev.map(r =>
            r.id === receiptId
              ? { ...r, emailSent: true, updatedAt: new Date().toISOString() }
              : r
          )
        );
      }
      
      return sent;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al enviar email';
      setError(errorMessage);
      console.error('Error sending email:', err);
      return false;
    } finally {
      setSendingEmail(false);
    }
  }, []);

  /**
   * Refresca todos los datos
   */
  const refresh = useCallback(async () => {
    await loadAll();
  }, [loadAll]);

  /**
   * Limpia el error actual
   */
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  // Auto-load on mount if enabled
  useEffect(() => {
    if (autoLoad && userId) {
      loadAll();
    }
  }, [autoLoad, userId, loadAll]);

  return {
    // Data
    receipts,
    transactions,
    stats,
    
    // Loading states
    loading,
    creating,
    downloading,
    sendingEmail,
    
    // Error handling
    error,
    
    // Actions
    loadReceipts,
    loadTransactions,
    loadStats,
    loadAll,
    createReceipt,
    getReceipt,
    searchReceipts,
    downloadPdf,
    sendEmail,
    refresh,
    clearError
  };
}

/**
 * Hook simplificado para un recibo individual
 */
export function useReceipt(receiptId: string | null) {
  const [receipt, setReceipt] = useState<Receipt | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadReceipt = useCallback(async () => {
    if (!receiptId) return;

    try {
      setLoading(true);
      setError(null);
      const data = await receiptService.getReceiptById(receiptId);
      setReceipt(data);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al cargar recibo';
      setError(errorMessage);
      console.error('Error loading receipt:', err);
    } finally {
      setLoading(false);
    }
  }, [receiptId]);

  useEffect(() => {
    loadReceipt();
  }, [loadReceipt]);

  return {
    receipt,
    loading,
    error,
    reload: loadReceipt
  };
}
