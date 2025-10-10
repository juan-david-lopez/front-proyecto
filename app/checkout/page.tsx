"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Check, Lock, Crown, Star, Users, Shield } from "lucide-react"
import Link from "next/link"
import { useSearchParams, useRouter } from "next/navigation"
import { useState, useEffect } from "react"
import { FitZoneLogo } from "@/components/fitzone-logo"
import { useAuth } from "@/contexts/auth-context"
import membershipService from "@/services/membershipService"
import { MembershipType } from "@/types/membership"
import { useToast } from "@/hooks/use-toast"
import { loadStripe } from '@stripe/stripe-js'
import { Elements } from '@stripe/react-stripe-js'
import { StripePaymentForm } from '@/components/stripe-payment-form'

// Inicializar Stripe con la clave pública
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || '')

const planData = {
  basico: {
    title: "Básico",
    price: "$50,000",
    description: "Perfecto para comenzar tu journey fitness",
    benefits: [
      "Acceso al área de pesas",
      "2 horas diarias de entrenamiento",
      "Máquinas cardiovasculares",
      "Vestuarios y duchas",
      "Horario: 6AM - 8PM",
      "Acceso a una sola sucursal",
    ],
  },
  premium: {
    title: "Premium",
    price: "$70,000",
    description: "La opción más completa para resultados óptimos",
    benefits: [
      "Todo lo del plan básico",
      "Acceso 24/7 con tiempo ilimitado",
      "Clases grupales ilimitadas",
      "Entrenador personal (2 sesiones/mes)",
      "Área de funcional",
      "Evaluación nutricional",
      "Gamificación y retos mensuales",
    ],
  },
  elite: {
    title: "ELITE",
    price: "$90,000",
    description: "El mejor valor para miembros comprometidos",
    benefits: [
      "Todo lo del plan Premium",
      "Acceso a cualquier sucursal",
      "Entrenador personal (4 sesiones/mes)",
      "Sauna y jacuzzi",
      "Plan nutricional personalizado",
      "Invitaciones para amigos (2/mes)",
      "20% de descuento en reservas de espacios",
    ],
  },
}

export default function CheckoutPage() {
  const { user, isLoading: authLoading, refreshUser } = useAuth()
  const { success: showSuccess, error: showError } = useToast()
  const searchParams = useSearchParams()
  const router = useRouter()
  const planId = searchParams.get("planId")

  const [membershipPlan, setMembershipPlan] = useState<MembershipType | null>(null)
  const [loading, setLoading] = useState(true)

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0,
    }).format(price)
  }

  const getDisplayName = (name: string) => {
    switch (name) {
      case 'BASIC': return 'Básico'
      case 'PREMIUM': return 'Premium'
      case 'ELITE': return 'ELITE'
      default: return name
    }
  }

  const getPlanIcon = (name: string) => {
    switch (name) {
      case 'BASIC': return <Users className="w-6 h-6" />
      case 'PREMIUM': return <Star className="w-6 h-6" />
      case 'ELITE': return <Crown className="w-6 h-6" />
      default: return <Shield className="w-6 h-6" />
    }
  }

  const getPlanFeatures = (membershipType: MembershipType) => {
    const features = [
      'Acceso al área de pesas',
      'Máquinas cardiovasculares', 
      'Vestuarios y duchas'
    ]

    if (membershipType.accessToAllLocation) {
      features.push('Acceso a todas las sucursales')
    } else {
      features.push('Acceso a una sola sucursal')
    }

    if (membershipType.groupClassesSessionsIncluded === -1) {
      features.push('Clases grupales ilimitadas')
    } else if (membershipType.groupClassesSessionsIncluded > 0) {
      features.push(`${membershipType.groupClassesSessionsIncluded} sesiones grupales/mes`)
    }

    if (membershipType.personalTrainingIncluded > 0) {
      features.push(`${membershipType.personalTrainingIncluded} entrenamientos personales/mes`)
    }

    if (membershipType.specializedClassesIncluded) {
      features.push('Clases especializadas incluidas')
    }

    return features
  }

  useEffect(() => {
    // Solo redirigir si definitivamente no hay usuario y no está cargando
    if (!user && !authLoading) {
      const currentUrl = '/checkout' + window.location.search
      router.push('/login?redirect=' + encodeURIComponent(currentUrl))
      return
    }
    
    // Cargar el plan solo cuando tengamos usuario y planId
    if (user && planId) {
      loadMembershipPlan()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [planId, user, authLoading, router])

  const loadMembershipPlan = async () => {
    try {
      setLoading(true)
      const types = await membershipService.getMembershipTypes()
      
      if (!types || types.length === 0) {
        console.warn('⚠️ No se obtuvieron tipos de membresía');
        showError("Error", "No se pudieron cargar los planes de membresía. Intenta más tarde.")
        return;
      }
      
      const plan = types.find(t => t.idMembershipType === parseInt(planId!))
      if (plan) {
        setMembershipPlan(plan)
      } else {
        showError("Error", "Plan de membresía no encontrado")
        window.location.href = '/membresias'
      }
    } catch (error) {
      showError("Error", "Error al cargar el plan de membresía")
      console.error('Error loading membership plan:', error)
    } finally {
      setLoading(false)
    }
  }

  const handlePaymentSuccess = async (paymentIntentId: string, receiptId?: string) => {
    console.log('✅ Pago exitoso:', { paymentIntentId, receiptId })
    
    showSuccess(
      "¡Pago exitoso!", 
      `Tu membresía ${membershipPlan ? getDisplayName(membershipPlan.name) : ''} ha sido activada. Redirigiendo...`
    )
    
    // Esperar más tiempo para que el backend procese la membresía
    console.log('⏳ Esperando 3 segundos para procesamiento del backend...')
    await new Promise(resolve => setTimeout(resolve, 3000))
    
    // Recargar información del usuario para obtener la membresía actualizada
    console.log('🔄 Recargando información del usuario desde backend...')
    try {
      await refreshUser()
      console.log('✅ Usuario recargado desde backend')
      
      // Esperar un poco más para que el estado se propague al contexto
      console.log('⏳ Esperando propagación del estado...')
      await new Promise(resolve => setTimeout(resolve, 1000))
      
    } catch (error) {
      console.error('⚠️ Error recargando usuario:', error)
      // Continuar de todos modos, el dashboard tiene botón de refresh
    }
    
    // Redirigir al dashboard principal (no membresia, para que muestre el estado)
    console.log('➡️ Redirigiendo al dashboard...')
    router.push('/dashboard')
  }

  const handlePaymentError = (error: string) => {
    console.error('❌ Error en el pago:', error)
    showError("Error en el pago", error)
  }

  // Mostrar loading mientras auth está cargando
  if (authLoading) {
    return (
      <div className="min-h-screen bg-theme-primary text-theme-primary flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#ff6b00] mx-auto mb-4"></div>
          <p className="text-theme-secondary">Verificando autenticación...</p>
        </div>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-theme-primary text-theme-primary flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#ff6b00] mx-auto mb-4"></div>
          <p className="text-theme-secondary">Cargando información del plan...</p>
        </div>
      </div>
    )
  }

  if (!membershipPlan) {
    return (
      <div className="min-h-screen bg-theme-primary text-theme-primary flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-400 mb-4">Plan no encontrado</p>
          <Button onClick={() => window.location.href = '/membresias'} className="bg-red-600 hover:bg-red-700">
            Volver a planes
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-theme-primary text-theme-primary">
      {/* Header */}
      <header className="border-b border-theme p-4 bg-theme-primary/50 backdrop-blur-sm">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <Link href="/membresias" className="flex items-center space-x-2 hover:text-[#ff6b00] transition-colors" aria-label="Volver a planes">
            <ArrowLeft className="w-5 h-5" />
            <span>Volver a planes</span>
          </Link>
          <FitZoneLogo 
            size="lg" 
            variant="light" 
            href="/"
          />
        </div>
      </header>

      <div className="max-w-6xl mx-auto p-6">
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Payment Form */}
          <div className="space-y-6">
            <div className="text-center">
              <h1 className="text-3xl font-bold text-[#ff6b00] mb-2">FINALIZAR COMPRA</h1>
              <p className="text-theme-secondary">Completa tu información para procesar el pago de forma segura con Stripe</p>
            </div>

            {/* Stripe Payment Form */}
            <Elements stripe={stripePromise}>
              <StripePaymentForm
                membershipTypeId={membershipPlan.idMembershipType}
                membershipTypeName={membershipPlan.name}
                amount={membershipPlan.monthlyPrice}
                onSuccess={handlePaymentSuccess}
                onError={handlePaymentError}
              />
            </Elements>

            {/* Cancel Button */}
            <Button
              type="button"
              variant="outline"
              className="w-full border-theme text-theme-secondary hover:bg-theme-secondary/10"
              onClick={() => router.back()}
            >
              Cancelar
            </Button>
          </div>

          {/* Order Summary */}
          <div className="lg:sticky lg:top-6">
            <Card className="bg-gradient-to-br from-card to-card/50 border-border shadow-lg">
              <CardHeader className="text-center">
                <div className="flex items-center justify-center gap-2 mb-4">
                  {getPlanIcon(membershipPlan.name)}
                  <Badge className="bg-[#ff6b00] text-white">Plan seleccionado</Badge>
                </div>
                <CardTitle className="text-2xl font-bold text-card-foreground mb-2">
                  {getDisplayName(membershipPlan.name)}
                </CardTitle>
                <p className="text-muted-foreground">{membershipPlan.description}</p>
              </CardHeader>
              
              <CardContent className="space-y-6">
                <div className="text-center">
                  <div className="text-4xl font-bold text-[#ff6b00] mb-1">
                    {formatPrice(membershipPlan.monthlyPrice)}
                  </div>
                  <span className="text-muted-foreground">/mes</span>
                </div>

                <div className="space-y-3">
                  <h4 className="font-semibold text-card-foreground flex items-center gap-2">
                    <Check className="w-5 h-5 text-green-500" />
                    Beneficios incluidos:
                  </h4>
                  {getPlanFeatures(membershipPlan).map((benefit, index) => (
                    <div key={index} className="flex items-center space-x-3">
                      <div className="w-2 h-2 bg-[#ff6b00] rounded-full flex-shrink-0"></div>
                      <span className="text-muted-foreground text-sm">{benefit}</span>
                    </div>
                  ))}
                </div>

                <div className="pt-6 border-t border-border">
                  <div className="flex justify-between items-center text-lg font-semibold mb-2">
                    <span className="text-card-foreground">Total mensual:</span>
                    <span className="text-[#ff6b00]">{formatPrice(membershipPlan.monthlyPrice)}</span>
                  </div>
                  <p className="text-muted-foreground text-sm flex items-center gap-2">
                    <Lock className="w-4 h-4" />
                    Pago seguro procesado por Stripe • Cancela cuando quieras
                  </p>
                </div>

                {/* Trust badges */}
                <div className="pt-4 border-t border-border">
                  <p className="text-xs text-muted-foreground text-center mb-3">Protegido por:</p>
                  <div className="flex justify-center items-center gap-4 opacity-70">
                    <svg className="h-6" viewBox="0 0 60 25" fill="currentColor">
                      <path d="M59.64 14.28h-8.06c.19 1.93 1.6 2.55 3.2 2.55 1.64 0 2.96-.37 4.05-.95v3.32a8.33 8.33 0 0 1-4.56 1.1c-4.01 0-6.83-2.5-6.83-7.48 0-4.19 2.39-7.52 6.3-7.52 3.92 0 5.96 3.28 5.96 7.5 0 .4-.04 1.26-.06 1.48zm-5.92-5.62c-1.03 0-2.17.73-2.17 2.58h4.25c0-1.85-1.07-2.58-2.08-2.58zM40.95 20.3c-1.44 0-2.32-.6-2.9-1.04l-.02 4.63-4.12.87V5.57h3.76l.08 1.02a4.7 4.7 0 0 1 3.23-1.29c2.9 0 5.62 2.6 5.62 7.4 0 5.23-2.7 7.6-5.65 7.6zM40 8.95c-.95 0-1.54.34-1.97.81l.02 6.12c.4.44.98.78 1.95.78 1.52 0 2.54-1.65 2.54-3.87 0-2.15-1.04-3.84-2.54-3.84zM28.24 5.57h4.13v14.44h-4.13V5.57zm0-4.7L32.37 0v3.36l-4.13.88V.88zm-4.32 9.35v9.79H19.8V5.57h3.7l.12 1.22c1-1.77 3.07-1.41 3.62-1.22v3.79c-.52-.17-2.29-.43-3.32.86zm-8.55 4.72c0 2.43 2.6 1.68 3.12 1.46v3.36c-.55.3-1.54.54-2.89.54a4.15 4.15 0 0 1-4.27-4.24l.01-13.17 4.02-.86v3.54h3.14V9.1h-3.13v5.85zm-4.91.7c0 2.97-2.31 4.66-5.73 4.66a11.2 11.2 0 0 1-4.46-.93v-3.93c1.38.75 3.1 1.31 4.46 1.31.92 0 1.53-.24 1.53-1C6.26 13.77 0 14.51 0 9.95 0 7.04 2.28 5.3 5.62 5.3c1.36 0 2.72.2 4.09.75v3.88a9.23 9.23 0 0 0-4.1-1.06c-.86 0-1.44.25-1.44.9 0 1.85 6.29.97 6.29 5.88z"/>
                    </svg>
                    <div className="text-xs font-medium">256-bit SSL</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
