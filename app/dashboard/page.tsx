// app/dashboard/page.tsx
"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { 
  User, BarChart3, CreditCard, Settings, Calendar, 
  Clock, Flame, LogOut, CheckCircle, TrendingUp, 
  Target, Award, Bell, Activity, Loader2, RefreshCw 
} from "lucide-react"
import { AuthGuard } from "@/components/auth-guard"
import { useState, useEffect } from "react"
import { membershipService } from "@/services/membershipService"
import { MembershipStatusResponse, MembershipTypeName } from "@/types/membership"
import { userService } from "@/services/userService"
import { ReservationWidget } from "@/components/reservation/reservation-widget"
import { NotificationBell } from "@/components/reservation/notification-bell"
import { MembershipNotificationBell } from "@/components/membership-notification-bell"
import { useAuth } from "@/contexts/auth-context"


export default function DashboardPage() {
  const router = useRouter()
  const { user: contextUser, refreshUser } = useAuth()
  const [userName, setUserName] = useState("Usuario")
  const [userId, setUserId] = useState<number | null>(null)
  const [membershipStatus, setMembershipStatus] = useState<MembershipStatusResponse | null>(null)
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [currentDate] = useState(new Date().toLocaleDateString("es-ES", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  }))

  useEffect(() => {
    loadUserData()
  }, [contextUser?.membershipType]) // Re-cargar cuando cambie el tipo de membresía en el contexto

 const loadUserData = async () => {
  try {
    setLoading(true)
    
    // 1. Primero, intentar refrescar el usuario desde el backend
    console.log('🔄 [Dashboard] Refrescando usuario desde backend...')
    try {
      await refreshUser()
      console.log('✅ [Dashboard] Usuario refrescado desde backend')
    } catch (error) {
      console.warn('⚠️ [Dashboard] Error al refrescar usuario, usando datos del localStorage:', error)
    }
    
    // 2. Obtener datos actualizados (ya sea del backend o del localStorage)
    const userData = userService.getCurrentUser()
    
    console.log('👤 [Dashboard] User data from storage:', userData)
    console.log('💳 [Dashboard] MembershipType from context:', contextUser?.membershipType)
    
    if (!userData) {
      console.warn('⚠️ [Dashboard] No user data found in storage')
      setMembershipStatus({
        isActive: false,
        status: "INACTIVE",
        membershipType: MembershipTypeName.NONE,
      })
      return
    }

    setUserName(userData.name || userData.email || "Usuario")
    
    // El objeto puede venir del contexto (User.id: string) o de localStorage (UserResponse.idUser: number)
    // Intentar obtener el ID de ambas formas
    const userIdString = (userData as any).id || userData.idUser?.toString()
    const userIdNumber = Number(userIdString)
    console.log('🆔 [Dashboard] User ID (string):', userIdString)
    console.log('🆔 [Dashboard] User ID (number):', userIdNumber)
    
    if (!userIdNumber || isNaN(userIdNumber) || userIdNumber === 0) {
      console.error('❌ [Dashboard] Invalid user ID. userData:', userData)
      setMembershipStatus({
        isActive: false,
        status: "INACTIVE",
        membershipType: MembershipTypeName.NONE,
      })
      return
    }
    
    setUserId(userIdNumber)
    
    // 3. Verificar si el usuario tiene membershipType en el contexto o localStorage
    const userMembershipType = contextUser?.membershipType || userData.membershipType
    console.log('💳 [Dashboard] UserMembershipType detected:', userMembershipType)
    
    // 4. Si el usuario tiene membershipType, usarlo directamente (más confiable que el endpoint status)
    if (userMembershipType && userMembershipType !== 'null') {
      console.log('✅ [Dashboard] Usando membershipType del usuario:', userMembershipType)
      
      // Mapear el tipo de membresía
      let mappedType = MembershipTypeName.NONE
      if (userMembershipType.toLowerCase() === 'basico' || userMembershipType.toLowerCase() === 'basic') {
        mappedType = MembershipTypeName.BASIC
      } else if (userMembershipType.toLowerCase() === 'premium') {
        mappedType = MembershipTypeName.PREMIUM
      } else if (userMembershipType.toLowerCase() === 'elite' || userMembershipType.toLowerCase() === 'vip') {
        mappedType = MembershipTypeName.ELITE
      }
      
      setMembershipStatus({
        isActive: true,
        status: "ACTIVE",
        membershipType: mappedType,
      })
    } else {
      // 5. Si no hay membershipType, consultar el endpoint status
      console.log('🔄 [Dashboard] No membershipType found, checking status endpoint...')
      const status = await membershipService.checkMembership(userIdNumber)
      console.log('📥 [Dashboard] Status from backend:', status)
      setMembershipStatus(status)
    }
    
  } catch (error) {
    console.error('❌ [Dashboard] Error loading user data:', error)
    setMembershipStatus({
      isActive: false,
      status: "INACTIVE",
      membershipType: MembershipTypeName.NONE,
    })
  } finally {
    setLoading(false)
  }
} 

  const handleLogout = () => {
    userService.clearAuth()
    router.push('/')
  }

  const handleRefreshMembership = async () => {
    setRefreshing(true)
    try {
      console.log('🔄 [Dashboard] Forzando recarga de membresía...')
      await loadUserData()
      console.log('✅ [Dashboard] Membresía recargada')
    } catch (error) {
      console.error('❌ [Dashboard] Error al refrescar membresía:', error)
    } finally {
      setRefreshing(false)
    }
  }

  const getMembershipInfo = () => {
    if (!membershipStatus) {
      return {
        title: "Cargando estado...",
        description: "Verificando información de membresía",
        color: "bg-theme-secondary",
        icon: CreditCard,
        badge: "Cargando",
        badgeColor: "bg-theme-secondary text-theme-primary",
        expiryDate: null
      }
    }

    if (membershipStatus.isActive) {
      const membershipType = membershipStatus.membershipType || "ACTIVE"
      const expiryDate = membershipStatus.expiryDate ? 
        new Date(membershipStatus.expiryDate).toLocaleDateString("es-ES") : 
        "Próximamente"
      
      switch (membershipType.toUpperCase()) {
        case "PREMIUM":
          return {
            title: "Membresía Premium Activa",
            description: `Incluye clases grupales y entrenador personal - Vence: ${expiryDate}`,
            color: "bg-blue-600",
            icon: Award,
            badge: "Premium",
            badgeColor: "bg-blue-100 text-blue-800",
            expiryDate
          }
        case "ELITE":
          return {
            title: "Membresía ELITE Activa",
            description: `Acceso completo + clases personalizadas + sauna - Vence: ${expiryDate}`,
            color: "bg-purple-600",
            icon: Award,
            badge: "ELITE",
            badgeColor: "bg-purple-100 text-purple-800",
            expiryDate
          }
        default:
          return {
            title: "Membresía Básica Activa",
            description: `Acceso completo al gimnasio - Vence: ${expiryDate}`,
            color: "bg-green-600",
            icon: CheckCircle,
            badge: "Activa",
            badgeColor: "bg-green-100 text-green-800",
            expiryDate
          }
      }
    } else {
      return {
        title: "Sin Membresía Activa",
        description: "Adquiere una membresía para acceder a todos los beneficios",
        color: "bg-theme-secondary",
        icon: CreditCard,
        badge: "Inactiva",
        badgeColor: "bg-gray-100 text-gray-800",
        expiryDate: null
      }
    }
  }

  const membershipInfo = getMembershipInfo()
  const MembershipIcon = membershipInfo.icon

  if (loading) {
    return (
      <div className="min-h-screen bg-theme-primary flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-red-500" />
        <span className="ml-2 text-theme-primary">Cargando dashboard...</span>
      </div>
    )
  }

  return (
    <AuthGuard requireAuth={true}>
      <div className="min-h-screen bg-theme-primary text-theme-primary">
        {/* Header */}
        <header className="flex items-center justify-between px-6 py-4 bg-theme-primary border-b border-theme shadow-sm">
          <div className="flex items-center space-x-4">
            <div
              className="w-12 h-12 bg-gradient-to-br from-red-600 to-red-700 rounded-full flex items-center justify-center shadow-lg"
              role="img"
              aria-label="Avatar del usuario"
            >
              <span className="text-white font-bold text-lg">{userName.charAt(0).toUpperCase()}</span>
            </div>
            <div>
              <h1 className="text-xl font-semibold text-theme-primary">¡Hola, {userName}!</h1>
              <p className="text-sm text-theme-secondary">Bienvenido a tu dashboard</p>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <MembershipNotificationBell />
            <NotificationBell />
            <Button
              onClick={handleLogout}
              variant="outline"
              className="border-red-600 text-red-600 hover:bg-red-600 hover:text-white bg-transparent"
              aria-label="Cerrar sesión de la aplicación"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Cerrar Sesión
            </Button>
          </div>
        </header>

        <div className="px-6 py-8 space-y-8">
          {/* Membership Status */}
          <section aria-labelledby="membership-heading">
            <h2 id="membership-heading" className="text-2xl font-bold text-red-500 mb-4">
              Estado de Membresía
            </h2>
            <Card className="card-theme border-theme shadow-sm">
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-4">
                    <div
                      className={`w-12 h-12 ${membershipInfo.color} rounded-lg flex items-center justify-center flex-shrink-0`}
                      role="img"
                      aria-label={membershipInfo.title}
                    >
                      <MembershipIcon className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h3 className="text-xl font-semibold text-theme-primary">{membershipInfo.title}</h3>
                        <Badge className={membershipInfo.badgeColor}>{membershipInfo.badge}</Badge>
                        <Button
                          onClick={handleRefreshMembership}
                          variant="ghost"
                          size="sm"
                          disabled={refreshing}
                          className="ml-auto"
                          aria-label="Actualizar estado de membresía"
                        >
                          <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
                        </Button>
                      </div>
                      <p className="text-theme-secondary mb-4">{membershipInfo.description}</p>
                      {(!membershipStatus || !membershipStatus.isActive) && (
                        <Link href="/membresias">
                          <Button className="bg-red-600 hover:bg-red-700 text-white">Adquirir Membresía</Button>
                        </Link>
                      )}
                      {membershipStatus?.isActive && (
                        <div className="flex space-x-3">
                          <Link href="/dashboard/membresia">
                            <Button className="bg-red-600 hover:bg-red-700 text-white">
                              Gestionar Membresía
                            </Button>
                          </Link>
                          <Link href="/membresias">
                            <Button
                              variant="outline"
                              className="border-red-600 text-red-600 hover:bg-red-600 hover:text-white bg-transparent"
                            >
                              Cambiar Plan
                            </Button>
                          </Link>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </section>

          {/* Quick Actions */}
          <section aria-labelledby="actions-heading">
            <h2 id="actions-heading" className="text-2xl font-bold text-red-500 mb-6">
              Acciones Rápidas
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6" role="grid">
              <Card
                className="card-theme border-theme hover:bg-theme-secondary/20 transition-all duration-200 cursor-pointer hover:shadow-md"
                role="gridcell"
              >
                <CardContent className="p-6 text-center">
                  <div
                    className="w-12 h-12 bg-gradient-to-br from-blue-600 to-blue-700 rounded-lg flex items-center justify-center mx-auto mb-4 shadow-sm"
                    role="img"
                    aria-label="Icono de perfil"
                  >
                    <User className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-lg font-semibold text-theme-primary mb-2">Mi Perfil</h3>
                  <p className="text-theme-secondary text-sm">Configurar información personal</p>
                </CardContent>
              </Card>

              <Card
                className="card-theme border-red-600 border-2 hover:bg-theme-secondary/20 transition-all duration-200 cursor-pointer hover:shadow-md"
                role="gridcell"
              >
                <CardContent className="p-6 text-center">
                  <div
                    className="w-12 h-12 bg-gradient-to-br from-green-600 to-green-700 rounded-lg flex items-center justify-center mx-auto mb-4 shadow-sm"
                    role="img"
                    aria-label="Icono de estadísticas"
                  >
                    <BarChart3 className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-lg font-semibold text-theme-primary mb-2">Estadísticas</h3>
                  <p className="text-theme-secondary text-sm">Ver progreso y métricas</p>
                </CardContent>
              </Card>

              <Link href="/dashboard/pagos" className="block">
                <Card
                  className="card-theme border-theme hover:bg-theme-secondary/20 transition-all duration-200 cursor-pointer h-full hover:shadow-md"
                  role="gridcell"
                >
                  <CardContent className="p-6 text-center">
                    <div
                      className="w-12 h-12 bg-gradient-to-br from-orange-600 to-orange-700 rounded-lg flex items-center justify-center mx-auto mb-4 shadow-sm"
                      role="img"
                      aria-label="Icono de pagos"
                    >
                      <CreditCard className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="text-lg font-semibold text-theme-primary mb-2">Pagos</h3>
                    <p className="text-theme-secondary text-sm">Historial y recibos</p>
                  </CardContent>
                </Card>
              </Link>

              <Link href="/configuracion" className="block">
                <Card
                  className="card-theme border-theme hover:bg-theme-secondary/20 transition-all duration-200 cursor-pointer h-full hover:shadow-md"
                  role="gridcell"
                >
                  <CardContent className="p-6 text-center">
                    <div
                      className="w-12 h-12 bg-gradient-to-br from-gray-600 to-gray-700 rounded-lg flex items-center justify-center mx-auto mb-4 shadow-sm"
                      role="img"
                      aria-label="Icono de configuración"
                    >
                      <Settings className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="text-lg font-semibold text-theme-primary mb-2">Configuración</h3>
                    <p className="text-theme-secondary text-sm">Ajustes de la aplicación</p>
                  </CardContent>
                </Card>
              </Link>
            </div>
          </section>

          {/* Today's Statistics */}
          <section aria-labelledby="stats-heading">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 id="stats-heading" className="text-2xl font-bold text-red-500">
                  Estadísticas de Hoy
                </h2>
                <p className="text-theme-secondary capitalize">{currentDate}</p>
              </div>
              <Button variant="ghost" size="sm" className="text-theme-secondary hover:text-theme-primary">
                <TrendingUp className="w-4 h-4 mr-2" />
                Ver Historial
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6" role="grid">
              <Card className="card-theme border-theme shadow-sm hover:shadow-md transition-shadow" role="gridcell">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div
                        className="w-12 h-12 bg-gradient-to-br from-blue-600 to-blue-700 rounded-lg flex items-center justify-center shadow-sm"
                        role="img"
                        aria-label="Icono de entrenamientos"
                      >
                        <Calendar className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <div className="text-2xl font-bold text-theme-primary">2</div>
                        <div className="text-theme-secondary text-sm">Entrenamientos</div>
                      </div>
                    </div>
                    <div className="text-green-600 text-sm font-medium">+1</div>
                  </div>
                </CardContent>
              </Card>

              <Card className="card-theme border-theme shadow-sm hover:shadow-md transition-shadow" role="gridcell">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div
                        className="w-12 h-12 bg-gradient-to-br from-orange-600 to-orange-700 rounded-lg flex items-center justify-center shadow-sm"
                        role="img"
                        aria-label="Icono de tiempo"
                      >
                        <Clock className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <div className="text-2xl font-bold text-theme-primary">1h 15m</div>
                        <div className="text-theme-secondary text-sm">Tiempo Entrenado</div>
                      </div>
                    </div>
                    <div className="text-green-600 text-sm font-medium">+30m</div>
                  </div>
                </CardContent>
              </Card>

              <Card className="card-theme border-theme shadow-sm hover:shadow-md transition-shadow" role="gridcell">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div
                        className="w-12 h-12 bg-gradient-to-br from-red-600 to-red-700 rounded-lg flex items-center justify-center shadow-sm"
                        role="img"
                        aria-label="Icono de calorías"
                      >
                        <Flame className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <div className="text-2xl font-bold text-theme-primary">485</div>
                        <div className="text-theme-secondary text-sm">Calorías Quemadas</div>
                      </div>
                    </div>
                    <div className="text-green-600 text-sm font-medium">+165</div>
                  </div>
                </CardContent>
              </Card>

              <Card className="card-theme border-theme shadow-sm hover:shadow-md transition-shadow" role="gridcell">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div
                        className="w-12 h-12 bg-gradient-to-br from-green-600 to-green-700 rounded-lg flex items-center justify-center shadow-sm"
                        role="img"
                        aria-label="Icono de objetivos"
                      >
                        <Target className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <div className="text-2xl font-bold text-theme-primary">75%</div>
                        <div className="text-theme-secondary text-sm">Objetivo Diario</div>
                      </div>
                    </div>
                    <div className="text-green-600 text-sm font-medium">+25%</div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </section>

          {/* Reservations Section */}
          <section aria-labelledby="reservations-heading">
            <h2 id="reservations-heading" className="text-2xl font-bold text-red-500 mb-6">
              Mis Reservas
            </h2>
            <ReservationWidget userId={userId || undefined} />
          </section>

          {/* Weekly Progress */}
          <section aria-labelledby="progress-heading">
            <h2 id="progress-heading" className="text-2xl font-bold text-red-500 mb-6">
              Progreso Semanal
            </h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="card-theme border-theme shadow-sm">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Activity className="w-5 h-5 text-red-600" />
                    <span>Actividad</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-theme-secondary">Entrenamientos completados</span>
                      <span className="font-semibold">8/10</span>
                    </div>
                    <div className="w-full bg-theme-secondary/20 rounded-full h-2">
                      <div className="bg-red-600 h-2 rounded-full" style={{ width: "80%" }}></div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="card-theme border-theme shadow-sm">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Award className="w-5 h-5 text-yellow-600" />
                    <span>Logros</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center">
                        <Award className="w-4 h-4 text-yellow-600" />
                      </div>
                      <div>
                        <p className="font-medium text-sm">Semana Consistente</p>
                        <p className="text-xs text-theme-secondary">5 días seguidos entrenando</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </section>
        </div>
      </div>
    </AuthGuard>
  )
}