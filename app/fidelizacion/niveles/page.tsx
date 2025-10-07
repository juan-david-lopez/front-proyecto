// app/fidelizacion/niveles/page.tsx
"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/contexts/auth-context"
import loyaltyService from "@/services/loyaltyService"
import type { TierName } from "@/types/loyalty"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Loader2, ArrowLeft, Trophy, Star, CheckCircle2, Sparkles } from "lucide-react"
import { toast } from "sonner"

// Definición de beneficios por tier
interface TierBenefitDetail {
  id: number
  name: string
  description: string
}

const TIER_BENEFITS: Record<TierName, TierBenefitDetail[]> = {
  BRONCE: [
    { id: 1, name: "Acumulación de puntos", description: "Gana puntos por cada actividad" },
    { id: 2, name: "Acceso al catálogo de recompensas", description: "Canjea tus puntos por premios" }
  ],
  PLATA: [
    { id: 1, name: "Acumulación de puntos", description: "Gana puntos por cada actividad" },
    { id: 2, name: "Acceso al catálogo de recompensas", description: "Canjea tus puntos por premios" },
    { id: 3, name: "5% descuento en renovaciones", description: "Ahorra en cada renovación de membresía" },
    { id: 4, name: "1 clase grupal gratis al mes", description: "Clase adicional sin costo" }
  ],
  ORO: [
    { id: 1, name: "Acumulación de puntos", description: "Gana puntos por cada actividad" },
    { id: 2, name: "Acceso al catálogo de recompensas", description: "Canjea tus puntos por premios" },
    { id: 3, name: "10% descuento en renovaciones", description: "Mayor ahorro en renovaciones" },
    { id: 4, name: "2 clases grupales gratis al mes", description: "Más clases adicionales" },
    { id: 5, name: "1 pase de invitado al mes", description: "Trae un amigo gratis" },
    { id: 6, name: "Reservas prioritarias", description: "Reserva antes que otros" }
  ],
  PLATINO: [
    { id: 1, name: "Acumulación de puntos", description: "Gana puntos por cada actividad" },
    { id: 2, name: "Acceso al catálogo de recompensas", description: "Canjea tus puntos por premios" },
    { id: 3, name: "15% descuento en renovaciones", description: "Máximo descuento disponible" },
    { id: 4, name: "4 clases grupales gratis al mes", description: "Máximas clases adicionales" },
    { id: 5, name: "3 pases de invitado al mes", description: "Trae más amigos" },
    { id: 6, name: "Reservas prioritarias", description: "Acceso prioritario garantizado" },
    { id: 7, name: "Consulta nutricional gratis", description: "Asesoría nutricional incluida" },
    { id: 8, name: "10% descuento en merchandising", description: "Descuento en productos del gym" }
  ]
}

export default function NivelesPage() {
  const { user } = useAuth()
  const router = useRouter()
  const [currentTier, setCurrentTier] = useState<TierName>("BRONCE")
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user) {
      router.push("/login?redirect=/fidelizacion/niveles")
      return
    }
    loadTierData()
  }, [user, router])

  const loadTierData = async () => {
    try {
      setLoading(true)
      const dashboard = await loyaltyService.getDashboard()
      setCurrentTier(dashboard.profile.currentTier)
    } catch (error) {
      console.error("Error loading tier data:", error)
      toast.error("Error al cargar información de niveles")
    } finally {
      setLoading(false)
    }
  }

  const getTierConfig = (tier: TierName) => {
    const configs: Record<TierName, {
      color: string
      bgGradient: string
      icon: React.ReactNode
      monthsRequired: number
      displayName: string
    }> = {
      BRONCE: {
        color: "text-orange-400",
        bgGradient: "tier-bronce-gradient",
        icon: <Trophy className="w-8 h-8 text-orange-400" />,
        monthsRequired: 0,
        displayName: "Bronce"
      },
      PLATA: {
        color: "text-gray-300",
        bgGradient: "tier-plata-gradient",
        icon: <Trophy className="w-8 h-8 text-gray-300" />,
        monthsRequired: 6,
        displayName: "Plata"
      },
      ORO: {
        color: "text-yellow-400",
        bgGradient: "tier-oro-gradient",
        icon: <Trophy className="w-8 h-8 text-yellow-400" />,
        monthsRequired: 12,
        displayName: "Oro"
      },
      PLATINO: {
        color: "text-cyan-300",
        bgGradient: "tier-platino-gradient",
        icon: <Star className="w-8 h-8 text-cyan-300" />,
        monthsRequired: 24,
        displayName: "Platino"
      }
    }
    return configs[tier]
  }

  const tierOrder: TierName[] = ["BRONCE", "PLATA", "ORO", "PLATINO"]
  const currentTierIndex = tierOrder.indexOf(currentTier)

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
        <div className="flex items-center gap-4 mb-8">
          <Button
            onClick={() => router.push("/fidelizacion")}
            variant="ghost"
            size="icon"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div>
            <h1 className="text-4xl font-bold text-gradient-hero">Niveles de Fidelización</h1>
            <p className="text-theme-secondary">
              Conoce los beneficios de cada nivel y cómo alcanzarlos
            </p>
          </div>
        </div>

        {/* Timeline Visual */}
        <div className="mb-12 relative">
          <div className="tier-timeline">
            {tierOrder.map((tier, index) => {
              const config = getTierConfig(tier)
              const isCurrentTier = tier === currentTier
              const isPastTier = index < currentTierIndex
              const isFutureTier = index > currentTierIndex

              return (
                <div
                  key={tier}
                  className={`tier-timeline-item ${
                    isPastTier ? "opacity-70" : ""
                  } ${isCurrentTier ? "tier-timeline-current" : ""}`}
                >
                  <div className={`tier-timeline-marker ${config.bgGradient}`}>
                    {isCurrentTier && (
                      <div className="absolute -top-8 left-1/2 -translate-x-1/2 whitespace-nowrap">
                        <Badge className="bg-green-600 text-white animate-pulse">
                          <Sparkles className="w-3 h-3 mr-1" />
                          Estás Aquí
                        </Badge>
                      </div>
                    )}
                    {config.icon}
                  </div>
                  <div className="text-center mt-4">
                    <p className={`font-bold ${config.color}`}>{config.displayName}</p>
                    <p className="text-xs text-theme-secondary">
                      {config.monthsRequired === 0 
                        ? "Inicio" 
                        : `${config.monthsRequired} meses`}
                    </p>
                  </div>
                  {index < tierOrder.length - 1 && (
                    <div className="tier-timeline-line" />
                  )}
                </div>
              )
            })}
          </div>
        </div>

        {/* Tarjetas de Beneficios por Nivel */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {tierOrder.map((tier) => {
            const config = getTierConfig(tier)
            const benefits = TIER_BENEFITS[tier]
            const isCurrentTier = tier === currentTier
            const isPastTier = tierOrder.indexOf(tier) < currentTierIndex
            const isFutureTier = tierOrder.indexOf(tier) > currentTierIndex

            return (
              <Card
                key={tier}
                className={`card-theme relative overflow-hidden transition-all duration-300 hover:scale-105 ${
                  isCurrentTier ? "ring-2 ring-green-500 shadow-xl" : ""
                } ${isPastTier ? "opacity-60" : ""}`}
              >
                {/* Gradient Background */}
                <div className={`absolute inset-0 ${config.bgGradient} opacity-10`} />

                <CardHeader className="relative z-10">
                  <div className="flex items-center justify-between mb-2">
                    {config.icon}
                    {isCurrentTier && (
                      <Badge className="bg-green-600 text-white text-xs">
                        Tu nivel
                      </Badge>
                    )}
                    {isPastTier && (
                      <Badge variant="secondary" className="text-xs">
                        Alcanzado
                      </Badge>
                    )}
                    {isFutureTier && (
                      <Badge variant="outline" className="text-xs">
                        Próximo
                      </Badge>
                    )}
                  </div>
                  <CardTitle className={`text-2xl ${config.color}`}>
                    {config.displayName}
                  </CardTitle>
                  <p className="text-sm text-theme-secondary">
                    {config.monthsRequired === 0
                      ? "Nivel inicial automático"
                      : `Requiere ${config.monthsRequired} meses de membresía`}
                  </p>
                </CardHeader>

                <CardContent className="relative z-10">
                  {benefits.length === 0 ? (
                    <p className="text-sm text-theme-secondary italic">
                      Sin beneficios especiales
                    </p>
                  ) : (
                    <div className="space-y-3">
                      <h4 className="font-semibold text-theme-primary text-sm mb-2">
                        Beneficios:
                      </h4>
                      {benefits.map((benefit) => (
                        <div
                          key={benefit.id}
                          className="flex items-start gap-2"
                        >
                          <CheckCircle2 className={`w-4 h-4 flex-shrink-0 mt-0.5 ${config.color}`} />
                          <div className="flex-1 min-w-0">
                            <p className="text-sm text-theme-primary font-medium">
                              {benefit.name}
                            </p>
                            <p className="text-xs text-theme-secondary">
                              {benefit.description}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Requisitos adicionales si existen */}
                  {tier === "PLATINO" && (
                    <div className="mt-4 pt-4 border-t border-border">
                      <p className="text-xs text-theme-secondary">
                        <Star className="w-3 h-3 inline mr-1" />
                        Nivel exclusivo con máximos privilegios
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            )
          })}
        </div>

        {/* Información adicional */}
        <Card className="card-theme mt-8">
          <CardHeader>
            <CardTitle className="text-xl text-theme-primary">
              ¿Cómo subir de nivel?
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold text-theme-primary mb-2 flex items-center gap-2">
                  <Trophy className="w-5 h-5 text-orange-400" />
                  Requisitos de Permanencia
                </h4>
                <ul className="space-y-2 text-sm text-theme-secondary">
                  <li>• <strong className="text-gray-300">Bronce:</strong> Nivel inicial (0 meses)</li>
                  <li>• <strong className="text-gray-300">Plata:</strong> 6 meses de membresía activa continua</li>
                  <li>• <strong className="text-yellow-400">Oro:</strong> 12 meses de membresía activa continua</li>
                  <li>• <strong className="text-cyan-300">Platino:</strong> 24 meses de membresía activa continua</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold text-theme-primary mb-2 flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-yellow-400" />
                  Beneficios Acumulativos
                </h4>
                <ul className="space-y-2 text-sm text-theme-secondary">
                  <li>• Los beneficios se acumulan al subir de nivel</li>
                  <li>• Mantén tu membresía activa sin interrupciones</li>
                  <li>• Cada nivel ofrece descuentos y bonificaciones exclusivas</li>
                  <li>• Los puntos de fidelización se multiplican en niveles altos</li>
                </ul>
              </div>
            </div>

            {currentTier !== "PLATINO" && (
              <div className="mt-6 p-4 rounded-lg bg-yellow-500/10 border border-yellow-500/30">
                <p className="text-sm text-yellow-200 font-medium">
                  💡 <strong>Próximo nivel:</strong> {getTierConfig(tierOrder[currentTierIndex + 1]).displayName}
                </p>
                <p className="text-sm text-theme-secondary mt-1">
                  Mantén tu membresía activa para alcanzar el siguiente nivel y desbloquear más beneficios.
                </p>
              </div>
            )}

            {currentTier === "PLATINO" && (
              <div className="mt-6 p-4 rounded-lg bg-cyan-500/10 border border-cyan-500/30">
                <p className="text-sm text-cyan-200 font-medium">
                  🎉 <strong>¡Felicitaciones!</strong> Has alcanzado el nivel máximo
                </p>
                <p className="text-sm text-theme-secondary mt-1">
                  Disfruta de todos los beneficios exclusivos del nivel Platino.
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
