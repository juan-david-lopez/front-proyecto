// services/pdfGeneratorService.ts
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { Receipt, TransactionStatus, TransactionType } from '@/types/receipt';

class PDFGeneratorService {
  /**
   * Genera un PDF de recibo
   */
  async generateReceiptPDF(receipt: Receipt): Promise<Blob> {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    
    // Colores
    const primaryColor: [number, number, number] = [234, 88, 12]; // Orange-600
    const grayColor: [number, number, number] = [107, 114, 128]; // Gray-500
    const lightGray: [number, number, number] = [243, 244, 246]; // Gray-100
    
    let yPosition = 20;

    // ==================== ENCABEZADO ====================
    // Logo y título (simulado)
    doc.setFillColor(...primaryColor);
    doc.circle(20, yPosition + 5, 5, 'F');
    
    doc.setFontSize(24);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(...primaryColor);
    doc.text('FITZONE', 30, yPosition + 8);
    
    // Estado del recibo
    const statusX = pageWidth - 60;
    this.drawStatusBadge(doc, receipt.transactionStatus, statusX, yPosition);
    
    yPosition += 25;

    // Número de recibo
    doc.setFontSize(16);
    doc.setTextColor(0, 0, 0);
    doc.setFont('helvetica', 'bold');
    doc.text(`Recibo #${receipt.receiptNumber}`, 20, yPosition);
    
    yPosition += 3;
    doc.setLineWidth(0.5);
    doc.setDrawColor(...primaryColor);
    doc.line(20, yPosition, pageWidth - 20, yPosition);
    yPosition += 10;

    // ==================== INFORMACIÓN DEL CLIENTE ====================
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(...grayColor);
    doc.text('INFORMACIÓN DEL CLIENTE', 20, yPosition);
    yPosition += 8;

    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(0, 0, 0);
    
    const billingInfo = [
      ['Nombre:', receipt.billingInfo.name],
      ['Email:', receipt.billingInfo.email],
      ['Teléfono:', receipt.billingInfo.phone || 'N/A'],
      ['Dirección:', receipt.billingInfo.address || 'N/A'],
    ];

    billingInfo.forEach(([label, value]) => {
      doc.setFont('helvetica', 'bold');
      doc.text(label, 20, yPosition);
      doc.setFont('helvetica', 'normal');
      doc.text(value, 55, yPosition);
      yPosition += 6;
    });

    yPosition += 5;

    // ==================== INFORMACIÓN DE LA TRANSACCIÓN ====================
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(...grayColor);
    doc.text('INFORMACIÓN DE LA TRANSACCIÓN', 20, yPosition);
    yPosition += 8;

    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(0, 0, 0);

    const transactionInfo = [
      ['Fecha:', new Date(receipt.transactionDate).toLocaleString('es-CO')],
      ['Tipo:', this.getTransactionTypeName(receipt.transactionType)],
      ['ID Transacción:', receipt.paymentInfo.transactionId],
      ['Método de Pago:', this.getPaymentMethodName(receipt.paymentInfo.method)],
    ];

    if (receipt.paymentInfo.authorizationCode) {
      transactionInfo.push(['Código Autorización:', receipt.paymentInfo.authorizationCode]);
    }

    transactionInfo.forEach(([label, value]) => {
      doc.setFont('helvetica', 'bold');
      doc.text(label, 20, yPosition);
      doc.setFont('helvetica', 'normal');
      doc.text(value, 65, yPosition);
      yPosition += 6;
    });

    yPosition += 10;

    // ==================== DETALLES DEL SERVICIO ====================
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(...grayColor);
    doc.text('DETALLES DEL SERVICIO', 20, yPosition);
    yPosition += 5;

    // Tabla de items
    const tableData = receipt.items.map(item => [
      item.description,
      item.quantity.toString(),
      this.formatCurrency(item.unitPrice, receipt.currency),
      this.formatCurrency(item.subtotal, receipt.currency),
    ]);

    autoTable(doc, {
      startY: yPosition,
      head: [['Descripción', 'Cantidad', 'Precio Unit.', 'Subtotal']],
      body: tableData,
      theme: 'striped',
      headStyles: {
        fillColor: primaryColor,
        textColor: [255, 255, 255],
        fontSize: 10,
        fontStyle: 'bold',
      },
      bodyStyles: {
        fontSize: 9,
      },
      columnStyles: {
        0: { cellWidth: 80 },
        1: { cellWidth: 30, halign: 'center' },
        2: { cellWidth: 35, halign: 'right' },
        3: { cellWidth: 35, halign: 'right' },
      },
      margin: { left: 20, right: 20 },
    });

    yPosition = (doc as any).lastAutoTable.finalY + 10;

    // ==================== RESUMEN DE PAGO ====================
    const summaryX = pageWidth - 80;
    
    doc.setFillColor(...lightGray);
    doc.rect(summaryX - 5, yPosition - 5, 75, 45, 'F');
    
    doc.setFontSize(10);
    doc.setTextColor(0, 0, 0);

    const summaryItems = [
      ['Subtotal:', this.formatCurrency(receipt.subtotal, receipt.currency)],
      ['IVA:', this.formatCurrency(receipt.tax, receipt.currency)],
    ];

    if (receipt.discount > 0) {
      summaryItems.push([
        'Descuento:',
        `- ${this.formatCurrency(receipt.discount, receipt.currency)}`
      ]);
    }

    summaryItems.forEach(([label, value]) => {
      doc.setFont('helvetica', 'normal');
      doc.text(label, summaryX, yPosition);
      doc.setFont('helvetica', 'bold');
      doc.text(value, summaryX + 50, yPosition, { align: 'right' });
      yPosition += 7;
    });

    // Total
    yPosition += 3;
    doc.setLineWidth(0.5);
    doc.setDrawColor(...primaryColor);
    doc.line(summaryX, yPosition, summaryX + 70, yPosition);
    yPosition += 8;

    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(...primaryColor);
    doc.text('TOTAL:', summaryX, yPosition);
    doc.text(
      this.formatCurrency(receipt.total, receipt.currency),
      summaryX + 50,
      yPosition,
      { align: 'right' }
    );

    yPosition += 20;

    // ==================== INFORMACIÓN DE MEMBRESÍA ====================
    if (receipt.membershipStartDate && receipt.membershipEndDate) {
      yPosition = Math.max(yPosition, (doc as any).lastAutoTable.finalY + 15);
      
      doc.setFillColor(...primaryColor);
      doc.rect(20, yPosition - 5, pageWidth - 40, 30, 'F');
      
      doc.setFontSize(11);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(255, 255, 255);
      doc.text('INFORMACIÓN DE MEMBRESÍA', 25, yPosition + 3);
      
      yPosition += 10;
      doc.setFontSize(9);
      doc.setFont('helvetica', 'normal');
      
      const membershipText = `Membresía ${receipt.membershipType} válida desde ${
        new Date(receipt.membershipStartDate).toLocaleDateString('es-CO')
      } hasta ${
        new Date(receipt.membershipEndDate).toLocaleDateString('es-CO')
      }`;
      
      doc.text(membershipText, 25, yPosition + 3);
      
      yPosition += 15;
    }

    // ==================== NOTAS ====================
    if (receipt.notes) {
      yPosition += 10;
      
      doc.setFontSize(10);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(...grayColor);
      doc.text('NOTAS:', 20, yPosition);
      
      yPosition += 6;
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(0, 0, 0);
      doc.setFontSize(9);
      
      const splitNotes = doc.splitTextToSize(receipt.notes, pageWidth - 40);
      doc.text(splitNotes, 20, yPosition);
      yPosition += splitNotes.length * 5;
    }

    // ==================== PIE DE PÁGINA ====================
    const footerY = pageHeight - 30;
    
    doc.setLineWidth(0.3);
    doc.setDrawColor(...grayColor);
    doc.line(20, footerY, pageWidth - 20, footerY);
    
    doc.setFontSize(8);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(...grayColor);
    
    const footerText = 'Gracias por confiar en FitZone. Este documento es un comprobante válido de pago.';
    doc.text(footerText, pageWidth / 2, footerY + 6, { align: 'center' });
    
    doc.setFontSize(7);
    doc.text(
      `Generado el ${new Date().toLocaleString('es-CO')}`,
      pageWidth / 2,
      footerY + 12,
      { align: 'center' }
    );

    // Convertir a Blob
    const pdfBlob = doc.output('blob');
    return pdfBlob;
  }

  /**
   * Descarga un PDF de recibo
   */
  async downloadReceiptPDF(receipt: Receipt): Promise<void> {
    const pdfBlob = await this.generateReceiptPDF(receipt);
    const url = URL.createObjectURL(pdfBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${receipt.receiptNumber}.pdf`;
    link.click();
    URL.revokeObjectURL(url);
  }

  /**
   * Genera un PDF de múltiples recibos
   */
  async generateBatchReceiptsPDF(receipts: Receipt[]): Promise<Blob> {
    const doc = new jsPDF();
    
    for (let i = 0; i < receipts.length; i++) {
      if (i > 0) {
        doc.addPage();
      }
      
      // Generar cada recibo en una nueva página
      // (Aquí se repetiría la lógica de generateReceiptPDF pero sin crear nuevo doc)
      // Por simplicidad, podemos generar PDFs separados y combinarlos
    }
    
    return doc.output('blob');
  }

  // ==================== MÉTODOS AUXILIARES ====================

  private drawStatusBadge(
    doc: jsPDF,
    status: TransactionStatus,
    x: number,
    y: number
  ): void {
    const statusConfig = {
      [TransactionStatus.COMPLETED]: {
        color: [34, 197, 94] as [number, number, number], // Green
        text: 'COMPLETADO',
      },
      [TransactionStatus.PENDING]: {
        color: [234, 179, 8] as [number, number, number], // Yellow
        text: 'PENDIENTE',
      },
      [TransactionStatus.FAILED]: {
        color: [239, 68, 68] as [number, number, number], // Red
        text: 'FALLIDO',
      },
      [TransactionStatus.REFUNDED]: {
        color: [59, 130, 246] as [number, number, number], // Blue
        text: 'REEMBOLSADO',
      },
      [TransactionStatus.CANCELLED]: {
        color: [156, 163, 175] as [number, number, number], // Gray
        text: 'CANCELADO',
      },
    };

    const config = statusConfig[status];
    
    doc.setFillColor(...config.color);
    doc.roundedRect(x, y, 50, 10, 2, 2, 'F');
    
    doc.setFontSize(8);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(255, 255, 255);
    doc.text(config.text, x + 25, y + 7, { align: 'center' });
  }

  private getTransactionTypeName(type: TransactionType): string {
    const names = {
      [TransactionType.MEMBERSHIP_PURCHASE]: 'Compra de Membresía',
      [TransactionType.MEMBERSHIP_RENEWAL]: 'Renovación de Membresía',
      [TransactionType.MEMBERSHIP_UPGRADE]: 'Upgrade de Membresía',
      [TransactionType.REFUND]: 'Reembolso',
      [TransactionType.ADJUSTMENT]: 'Ajuste',
    };
    return names[type] || type;
  }

  private getPaymentMethodName(method: string): string {
    const names: { [key: string]: string } = {
      CREDIT_CARD: 'Tarjeta de Crédito',
      DEBIT_CARD: 'Tarjeta de Débito',
      CASH: 'Efectivo',
      TRANSFER: 'Transferencia Bancaria',
      PSE: 'PSE',
    };
    return names[method] || method;
  }

  private formatCurrency(amount: number, currency: string = 'COP'): string {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency,
    }).format(amount);
  }
}

export const pdfGeneratorService = new PDFGeneratorService();
