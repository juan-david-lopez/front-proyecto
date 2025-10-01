// components/receipt-generator.tsx
'use client';

import React from 'react';
import { Receipt, PaymentMethod, TransactionType } from '@/types/receipt';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Download, Mail, CheckCircle2, CreditCard, Banknote, Building2 } from 'lucide-react';

interface ReceiptGeneratorProps {
  receipt: Receipt;
  onDownload?: () => void;
  onEmail?: () => void;
}

export function ReceiptGenerator({ receipt, onDownload, onEmail }: ReceiptGeneratorProps) {
  // Formatear fecha
  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-CO', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Formatear moneda
  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: receipt.currency
    }).format(amount);
  };

  // Obtener icono de método de pago
  const getPaymentMethodIcon = (method: PaymentMethod) => {
    switch (method) {
      case PaymentMethod.CREDIT_CARD:
      case PaymentMethod.DEBIT_CARD:
        return <CreditCard className="h-5 w-5" />;
      case PaymentMethod.CASH:
        return <Banknote className="h-5 w-5" />;
      case PaymentMethod.TRANSFER:
      case PaymentMethod.PSE:
        return <Building2 className="h-5 w-5" />;
      default:
        return <CreditCard className="h-5 w-5" />;
    }
  };

  // Obtener nombre legible del método de pago
  const getPaymentMethodName = (method: PaymentMethod): string => {
    const names = {
      [PaymentMethod.CREDIT_CARD]: 'Tarjeta de Crédito',
      [PaymentMethod.DEBIT_CARD]: 'Tarjeta de Débito',
      [PaymentMethod.CASH]: 'Efectivo',
      [PaymentMethod.TRANSFER]: 'Transferencia Bancaria',
      [PaymentMethod.PSE]: 'PSE'
    };
    return names[method] || method;
  };

  // Obtener nombre del tipo de transacción
  const getTransactionTypeName = (type: TransactionType): string => {
    const names = {
      [TransactionType.MEMBERSHIP_PURCHASE]: 'Compra de Membresía',
      [TransactionType.MEMBERSHIP_RENEWAL]: 'Renovación de Membresía',
      [TransactionType.MEMBERSHIP_UPGRADE]: 'Actualización de Membresía',
      [TransactionType.REFUND]: 'Reembolso',
      [TransactionType.ADJUSTMENT]: 'Ajuste'
    };
    return names[type] || type;
  };

  return (
    <div className="space-y-4">
      {/* Acciones rápidas */}
      <div className="flex justify-end gap-2">
        {onDownload && (
          <Button
            onClick={onDownload}
            variant="outline"
            size="sm"
          >
            <Download className="h-4 w-4 mr-2" />
            Descargar PDF
          </Button>
        )}
        {onEmail && (
          <Button
            onClick={onEmail}
            variant="outline"
            size="sm"
          >
            <Mail className="h-4 w-4 mr-2" />
            Enviar por Email
          </Button>
        )}
      </div>

      {/* Recibo */}
      <Card className="receipt-container">
        <CardContent className="p-8 space-y-6">
          {/* Header */}
          <div className="flex justify-between items-start border-b pb-6">
            <div>
              <h1 className="text-3xl font-bold text-orange-600">FitZone</h1>
              <p className="text-sm text-gray-600 mt-1">
                Tu gimnasio de confianza
              </p>
              <p className="text-xs text-gray-500 mt-2">
                Calle 123 #45-67, Bogotá, Colombia<br />
                Tel: +57 (1) 234-5678<br />
                NIT: 900.123.456-7<br />
                info@fitzone.com
              </p>
            </div>
            <div className="text-right">
              <div className="inline-flex items-center gap-2 bg-green-100 text-green-800 px-3 py-1 rounded-full mb-2">
                <CheckCircle2 className="h-4 w-4" />
                <span className="text-sm font-medium">Pagado</span>
              </div>
              <p className="text-2xl font-bold text-gray-800">
                {receipt.receiptNumber}
              </p>
              <p className="text-sm text-gray-600 mt-1">
                {formatDate(receipt.transactionDate)}
              </p>
            </div>
          </div>

          {/* Cliente */}
          <div className="border-b pb-6">
            <h2 className="text-lg font-semibold mb-3">Información del Cliente</h2>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-gray-600">Nombre</p>
                <p className="font-medium">{receipt.billingInfo.name}</p>
              </div>
              <div>
                <p className="text-gray-600">Email</p>
                <p className="font-medium">{receipt.billingInfo.email}</p>
              </div>
              {receipt.billingInfo.phone && (
                <div>
                  <p className="text-gray-600">Teléfono</p>
                  <p className="font-medium">{receipt.billingInfo.phone}</p>
                </div>
              )}
              {receipt.billingInfo.taxId && (
                <div>
                  <p className="text-gray-600">Documento</p>
                  <p className="font-medium">{receipt.billingInfo.taxId}</p>
                </div>
              )}
            </div>
          </div>

          {/* Tipo de transacción */}
          <div className="border-b pb-6">
            <h2 className="text-lg font-semibold mb-3">Detalles de la Transacción</h2>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-gray-600">Tipo</p>
                <p className="font-medium">{getTransactionTypeName(receipt.transactionType)}</p>
              </div>
              <div>
                <p className="text-gray-600">ID de Transacción</p>
                <p className="font-medium font-mono text-xs">{receipt.paymentInfo.transactionId}</p>
              </div>
              {receipt.membershipStartDate && (
                <>
                  <div>
                    <p className="text-gray-600">Inicio de Membresía</p>
                    <p className="font-medium">
                      {new Date(receipt.membershipStartDate).toLocaleDateString('es-CO')}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-600">Fin de Membresía</p>
                    <p className="font-medium">
                      {receipt.membershipEndDate 
                        ? new Date(receipt.membershipEndDate).toLocaleDateString('es-CO')
                        : 'N/A'
                      }
                    </p>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Items */}
          <div className="border-b pb-6">
            <h2 className="text-lg font-semibold mb-3">Detalle de Pago</h2>
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b text-left">
                  <th className="pb-2 font-semibold">Descripción</th>
                  <th className="pb-2 font-semibold text-center">Cant.</th>
                  <th className="pb-2 font-semibold text-right">Precio Unit.</th>
                  <th className="pb-2 font-semibold text-right">Subtotal</th>
                </tr>
              </thead>
              <tbody>
                {receipt.items.map((item, index) => (
                  <tr key={index} className="border-b">
                    <td className="py-3">
                      <p className="font-medium">{item.description}</p>
                    </td>
                    <td className="py-3 text-center">{item.quantity}</td>
                    <td className="py-3 text-right">{formatCurrency(item.unitPrice)}</td>
                    <td className="py-3 text-right font-medium">{formatCurrency(item.subtotal)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Totales */}
          <div className="border-b pb-6">
            <div className="flex justify-end">
              <div className="w-64 space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Subtotal:</span>
                  <span className="font-medium">{formatCurrency(receipt.subtotal)}</span>
                </div>
                {receipt.discount > 0 && (
                  <div className="flex justify-between text-green-600">
                    <span>Descuento:</span>
                    <span className="font-medium">-{formatCurrency(receipt.discount)}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-gray-600">IVA (19%):</span>
                  <span className="font-medium">{formatCurrency(receipt.tax)}</span>
                </div>
                <div className="flex justify-between text-lg font-bold border-t pt-2">
                  <span>Total:</span>
                  <span className="text-orange-600">{formatCurrency(receipt.total)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Método de pago */}
          <div className="border-b pb-6">
            <h2 className="text-lg font-semibold mb-3">Método de Pago</h2>
            <div className="flex items-center gap-3 text-sm">
              <div className="text-orange-600">
                {getPaymentMethodIcon(receipt.paymentInfo.method)}
              </div>
              <div>
                <p className="font-medium">{getPaymentMethodName(receipt.paymentInfo.method)}</p>
                {receipt.paymentInfo.cardLastFour && (
                  <p className="text-gray-600">
                    {receipt.paymentInfo.cardBrand} •••• {receipt.paymentInfo.cardLastFour}
                  </p>
                )}
                {receipt.paymentInfo.authorizationCode && (
                  <p className="text-xs text-gray-500">
                    Código de autorización: {receipt.paymentInfo.authorizationCode}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Notas y términos */}
          {(receipt.notes || receipt.terms) && (
            <div className="space-y-3">
              {receipt.notes && (
                <div>
                  <h3 className="text-sm font-semibold mb-1">Notas:</h3>
                  <p className="text-xs text-gray-600">{receipt.notes}</p>
                </div>
              )}
              {receipt.terms && (
                <div>
                  <h3 className="text-sm font-semibold mb-1">Términos y Condiciones:</h3>
                  <p className="text-xs text-gray-600">{receipt.terms}</p>
                </div>
              )}
            </div>
          )}

          {/* Footer */}
          <div className="text-center pt-6 border-t">
            <p className="text-xs text-gray-500">
              Gracias por confiar en FitZone. Para cualquier consulta, contáctanos a info@fitzone.com
            </p>
            <p className="text-xs text-gray-400 mt-2">
              Este es un recibo electrónico válido. No requiere firma.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
