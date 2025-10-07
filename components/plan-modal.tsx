// components/plan-modal.tsx
"use client"

import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Check, Crown, Star, Users, Zap, Shield, Clock, MapPin, ArrowRight } from "lucide-react"
import { useEffect, useRef } from "react"
import { MembershipType } from "@/types/membership"
import { useAuth } from "@/contexts/auth-context"

interface PlanModalProps {
  isOpen: boolean
  onClose: () => void
  plan: MembershipType | null
}

export function PlanModal({ isOpen, onClose, plan }: PlanModalProps) {
  const { user } = useAuth()
  const continueButtonRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    if (isOpen && continueButtonRef.current) {
      continueButtonRef.current.focus()
    }
  }, [isOpen])

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose()
      }
    }

    if (isOpen) {
      document.addEventListener("keydown", handleKeyDown)
      return () => document.removeEventListener("keydown", handleKeyDown)
    }
  }, [isOpen, onClose])

  if (!plan) return null

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

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0,
    }).format(price)
  }

  const getDisplayName = (name: string) => {
    switch (name) {
      case 'BASIC':
        return 'Básico'
      case 'PREMIUM':
        return 'Premium'
      case 'ELITE':
        return 'ELITE'
      default:
        return name
    }
  }

  const getPlanIcon = (name: string) => {
    switch (name) {
      case 'BASIC':
        return <Users className="w-8 h-8" />
      case 'PREMIUM':
        return <Star className="w-8 h-8" />
      case 'ELITE':
        return <Crown className="w-8 h-8" />
      default:
        return <Zap className="w-8 h-8" />
    }
  }

  const getPlanColor = (name: string) => {
    switch (name) {
      case 'BASIC':
        return 'from-blue-500 to-blue-700'
      case 'PREMIUM':
        return 'from-purple-500 to-purple-700'
      case 'ELITE':
        return 'from-yellow-400 to-yellow-600'
      default:
        return 'from-red-500 to-red-700'
    }
  }

  const handleContinue = () => {
    if (!user) {
      // Redirigir al login si no está logueado
      window.location.href = `/login?redirect=/checkout?planId=${plan.idMembershipType}&planName=${encodeURIComponent(plan.name)}`
    } else {
      // Redirigir al checkout con el ID del plan seleccionado
      window.location.href = `/checkout?planId=${plan.idMembershipType}&planName=${encodeURIComponent(plan.name)}`
    }
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="card-theme border-2 border-theme text-theme-primary max-w-3xl max-h-[92vh] overflow-hidden shadow-2xl p-0">
        {/* Scrollable content with custom scrollbar */}
        <div className="overflow-y-auto max-h-[92vh] custom-scrollbar">
          {/* Header mejorado - Más compacto */}
          <DialogHeader className="relative overflow-hidden rounded-t-lg">
            <div className={`absolute inset-0 bg-gradient-to-r ${getPlanColor(plan.name)} opacity-10`} />
            <div className={`absolute inset-0 bg-gradient-to-b from-transparent to-theme-secondary/50`} />
            <div className="relative z-10 text-center py-6 px-4">
              <div className={`inline-flex items-center justify-center w-16 h-16 rounded-2xl mb-3 bg-gradient-to-r ${getPlanColor(plan.name)} shadow-2xl transform hover:scale-110 transition-transform`}>
                <div className="text-white">
                  {getPlanIcon(plan.name)}
                </div>
              </div>
              
              <DialogTitle className="text-2xl md:text-3xl font-bold text-theme-primary mb-2">
                Plan {getDisplayName(plan.name)}
              </DialogTitle>
              
              {plan.name === 'PREMIUM' && (
                <Badge className="bg-gradient-to-r from-red-500 to-red-600 text-white mb-3 px-3 py-1 shadow-lg text-xs">
                  <Star className="w-3 h-3 inline mr-1" />
                  Más popular
                </Badge>
              )}
              
              <div className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-theme-primary to-theme-secondary bg-clip-text text-transparent">
                {formatPrice(plan.monthlyPrice)}
                <span className="text-base md:text-lg font-normal text-theme-secondary">/mes</span>
              </div>
            </div>
          </DialogHeader>

          <div className="space-y-4 px-4 md:px-6 pb-6">
            {/* Descripción del plan - Más compacta */}
            <div className="text-center">
              <p className="text-theme-secondary text-sm md:text-base leading-relaxed">
                {plan.description}
              </p>
            </div>

            {/* Información de acceso - Responsive mejorado */}
            <div className="grid grid-cols-3 gap-2 md:gap-4">
              <div className="text-center p-3 md:p-4 bg-theme-secondary/20 rounded-lg md:rounded-xl border border-theme hover:border-blue-500/50 transition-all">
                <MapPin className="w-5 h-5 md:w-6 md:h-6 text-blue-400 mx-auto mb-2" />
                <div className="text-xs text-theme-secondary mb-1">Ubicaciones</div>
                <div className="font-semibold text-theme-primary text-xs md:text-sm">
                  {plan.accessToAllLocation ? "Todas" : "Una"}
                </div>
              </div>
              
              <div className="text-center p-3 md:p-4 bg-theme-secondary/20 rounded-lg md:rounded-xl border border-theme hover:border-green-500/50 transition-all">
                <Shield className="w-5 h-5 md:w-6 md:h-6 text-green-400 mx-auto mb-2" />
                <div className="text-xs text-theme-secondary mb-1">Clases</div>
                <div className="font-semibold text-theme-primary text-xs md:text-sm">
                  {plan.groupClassesSessionsIncluded === -1 
                    ? "Ilimitadas" 
                    : `${plan.groupClassesSessionsIncluded}/mes`
                  }
                </div>
              </div>
              
              <div className="text-center p-3 md:p-4 bg-theme-secondary/20 rounded-lg md:rounded-xl border border-theme hover:border-purple-500/50 transition-all">
                <Clock className="w-5 h-5 md:w-6 md:h-6 text-purple-400 mx-auto mb-2" />
                <div className="text-xs text-theme-secondary mb-1">Personal</div>
                <div className="font-semibold text-theme-primary text-xs md:text-sm">
                  {plan.personalTrainingIncluded > 0 
                    ? `${plan.personalTrainingIncluded}/mes`
                    : "No"
                  }
                </div>
              </div>
            </div>

            {/* Lista detallada de beneficios - Optimizada */}
            <div className="bg-theme-secondary/20 rounded-xl p-4 md:p-5 border border-theme">
              <h3 className="text-base md:text-lg font-semibold mb-4 text-center text-theme-primary flex items-center justify-center gap-2">
                <Check className="w-5 h-5 text-green-400" />
                Todo lo que incluye
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {getPlanFeatures(plan).map((benefit, index) => (
                  <div key={index} className="flex items-start gap-2 p-2 rounded-lg hover:bg-theme-secondary/30 transition-all">
                    <div className="w-5 h-5 rounded-full bg-green-500/20 flex items-center justify-center flex-shrink-0 mt-0.5 ring-1 ring-green-500/30">
                      <Check size={12} className="text-green-400" />
                    </div>
                    <span className="text-theme-secondary text-xs md:text-sm leading-relaxed">{benefit}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Mensaje para usuarios no logueados - Compacto */}
            {!user && (
              <div className="bg-gradient-to-r from-yellow-500/10 to-orange-500/10 border border-yellow-500/40 rounded-lg md:rounded-xl p-3 md:p-4">
                <div className="flex items-center gap-2 text-yellow-400 mb-1">
                  <Shield className="w-4 h-4 md:w-5 md:h-5" />
                  <span className="font-semibold text-sm md:text-base">Inicia sesión para continuar</span>
                </div>
                <p className="text-yellow-300/90 text-xs md:text-sm leading-relaxed">
                  Necesitas una cuenta para procesar tu membresía.
                </p>
              </div>
            )}

            {/* Botones de acción - Responsive mejorado */}
            <div className="flex flex-col sm:flex-row gap-3 pt-2 sticky bottom-0 bg-gradient-to-t from-theme-primary via-theme-primary to-transparent pt-4 pb-2">
              <Button
                onClick={onClose}
                variant="outline"
                className="flex-1 border-2 border-theme text-theme-secondary hover:bg-theme-secondary/20 hover:text-theme-primary hover:border-theme font-semibold py-4 md:py-5 text-sm md:text-base transition-all"
              >
                Volver
              </Button>
              <Button
                ref={continueButtonRef}
                onClick={handleContinue}
                className={`flex-1 font-bold py-4 md:py-5 text-sm md:text-base transition-all duration-300 transform hover:scale-105 ${
                  plan.name === 'PREMIUM'
                    ? "btn-primary-red shadow-xl"
                    : `bg-gradient-to-r ${getPlanColor(plan.name)} shadow-xl`
                }`}
              >
                {user ? "Proceder al pago" : "Inicia sesión"}
                <ArrowRight className="w-4 h-4 ml-2 inline" />
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}