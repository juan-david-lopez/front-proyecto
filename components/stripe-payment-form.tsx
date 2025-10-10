"use client"

import { useState } from 'react'
import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Lock, CreditCard, AlertCircle, CheckCircle } from 'lucide-react'
import paymentService from '@/services/paymentService'
import { useAuth } from '@/contexts/auth-context'

interface StripePaymentFormProps {
  membershipTypeId: number
  membershipTypeName: string
  amount: number
  onSuccess: (paymentIntentId: string, receiptId?: string) => void
  onError: (error: string) => void
}

export function StripePaymentForm({
  membershipTypeId,
  membershipTypeName,
  amount,
  onSuccess,
  onError,
}: StripePaymentFormProps) {
  const stripe = useStripe()
  const elements = useElements()
  const { user } = useAuth()

  const [processing, setProcessing] = useState(false)
  const [succeeded, setSucceeded] = useState(false)
  const [cardError, setCardError] = useState<string | null>(null)
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'checkout'>('card')

  // Datos de facturación
  const [billingInfo, setBillingInfo] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: '',
    address: '',
    city: '',
  })

  const handleBillingChange = (field: string, value: string) => {
    setBillingInfo(prev => ({ ...prev, [field]: value }))
  }

  const handleCardChange = (event: any) => {
    setCardError(event.error ? event.error.message : null)
  }

  const handlePaymentIntentSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!stripe || !elements || !user) {
      onError('Stripe no está inicializado correctamente')
      return
    }

    if (!billingInfo.name || !billingInfo.email) {
      onError('Por favor completa los datos de facturación')
      return
    }

    setProcessing(true)
    setCardError(null)

    try {
      // 1. Crear Payment Intent en el backend
      console.log('🔄 Creando Payment Intent...')
      const intentResponse = await paymentService.createPaymentIntent({
        amount,
        currency: 'cop',
        membershipType: membershipTypeName,
        userId: parseInt(user.id, 10),
        description: `Membresía ${membershipTypeName} - FitZone`,
        metadata: {
          membershipType: membershipTypeName,
          membershipTypeId: membershipTypeId.toString(),
          duration: '1_month',
        },
      })

      // El backend puede devolver el objeto directamente o con wrapper success
      const clientSecret = intentResponse.clientSecret
      const paymentIntentId = intentResponse.paymentIntentId
      
      if (!clientSecret || !paymentIntentId) {
        throw new Error(intentResponse.error || 'Error al crear la intención de pago: no se recibió clientSecret')
      }

      console.log('✅ Payment Intent creado:', paymentIntentId)

      // 2. Obtener el CardElement
      const cardElement = elements.getElement(CardElement)
      if (!cardElement) {
        throw new Error('No se pudo obtener el elemento de tarjeta')
      }

      // 3. Confirmar el pago con Stripe.js
      console.log('🔄 Confirmando pago con Stripe...')
      const { error: stripeError, paymentIntent } = await stripe.confirmCardPayment(
        clientSecret, // Usar la variable local validada
        {
          payment_method: {
            card: cardElement,
            billing_details: {
              name: billingInfo.name,
              email: billingInfo.email,
              phone: billingInfo.phone || undefined,
              address: billingInfo.address
                ? {
                    line1: billingInfo.address,
                    city: billingInfo.city || undefined,
                    country: 'CO',
                  }
                : undefined,
            },
          },
        }
      )

      if (stripeError) {
        throw new Error(stripeError.message || 'Error al procesar el pago')
      }

      if (paymentIntent?.status === 'succeeded') {
        console.log('✅ Pago confirmado en Stripe:', paymentIntent.id)

        // 4. Activar membresía en el backend
        console.log('🔄 Activando membresía en backend...')
        const activationResponse = await paymentService.activateMembership(
          paymentIntent.id,
          parseInt(user.id, 10),
          membershipTypeName
        )

        // Verificar si la activación fue exitosa (algunos backends no devuelven success)
        const activationSuccess = activationResponse.success !== false && 
                                   (activationResponse.data?.membershipId || activationResponse.message)
        
        if (!activationSuccess) {
          console.warn('⚠️ Membresía no activada correctamente:', activationResponse)
          throw new Error(activationResponse.error || 'Error al activar la membresía')
        }

        console.log('✅ Membresía activada:', activationResponse.data || activationResponse)
        
        setSucceeded(true)
        onSuccess(
          paymentIntent.id, 
          activationResponse.data?.membershipId?.toString() || 'unknown'
        )
      } else {
        throw new Error('El pago no se completó correctamente')
      }
    } catch (error: any) {
      console.error('❌ Error en el proceso de pago:', error)
      setCardError(error.message || 'Error al procesar el pago')
      onError(error.message || 'Error al procesar el pago')
    } finally {
      setProcessing(false)
    }
  }

  const handleCheckoutSession = async () => {
    if (!user) {
      onError('Usuario no autenticado')
      return
    }

    if (!billingInfo.name || !billingInfo.email) {
      onError('Por favor completa los datos de facturación')
      return
    }

    setProcessing(true)

    try {
      console.log('🔄 Creando Checkout Session...')
      const sessionResponse = await paymentService.createCheckoutSession({
        membershipType: membershipTypeName,
        userId: parseInt(user.id, 10),
        successUrl: `${window.location.origin}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
        cancelUrl: `${window.location.origin}/checkout/cancel`,
        billingInfo: {
          name: billingInfo.name,
          email: billingInfo.email,
          phone: billingInfo.phone || undefined,
          address: billingInfo.address || undefined,
          city: billingInfo.city || undefined,
          country: 'Colombia',
        },
      })

      if (!sessionResponse.success || !sessionResponse.sessionUrl) {
        throw new Error(sessionResponse.error || 'Error al crear la sesión de pago')
      }

      console.log('✅ Checkout Session creado, redirigiendo...')
      // Redirigir a Stripe Checkout
      window.location.href = sessionResponse.sessionUrl
    } catch (error: any) {
      console.error('❌ Error al crear Checkout Session:', error)
      onError(error.message || 'Error al crear la sesión de pago')
      setProcessing(false)
    }
  }

  const cardElementOptions = {
    style: {
      base: {
        fontSize: '16px',
        color: 'hsl(var(--foreground))',
        '::placeholder': {
          color: 'hsl(var(--muted-foreground))',
        },
        iconColor: 'hsl(var(--primary))',
      },
      invalid: {
        color: 'hsl(var(--destructive))',
        iconColor: 'hsl(var(--destructive))',
      },
    },
    hidePostalCode: true,
  }

  return (
    <div className="space-y-6">
      {/* Selector de método de pago */}
      <Card>
        <CardContent className="pt-6 space-y-4">
          <Label className="text-base font-semibold flex items-center gap-2">
            <CreditCard className="w-5 h-5" />
            Método de pago
          </Label>
          
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => setPaymentMethod('card')}
              className={`p-4 rounded-lg border-2 transition-all ${
                paymentMethod === 'card'
                  ? 'border-[#ff6b00] bg-[#ff6b00]/10'
                  : 'border-border hover:border-[#ff6b00]/50'
              }`}
            >
              <div className="text-sm font-medium">Pago directo</div>
              <div className="text-xs text-muted-foreground mt-1">Tarjeta de crédito/débito</div>
            </button>

            <button
              type="button"
              onClick={() => setPaymentMethod('checkout')}
              className={`p-4 rounded-lg border-2 transition-all ${
                paymentMethod === 'checkout'
                  ? 'border-[#ff6b00] bg-[#ff6b00]/10'
                  : 'border-border hover:border-[#ff6b00]/50'
              }`}
            >
              <div className="text-sm font-medium">Stripe Checkout</div>
              <div className="text-xs text-muted-foreground mt-1">Página segura de Stripe</div>
            </button>
          </div>
        </CardContent>
      </Card>

      {/* Datos de facturación */}
      <Card>
        <CardContent className="pt-6 space-y-4">
          <Label className="text-base font-semibold">Información de facturación</Label>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="billing-name">Nombre completo *</Label>
              <Input
                id="billing-name"
                value={billingInfo.name}
                onChange={(e) => handleBillingChange('name', e.target.value)}
                placeholder="Juan Pérez"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="billing-email">Email *</Label>
              <Input
                id="billing-email"
                type="email"
                value={billingInfo.email}
                onChange={(e) => handleBillingChange('email', e.target.value)}
                placeholder="juan@example.com"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="billing-phone">Teléfono</Label>
              <Input
                id="billing-phone"
                value={billingInfo.phone}
                onChange={(e) => handleBillingChange('phone', e.target.value)}
                placeholder="+57 300 123 4567"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="billing-city">Ciudad</Label>
              <Input
                id="billing-city"
                value={billingInfo.city}
                onChange={(e) => handleBillingChange('city', e.target.value)}
                placeholder="Bogotá"
              />
            </div>

            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="billing-address">Dirección</Label>
              <Input
                id="billing-address"
                value={billingInfo.address}
                onChange={(e) => handleBillingChange('address', e.target.value)}
                placeholder="Calle 123 #45-67"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tarjeta de crédito (solo si método es 'card') */}
      {paymentMethod === 'card' && (
        <Card>
          <CardContent className="pt-6 space-y-4">
            <Label className="text-base font-semibold flex items-center gap-2">
              <CreditCard className="w-5 h-5" />
              Datos de la tarjeta
            </Label>

            <div className="p-4 border rounded-lg bg-background">
              <CardElement
                options={cardElementOptions}
                onChange={handleCardChange}
              />
            </div>

            {cardError && (
              <div className="flex items-start gap-2 p-3 bg-destructive/10 border border-destructive/20 rounded-lg">
                <AlertCircle className="w-5 h-5 text-destructive flex-shrink-0 mt-0.5" />
                <p className="text-sm text-destructive">{cardError}</p>
              </div>
            )}

            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Lock className="w-4 h-4" />
              <span>Tu información está protegida y encriptada por Stripe</span>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Estado de éxito */}
      {succeeded && (
        <div className="flex items-center gap-2 p-4 bg-green-500/10 border border-green-500/20 rounded-lg">
          <CheckCircle className="w-5 h-5 text-green-500" />
          <p className="text-sm text-green-600 dark:text-green-400">
            ¡Pago procesado exitosamente!
          </p>
        </div>
      )}

      {/* Botón de pago */}
      <Button
        onClick={paymentMethod === 'card' ? handlePaymentIntentSubmit : handleCheckoutSession}
        disabled={processing || succeeded || (paymentMethod === 'card' && (!stripe || !elements))}
        size="lg"
        className="w-full bg-[#ff6b00] hover:bg-[#ff6b00]/90 text-white font-semibold py-6"
      >
        {processing ? (
          <>
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2" />
            Procesando pago...
          </>
        ) : succeeded ? (
          'Pago completado ✓'
        ) : paymentMethod === 'checkout' ? (
          `Ir a Stripe Checkout - ${new Intl.NumberFormat('es-CO', {
            style: 'currency',
            currency: 'COP',
            minimumFractionDigits: 0,
          }).format(amount)}`
        ) : (
          `Pagar ${new Intl.NumberFormat('es-CO', {
            style: 'currency',
            currency: 'COP',
            minimumFractionDigits: 0,
          }).format(amount)}`
        )}
      </Button>

      {/* Tarjetas de prueba info */}
      {process.env.NODE_ENV === 'development' && (
        <Card className="bg-blue-500/5 border-blue-500/20">
          <CardContent className="pt-6">
            <p className="text-xs font-semibold text-blue-600 dark:text-blue-400 mb-2">
              🧪 Modo de prueba - Usa estas tarjetas:
            </p>
            <ul className="text-xs text-muted-foreground space-y-1">
              <li>• Visa: 4242 4242 4242 4242</li>
              <li>• Mastercard: 5555 5555 5555 4444</li>
              <li>• CVV: cualquier 3 dígitos • Fecha: cualquier fecha futura</li>
            </ul>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
