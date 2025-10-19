// app/dashboard/membresia/page.tsx
"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { BackButton } from "@/components/back-button"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { 
  CreditCard, Calendar, AlertCircle, CheckCircle, Clock, 
  RefreshCw, PauseCircle, XCircle, Shield, ArrowLeft,
  TrendingUp, Award, Loader2, AlertTriangle
} from "lucide-react"
import { AuthGuard } from "@/components/auth-guard"
import { useState, useEffect } from "react"
import { membershipManagementService } from "@/services/membershipManagementService"
import { MembershipInfo, MembershipStatus, MembershipTypeName, MembershipDetailsResponse } from "@/types/membership"
import { userService } from "@/services/userService"
import { useToast } from "@/hooks/use-toast"

export default function MembershipManagementPage() {
  const router = useRouter()
  const { success: showSuccess, error: showError } = useToast()
  const [loading, setLoading] = useState(true)
  const [membershipDetails, setMembershipDetails] = useState<MembershipDetailsResponse | null>(null)
  const [membership, setMembership] = useState<MembershipInfo | null>(null)
  const [userId, setUserId] = useState<number | null>(null)

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

      // getMembershipDetails retorna MembershipDetailsResponse con hasMembership y needsLocation
      const details = await membershipManagementService.getMembershipDetails(userIdNumber)
      setMembershipDetails(details)
      
      if (!details.hasMembership) {
        // Usuario no tiene membresía - esto NO es un error
        console.log('ℹ️ Usuario no tiene membresía activa:', details.message)
        
        if (details.needsLocation) {
          console.log('⚠️ Usuario necesita asignar ubicación principal')
        }
        
        setMembership(null)
      } else {
        // Usuario tiene membresía - convertir a MembershipInfo para UI existente
        console.log('✅ Membresía encontrada:', details)
        const membershipInfo: MembershipInfo = {
          id: details.membershipId,
          status: (details.status as MembershipStatus) || MembershipStatus.ACTIVE,
          isActive: details.status === 'ACTIVE',
          startDate: details.startDate,
          endDate: details.endDate,
          daysRemaining: details.endDate ? calculateDaysRemaining(details.endDate) : 0
        }
        setMembership(membershipInfo)
      }
    } catch (error) {
      // Solo errores técnicos llegan aquí (red, servidor caído, etc.)
      console.error('❌ Error técnico cargando membresía:', error)
      showError("Error", "Hubo un problema al cargar la información. Por favor, intenta de nuevo.")
      setMembership(null)
      setMembershipDetails(null)
    } finally {
      setLoading(false)
    }
  }

  const calculateDaysRemaining = (endDate: string): number => {
    const expiry = new Date(endDate);
    const today = new Date();
    const diffTime = expiry.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return Math.max(0, diffDays);
  }

  const getMembershipTypeDisplay = (type?: MembershipTypeName) => {
    switch (type) {
      case MembershipTypeName.BASIC: return 'Básico'
      case MembershipTypeName.PREMIUM: return 'Premium'
      case MembershipTypeName.ELITE: return 'Elite'
      default: return 'Sin membresía'
    }
  }

  const getStatusBadge = (status: MembershipStatus) => {
    switch (status) {
      case MembershipStatus.ACTIVE:
        return <Badge className="bg-green-500 text-white"><CheckCircle className="w-3 h-3 mr-1" />Activa</Badge>
      case MembershipStatus.SUSPENDED:
        return <Badge className="bg-yellow-500 text-white"><PauseCircle className="w-3 h-3 mr-1" />Suspendida</Badge>
      case MembershipStatus.EXPIRED:
        return <Badge className="bg-red-500 text-white"><AlertCircle className="w-3 h-3 mr-1" />Vencida</Badge>
      case MembershipStatus.CANCELLED:
        return <Badge className="bg-gray-500 text-white"><XCircle className="w-3 h-3 mr-1" />Cancelada</Badge>
      case MembershipStatus.INACTIVE:
        return <Badge className="bg-gray-400 text-white"><AlertCircle className="w-3 h-3 mr-1" />Inactiva</Badge>
      default:
        return <Badge className="bg-gray-400 text-white">Desconocido</Badge>
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

  const getPlanIcon = (type?: MembershipTypeName) => {
    switch (type) {
      case MembershipTypeName.BASIC: return <Shield className="w-8 h-8" />
      case MembershipTypeName.PREMIUM: return <Award className="w-8 h-8" />
      case MembershipTypeName.ELITE: return <TrendingUp className="w-8 h-8" />
      default: return <CreditCard className="w-8 h-8" />
    }
  }

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'No disponible'
    return new Date(dateString).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const canRenew = membership?.status === MembershipStatus.ACTIVE || 
                   membership?.status === MembershipStatus.EXPIRED

  const canSuspend = membership?.status === MembershipStatus.ACTIVE &&
                     (membership?.suspensionsUsed || 0) < 2

  const canCancel = membership?.status === MembershipStatus.ACTIVE ||
                    membership?.status === MembershipStatus.SUSPENDED

  const canReactivate = membership?.status === MembershipStatus.SUSPENDED

  const handleReactivate = async () => {
    if (!userId || !membership?.id) return

    try {
      const result = await membershipManagementService.reactivateMembership(userId, membership.id)
      
      if (result.success) {
        showSuccess("¡Éxito!", "Tu membresía ha sido reactivada")
        loadMembershipData()
      } else {
        showError("Error", result.message)
      }
    } catch (error) {
      showError("Error", "No se pudo reactivar la membresía")
    }
  }

  if (loading) {
    return (
      <AuthGuard requireAuth={true}>
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 text-white flex items-center justify-center">
          <div className="text-center">
            <Loader2 className="w-12 h-12 animate-spin text-red-500 mx-auto mb-4" />
            <p className="text-gray-400">Cargando información de tu membresía...</p>
          </div>
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
                <BackButton href="/dashboard" />
                <div>
                  <h1 className="text-2xl font-bold">Gestión de Membresía</h1>
                  <p className="text-sm text-gray-400">
                    {membership ? 'Administra tu suscripción y beneficios' : 'Adquiere tu membresía y comienza tu transformación'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </header>

        <div className="container mx-auto px-4 md:px-6 py-8 max-w-6xl">
          {/* UI cuando NO hay membresía */}
          {!membership && membershipDetails && (
            <div className="space-y-6">
              {/* Caso 1: Usuario necesita asignar ubicación */}
              {membershipDetails.needsLocation && (
                <Card className="bg-gradient-to-br from-amber-500 to-orange-600 border-0 shadow-2xl">
                  <CardContent className="py-12 text-center">
                    <div className="max-w-2xl mx-auto space-y-6">
                      <div className="inline-flex p-4 bg-white/20 rounded-full backdrop-blur-sm">
                        <AlertTriangle className="w-12 h-12 text-white" />
                      </div>
                      <div>
                        <h2 className="text-3xl font-bold text-white mb-3">
                          Asigna tu Sede Principal
                        </h2>
                        <p className="text-white/90 text-lg">
                          Debes seleccionar una ubicación principal antes de adquirir una membresía. 
                          Esto nos ayudará a personalizar tu experiencia.
                        </p>
                      </div>
                      <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Link href="/configuracion">
                          <Button 
                            size="lg"
                            className="bg-white text-amber-600 hover:bg-gray-100 font-bold px-8 py-6 text-lg"
                          >
                            <Shield className="w-5 h-5 mr-2" />
                            Ir a Configuración
                          </Button>
                        </Link>
                        <Link href="/dashboard">
                          <Button 
                            size="lg"
                            variant="outline"
                            className="border-2 border-white text-white hover:bg-white/10 font-bold px-8 py-6 text-lg"
                          >
                            <ArrowLeft className="w-5 h-5 mr-2" />
                            Volver al Dashboard
                          </Button>
                        </Link>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Caso 2: Usuario puede comprar membresía */}
              {!membershipDetails.needsLocation && (
                <>
                  <Card className="bg-gradient-to-br from-[#ff6b00] to-red-600 border-0 shadow-2xl">
                    <CardContent className="py-12 text-center">
                      <div className="max-w-2xl mx-auto space-y-6">
                        <div className="inline-flex p-4 bg-white/20 rounded-full backdrop-blur-sm">
                          <CreditCard className="w-12 h-12 text-white" />
                        </div>
                        <div>
                          <h2 className="text-3xl font-bold text-white mb-3">
                            ¡Bienvenido a FitZone!
                          </h2>
                          <p className="text-white/90 text-lg">
                            {membershipDetails.message || 'Actualmente no tienes una membresía activa. Selecciona el plan perfecto para ti y comienza tu viaje fitness hoy mismo.'}
                          </p>
                        </div>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                          <Link href="/membresias">
                            <Button 
                              size="lg"
                              className="bg-white text-[#ff6b00] hover:bg-gray-100 font-bold px-8 py-6 text-lg"
                            >
                              <Award className="w-5 h-5 mr-2" />
                              Ver Planes Disponibles
                            </Button>
                          </Link>
                          <Link href="/dashboard">
                            <Button 
                              size="lg"
                              variant="outline"
                              className="border-2 border-white text-white hover:bg-white/10 font-bold px-8 py-6 text-lg"
                            >
                              <ArrowLeft className="w-5 h-5 mr-2" />
                              Volver al Dashboard
                            </Button>
                          </Link>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </>
              )}

              {/* Por qué elegir FitZone */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="bg-gray-800/50 border-gray-700 hover:bg-gray-800/70 transition-all">
                  <CardContent className="py-8 text-center">
                    <div className="inline-flex p-3 bg-green-500/20 rounded-full mb-4">
                      <CheckCircle className="w-8 h-8 text-green-400" />
                    </div>
                    <h3 className="text-xl font-bold mb-2">Equipamiento Completo</h3>
                    <p className="text-gray-400">
                      Acceso a máquinas de última generación y áreas especializadas para tu entrenamiento
                    </p>
                  </CardContent>
                </Card>

                <Card className="bg-gray-800/50 border-gray-700 hover:bg-gray-800/70 transition-all">
                  <CardContent className="py-8 text-center">
                    <div className="inline-flex p-3 bg-blue-500/20 rounded-full mb-4">
                      <Shield className="w-8 h-8 text-blue-400" />
                    </div>
                    <h3 className="text-xl font-bold mb-2">Entrenadores Expertos</h3>
                    <p className="text-gray-400">
                      Profesionales certificados te guiarán en cada paso de tu transformación
                    </p>
                  </CardContent>
                </Card>

                <Card className="bg-gray-800/50 border-gray-700 hover:bg-gray-800/70 transition-all">
                  <CardContent className="py-8 text-center">
                    <div className="inline-flex p-3 bg-purple-500/20 rounded-full mb-4">
                      <TrendingUp className="w-8 h-8 text-purple-400" />
                    </div>
                    <h3 className="text-xl font-bold mb-2">Resultados Garantizados</h3>
                    <p className="text-gray-400">
                      Planes personalizados y seguimiento continuo para alcanzar tus objetivos
                    </p>
                  </CardContent>
                </Card>
              </div>

              {/* Preguntas frecuentes */}
              <Card className="bg-gray-800/50 border-gray-700">
                <CardHeader>
                  <CardTitle className="text-2xl">Preguntas Frecuentes</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="border-b border-gray-700 pb-4">
                    <h4 className="font-semibold text-lg mb-2">¿Qué incluye la membresía?</h4>
                    <p className="text-gray-400">
                      Dependiendo del plan, tendrás acceso a áreas de pesas, cardio, clases grupales, entrenamiento personal y más.
                    </p>
                  </div>
                  <div className="border-b border-gray-700 pb-4">
                    <h4 className="font-semibold text-lg mb-2">¿Puedo cancelar en cualquier momento?</h4>
                    <p className="text-gray-400">
                      Sí, puedes cancelar tu membresía cuando lo desees sin penalizaciones.
                    </p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-lg mb-2">¿Ofrecen prueba gratuita?</h4>
                    <p className="text-gray-400">
                      Contáctanos para conocer nuestras promociones actuales y días de prueba disponibles.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* UI cuando SÍ hay membresía (código original) */}
          {membership && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Información principal de membresía */}
            <div className="lg:col-span-2 space-y-6">
              {/* Estado actual */}
              <Card className={`bg-gradient-to-br ${getPlanColor(membership?.type?.name)} border-0 shadow-2xl`}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="p-3 bg-white/10 rounded-xl backdrop-blur-sm">
                        {getPlanIcon(membership?.type?.name)}
                      </div>
                      <div>
                        <CardTitle className="text-2xl text-white">
                          Plan {getMembershipTypeDisplay(membership?.type?.name)}
                        </CardTitle>
                        <p className="text-white/80 text-sm mt-1">
                          {membership?.type?.description || 'Tu membresía actual'}
                        </p>
                      </div>
                    </div>
                    {membership && getStatusBadge(membership.status)}
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                      <p className="text-white/70 text-sm mb-1">Fecha de inicio</p>
                      <p className="text-white font-semibold">{formatDate(membership?.startDate)}</p>
                    </div>
                    <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                      <p className="text-white/70 text-sm mb-1">Fecha de vencimiento</p>
                      <p className="text-white font-semibold">{formatDate(membership?.endDate)}</p>
                    </div>
                  </div>

                  {membership?.daysRemaining && membership.daysRemaining > 0 && (
                    <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                      <div className="flex items-center gap-2">
                        <Clock className="w-5 h-5 text-white" />
                        <div>
                          <p className="text-white font-semibold">
                            {membership.daysRemaining} día{membership.daysRemaining !== 1 ? 's' : ''} restantes
                          </p>
                          <p className="text-white/70 text-sm">
                            {membershipManagementService.getMembershipStatusMessage(membership)}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  {membership?.status === MembershipStatus.SUSPENDED && (
                    <div className="bg-yellow-500/20 border border-yellow-500/50 rounded-lg p-4">
                      <div className="flex items-start gap-3">
                        <AlertTriangle className="w-5 h-5 text-yellow-400 flex-shrink-0 mt-0.5" />
                        <div>
                          <p className="text-yellow-200 font-semibold">Membresía Suspendida</p>
                          <p className="text-yellow-100 text-sm mt-1">
                            Motivo: {membership.suspensionReason || 'No especificado'}
                          </p>
                          <p className="text-yellow-100 text-sm">
                            Se reactivará el: {formatDate(membership.suspensionEndDate)}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  {membership?.status === MembershipStatus.EXPIRED && (
                    <div className="bg-red-500/20 border border-red-500/50 rounded-lg p-4">
                      <div className="flex items-start gap-3">
                        <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
                        <div>
                          <p className="text-red-200 font-semibold">Membresía Vencida</p>
                          <p className="text-red-100 text-sm mt-1">
                            Tu membresía expiró el {formatDate(membership.endDate)}. Renueva para continuar disfrutando de todos los beneficios.
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Acciones disponibles */}
              <Card className="bg-gray-800/50 border-gray-700">
                <CardHeader>
                  <CardTitle className="text-xl">Acciones Disponibles</CardTitle>
                  <p className="text-gray-400 text-sm">Gestiona tu membresía según tus necesidades</p>
                </CardHeader>
                <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Renovar */}
                  <Link href={canRenew ? "/dashboard/membresia/renovar" : "#"} className={!canRenew ? 'pointer-events-none' : ''}>
                    <Button 
                      className={`w-full h-auto py-6 flex flex-col items-start gap-2 ${
                        canRenew 
                          ? 'bg-gradient-to-r from-green-600 to-green-700 hover:from-green-500 hover:to-green-600' 
                          : 'bg-gray-700 cursor-not-allowed opacity-50'
                      }`}
                      disabled={!canRenew}
                    >
                      <div className="flex items-center gap-3 w-full">
                        <RefreshCw className="w-6 h-6" />
                        <div className="text-left flex-1">
                          <p className="font-bold text-base">Renovar Membresía</p>
                          <p className="text-xs text-white/80 mt-1">Extiende tu membresía actual</p>
                        </div>
                      </div>
                    </Button>
                  </Link>

                  {/* Suspender */}
                  <Link href={canSuspend ? "/dashboard/membresia/suspender" : "#"} className={!canSuspend ? 'pointer-events-none' : ''}>
                    <Button 
                      className={`w-full h-auto py-6 flex flex-col items-start gap-2 ${
                        canSuspend 
                          ? 'bg-gradient-to-r from-yellow-600 to-yellow-700 hover:from-yellow-500 hover:to-yellow-600' 
                          : 'bg-gray-700 cursor-not-allowed opacity-50'
                      }`}
                      disabled={!canSuspend}
                    >
                      <div className="flex items-center gap-3 w-full">
                        <PauseCircle className="w-6 h-6" />
                        <div className="text-left flex-1">
                          <p className="font-bold text-base">Suspender Temporalmente</p>
                          <p className="text-xs text-white/80 mt-1">
                            Pausa tu membresía (15-90 días)
                            {membership?.suspensionsUsed ? ` · ${2 - membership.suspensionsUsed} disponibles` : ''}
                          </p>
                        </div>
                      </div>
                    </Button>
                  </Link>

                  {/* Reactivar */}
                  {canReactivate && (
                    <Button 
                      onClick={handleReactivate}
                      className="w-full h-auto py-6 flex flex-col items-start gap-2 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600"
                    >
                      <div className="flex items-center gap-3 w-full">
                        <CheckCircle className="w-6 h-6" />
                        <div className="text-left flex-1">
                          <p className="font-bold text-base">Reactivar Membresía</p>
                          <p className="text-xs text-white/80 mt-1">Volver a activar tu membresía suspendida</p>
                        </div>
                      </div>
                    </Button>
                  )}

                  {/* Cancelar */}
                  <Link href={canCancel ? "/dashboard/membresia/cancelar" : "#"} className={!canCancel ? 'pointer-events-none' : ''}>
                    <Button 
                      variant="outline"
                      className={`w-full h-auto py-6 flex flex-col items-start gap-2 border-2 ${
                        canCancel 
                          ? 'border-red-500/50 text-red-400 hover:bg-red-500/10 hover:text-red-300 hover:border-red-400' 
                          : 'border-gray-700 text-gray-500 cursor-not-allowed opacity-50'
                      }`}
                      disabled={!canCancel}
                    >
                      <div className="flex items-center gap-3 w-full">
                        <XCircle className="w-6 h-6" />
                        <div className="text-left flex-1">
                          <p className="font-bold text-base">Cancelar Membresía</p>
                          <p className="text-xs opacity-80 mt-1">Terminar tu suscripción</p>
                        </div>
                      </div>
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            </div>

            {/* Información adicional */}
            <div className="space-y-6">
              {/* Beneficios actuales */}
              {membership?.type && (
                <Card className="bg-gray-800/50 border-gray-700">
                  <CardHeader>
                    <CardTitle className="text-lg">Tus Beneficios</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-center gap-3 text-sm">
                      <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0" />
                      <span className="text-gray-300">
                        {membership.type.accessToAllLocation ? 'Acceso a todas las sucursales' : 'Acceso a una sucursal'}
                      </span>
                    </div>
                    <div className="flex items-center gap-3 text-sm">
                      <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0" />
                      <span className="text-gray-300">
                        {membership.type.groupClassesSessionsIncluded === -1 
                          ? 'Clases grupales ilimitadas'
                          : membership.type.groupClassesSessionsIncluded > 0
                            ? `${membership.type.groupClassesSessionsIncluded} clases grupales/mes`
                            : 'Sin clases grupales incluidas'
                        }
                      </span>
                    </div>
                    <div className="flex items-center gap-3 text-sm">
                      <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0" />
                      <span className="text-gray-300">
                        {membership.type.personalTrainingIncluded > 0
                          ? `${membership.type.personalTrainingIncluded} sesiones de entrenamiento personal/mes`
                          : 'Sin entrenamiento personal incluido'
                        }
                      </span>
                    </div>
                    {membership.type.specializedClassesIncluded && (
                      <div className="flex items-center gap-3 text-sm">
                        <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0" />
                        <span className="text-gray-300">Clases especializadas incluidas</span>
                      </div>
                    )}
                  </CardContent>
                </Card>
              )}

              {/* Información de ayuda */}
              <Card className="bg-blue-500/10 border-blue-500/30">
                <CardHeader>
                  <CardTitle className="text-lg text-blue-300">¿Necesitas ayuda?</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 text-sm text-blue-200">
                  <p>Si tienes dudas sobre tu membresía o necesitas asistencia, contáctanos:</p>
                  <div className="space-y-2">
                    <p className="font-semibold">📧 soporte@fitzone.com</p>
                    <p className="font-semibold">📞 +57 300 123 4567</p>
                    <p className="text-xs text-blue-300">Horario: Lun-Vie 8AM-8PM, Sáb 9AM-2PM</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
          )}
          {/* Fin del condicional de membresía */}
        </div>
      </div>
    </AuthGuard>
  )
}
