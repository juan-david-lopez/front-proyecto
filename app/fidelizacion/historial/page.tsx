// app/fidelizacion/historial/page.tsx
"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/contexts/auth-context"
import loyaltyService from "@/services/loyaltyService"
import type { LoyaltyActivity, ActivityType } from "@/types/loyalty"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Loader2, ArrowLeft, TrendingUp, Calendar, AlertTriangle, CheckCircle2, XCircle } from "lucide-react"
import { formatDistanceToNow, isAfter, isBefore, addDays } from "date-fns"
import { es } from "date-fns/locale"
import { toast } from "sonner"

export default function HistorialPage() {
  const { user } = useAuth()
  const router = useRouter()
  const [activities, setActivities] = useState<LoyaltyActivity[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<"all" | ActivityType | "expiring">("all")

  useEffect(() => {
    if (!user) {
      router.push("/login?redirect=/fidelizacion/historial")
      return
    }
    loadActivities()
  }, [user, router])

  const loadActivities = async () => {
    try {
      setLoading(true)
      const data = await loyaltyService.getActivities()
      setActivities(data)
    } catch (error) {
      console.error("Error loading activities:", error)
      toast.error("Error al cargar historial")
    } finally {
      setLoading(false)
    }
  }

  const getActivityIcon = (type: string) => {
    const icons: Record<string, string> = {
      MEMBERSHIP_PURCHASE: "🎟️",
      MEMBERSHIP_RENEWAL: "🔄",
      MEMBERSHIP_UPGRADE: "⬆️",
      CLASS_ATTENDANCE: "💪",
      REFERRAL: "👥",
      LOGIN_STREAK: "🔥",
      EARLY_RENEWAL: "⚡",
      PAYMENT_ON_TIME: "✅",
      SOCIAL_SHARE: "📱",
      PROFILE_COMPLETION: "📝"
    }
    return icons[type] || "⭐"
  }

  const getActivityStatus = (activity: LoyaltyActivity) => {
    if (activity.isCancelled) {
      return {
        badge: (
          <Badge variant="destructive" className="text-xs">
            <XCircle className="w-3 h-3 mr-1" />
            Cancelado
          </Badge>
        ),
        className: "opacity-50"
      }
    }
    
    if (activity.isExpired) {
      return {
        badge: (
          <Badge variant="secondary" className="text-xs">
            <AlertTriangle className="w-3 h-3 mr-1" />
            Expirado
          </Badge>
        ),
        className: "opacity-70"
      }
    }

    // Verificar si expira pronto (< 30 días)
    const expirationDate = new Date(activity.expirationDate)
    const thirtyDaysFromNow = addDays(new Date(), 30)
    
    if (isBefore(expirationDate, thirtyDaysFromNow) && isAfter(expirationDate, new Date())) {
      return {
        badge: (
          <Badge className="bg-yellow-600 text-white text-xs">
            <AlertTriangle className="w-3 h-3 mr-1" />
            Expira Pronto
          </Badge>
        ),
        className: "border-yellow-500/30"
      }
    }

    return {
      badge: (
        <Badge className="bg-green-600 text-white text-xs">
          <CheckCircle2 className="w-3 h-3 mr-1" />
          Activo
        </Badge>
      ),
      className: ""
    }
  }

  const filteredActivities = activities.filter(activity => {
    if (filter === "all") return true
    if (filter === "expiring") {
      const expirationDate = new Date(activity.expirationDate)
      const thirtyDaysFromNow = addDays(new Date(), 30)
      return !activity.isExpired && 
             !activity.isCancelled && 
             isBefore(expirationDate, thirtyDaysFromNow) && 
             isAfter(expirationDate, new Date())
    }
    return activity.activityType === filter
  })

  const stats = {
    total: activities.length,
    active: activities.filter(a => !a.isExpired && !a.isCancelled).length,
    expired: activities.filter(a => a.isExpired).length,
    cancelled: activities.filter(a => a.isCancelled).length,
    totalPoints: activities
      .filter(a => !a.isCancelled)
      .reduce((sum, a) => sum + a.pointsEarned, 0)
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background text-foreground p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <Button
            onClick={() => router.push("/fidelizacion")}
            variant="ghost"
            size="icon"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div>
            <h1 className="text-4xl font-bold text-gradient-hero">Historial de Actividades</h1>
            <p className="text-theme-secondary">
              Revisa cómo has ganado tus puntos
            </p>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
          <Card className="card-theme">
            <CardContent className="p-4 text-center">
              <p className="text-2xl font-bold text-theme-primary">{stats.total}</p>
              <p className="text-xs text-theme-secondary">Total</p>
            </CardContent>
          </Card>
          <Card className="card-theme border-green-500/30">
            <CardContent className="p-4 text-center">
              <p className="text-2xl font-bold text-green-400">{stats.active}</p>
              <p className="text-xs text-theme-secondary">Activas</p>
            </CardContent>
          </Card>
          <Card className="card-theme border-gray-500/30">
            <CardContent className="p-4 text-center">
              <p className="text-2xl font-bold text-gray-400">{stats.expired}</p>
              <p className="text-xs text-theme-secondary">Expiradas</p>
            </CardContent>
          </Card>
          <Card className="card-theme border-red-500/30">
            <CardContent className="p-4 text-center">
              <p className="text-2xl font-bold text-red-400">{stats.cancelled}</p>
              <p className="text-xs text-theme-secondary">Canceladas</p>
            </CardContent>
          </Card>
          <Card className="card-theme border-yellow-500/30">
            <CardContent className="p-4 text-center">
              <p className="text-2xl font-bold text-yellow-400">{stats.totalPoints}</p>
              <p className="text-xs text-theme-secondary">Puntos Totales</p>
            </CardContent>
          </Card>
        </div>

        {/* Filtros */}
        <div className="mb-6 flex gap-4">
          <Select value={filter} onValueChange={(v: any) => setFilter(v)}>
            <SelectTrigger className="w-[280px]">
              <SelectValue placeholder="Filtrar por tipo" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas las actividades</SelectItem>
              <SelectItem value="expiring">Puntos por expirar</SelectItem>
              <SelectItem value="MEMBERSHIP_PURCHASE">Compra de Membresía</SelectItem>
              <SelectItem value="MEMBERSHIP_RENEWAL">Renovación</SelectItem>
              <SelectItem value="MEMBERSHIP_UPGRADE">Upgrade</SelectItem>
              <SelectItem value="CLASS_ATTENDANCE">Asistencia a Clase</SelectItem>
              <SelectItem value="REFERRAL">Referidos</SelectItem>
              <SelectItem value="LOGIN_STREAK">Racha de Login</SelectItem>
              <SelectItem value="EARLY_RENEWAL">Renovación Anticipada</SelectItem>
              <SelectItem value="PAYMENT_ON_TIME">Pago a Tiempo</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Lista de Actividades */}
        {filteredActivities.length === 0 ? (
          <Card className="card-theme">
            <CardContent className="p-12 text-center">
              <TrendingUp className="w-16 h-16 mx-auto mb-4 text-theme-secondary opacity-50" />
              <h3 className="text-xl font-bold text-theme-primary mb-2">
                No hay actividades
              </h3>
              <p className="text-theme-secondary">
                {filter === "all" 
                  ? "Aún no tienes actividades registradas" 
                  : "No hay actividades con este filtro"
                }
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {filteredActivities.map((activity) => {
              const status = getActivityStatus(activity)
              
              return (
                <Card
                  key={activity.idLoyaltyActivity}
                  className={`card-theme transition-all duration-300 hover:scale-[1.01] ${status.className}`}
                >
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      {/* Icono */}
                      <div className="text-4xl flex-shrink-0">
                        {getActivityIcon(activity.activityType)}
                      </div>

                      {/* Contenido principal */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-4 mb-2">
                          <div>
                            <h3 className="text-lg font-bold text-theme-primary">
                              {activity.activityTypeDisplayName}
                            </h3>
                            <p className="text-sm text-theme-secondary">
                              {activity.description}
                            </p>
                          </div>
                          {status.badge}
                        </div>

                        {/* Información adicional */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                          <div>
                            <p className="text-xs text-theme-secondary mb-1">Puntos ganados:</p>
                            <p className="text-2xl font-bold text-green-400">
                              +{activity.pointsEarned}
                            </p>
                          </div>
                          <div>
                            <p className="text-xs text-theme-secondary mb-1 flex items-center gap-1">
                              <Calendar className="w-3 h-3" />
                              Fecha de actividad:
                            </p>
                            <p className="text-sm text-theme-primary">
                              {formatDistanceToNow(new Date(activity.activityDate), {
                                addSuffix: true,
                                locale: es
                              })}
                            </p>
                            <p className="text-xs text-theme-secondary">
                              {new Date(activity.activityDate).toLocaleDateString("es-ES")}
                            </p>
                          </div>
                          <div>
                            <p className="text-xs text-theme-secondary mb-1 flex items-center gap-1">
                              <AlertTriangle className="w-3 h-3" />
                              Expiran:
                            </p>
                            {activity.isExpired ? (
                              <p className="text-sm text-red-400 font-semibold">
                                Ya expirados
                              </p>
                            ) : activity.isCancelled ? (
                              <p className="text-sm text-gray-400 font-semibold">
                                Cancelados
                              </p>
                            ) : (
                              <>
                                <p className="text-sm text-theme-primary">
                                  {formatDistanceToNow(new Date(activity.expirationDate), {
                                    addSuffix: true,
                                    locale: es
                                  })}
                                </p>
                                <p className="text-xs text-theme-secondary">
                                  {new Date(activity.expirationDate).toLocaleDateString("es-ES")}
                                </p>
                              </>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
