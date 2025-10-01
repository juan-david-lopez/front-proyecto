"use client"

import type React from "react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Check, CreditCard, Lock, Shield, Crown, Star, Users } from "lucide-react"
import Link from "next/link"
import { useSearchParams, useRouter } from "next/navigation"
import { useState, useEffect } from "react"
import { FitZoneLogo } from "@/components/fitzone-logo"
import { useAuth } from "@/contexts/auth-context"
import membershipService from "@/services/membershipService"
import { receiptService } from "@/services/receiptService"
import { MembershipType } from "@/types/membership"
import { PaymentMethod, TransactionType } from "@/types/receipt"
import { useToast } from "@/hooks/use-toast"

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
  const { user } = useAuth()
  const { success: showSuccess, error: showError } = useToast()
  const searchParams = useSearchParams()
  const router = useRouter()
  const planId = searchParams.get("planId")
  const planName = searchParams.get("planName")

  const [membershipPlan, setMembershipPlan] = useState<MembershipType | null>(null)
  const [loading, setLoading] = useState(true)
  const [processing, setProcessing] = useState(false)

  const [formData, setFormData] = useState({
    cardNumber: "",
    expiryDate: "",
    cvv: "",
    cardName: "",
    billingName: "",
    billingEmail: "",
    address: "",
    city: "",
    postalCode: "",
    phone: "",
  })

  const [errors, setErrors] = useState<Record<string, string>>({})

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
    if (!user) {
      window.location.href = '/login?redirect=' + encodeURIComponent('/checkout' + window.location.search)
      return
    }
    
    if (planId) {
      loadMembershipPlan()
    }
  }, [planId, user])

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

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }))
    }
  }

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.cardNumber || formData.cardNumber.length < 16) {
      newErrors.cardNumber = "Número de tarjeta inválido"
    }
    if (!formData.expiryDate) {
      newErrors.expiryDate = "Fecha de expiración requerida"
    }
    if (!formData.cvv || formData.cvv.length < 3) {
      newErrors.cvv = "CVV inválido"
    }
    if (!formData.cardName.trim()) {
      newErrors.cardName = "Nombre en la tarjeta requerido"
    }
    if (!formData.billingName.trim()) {
      newErrors.billingName = "Nombre de facturación requerido"
    }
    if (!formData.billingEmail.includes("@")) {
      newErrors.billingEmail = "Email inválido"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm() || !membershipPlan || !user) {
      return
    }

    setProcessing(true)
    try {
      // Simular procesamiento de pago
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      console.log("Procesando pago...", { plan: membershipPlan.name, ...formData })
      
      // Calcular fechas de membresía
      const startDate = new Date()
      const endDate = new Date()
      endDate.setMonth(endDate.getMonth() + 1) // 1 mes de membresía
      
      // Determinar método de pago según el número de tarjeta
      let paymentMethod: PaymentMethod = PaymentMethod.CREDIT_CARD
      const cardNumber = formData.cardNumber.replace(/\s/g, '')
      if (cardNumber.startsWith('5')) {
        paymentMethod = PaymentMethod.CREDIT_CARD // Mastercard
      } else if (cardNumber.startsWith('4')) {
        paymentMethod = PaymentMethod.CREDIT_CARD // Visa
      } else if (cardNumber.startsWith('3')) {
        paymentMethod = PaymentMethod.CREDIT_CARD // Amex
      }
      
      // Generar recibo
      const receiptResult = await receiptService.generateReceipt({
        userId: parseInt(user.id, 10),
        transactionType: TransactionType.MEMBERSHIP_PURCHASE,
        membershipType: membershipPlan.name as any, // BASIC, PREMIUM, ELITE
        membershipStartDate: startDate.toISOString(),
        membershipEndDate: endDate.toISOString(),
        amount: membershipPlan.monthlyPrice,
        paymentMethod: paymentMethod,
        paymentInfo: {
          cardLastFour: cardNumber.slice(-4),
          cardBrand: cardNumber.startsWith('5') ? 'Mastercard' : 
                     cardNumber.startsWith('4') ? 'Visa' : 
                     cardNumber.startsWith('3') ? 'American Express' : 'Unknown',
          transactionId: `TXN_${Date.now()}`
        },
        billingInfo: {
          name: formData.billingName,
          email: formData.billingEmail,
          phone: formData.phone || undefined,
          address: formData.address || undefined,
          city: formData.city || undefined,
          country: 'Colombia'
        },
        notes: `Pago inicial de membresía ${getDisplayName(membershipPlan.name)}`
      })
      
      if (receiptResult.success && receiptResult.receipt) {
        
        showSuccess("¡Pago exitoso!", `Tu membresía ${getDisplayName(membershipPlan.name)} ha sido activada`)
        
        // Redirigir a la página del recibo
        setTimeout(() => {
          router.push(`/dashboard/pagos/${receiptResult.receipt!.id}`)
        }, 1500)
      } else {
        throw new Error(receiptResult.error || 'Error al generar recibo')
      }
    } catch (error) {
      console.error('Error en el checkout:', error)
      showError("Error", "Hubo un problema al procesar el pago. Inténtalo de nuevo.")
    } finally {
      setProcessing(false)
    }
  }

  const formatCardNumber = (value: string) => {
    const v = value.replace(/\s+/g, "").replace(/[^0-9]/gi, "")
    const matches = v.match(/\d{4,16}/g)
    const match = (matches && matches[0]) || ""
    const parts = []
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4))
    }
    if (parts.length) {
      return parts.join(" ")
    } else {
      return v
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-500 mx-auto mb-4"></div>
          <p className="text-gray-400">Cargando información del plan...</p>
        </div>
      </div>
    )
  }

  if (!membershipPlan) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
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
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black text-white">
      {/* Header */}
      <header className="border-b border-gray-800/50 p-4 bg-black/50 backdrop-blur-sm">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <Link href="/membresias" className="flex items-center space-x-2 hover:text-red-400 transition-colors" aria-label="Volver a planes">
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
          <div className="space-y-8">
            <div className="text-center">
              <h1 className="text-3xl font-bold text-red-500 mb-2">FINALIZAR COMPRA</h1>
              <p className="text-gray-400">Completa tu información para procesar el pago</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Card Information */}
              <section className="bg-gray-900 p-6 rounded-lg">
                <h2 className="text-xl font-semibold mb-6 flex items-center">
                  <CreditCard className="w-5 h-5 mr-2" />
                  Datos de tarjeta
                </h2>

                <div className="space-y-4">
                  <div>
                    <Label htmlFor="cardNumber" className="text-gray-300">
                      Número de tarjeta
                    </Label>
                    <Input
                      id="cardNumber"
                      type="text"
                      placeholder="1234 5678 9012 3456"
                      value={formData.cardNumber}
                      onChange={(e) => handleInputChange("cardNumber", formatCardNumber(e.target.value))}
                      className="bg-gray-800 border-gray-700 text-white mt-2"
                      maxLength={19}
                      aria-describedby={errors.cardNumber ? "cardNumber-error" : undefined}
                      aria-invalid={!!errors.cardNumber}
                    />
                    {errors.cardNumber && (
                      <p id="cardNumber-error" className="text-red-500 text-sm mt-1" role="alert">
                        {errors.cardNumber}
                      </p>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="expiryDate" className="text-gray-300">
                        Fecha de expiración
                      </Label>
                      <Input
                        id="expiryDate"
                        type="text"
                        placeholder="MM/YY"
                        value={formData.expiryDate}
                        onChange={(e) => {
                          let value = e.target.value.replace(/\D/g, "")
                          if (value.length >= 2) {
                            value = value.substring(0, 2) + "/" + value.substring(2, 4)
                          }
                          handleInputChange("expiryDate", value)
                        }}
                        className="bg-gray-800 border-gray-700 text-white mt-2"
                        maxLength={5}
                        aria-describedby={errors.expiryDate ? "expiryDate-error" : undefined}
                        aria-invalid={!!errors.expiryDate}
                      />
                      {errors.expiryDate && (
                        <p id="expiryDate-error" className="text-red-500 text-sm mt-1" role="alert">
                          {errors.expiryDate}
                        </p>
                      )}
                    </div>
                    <div>
                      <Label htmlFor="cvv" className="text-gray-300">
                        CVV
                      </Label>
                      <Input
                        id="cvv"
                        type="text"
                        placeholder="123"
                        value={formData.cvv}
                        onChange={(e) => handleInputChange("cvv", e.target.value.replace(/\D/g, ""))}
                        className="bg-gray-800 border-gray-700 text-white mt-2"
                        maxLength={4}
                        aria-describedby={errors.cvv ? "cvv-error" : undefined}
                        aria-invalid={!!errors.cvv}
                      />
                      {errors.cvv && (
                        <p id="cvv-error" className="text-red-500 text-sm mt-1" role="alert">
                          {errors.cvv}
                        </p>
                      )}
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="cardName" className="text-gray-300">
                      Nombre en la tarjeta
                    </Label>
                    <Input
                      id="cardName"
                      type="text"
                      placeholder="Juan Pérez"
                      value={formData.cardName}
                      onChange={(e) => handleInputChange("cardName", e.target.value)}
                      className="bg-gray-800 border-gray-700 text-white mt-2"
                      aria-describedby={errors.cardName ? "cardName-error" : undefined}
                      aria-invalid={!!errors.cardName}
                    />
                    {errors.cardName && (
                      <p id="cardName-error" className="text-red-500 text-sm mt-1" role="alert">
                        {errors.cardName}
                      </p>
                    )}
                  </div>
                </div>

                {/* Test Cards Info */}
                <div className="mt-6 p-4 bg-gray-800 rounded-lg">
                  <h3 className="font-semibold mb-2">Tarjetas de prueba</h3>
                  <div className="text-sm text-gray-400 space-y-1">
                    <p>
                      <strong>Visa:</strong> 4242 4242 4242 4242
                    </p>
                    <p>
                      <strong>Mastercard:</strong> 5555 5555 5555 4444
                    </p>
                    <p>
                      <strong>AMEX:</strong> 3782 822463 10005
                    </p>
                    <p className="mt-2">
                      Usa cualquier fecha futura, CVC aleatorio (ej. 123) y cualquier código postal
                    </p>
                  </div>
                </div>
              </section>

              {/* Billing Information */}
              <section className="bg-gray-900 p-6 rounded-lg">
                <h2 className="text-xl font-semibold mb-6">Información de facturación</h2>

                <div className="space-y-4">
                  <div>
                    <Label htmlFor="billingName" className="text-gray-300">
                      Nombre
                    </Label>
                    <Input
                      id="billingName"
                      type="text"
                      placeholder="Tu nombre completo"
                      value={formData.billingName}
                      onChange={(e) => handleInputChange("billingName", e.target.value)}
                      className="bg-gray-800 border-gray-700 text-white mt-2"
                      aria-describedby={errors.billingName ? "billingName-error" : undefined}
                      aria-invalid={!!errors.billingName}
                    />
                    {errors.billingName && (
                      <p id="billingName-error" className="text-red-500 text-sm mt-1" role="alert">
                        {errors.billingName}
                      </p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="billingEmail" className="text-gray-300">
                      Email
                    </Label>
                    <Input
                      id="billingEmail"
                      type="email"
                      placeholder="tu@email.com"
                      value={formData.billingEmail}
                      onChange={(e) => handleInputChange("billingEmail", e.target.value)}
                      className="bg-gray-800 border-gray-700 text-white mt-2"
                      aria-describedby={errors.billingEmail ? "billingEmail-error" : undefined}
                      aria-invalid={!!errors.billingEmail}
                    />
                    {errors.billingEmail && (
                      <p id="billingEmail-error" className="text-red-500 text-sm mt-1" role="alert">
                        {errors.billingEmail}
                      </p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="address" className="text-gray-300">
                      Dirección
                    </Label>
                    <Input
                      id="address"
                      type="text"
                      placeholder="Calle 123 #45-67"
                      value={formData.address}
                      onChange={(e) => handleInputChange("address", e.target.value)}
                      className="bg-gray-800 border-gray-700 text-white mt-2"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="city" className="text-gray-300">
                        Ciudad
                      </Label>
                      <Input
                        id="city"
                        type="text"
                        placeholder="Bogotá"
                        value={formData.city}
                        onChange={(e) => handleInputChange("city", e.target.value)}
                        className="bg-gray-800 border-gray-700 text-white mt-2"
                      />
                    </div>
                    <div>
                      <Label htmlFor="postalCode" className="text-gray-300">
                        Código postal
                      </Label>
                      <Input
                        id="postalCode"
                        type="text"
                        placeholder="110111"
                        value={formData.postalCode}
                        onChange={(e) => handleInputChange("postalCode", e.target.value)}
                        className="bg-gray-800 border-gray-700 text-white mt-2"
                      />
                    </div>
                  </div>
                </div>
              </section>

              {/* Security Notice */}
              <div className="text-center text-gray-400 text-sm">
                Los pagos son procesados de forma segura mediante Stripe. No almacenamos la información de tu tarjeta.
              </div>

              {/* Action Buttons */}
              <div className="space-y-4">
                <Button
                  type="submit"
                  disabled={processing || !membershipPlan}
                  className="w-full bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 text-white font-bold py-4 text-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300"
                  aria-label={membershipPlan ? `Pagar ${formatPrice(membershipPlan.monthlyPrice)} por plan ${getDisplayName(membershipPlan.name)}` : "Procesar pago"}
                >
                  {processing ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                      PROCESANDO...
                    </>
                  ) : (
                    <>
                      <Lock className="w-5 h-5 mr-2" />
                      PAGAR AHORA
                    </>
                  )}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  className="w-full border-red-600 text-red-600 hover:bg-red-600 hover:text-white py-4 bg-transparent"
                  onClick={() => window.history.back()}
                >
                  Cancelar
                </Button>
              </div>
            </form>
          </div>

          {/* Order Summary */}
          <div className="lg:sticky lg:top-6">
            {loading ? (
              <div className="bg-gray-900 p-6 rounded-lg text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-500 mx-auto mb-4"></div>
                <p className="text-gray-400">Cargando plan...</p>
              </div>
            ) : membershipPlan ? (
              <Card className="bg-gradient-to-br from-gray-900 to-black border-gray-700">
                <CardHeader className="text-center">
                  <div className="flex items-center justify-center gap-2 mb-4">
                    {getPlanIcon(membershipPlan.name)}
                    <Badge className="bg-red-600 text-white">Plan seleccionado</Badge>
                  </div>
                  <CardTitle className="text-2xl font-bold text-white mb-2">
                    {getDisplayName(membershipPlan.name)}
                  </CardTitle>
                  <p className="text-gray-400">{membershipPlan.description}</p>
                </CardHeader>
                
                <CardContent className="space-y-6">
                  <div className="text-center">
                    <div className="text-4xl font-bold text-white mb-1">
                      {formatPrice(membershipPlan.monthlyPrice)}
                    </div>
                    <span className="text-gray-400">/mes</span>
                  </div>

                  <div className="space-y-3">
                    <h4 className="font-semibold text-white flex items-center gap-2">
                      <Check className="w-5 h-5 text-green-400" />
                      Beneficios incluidos:
                    </h4>
                    {getPlanFeatures(membershipPlan).map((benefit, index) => (
                      <div key={index} className="flex items-center space-x-3">
                        <div className="w-2 h-2 bg-red-500 rounded-full flex-shrink-0"></div>
                        <span className="text-gray-300 text-sm">{benefit}</span>
                      </div>
                    ))}
                  </div>

                  <div className="pt-6 border-t border-gray-700">
                    <div className="flex justify-between items-center text-lg font-semibold mb-2">
                      <span className="text-gray-300">Total mensual:</span>
                      <span className="text-red-400">{formatPrice(membershipPlan.monthlyPrice)}</span>
                    </div>
                    <p className="text-gray-500 text-sm">
                      <Lock className="w-4 h-4 inline mr-1" />
                      Pago seguro • Cancela cuando quieras
                    </p>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <div className="bg-gray-900 p-6 rounded-lg text-center">
                <p className="text-red-400">Error al cargar el plan</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
