// services/exportService.ts
import { TransactionSummary, Receipt, PaymentStats } from '@/types/receipt';

export type ExportFormat = 'csv' | 'excel' | 'json';

export interface ExportOptions {
  format: ExportFormat;
  filename?: string;
  includeHeaders?: boolean;
}

class ExportService {
  /**
   * Exporta transacciones a diferentes formatos
   */
  exportTransactions(
    transactions: TransactionSummary[],
    options: ExportOptions = { format: 'csv', includeHeaders: true }
  ): void {
    const { format, filename, includeHeaders = true } = options;
    const timestamp = new Date().toISOString().split('T')[0];
    const defaultFilename = `transacciones_${timestamp}`;

    switch (format) {
      case 'csv':
        this.exportToCSV(
          transactions,
          filename || `${defaultFilename}.csv`,
          includeHeaders
        );
        break;
      case 'excel':
        this.exportToExcel(
          transactions,
          filename || `${defaultFilename}.xlsx`
        );
        break;
      case 'json':
        this.exportToJSON(
          transactions,
          filename || `${defaultFilename}.json`
        );
        break;
      default:
        throw new Error(`Formato no soportado: ${format}`);
    }
  }

  /**
   * Exporta recibos completos
   */
  exportReceipts(
    receipts: Receipt[],
    options: ExportOptions = { format: 'csv', includeHeaders: true }
  ): void {
    const { format, filename, includeHeaders = true } = options;
    const timestamp = new Date().toISOString().split('T')[0];
    const defaultFilename = `recibos_${timestamp}`;

    switch (format) {
      case 'csv':
        this.exportReceiptsToCSV(
          receipts,
          filename || `${defaultFilename}.csv`,
          includeHeaders
        );
        break;
      case 'excel':
        this.exportReceiptsToExcel(
          receipts,
          filename || `${defaultFilename}.xlsx`
        );
        break;
      case 'json':
        this.exportToJSON(
          receipts,
          filename || `${defaultFilename}.json`
        );
        break;
      default:
        throw new Error(`Formato no soportado: ${format}`);
    }
  }

  /**
   * Exporta estadísticas
   */
  exportStats(
    stats: PaymentStats,
    options: ExportOptions = { format: 'json' }
  ): void {
    const { format, filename } = options;
    const timestamp = new Date().toISOString().split('T')[0];
    const defaultFilename = `estadisticas_${timestamp}`;

    if (format === 'json') {
      this.exportToJSON(
        stats,
        filename || `${defaultFilename}.json`
      );
    } else {
      // Para CSV/Excel, convertimos a formato tabular
      const statsArray = [
        {
          métrica: 'Total Transacciones',
          valor: stats.totalTransactions,
        },
        {
          métrica: 'Transacciones Exitosas',
          valor: stats.successfulTransactions,
        },
        {
          métrica: 'Total Pagado',
          valor: stats.totalAmount,
        },
        {
          métrica: 'Promedio por Transacción',
          valor: stats.averageTransactionAmount,
        },
        {
          métrica: 'Reembolsos',
          valor: stats.refundedAmount,
        },
      ];

      if (format === 'csv') {
        this.exportToCSV(
          statsArray as any,
          filename || `${defaultFilename}.csv`,
          true
        );
      }
    }
  }

  // ==================== MÉTODOS PRIVADOS ====================

  /**
   * Exporta a CSV
   */
  private exportToCSV(
    data: any[],
    filename: string,
    includeHeaders: boolean
  ): void {
    if (!data || data.length === 0) {
      throw new Error('No hay datos para exportar');
    }

    // Obtener headers
    const headers = Object.keys(data[0]);
    
    // Crear contenido CSV
    let csvContent = '';
    
    if (includeHeaders) {
      csvContent += headers.join(',') + '\n';
    }

    // Agregar filas
    data.forEach((item) => {
      const row = headers.map((header) => {
        let value = item[header];
        
        // Formatear valores
        if (value === null || value === undefined) {
          value = '';
        } else if (typeof value === 'string' && value.includes(',')) {
          value = `"${value}"`;
        }
        
        return value;
      });
      
      csvContent += row.join(',') + '\n';
    });

    // Descargar archivo
    this.downloadFile(csvContent, filename, 'text/csv;charset=utf-8;');
  }

  /**
   * Exporta transacciones a CSV
   */
  private exportReceiptsToCSV(
    receipts: Receipt[],
    filename: string,
    includeHeaders: boolean
  ): void {
    if (!receipts || receipts.length === 0) {
      throw new Error('No hay recibos para exportar');
    }

    // Aplanar estructura de recibos
    const flatReceipts = receipts.map((receipt) => ({
      número_recibo: receipt.receiptNumber,
      fecha: receipt.transactionDate,
      usuario_id: receipt.userId,
      tipo_membresía: receipt.membershipType,
      fecha_inicio: receipt.membershipStartDate || 'N/A',
      fecha_fin: receipt.membershipEndDate || 'N/A',
      monto: receipt.total,
      moneda: receipt.currency,
      método_pago: receipt.paymentInfo.method,
      estado: receipt.transactionStatus,
      tipo_transacción: receipt.transactionType,
      id_transacción: receipt.paymentInfo.transactionId,
    }));

    this.exportToCSV(flatReceipts, filename, includeHeaders);
  }

  /**
   * Exporta a formato Excel (simulado con CSV mejorado)
   */
  private exportToExcel(data: any[], filename: string): void {
    // Por ahora, Excel es un CSV con formato mejorado
    // En producción, usar librerías como xlsx o exceljs
    
    if (!data || data.length === 0) {
      throw new Error('No hay datos para exportar');
    }

    // Crear tabla HTML que Excel puede interpretar
    let htmlContent = '<html xmlns:x="urn:schemas-microsoft-com:office:excel">\n';
    htmlContent += '<head>\n';
    htmlContent += '<meta charset="UTF-8">\n';
    htmlContent += '<style>\n';
    htmlContent += 'table { border-collapse: collapse; width: 100%; }\n';
    htmlContent += 'th, td { border: 1px solid black; padding: 8px; text-align: left; }\n';
    htmlContent += 'th { background-color: #f2f2f2; font-weight: bold; }\n';
    htmlContent += '</style>\n';
    htmlContent += '</head>\n';
    htmlContent += '<body>\n';
    htmlContent += '<table>\n';
    
    // Headers
    const headers = Object.keys(data[0]);
    htmlContent += '<thead><tr>\n';
    headers.forEach((header) => {
      htmlContent += `<th>${this.formatHeader(header)}</th>`;
    });
    htmlContent += '</tr></thead>\n';
    
    // Rows
    htmlContent += '<tbody>\n';
    data.forEach((item) => {
      htmlContent += '<tr>';
      headers.forEach((header) => {
        const value = item[header] ?? '';
        htmlContent += `<td>${value}</td>`;
      });
      htmlContent += '</tr>\n';
    });
    htmlContent += '</tbody>\n';
    htmlContent += '</table>\n';
    htmlContent += '</body>\n';
    htmlContent += '</html>';

    // Descargar como XLS
    this.downloadFile(
      htmlContent,
      filename,
      'application/vnd.ms-excel'
    );
  }

  /**
   * Exporta recibos a Excel
   */
  private exportReceiptsToExcel(receipts: Receipt[], filename: string): void {
    if (!receipts || receipts.length === 0) {
      throw new Error('No hay recibos para exportar');
    }

    // Aplanar estructura
    const flatReceipts = receipts.map((receipt) => ({
      'Número Recibo': receipt.receiptNumber,
      'Fecha': receipt.transactionDate,
      'Usuario ID': receipt.userId,
      'Tipo Membresía': receipt.membershipType,
      'Fecha Inicio': receipt.membershipStartDate || 'N/A',
      'Fecha Fin': receipt.membershipEndDate || 'N/A',
      'Monto': receipt.total,
      'Moneda': receipt.currency,
      'Método Pago': receipt.paymentInfo.method,
      'Estado': receipt.transactionStatus,
      'Tipo Transacción': receipt.transactionType,
      'ID Transacción': receipt.paymentInfo.transactionId,
    }));

    this.exportToExcel(flatReceipts, filename);
  }

  /**
   * Exporta a JSON
   */
  private exportToJSON(data: any, filename: string): void {
    if (!data) {
      throw new Error('No hay datos para exportar');
    }

    const jsonContent = JSON.stringify(data, null, 2);
    this.downloadFile(
      jsonContent,
      filename,
      'application/json;charset=utf-8;'
    );
  }

  /**
   * Descarga un archivo
   */
  private downloadFile(
    content: string,
    filename: string,
    mimeType: string
  ): void {
    const blob = new Blob([content], { type: mimeType });
    const link = document.createElement('a');
    
    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', filename);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } else {
      // Fallback para navegadores antiguos
      window.open(
        `data:${mimeType},${encodeURIComponent(content)}`,
        '_blank'
      );
    }
  }

  /**
   * Formatea headers para mejor legibilidad
   */
  private formatHeader(header: string): string {
    return header
      .replace(/_/g, ' ')
      .replace(/([A-Z])/g, ' $1')
      .trim()
      .split(' ')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(' ');
  }

  /**
   * Crea un reporte completo con múltiples hojas (simulado)
   */
  exportCompleteReport(
    transactions: TransactionSummary[],
    receipts: Receipt[],
    stats: PaymentStats,
    format: ExportFormat = 'csv'
  ): void {
    const timestamp = new Date().toISOString().split('T')[0];
    
    // Exportar cada sección por separado
    this.exportTransactions(transactions, {
      format,
      filename: `reporte_transacciones_${timestamp}.${format}`,
    });

    this.exportReceipts(receipts, {
      format,
      filename: `reporte_recibos_${timestamp}.${format}`,
    });

    this.exportStats(stats, {
      format: 'json',
      filename: `reporte_estadisticas_${timestamp}.json`,
    });
  }
}

export const exportService = new ExportService();
