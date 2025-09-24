"use client"

import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Check } from "lucide-react"
import { useEffect, useRef } from "react"

interface PlanModalProps {
  isOpen: boolean
  onClose: () => void
  plan: "basico" | "premium" | "elite"
}

const planData = {
  basico: {
    title: "Plan Básico",
    price: "$50.000/mes",
    benefits: [
      "Acceso al área de pesas",
      "2 horas por día de entrenamiento",
      "Máquinas cardiovasculares",
      "Vestuarios y duchas",
      "Solo puede estar en una sucursal",
    ],
  },
  premium: {
    title: "Plan Premium",
    price: "$70.000/mes",
    benefits: [
      "Todo lo del plan básico",
      "Acceso 24/7",
      "Entrenador personal (2 sesiones/mes)",
      "Evaluación nutricional",
      "Invitaciones para amigos (1/mes)",
    ],
  },
  elite: {
    title: "Plan Elite",
    price: "$90.000/mes",
    benefits: [
      "Todo lo del plan Premium",
      "Puede ingresar a cualquier sucursal",
      "Entrenador personal (4 sesiones/mes)",
      "Plan nutricional personalizado",
      "Invitaciones para amigos (3/mes)",
      "Nutricionista incluido",
    ],
  },
}

export function PlanModal({ isOpen, onClose, plan }: PlanModalProps) {
  const currentPlan = planData[plan]
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

  const handleContinue = () => {
    window.location.href = `/checkout?plan=${plan}`
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent
        className="bg-gray-800 border-gray-700 text-white max-w-md"
        aria-describedby="plan-modal-description"
      >
        <DialogHeader className="bg-black p-4 -m-6 mb-6 rounded-t-lg">
          <DialogTitle className="text-white text-lg font-semibold text-center">
            Estás a punto de elegir: {currentPlan.title}
          </DialogTitle>
          <div className="w-full h-px bg-red-500 mt-2" aria-hidden="true"></div>
        </DialogHeader>

        <div className="space-y-6" id="plan-modal-description">
          <div className="text-center">
            <div className="bg-red-600 text-white px-6 py-3 rounded-lg inline-block">
              <span className="text-2xl font-bold" aria-label={`Precio: ${currentPlan.price}`}>
                {currentPlan.price}
              </span>
            </div>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-4 text-center">Beneficios incluidos:</h3>
            <ul className="space-y-3" role="list" aria-label="Lista de beneficios del plan">
              {currentPlan.benefits.map((benefit, index) => (
                <li key={index} className="flex items-center space-x-3" role="listitem">
                  <Check className="w-5 h-5 text-red-500 flex-shrink-0" aria-hidden="true" />
                  <span className="text-gray-300">{benefit}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="flex space-x-4 pt-4" role="group" aria-label="Acciones del plan">
            <Button
              onClick={onClose}
              className="flex-1 bg-gray-600 hover:bg-gray-700 text-white font-semibold py-3 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 focus:ring-offset-gray-800"
              aria-label="Volver sin seleccionar plan"
            >
              Volver
            </Button>
            <Button
              ref={continueButtonRef}
              onClick={handleContinue}
              className="flex-1 bg-red-600 hover:bg-red-700 text-white font-semibold py-3 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 focus:ring-offset-gray-800"
              aria-label={`Continuar con ${currentPlan.title} por ${currentPlan.price}`}
            >
              Continuar
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
