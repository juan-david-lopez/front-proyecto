'use client';

import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { AlertCircle, Loader, Lock, CheckCircle } from 'lucide-react';
import { Reservation } from '@/types/reservation';
import { reservationService } from '@/services/reservationService';
import { CardElement, Elements, useElements, useStripe } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import { useToast } from '@/hooks/use-toast';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

interface PaymentFormProps {
  groupClassId: number;
  groupClass: Reservation;
  price: number;
  onSuccess: () => void;
  onClose: () => void;
}

function PaymentFormContent({ groupClassId, groupClass, price, onSuccess, onClose }: PaymentFormProps) {
  const stripe = useStripe();
  const elements = useElements();
  const { success: showSuccess, error: showError } = useToast();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements) {
      setError('Stripe no esta cargado');
      return;
    }

    try {
      setLoading(true);
      setError(null);

      // 1. Crear PaymentMethod con Stripe
      const cardElement = elements.getElement(CardElement);
      const { error: pmError, paymentMethod } = await stripe.createPaymentMethod({
        type: 'card',
        card: cardElement!,
      });

      if (pmError) {
        throw new Error(pmError.message);
      }

      console.log('PaymentMethod creado:', paymentMethod?.id);

      // 2. Enviar al backend
      const response = await reservationService.joinGroupClassWithPayment(groupClassId, paymentMethod!.id);

      console.log('Inscripcion exitosa:', response);
      
      // Mostrar notificación de éxito
      setSuccessMessage(`¡Pago exitoso! Ya estás inscrito en ${groupClass.groupClass?.name || 'la clase'}`);
      showSuccess(
        '¡Pago Exitoso!',
        `Pago de $${price.toLocaleString('es-CO')} COP procesado correctamente. Ya estás inscrito en la clase.`
      );
      
      // Llamar al callback de exito
      onSuccess();
      
      // Cerrar el modal despues de 2 segundos
      setTimeout(() => {
        onClose();
      }, 2000);
    } catch (err: any) {
      console.error('Error en pago:', err);
      const errorMsg = err.message || 'Error procesando el pago. Intenta de nuevo.';
      setError(errorMsg);
      showError('Error en el pago', errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Resumen de la clase */}
      <Card className="bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700">
        <CardContent className="pt-4">
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm text-slate-600 dark:text-slate-400">Clase:</span>
              <span className="font-semibold text-black dark:text-white">
                {groupClass.groupClass?.name}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-slate-600 dark:text-slate-400">Fecha:</span>
              <span className="font-semibold text-black dark:text-white">
                {new Date(groupClass.scheduledDate).toLocaleDateString('es-ES')}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-slate-600 dark:text-slate-400">Hora:</span>
              <span className="font-semibold text-black dark:text-white">
                {groupClass.scheduledStartTime} - {groupClass.scheduledEndTime}
              </span>
            </div>
            <div className="border-t border-slate-300 dark:border-slate-600 pt-2 mt-2">
              <div className="flex justify-between items-center">
                <span className="font-semibold text-black dark:text-white">Total a pagar:</span>
                <span className="text-2xl font-bold text-red-600 dark:text-red-500">
                  ${price.toLocaleString('es-CO')}
                </span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Informacion de error */}
      {error && (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-3">
          <div className="flex items-center gap-2 text-red-700 dark:text-red-400">
            <AlertCircle className="w-5 h-5" />
            <span className="text-sm">{error}</span>
          </div>
        </div>
      )}

      {/* Mensaje de éxito */}
      {successMessage && (
        <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-3">
          <div className="flex items-center gap-2 text-green-700 dark:text-green-400">
            <CheckCircle className="w-5 h-5" />
            <span className="text-sm font-semibold">{successMessage}</span>
          </div>
        </div>
      )}

      {/* Formulario de tarjeta */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg p-4">
        <label className="block text-sm font-semibold text-black dark:text-white mb-3">
          Informacion de la tarjeta
        </label>
        <CardElement
          options={{
            style: {
              base: {
                fontSize: '16px',
                color: '#1e293b',
                backgroundColor: '#ffffff',
                '::placeholder': {
                  color: '#94a3b8',
                },
              },
              invalid: {
                color: '#dc2626',
              },
            },
          }}
        />
      </div>

      {/* Informacion de seguridad */}
      <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-3">
        <div className="flex items-center gap-2 text-blue-700 dark:text-blue-400">
          <Lock className="w-4 h-4" />
          <span className="text-xs font-medium">
            Pago seguro procesado por Stripe
          </span>
        </div>
      </div>

      {/* Tarjetas de prueba */}
      <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-3">
        <p className="text-xs text-yellow-800 dark:text-yellow-200">
          <strong>Para pruebas:</strong> Tarjeta 4242 4242 4242 4242, cualquier fecha futura y CVC
        </p>
      </div>

      {/* Botones de accion */}
      <div className="flex gap-3">
        <Button
          type="button"
          onClick={onClose}
          variant="outline"
          disabled={loading}
          className="flex-1 dark:bg-slate-800 dark:border-slate-700 dark:text-white"
        >
          Cancelar
        </Button>
        <Button
          type="submit"
          disabled={loading || !stripe}
          className="flex-1 bg-blue-600 hover:bg-blue-700 dark:bg-blue-600 dark:hover:bg-blue-700 text-white"
        >
          {loading ? (
            <>
              <Loader className="w-4 h-4 mr-2 animate-spin" />
              Procesando...
            </>
          ) : (
            `Pagar $${price.toLocaleString('es-CO')}`
          )}
        </Button>
      </div>
    </form>
  );
}

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  groupClass: Reservation;
  groupClassId: number;
  price: number;
}

export function PaymentModal({
  isOpen,
  onClose,
  onSuccess,
  groupClass,
  groupClassId,
  price,
}: PaymentModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md dark:bg-slate-950 dark:border-slate-700">
        <DialogHeader>
          <DialogTitle className="text-black dark:text-white">
            Procesar Pago
          </DialogTitle>
          <DialogDescription className="text-slate-600 dark:text-slate-400">
            Completa el pago para unirte a {groupClass.groupClass?.name}
          </DialogDescription>
        </DialogHeader>

        <Elements stripe={stripePromise}>
          <PaymentFormContent
            groupClassId={groupClassId}
            groupClass={groupClass}
            price={price}
            onSuccess={() => {
              onSuccess();
              onClose();
            }}
            onClose={onClose}
          />
        </Elements>
      </DialogContent>
    </Dialog>
  );
}
