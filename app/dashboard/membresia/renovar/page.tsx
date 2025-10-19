// app/dashboard/membresia/renovar/page.tsx
"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { 
  ArrowLeft, RefreshCw, CreditCard, Calendar, CheckCircle, 
  AlertCircle, Loader2, Shield, Award, TrendingUp
} from "lucide-react"
import { AuthGuard } from "@/components/auth-guard"
import { useState, useEffect } from "react"
import { membershipManagementService } from "@/services/membershipManagementService"
import { membershipService } from "@/services/membershipService"
import { MembershipInfo, MembershipTypeName } from "@/types/membership"
import { userService } from "@/services/userService"
import { useToast } from "@/hooks/use-toast"

export default function RenewMembershipPage() {
  const router = useRouter()
  const { success: showSuccess, error: showError } = useToast()
  const [loading, setLoading] = useState(true)
  const [processing, setProcessing] = useState(false)
  const [membership, setMembership] = useState<MembershipInfo | null>(null)
  const [userId, setUserId] = useState<number | null>(null)
  const [autoRenewal, setAutoRenewal] = useState(false)

  useEffect(() => {
    loadMembershipData()
  }, [])

  const loadMembershipData = async () => {
    try {
      setLoading(true)
      const userData = userService.getCurrentUser()
      
      if (!userData || !userData.idUser) {
        showError("Error", "No se pudo obtener la información del usuario")
        router.push('/login')
        return
      }

      const userIdNumber = Number(userData.idUser)
      setUserId(userIdNumber)

      const membershipData = await membershipManagementService.getMembershipDetails(userIdNumber)
      setMembership(membershipData)
      setAutoRenewal(membershipData.autoRenewal || false)
    } catch (error) {
      console.error('Error loading membership:', error)
      showError("Error", "No se pudo cargar la información de tu membresía")
    } finally {
      setLoading(false)
    }
  }

  const getMembershipTypeDisplay = (type?: MembershipTypeName) => {
    switch (type) {
      case MembershipTypeName.BASIC: return 'Básico'
      case MembershipTypeName.PREMIUM: return 'Premium'
      case MembershipTypeName.ELITE: return 'Elite'
      default: return 'Sin membresía'
    }
  }

  const getPlanIcon = (type?: MembershipTypeName) => {
    switch (type) {
      case MembershipTypeName.BASIC: return <Shield className="w-8 h-8" />
      case MembershipTypeName.PREMIUM: return <Award className="w-8 h-8" />
      case MembershipTypeName.ELITE: return <TrendingUp className="w-8 h-8" />
      default: return <CreditCard className="w-8 h-8" />
    }
  }

  const getPlanColor = (type?: MembershipTypeName) => {
    switch (type) {
      case MembershipTypeName.BASIC: return 'from-gray-600 to-gray-700'
      case MembershipTypeName.PREMIUM: return 'from-red-600 to-red-700'
      case MembershipTypeName.ELITE: return 'from-yellow-500 to-yellow-600'
      default: return 'from-gray-500 to-gray-600'
    }
  }

  const formatPrice = (price?: number) => {
    if (!price) return '$0'
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0,
    }).format(price)
  }

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'No disponible'
    return new Date(dateString).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const calculateNewExpiryDate = () => {
    if (!membership?.endDate) return 'No disponible'
    const currentExpiry = new Date(membership.endDate)
    const newExpiry = new Date(currentExpiry)
    newExpiry.setMonth(newExpiry.getMonth() + 1)
    return formatDate(newExpiry.toISOString())
  }

  const handleRenewal = async () => {
    if (!userId || !membership?.id || !membership?.type?.idMembershipType) {
      showError("Error", "Información de membresía incompleta")
      return
    }

    setProcessing(true)

    try {
      // Simular creación de payment intent (en producción esto se haría con Stripe/pasarela real)
      const paymentIntent = await membershipService.createPaymentIntent(
        membership.type.monthlyPrice,
        'cop',
        `Renovación membresía ${getMembershipTypeDisplay(membership.type.name)}`
      )

      if (!paymentIntent) {
        throw new Error('No se pudo crear la intención de pago')
      }

      // Procesar renovación
      const result = await membershipManagementService.renewMembership({
        userId,
        membershipId: membership.id,
        paymentIntentId: paymentIntent,
        autoRenewal,
      })

      if (result.success) {
        showSuccess(
          "¡Renovación Exitosa!", 
          `Tu membresía ha sido renovada hasta ${calculateNewExpiryDate()}`
        )
        
        // Redirigir después de 2 segundos
        setTimeout(() => {
          router.push('/dashboard/membresia')
        }, 2000)
      } else {
        showError("Error en renovación", result.message)
      }
    } catch (error: any) {
      console.error('Error processing renewal:', error)
      showError("Error", error.message || "No se pudo procesar la renovación")
    } finally {
      setProcessing(false)
    }
  }

  if (loading) {
    return (
      <AuthGuard requireAuth={true}>
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 text-white flex items-center justify-center">
          <div className="text-center">
            <Loader2 className="w-12 h-12 animate-spin text-red-500 mx-auto mb-4" />
            <p className="text-gray-400">Cargando información...</p>
          </div>
        </div>
      </AuthGuard>
    )
  }

  if (!membership || !membership.type) {
    return (
      <AuthGuard requireAuth={true}>
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 text-white flex items-center justify-center">
          <Card className="bg-red-500/10 border-red-500/30 max-w-md">
            <CardContent className="pt-6">
              <div className="text-center space-y-4">
                <AlertCircle className="w-16 h-16 text-red-400 mx-auto" />
                <h2 className="text-xl font-bold text-red-300">No hay membresía para renovar</h2>
                <p className="text-red-200">No se encontró información de tu membresía actual.</p>
                <Link href="/dashboard/membresia">
                  <Button className="bg-red-600 hover:bg-red-700">
                    Volver a Gestión de Membresía
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </AuthGuard>
    )
  }

  return (
    <AuthGuard requireAuth={true}>
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 text-white">
        {/* Header */}
        <header className="border-b border-gray-800 bg-black/50 backdrop-blur-md sticky top-0 z-10">
          <div className="container mx-auto px-4 md:px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Link href="/dashboard/membresia">
                  <Button variant="ghost" size="sm" className="text-gray-300 hover:text-white">
                    <ArrowLeft className="w-5 h-5" />
                  </Button>
                </Link>
                <div>
                  <h1 className="text-2xl font-bold">Renovar Membresía</h1>
                  <p className="text-sm text-gray-400">Extiende tu membresía por 30 días más</p>
                </div>
              </div>
            </div>
          </div>
        </header>

        <div className="container mx-auto px-4 md:px-6 py-8 max-w-4xl">
          <div className="space-y-6">
            {/* Plan actual */}
            <Card className={`bg-gradient-to-br ${getPlanColor(membership.type.name)} border-0 shadow-2xl`}>
              <CardHeader>
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-white/10 rounded-xl backdrop-blur-sm">
                    {getPlanIcon(membership.type.name)}
                  </div>
                  <div>
                    <CardTitle className="text-2xl text-white">
                      Plan {getMembershipTypeDisplay(membership.type.name)}
                    </CardTitle>
                    <p className="text-white/80 text-sm mt-1">Tu membresía actual</p>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                    <p className="text-white/70 text-sm mb-1">Vence el</p>
                    <p className="text-white font-semibold">{formatDate(membership.endDate)}</p>
                  </div>
                  <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                    <p className="text-white/70 text-sm mb-1">Nueva fecha de vencimiento</p>
                    <p className="text-white font-semibold">{calculateNewExpiryDate()}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Detalles de renovación */}
            <Card className="bg-gray-800/50 border-gray-700">
              <CardHeader>
                <CardTitle className="text-xl flex items-center gap-2">
                  <RefreshCw className="w-6 h-6 text-green-400" />
                  Detalles de Renovación
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Resumen de costos */}
                <div className="space-y-3">
                  <div className="flex justify-between items-center py-3 border-b border-gray-700">
                    <span className="text-gray-300">Plan {getMembershipTypeDisplay(membership.type.name)}</span>
                    <span className="font-semibold">{formatPrice(membership.type.monthlyPrice)}</span>
                  </div>
                  <div className="flex justify-between items-center py-3 border-b border-gray-700">
                    <span className="text-gray-300">Período</span>
                    <span className="font-semibold">30 días</span>
                  </div>
                  <div className="flex justify-between items-center py-4 bg-green-500/10 rounded-lg px-4">
                    <span className="text-lg font-bold text-green-300">Total a pagar</span>
                    <span className="text-2xl font-bold text-green-400">
                      {formatPrice(membership.type.monthlyPrice)}
                    </span>
                  </div>
                </div>

                {/* Beneficios */}
                <div className="bg-gray-700/30 rounded-lg p-4 space-y-2">
                  <p className="font-semibold text-white mb-3">Beneficios renovados:</p>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm text-gray-300">
                      <CheckCircle className="w-4 h-4 text-green-400 flex-shrink-0" />
                      <span>30 días adicionales de acceso al gimnasio</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-300">
                      <CheckCircle className="w-4 h-4 text-green-400 flex-shrink-0" />
                      <span>
                        {membership.type.accessToAllLocation 
                          ? 'Acceso a todas las sucursales' 
                          : 'Acceso a tu sucursal principal'}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-300">
                      <CheckCircle className="w-4 h-4 text-green-400 flex-shrink-0" />
                      <span>
                        {membership.type.groupClassesSessionsIncluded === -1 
                          ? 'Clases grupales ilimitadas'
                          : membership.type.groupClassesSessionsIncluded > 0
                            ? `${membership.type.groupClassesSessionsIncluded} clases grupales`
                            : 'Sin clases grupales'}
                      </span>
                    </div>
                    {membership.type.personalTrainingIncluded > 0 && (
                      <div className="flex items-center gap-2 text-sm text-gray-300">
                        <CheckCircle className="w-4 h-4 text-green-400 flex-shrink-0" />
                        <span>{membership.type.personalTrainingIncluded} sesiones de entrenamiento personal</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Renovación automática */}
                <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4">
                  <div className="flex items-start gap-3">
                    <Checkbox 
                      id="auto-renewal" 
                      checked={autoRenewal}
                      onCheckedChange={(checked) => setAutoRenewal(checked as boolean)}
                      className="mt-1"
                    />
                    <div className="flex-1">
                      <label htmlFor="auto-renewal" className="text-white font-semibold cursor-pointer">
                        Activar renovación automática
                      </label>
                      <p className="text-blue-200 text-sm mt-1">
                        Tu membresía se renovará automáticamente cada mes. Puedes cancelar en cualquier momento.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Botones de acción */}
                <div className="flex flex-col sm:flex-row gap-4 pt-4">
                  <Link href="/dashboard/membresia" className="flex-1">
                    <Button 
                      variant="outline" 
                      className="w-full border-gray-600 text-gray-300 hover:bg-gray-700"
                      disabled={processing}
                    >
                      Cancelar
                    </Button>
                  </Link>
                  <Button 
                    onClick={handleRenewal}
                    disabled={processing}
                    className="flex-1 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-500 hover:to-green-600 text-white font-bold py-6"
                  >
                    {processing ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin mr-2" />
                        Procesando...
                      </>
                    ) : (
                      <>
                        <CreditCard className="w-5 h-5 mr-2" />
                        Proceder al Pago
                      </>
                    )}
                  </Button>
                </div>

                {/* Nota de seguridad */}
                <div className="text-center text-xs text-gray-400 pt-2">
                  <p className="flex items-center justify-center gap-2">
                    <Shield className="w-4 h-4" />
                    Pago seguro encriptado. Tu información está protegida.
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Información adicional */}
            <Card className="bg-gray-800/30 border-gray-700">
              <CardContent className="pt-6">
                <div className="space-y-3 text-sm text-gray-400">
                  <p className="flex items-start gap-2">
                    <Calendar className="w-5 h-5 flex-shrink-0 text-blue-400 mt-0.5" />
                    <span>
                      La renovación extenderá tu membresía por 30 días adicionales a partir de tu fecha de vencimiento actual.
                    </span>
                  </p>
                  <p className="flex items-start gap-2">
                    <AlertCircle className="w-5 h-5 flex-shrink-0 text-yellow-400 mt-0.5" />
                    <span>
                      Si activas la renovación automática, se cargará automáticamente cada mes hasta que canceles.
                    </span>
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </AuthGuard>
  )
}
