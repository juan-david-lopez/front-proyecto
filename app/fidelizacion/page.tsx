// app/fidelizacion/page.tsx
"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/contexts/auth-context"
import loyaltyService from "@/services/loyaltyService"
import type { LoyaltyDashboard } from "@/types/loyalty"
import { LoyaltyBadge } from "@/components/loyalty/loyalty-badge"
import { PointsDisplay } from "@/components/loyalty/points-display"
import { TierProgressBar } from "@/components/loyalty/tier-progress-bar"
import { EarnPointsActions } from "@/components/loyalty/earn-points-actions"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Loader2, Gift, History, Award, TrendingUp, Copy, CheckCircle2 } from "lucide-react"
import { formatDistanceToNow } from "date-fns"
import { es } from "date-fns/locale"
import { toast } from "sonner"

export default function FidelizacionPage() {
  const { user } = useAuth()
  const router = useRouter()
  const [dashboard, setDashboard] = useState<LoyaltyDashboard | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [copiedCode, setCopiedCode] = useState<string | null>(null)

  useEffect(() => {
    if (!user) {
      router.push("/login?redirect=/fidelizacion")
      return
    }
    loadDashboard()
  }, [user, router])

  const loadDashboard = async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await loyaltyService.getDashboard()
      setDashboard(data)
    } catch (error: any) {
      console.error("Error loading dashboard:", error)
      const errorMessage = error?.message || "Error al cargar el dashboard de fidelización"
      setError(errorMessage)
      toast.error(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  const copyCode = (code: string) => {
    navigator.clipboard.writeText(code)
    setCopiedCode(code)
    toast.success("Código copiado al portapapeles")
    setTimeout(() => setCopiedCode(null), 2000)
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

  if (loading) {
    return (
      <div className="min-h-screen bg-theme-primary flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-red-500 mx-auto mb-4" />
          <p className="text-theme-secondary">Cargando programa de fidelización...</p>
        </div>
      </div>
    )
  }

  if (error || !dashboard) {
    return (
      <div className="min-h-screen bg-theme-primary flex items-center justify-center p-6">
        <Card className="card-theme border-theme max-w-md w-full">
          <CardContent className="p-8 text-center">
            <div className="w-16 h-16 rounded-full bg-red-500/20 flex items-center justify-center mx-auto mb-4">
              <Gift className="w-8 h-8 text-red-500" />
            </div>
            <h2 className="text-2xl font-bold text-theme-primary mb-2">
              Error al cargar datos
            </h2>
            <p className="text-theme-secondary mb-6">
              {error || "No se pudieron cargar los datos del programa de fidelización."}
            </p>
            <div className="space-y-3">
              <Button 
                onClick={loadDashboard}
                className="w-full bg-red-600 hover:bg-red-700"
              >
                Reintentar
              </Button>
              <Button 
                onClick={() => router.push("/dashboard")}
                variant="outline"
                className="w-full border-theme text-theme-secondary hover:text-theme-primary"
              >
                Volver al Dashboard
              </Button>
            </div>
            <p className="text-xs text-theme-secondary mt-4">
              💡 Nota: El programa de fidelización requiere que el backend esté configurado correctamente.
            </p>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background text-foreground p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-gradient-to-r from-red-600 to-orange-600 rounded-lg p-8 text-white mb-6 shadow-xl">
          <div className="flex items-center gap-4 mb-4">
            <Button
              onClick={() => router.push("/dashboard")}
              variant="ghost"
              size="sm"
              className="text-white hover:bg-white/20"
            >
              ← Volver
            </Button>
          </div>
          <h1 className="text-4xl font-bold mb-2">Mi Fidelización</h1>
          <p className="text-lg opacity-90">{dashboard.motivationalMessage}</p>
        </div>

        {/* Advertencia de puntos por expirar */}
        {dashboard.pointsExpiringInNext30Days > 0 && (
          <Card className="card-theme border-yellow-500 mb-6">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <TrendingUp className="w-6 h-6 text-yellow-500" />
                <div>
                  <p className="font-semibold text-theme-primary">
                    ⚠️ Tienes {dashboard.pointsExpiringInNext30Days} puntos que expirarán pronto
                  </p>
                  <p className="text-sm text-theme-secondary">
                    ¡Úsalos antes de que sea tarde!
                  </p>
                </div>
                <Button
                  onClick={() => router.push("/fidelizacion/recompensas")}
                  variant="outline"
                  className="ml-auto"
                >
                  Ver Recompensas
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          {/* Perfil y Badge */}
          <div className="space-y-4">
            <Card className="card-theme">
              <CardContent className="p-6 text-center">
                <div className="flex justify-center mb-4">
                  <LoyaltyBadge 
                    tier={dashboard.profile.currentTier} 
                    size="large" 
                    animated 
                  />
                </div>
                <h2 className="text-2xl font-bold text-theme-primary mb-2">
                  Nivel {dashboard.profile.currentTier}
                </h2>
                <p className="text-sm text-theme-secondary mb-4">
                  Miembro desde hace {dashboard.profile.monthsAsMember} meses
                </p>
                
                {/* Beneficios del nivel */}
                <div className="space-y-2 text-sm text-left">
                  <div className="flex justify-between">
                    <span className="text-theme-secondary">Descuento renovación:</span>
                    <span className="font-semibold text-green-400">
                      {dashboard.profile.tierBenefits.renewalDiscountPercentage}%
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-theme-secondary">Clases adicionales:</span>
                    <span className="font-semibold text-theme-primary">
                      {dashboard.profile.tierBenefits.additionalClassesPerMonth}/mes
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-theme-secondary">Pases de invitado:</span>
                    <span className="font-semibold text-theme-primary">
                      {dashboard.profile.tierBenefits.freeGuestPassesPerMonth}/mes
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <PointsDisplay
              availablePoints={dashboard.profile.availablePoints}
              totalPoints={dashboard.profile.totalPoints}
              expiringPoints={dashboard.pointsExpiringInNext30Days}
            />

            <TierProgressBar
              currentTier={dashboard.profile.currentTier}
              nextTier={dashboard.profile.nextTier}
              monthsRemaining={dashboard.profile.monthsToNextTier}
              totalMonths={12}
            />
          </div>

          {/* Actividades Recientes y Canjes */}
          <div className="lg:col-span-2 space-y-6">
            {/* Componente para ganar puntos */}
            <EarnPointsActions onPointsEarned={loadDashboard} />

            {/* Actividades Recientes */}
            <Card className="card-theme">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-theme-primary">
                  <History className="w-5 h-5" />
                  Actividades Recientes
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {dashboard.recentActivities.slice(0, 10).map((activity) => (
                    <div
                      key={activity.idLoyaltyActivity}
                      className="flex items-center justify-between p-3 rounded-lg bg-theme-secondary/10 hover:bg-theme-secondary/20 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">{getActivityIcon(activity.activityType)}</span>
                        <div>
                          <p className="font-semibold text-theme-primary text-sm">
                            {activity.activityTypeDisplayName}
                          </p>
                          <p className="text-xs text-theme-secondary">{activity.description}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-bold text-green-400">+{activity.pointsEarned}</p>
                        <p className="text-xs text-theme-secondary">
                          {formatDistanceToNow(new Date(activity.activityDate), {
                            addSuffix: true,
                            locale: es
                          })}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
                <Button
                  onClick={() => router.push("/fidelizacion/historial")}
                  variant="outline"
                  className="w-full mt-4"
                >
                  Ver Historial Completo
                </Button>
              </CardContent>
            </Card>

            {/* Canjes Activos */}
            {dashboard.activeRedemptions.length > 0 && (
              <Card className="card-theme">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-theme-primary">
                    <Gift className="w-5 h-5" />
                    Tus Canjes Activos
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {dashboard.activeRedemptions.map((redemption) => (
                      <Card
                        key={redemption.idLoyaltyRedemption}
                        className="border-2 border-green-500/30 bg-green-500/5"
                      >
                        <CardContent className="p-4">
                          <div className="flex items-start justify-between mb-3">
                            <h3 className="font-bold text-theme-primary">{redemption.rewardName}</h3>
                            <Badge variant="default" className="bg-green-600">
                              ACTIVO
                            </Badge>
                          </div>
                          <div className="redemption-code text-center mb-3">
                            {redemption.redemptionCode}
                          </div>
                          <Button
                            onClick={() => copyCode(redemption.redemptionCode)}
                            variant="outline"
                            size="sm"
                            className="w-full"
                          >
                            {copiedCode === redemption.redemptionCode ? (
                              <>
                                <CheckCircle2 className="w-4 h-4 mr-2" />
                                Copiado
                              </>
                            ) : (
                              <>
                                <Copy className="w-4 h-4 mr-2" />
                                Copiar Código
                              </>
                            )}
                          </Button>
                          <p className="text-xs text-theme-secondary mt-2 text-center">
                            Válido hasta:{" "}
                            {new Date(redemption.expirationDate).toLocaleDateString("es-ES")}
                          </p>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                  <Button
                    onClick={() => router.push("/fidelizacion/mis-canjes")}
                    variant="outline"
                    className="w-full mt-4"
                  >
                    Ver Todos los Canjes
                  </Button>
                </CardContent>
              </Card>
            )}

            {/* Quick Actions */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              <Button
                onClick={() => router.push("/fidelizacion/recompensas")}
                className="h-24 flex flex-col items-center justify-center gap-2 btn-primary-red"
              >
                <Gift className="w-6 h-6" />
                <span className="text-sm font-semibold">Recompensas</span>
              </Button>
              <Button
                onClick={() => router.push("/fidelizacion/niveles")}
                variant="outline"
                className="h-24 flex flex-col items-center justify-center gap-2"
              >
                <Award className="w-6 h-6" />
                <span className="text-sm font-semibold">Niveles</span>
              </Button>
              <Button
                onClick={() => router.push("/fidelizacion/historial")}
                variant="outline"
                className="h-24 flex flex-col items-center justify-center gap-2"
              >
                <History className="w-6 h-6" />
                <span className="text-sm font-semibold">Historial</span>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
