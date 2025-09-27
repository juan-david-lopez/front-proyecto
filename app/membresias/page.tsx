"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import Link from "next/link"
import { useState } from "react"
import { PlanModal } from "@/components/plan-modal"
import { ArrowLeft, Check } from "lucide-react"

export default function MembresíasPage() {
  const [selectedPlan, setSelectedPlan] = useState<"basico" | "premium" | "elite" | null>(null)

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header with back button */}
      <header className="px-6 py-6">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-white hover:text-red-500 transition-colors focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 focus:ring-offset-black rounded-lg p-2"
          aria-label="Volver a la página principal"
        >
          <ArrowLeft size={20} />
          <span>Volver</span>
        </Link>
      </header>

      {/* Main content */}
      <main className="px-6 pb-16">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 text-balance">Planes de Membresía</h1>
          <p className="text-xl text-gray-400">Elige el plan perfecto para alcanzar tus objetivos</p>
        </div>

        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Plan Básico */}
          <Card className="bg-gray-800 border-gray-700 text-white relative flex flex-col">
            <CardContent className="p-8 flex flex-col flex-1">
              <div className="text-center mb-6">
                <h2 className="text-2xl font-bold text-gray-300 mb-2">Básico</h2>
                <p className="text-gray-400 mb-4">Perfecto para comenzar tu journey fitness</p>
                <div className="text-4xl font-bold text-green-400">
                  $50,000 <span className="text-lg font-normal text-gray-400">/ 1 mes</span>
                </div>
              </div>

              <div className="mb-8 flex-1">
                <h3 className="text-lg font-semibold mb-4">Incluye:</h3>
                <ul className="space-y-3" role="list">
                  <li className="flex items-center gap-3">
                    <Check size={16} className="text-green-400 flex-shrink-0" aria-hidden="true" />
                    <span>Acceso al área de pesas</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <Check size={16} className="text-green-400 flex-shrink-0" aria-hidden="true" />
                    <span>2 horas diarias de entrenamiento</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <Check size={16} className="text-green-400 flex-shrink-0" aria-hidden="true" />
                    <span>Máquinas cardiovasculares</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <Check size={16} className="text-green-400 flex-shrink-0" aria-hidden="true" />
                    <span>Vestuarios y duchas</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <Check size={16} className="text-green-400 flex-shrink-0" aria-hidden="true" />
                    <span>Horario: 6AM - 8PM</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <Check size={16} className="text-green-400 flex-shrink-0" aria-hidden="true" />
                    <span>Acceso a una sola sucursal</span>
                  </li>
                </ul>
              </div>

              <Button
                onClick={() => setSelectedPlan("basico")}
                className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 focus:ring-offset-gray-800 mt-auto"
                aria-describedby="plan-basico-description"
              >
                Seleccionar Plan
              </Button>
              <div id="plan-basico-description" className="sr-only">
                Plan Básico por $50,000 pesos mensuales con acceso básico al gimnasio
              </div>
            </CardContent>
          </Card>

          {/* Plan Premium */}
          <Card className="bg-gray-800 border-2 border-red-500 text-white relative flex flex-col">
            <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
              <span className="bg-red-500 text-white px-4 py-1 rounded-full text-sm font-bold">MAS POPULAR</span>
            </div>
            <CardContent className="p-8 pt-12 flex flex-col flex-1">
              <div className="text-center mb-6">
                <h2 className="text-2xl font-bold text-red-500 mb-2">Premium</h2>
                <p className="text-gray-400 mb-4">La opción más completa para resultados óptimos</p>
                <div className="text-4xl font-bold text-green-400">
                  $70,000 <span className="text-lg font-normal text-gray-400">/ 1 mes</span>
                </div>
              </div>

              <div className="mb-8 flex-1">
                <h3 className="text-lg font-semibold mb-4">Incluye:</h3>
                <ul className="space-y-3" role="list">
                  <li className="flex items-center gap-3">
                    <Check size={16} className="text-green-400 flex-shrink-0" aria-hidden="true" />
                    <span>Todo lo del plan básico</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <Check size={16} className="text-green-400 flex-shrink-0" aria-hidden="true" />
                    <span>Acceso 24/7 con tiempo ilimitado</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <Check size={16} className="text-green-400 flex-shrink-0" aria-hidden="true" />
                    <span>Clases grupales ilimitadas</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <Check size={16} className="text-green-400 flex-shrink-0" aria-hidden="true" />
                    <span>Entrenador personal (2 sesiones/mes)</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <Check size={16} className="text-green-400 flex-shrink-0" aria-hidden="true" />
                    <span>Área de funcional</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <Check size={16} className="text-green-400 flex-shrink-0" aria-hidden="true" />
                    <span>Evaluación nutricional</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <Check size={16} className="text-green-400 flex-shrink-0" aria-hidden="true" />
                    <span>Gamificación y retos mensuales</span>
                  </li>
                </ul>
              </div>

              <Button
                onClick={() => setSelectedPlan("premium")}
                className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 focus:ring-offset-gray-800 mt-auto"
                aria-describedby="plan-premium-description"
              >
                Seleccionar Plan
              </Button>
              <div id="plan-premium-description" className="sr-only">
                Plan Premium por $70,000 pesos mensuales, el más popular con acceso completo y entrenador personal
              </div>
            </CardContent>
          </Card>

          {/* Plan VIP */}
          <Card className="bg-gray-800 border-gray-700 text-white relative flex flex-col">
            <CardContent className="p-8 flex flex-col flex-1">
              <div className="text-center mb-6">
                <h2 className="text-2xl font-bold text-gray-300 mb-2">VIP</h2>
                <p className="text-gray-400 mb-4">El mejor valor para miembros comprometidos</p>
                <div className="text-4xl font-bold text-green-400">
                  $90,000 <span className="text-lg font-normal text-gray-400">/ 1 mes</span>
                </div>
              </div>

              <div className="mb-8 flex-1">
                <h3 className="text-lg font-semibold mb-4">Incluye:</h3>
                <ul className="space-y-3" role="list">
                  <li className="flex items-center gap-3">
                    <Check size={16} className="text-green-400 flex-shrink-0" aria-hidden="true" />
                    <span>Todo lo del plan Premium</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <Check size={16} className="text-green-400 flex-shrink-0" aria-hidden="true" />
                    <span>Acceso a cualquier sucursal</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <Check size={16} className="text-green-400 flex-shrink-0" aria-hidden="true" />
                    <span>Entrenador personal (4 sesiones/mes)</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <Check size={16} className="text-green-400 flex-shrink-0" aria-hidden="true" />
                    <span>Sauna y jacuzzi</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <Check size={16} className="text-green-400 flex-shrink-0" aria-hidden="true" />
                    <span>Plan nutricional personalizado</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <Check size={16} className="text-green-400 flex-shrink-0" aria-hidden="true" />
                    <span>Invitaciones para amigos (2/mes)</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <Check size={16} className="text-green-400 flex-shrink-0" aria-hidden="true" />
                    <span>20% de descuento en reservas de espacios</span>
                  </li>
                </ul>
              </div>

              <Button
                onClick={() => setSelectedPlan("elite")}
                className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 focus:ring-offset-gray-800 mt-auto"
                aria-describedby="plan-vip-description"
              >
                Seleccionar Plan
              </Button>
              <div id="plan-vip-description" className="sr-only">
                Plan VIP por $90,000 pesos mensuales con acceso premium y beneficios exclusivos
              </div>
            </CardContent>
          </Card>
        </div>
      </main>

      {selectedPlan && <PlanModal isOpen={!!selectedPlan} onClose={() => setSelectedPlan(null)} plan={selectedPlan} />}
    </div>
  )
}
