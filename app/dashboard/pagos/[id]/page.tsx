// app/dashboard/pagos/[id]/page.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { receiptService } from '@/services/receiptService';
import { Receipt } from '@/types/receipt';
import { ReceiptGenerator } from '@/components/receipt-generator';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowLeft, Download, Mail, Loader2 } from 'lucide-react';
import { AuthGuard } from '@/components/auth-guard';
import { useToast } from '@/hooks/use-toast';
import Link from 'next/link';

function ReceiptDetailContent() {
  const params = useParams();
  const router = useRouter();
  const { success, error: showError } = useToast();
  const [receipt, setReceipt] = useState<Receipt | null>(null);
  const [loading, setLoading] = useState(true);
  const [downloading, setDownloading] = useState(false);
  const [sendingEmail, setSendingEmail] = useState(false);

  useEffect(() => {
    loadReceipt();
  }, [params.id]);

  const loadReceipt = async () => {
    try {
      setLoading(true);
      const receiptData = await receiptService.getReceiptById(params.id as string);
      
      if (!receiptData) {
        showError('Recibo no encontrado');
        router.push('/dashboard/pagos');
        return;
      }
      
      setReceipt(receiptData);
    } catch (err) {
      console.error('Error al cargar recibo:', err);
      showError('Error al cargar el recibo');
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadPdf = async () => {
    if (!receipt) return;

    try {
      setDownloading(true);
      await receiptService.downloadReceiptPdf(receipt.id);
      success('Recibo descargado exitosamente');
    } catch (err) {
      console.error('Error al descargar PDF:', err);
      showError('Error al descargar el recibo');
    } finally {
      setDownloading(false);
    }
  };

  const handleSendEmail = async () => {
    if (!receipt) return;

    try {
      setSendingEmail(true);
      const sent = await receiptService.sendReceiptByEmail(
        receipt.id,
        receipt.billingInfo.email
      );
      
      if (sent) {
        success(`Recibo enviado a ${receipt.billingInfo.email}`);
        // Recargar para actualizar el estado de emailSent
        await loadReceipt();
      } else {
        showError('No se pudo enviar el recibo');
      }
    } catch (err) {
      console.error('Error al enviar email:', err);
      showError('Error al enviar el recibo por email');
    } finally {
      setSendingEmail(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando recibo...</p>
        </div>
      </div>
    );
  }

  if (!receipt) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <Card>
          <CardContent className="py-12 text-center">
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Recibo no encontrado
            </h3>
            <p className="text-gray-600 mb-4">
              El recibo que buscas no existe o no tienes acceso a él
            </p>
            <Link href="/dashboard/pagos">
              <Button>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Volver al Historial
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      {/* Header con navegación */}
      <div className="mb-6 flex items-center justify-between">
        <Link href="/dashboard/pagos">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Volver al Historial
          </Button>
        </Link>

        {receipt.emailSent && (
          <div className="text-sm text-green-600 flex items-center gap-2">
            <Mail className="h-4 w-4" />
            Email enviado
          </div>
        )}
      </div>

      {/* Generador de recibo */}
      <ReceiptGenerator
        receipt={receipt}
        onDownload={handleDownloadPdf}
        onEmail={handleSendEmail}
      />

      {/* Botones de acción adicionales */}
      <div className="mt-6 flex justify-center gap-4">
        <Button
          onClick={handleDownloadPdf}
          disabled={downloading}
          size="lg"
        >
          {downloading ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Descargando...
            </>
          ) : (
            <>
              <Download className="h-4 w-4 mr-2" />
              Descargar PDF
            </>
          )}
        </Button>

        <Button
          onClick={handleSendEmail}
          disabled={sendingEmail}
          variant="outline"
          size="lg"
        >
          {sendingEmail ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Enviando...
            </>
          ) : (
            <>
              <Mail className="h-4 w-4 mr-2" />
              {receipt.emailSent ? 'Reenviar por Email' : 'Enviar por Email'}
            </>
          )}
        </Button>
      </div>

      {/* Información adicional */}
      <Card className="mt-6">
        <CardContent className="p-6">
          <h3 className="text-sm font-semibold text-gray-700 mb-3">
            Información Adicional
          </h3>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-gray-600">Fecha de creación</p>
              <p className="font-medium">
                {new Date(receipt.createdAt).toLocaleString('es-CO', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </p>
            </div>
            {receipt.updatedAt && (
              <div>
                <p className="text-gray-600">Última actualización</p>
                <p className="font-medium">
                  {new Date(receipt.updatedAt).toLocaleString('es-CO', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default function ReceiptDetailPage() {
  return (
    <AuthGuard>
      <ReceiptDetailContent />
    </AuthGuard>
  );
}
