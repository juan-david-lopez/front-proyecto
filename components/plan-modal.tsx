// components/plan-modal.tsx
"use client"

import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Check } from "lucide-react"
import { useEffect, useRef } from "react"
import { MembershipType } from "@/types/membership"

interface PlanModalProps {
  isOpen: boolean
  onClose: () => void
  plan: MembershipType | null
}

export function PlanModal({ isOpen, onClose, plan }: PlanModalProps) {
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

  const handleContinue = () => {
    // Redirigir al checkout con el ID del plan seleccionado
    window.location.href = `/checkout?planId=${plan.idMembershipType}&planName=${encodeURIComponent(plan.name)}`
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-gray-800 border-gray-700 text-white max-w-md">
        <DialogHeader className="bg-black p-4 -m-6 mb-6 rounded-t-lg">
          <DialogTitle className="text-white text-lg font-semibold text-center">
            Estás a punto de elegir: {getDisplayName(plan.name)}
          </DialogTitle>
          <div className="w-full h-px bg-red-500 mt-2" aria-hidden="true"></div>
        </DialogHeader>

        <div className="space-y-6">
          <div className="text-center">
            <div className="bg-red-600 text-white px-6 py-3 rounded-lg inline-block">
              <span className="text-2xl font-bold">
                {formatPrice(plan.monthlyPrice)}/mes
              </span>
            </div>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-4 text-center">Beneficios incluidos:</h3>
            <ul className="space-y-3">
              {getPlanFeatures(plan).map((benefit, index) => (
                <li key={index} className="flex items-center space-x-3">
                  <Check className="w-5 h-5 text-red-500 flex-shrink-0" />
                  <span className="text-gray-300">{benefit}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="flex space-x-4 pt-4">
            <Button
              onClick={onClose}
              className="flex-1 bg-gray-600 hover:bg-gray-700 text-white font-semibold py-3"
            >
              Volver
            </Button>
            <Button
              ref={continueButtonRef}
              onClick={handleContinue}
              className="flex-1 bg-red-600 hover:bg-red-700 text-white font-semibold py-3"
            >
              Continuar
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}