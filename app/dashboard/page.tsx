"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { useRouter } from "next/navigation"
import {
  User,
  BarChart3,
  CreditCard,
  Settings,
  Calendar,
  Clock,
  Flame,
  LogOut,
  CheckCircle,
  TrendingUp,
  Target,
  Award,
  Bell,
  Activity,
} from "lucide-react"
import { AuthGuard } from "@/components/auth-guard"
import { useState, useEffect } from "react"

export default function DashboardPage() {
  const router = useRouter()
  const [userName, setUserName] = useState("Usuario")
  const [membershipStatus, setMembershipStatus] = useState("inactive") // inactive, active, premium, vip

  useEffect(() => {
    // Simular obtener datos del usuario desde localStorage o API
    const userData = localStorage.getItem("user")
    if (userData) {
      const user = JSON.parse(userData)
      setUserName(user.name || "Usuario")
      // Simular estado de membresía basado en datos del usuario
      setMembershipStatus(user.membership || "inactive")
    }
  }, [])

  const handleLogout = () => {
    localStorage.removeItem("user")
    router.push("/")
  }

  const currentDate = new Date().toLocaleDateString("es-ES", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  })

  const getMembershipInfo = () => {
    switch (membershipStatus) {
      case "active":
        return {
          title: "Membresía Básica Activa",
          description: "Acceso completo al gimnasio",
          color: "bg-green-600",
          icon: CheckCircle,
          badge: "Activa",
          badgeColor: "bg-green-100 text-green-800",
        }
      case "premium":
        return {
          title: "Membresía Premium Activa",
          description: "Incluye clases grupales y entrenador personal",
          color: "bg-blue-600",
          icon: Award,
          badge: "Premium",
          badgeColor: "bg-blue-100 text-blue-800",
        }
      case "vip":
        return {
          title: "Membresía VIP Activa",
          description: "Acceso completo + nutricionista + sauna",
          color: "bg-purple-600",
          icon: Award,
          badge: "VIP",
          badgeColor: "bg-purple-100 text-purple-800",
        }
      default:
        return {
          title: "Sin Membresía Activa",
          description: "Adquiere una membresía para acceder a todos los beneficios",
          color: "bg-gray-600",
          icon: CreditCard,
          badge: "Inactiva",
          badgeColor: "bg-gray-100 text-gray-800",
        }
    }
  }

  const membershipInfo = getMembershipInfo()
  const MembershipIcon = membershipInfo.icon

  return (
    <AuthGuard requireAuth={true}>
      <div className="min-h-screen bg-background text-foreground">
        {/* Header */}
        <header className="flex items-center justify-between px-6 py-4 bg-background border-b border-border shadow-sm">
          <div className="flex items-center space-x-4">
            <div
              className="w-12 h-12 bg-gradient-to-br from-red-600 to-red-700 rounded-full flex items-center justify-center shadow-lg"
              role="img"
              aria-label="Avatar del usuario"
            >
              <span className="text-white font-bold text-lg">{userName.charAt(0).toUpperCase()}</span>
            </div>
            <div>
              <h1 className="text-xl font-semibold">¡Hola, {userName}!</h1>
              <p className="text-sm text-muted-foreground">Bienvenido a tu dashboard</p>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <Button
              variant="ghost"
              size="sm"
              className="text-muted-foreground hover:text-foreground"
              aria-label="Notificaciones"
            >
              <Bell className="w-5 h-5" />
            </Button>
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
            <Card className="bg-card border-border shadow-sm">
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
                        <h3 className="text-xl font-semibold text-card-foreground">{membershipInfo.title}</h3>
                        <Badge className={membershipInfo.badgeColor}>{membershipInfo.badge}</Badge>
                      </div>
                      <p className="text-muted-foreground mb-4">{membershipInfo.description}</p>
                      {membershipStatus === "inactive" && (
                        <Link href="/membresias">
                          <Button className="bg-red-600 hover:bg-red-700 text-white">Adquirir Membresía</Button>
                        </Link>
                      )}
                      {membershipStatus !== "inactive" && (
                        <div className="flex space-x-3">
                          <Link href="/membresias">
                            <Button
                              variant="outline"
                              className="border-red-600 text-red-600 hover:bg-red-600 hover:text-white bg-transparent"
                            >
                              Cambiar Plan
                            </Button>
                          </Link>
                          <Button variant="ghost" className="text-muted-foreground">
                            Ver Detalles
                          </Button>
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
                className="bg-card border-border hover:bg-accent transition-all duration-200 cursor-pointer hover:shadow-md"
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
                  <h3 className="text-lg font-semibold text-card-foreground mb-2">Mi Perfil</h3>
                  <p className="text-muted-foreground text-sm">Configurar información personal</p>
                </CardContent>
              </Card>

              <Card
                className="bg-card border-red-600 border-2 hover:bg-accent transition-all duration-200 cursor-pointer hover:shadow-md"
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
                  <h3 className="text-lg font-semibold text-card-foreground mb-2">Estadísticas</h3>
                  <p className="text-muted-foreground text-sm">Ver progreso y métricas</p>
                </CardContent>
              </Card>

              <Link href="/membresias" className="block">
                <Card
                  className="bg-card border-border hover:bg-accent transition-all duration-200 cursor-pointer h-full hover:shadow-md"
                  role="gridcell"
                >
                  <CardContent className="p-6 text-center">
                    <div
                      className="w-12 h-12 bg-gradient-to-br from-orange-600 to-orange-700 rounded-lg flex items-center justify-center mx-auto mb-4 shadow-sm"
                      role="img"
                      aria-label="Icono de membresías"
                    >
                      <CreditCard className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="text-lg font-semibold text-card-foreground mb-2">Membresías</h3>
                    <p className="text-muted-foreground text-sm">Gestionar planes y pagos</p>
                  </CardContent>
                </Card>
              </Link>

              <Link href="/configuracion" className="block">
                <Card
                  className="bg-card border-border hover:bg-accent transition-all duration-200 cursor-pointer h-full hover:shadow-md"
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
                    <h3 className="text-lg font-semibold text-card-foreground mb-2">Configuración</h3>
                    <p className="text-muted-foreground text-sm">Ajustes de la aplicación</p>
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
                <p className="text-muted-foreground capitalize">{currentDate}</p>
              </div>
              <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground">
                <TrendingUp className="w-4 h-4 mr-2" />
                Ver Historial
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6" role="grid">
              <Card className="bg-card border-border shadow-sm hover:shadow-md transition-shadow" role="gridcell">
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
                        <div className="text-2xl font-bold text-card-foreground">2</div>
                        <div className="text-muted-foreground text-sm">Entrenamientos</div>
                      </div>
                    </div>
                    <div className="text-green-600 text-sm font-medium">+1</div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-card border-border shadow-sm hover:shadow-md transition-shadow" role="gridcell">
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
                        <div className="text-2xl font-bold text-card-foreground">1h 15m</div>
                        <div className="text-muted-foreground text-sm">Tiempo Entrenado</div>
                      </div>
                    </div>
                    <div className="text-green-600 text-sm font-medium">+30m</div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-card border-border shadow-sm hover:shadow-md transition-shadow" role="gridcell">
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
                        <div className="text-2xl font-bold text-card-foreground">485</div>
                        <div className="text-muted-foreground text-sm">Calorías Quemadas</div>
                      </div>
                    </div>
                    <div className="text-green-600 text-sm font-medium">+165</div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-card border-border shadow-sm hover:shadow-md transition-shadow" role="gridcell">
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
                        <div className="text-2xl font-bold text-card-foreground">75%</div>
                        <div className="text-muted-foreground text-sm">Objetivo Diario</div>
                      </div>
                    </div>
                    <div className="text-green-600 text-sm font-medium">+25%</div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </section>

          {/* Weekly Progress */}
          <section aria-labelledby="progress-heading">
            <h2 id="progress-heading" className="text-2xl font-bold text-red-500 mb-6">
              Progreso Semanal
            </h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="bg-card border-border shadow-sm">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Activity className="w-5 h-5 text-red-600" />
                    <span>Actividad</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Entrenamientos completados</span>
                      <span className="font-semibold">8/10</span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2">
                      <div className="bg-red-600 h-2 rounded-full" style={{ width: "80%" }}></div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-card border-border shadow-sm">
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
                        <p className="text-xs text-muted-foreground">5 días seguidos entrenando</p>
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
