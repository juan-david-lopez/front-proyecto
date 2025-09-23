"use client"

import { useState, lazy, Suspense } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Navigation } from "@/components/navigation"

// Lazy loading del modal
const PlanModal = lazy(() => import("@/components/plan-modal").then(module => ({ default: module.PlanModal })))

export default function HomePage() {
  const [selectedPlan, setSelectedPlan] = useState<"basico" | "premium" | "elite" | null>(null)

  return (
    <div className="min-h-screen bg-black text-white">
      {/* ✅ Navigation extraído en componente */}
      <Navigation />

      {/* Hero Section */}
      <section
        className="flex flex-col items-center justify-center min-h-[60vh] px-6 text-center bg-gradient-to-b from-black to-gray-900"
        role="banner"
      >
        <h1 className="text-4xl md:text-6xl font-bold mb-6 text-balance">
          FitZone - Tu camino hacia una vida más saludable
        </h1>
        <p className="text-xl md:text-2xl mb-8 text-gray-300">Transforma tu cuerpo, mente y espíritu</p>
        <Button className="bg-red-600 hover:bg-red-700 text-white px-8 py-3 text-lg font-semibold rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 focus:ring-offset-black">
          Únete Ahora
        </Button>
      </section>

      {/* Memberships Section */}
      <section className="py-16 px-6 bg-gray-900" aria-labelledby="memberships-heading">
        <h2 id="memberships-heading" className="text-3xl md:text-4xl font-bold text-center mb-12">
          Nuestras Membresías
        </h2>

        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Plan Básico */}
          <Card className="bg-gray-800 border-gray-700 text-white h-full">
            <CardContent className="p-8 text-center h-full flex flex-col">
              <h3 className="text-2xl font-bold text-gray-300 mb-4">Básico</h3>
              <div className="text-3xl font-bold mb-6 text-green-400">
                $50,000<span className="text-lg font-normal text-gray-400">/mes</span>
              </div>
              <ul className="space-y-3 mb-8 text-gray-300 flex-grow" role="list">
                <li>Acceso al área de pesas</li>
                <li>2 horas diarias de entrenamiento</li>
                <li>Máquinas cardiovasculares</li>
                <li>Vestuarios y duchas</li>
                <li>Horario: 6AM - 8PM</li>
                <li>Acceso a una sola sucursal</li>
              </ul>
              <Button
                onClick={() => setSelectedPlan("basico")}
                className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-2 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 focus:ring-offset-gray-800 mt-auto"
                aria-describedby="plan-basico-info"
              >
                Seleccionar Plan
              </Button>
              <div id="plan-basico-info" className="sr-only">
                Plan Básico por $50,000 pesos mensuales
              </div>
            </CardContent>
          </Card>

          {/* Plan Premium */}
          <Card className="bg-gray-800 border-2 border-red-500 text-white relative">
            <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
              <span className="bg-red-500 text-white px-4 py-1 rounded-full text-sm font-bold">MAS POPULAR</span>
            </div>
            <CardContent className="p-8 pt-12 text-center">
              <h3 className="text-2xl font-bold text-red-500 mb-4">Premium</h3>
              <div className="text-3xl font-bold mb-6 text-green-400">
                $70,000<span className="text-lg font-normal text-gray-400">/mes</span>
              </div>
              <ul className="space-y-3 mb-8 text-gray-300" role="list">
                <li>Todo lo del plan básico</li>
                <li>Acceso 24/7 con tiempo ilimitado</li>
                <li>Clases grupales ilimitadas</li>
                <li>Entrenador personal (2 sesiones/mes)</li>
                <li>Área de funcional</li>
                <li>Evaluación nutricional</li>
                <li>Gamificación y retos mensuales</li>
              </ul>
              <Button
                onClick={() => setSelectedPlan("premium")}
                className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-2 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 focus:ring-offset-gray-800"
                aria-describedby="plan-premium-info"
              >
                Seleccionar Plan
              </Button>
              <div id="plan-premium-info" className="sr-only">
                Plan Premium por $70,000 pesos mensuales
              </div>
            </CardContent>
          </Card>

          {/* Plan Elite */}
          <Card className="bg-gray-800 border-gray-700 text-white">
            <CardContent className="p-8 text-center">
              <h3 className="text-2xl font-bold text-gray-300 mb-4">Elite</h3>
              <div className="text-3xl font-bold mb-6 text-green-400">
                $90,000<span className="text-lg font-normal text-gray-400">/mes</span>
              </div>
              <ul className="space-y-3 mb-8 text-gray-300" role="list">
                <li>Todo lo del plan Premium</li>
                <li>Acceso a cualquier sucursal</li>
                <li>Entrenador personal (4 sesiones/mes)</li>
                <li>Sauna y jacuzzi</li>
                <li>Plan nutricional personalizado</li>
                <li>Invitaciones para amigos (2/mes)</li>
                <li>20% de descuento en reservas de espacios</li>
              </ul>
              <Button
                onClick={() => setSelectedPlan("elite")}
                className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-2 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 focus:ring-offset-gray-800"
                aria-describedby="plan-elite-info"
              >
                Seleccionar Plan
              </Button>
              <div id="plan-elite-info" className="sr-only">
                Plan Elite por $90,000 pesos mensuales
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="py-16 px-6 text-center bg-black">
        <h2 className="text-3xl md:text-4xl font-bold mb-8">Empieza a mejorar tu salud hoy</h2>
        <Button className="bg-red-600 hover:bg-red-700 text-white px-12 py-4 text-xl font-bold rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 focus:ring-offset-black">
          ¡EMPIEZA YA!
        </Button>
      </section>

      {selectedPlan && (
        <Suspense fallback={<div className="fixed inset-0 bg-black/50 flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-500"></div>
        </div>}>
          <PlanModal 
            isOpen={!!selectedPlan} 
            onClose={() => setSelectedPlan(null)} 
            plan={selectedPlan} 
          />
        </Suspense>
      )}
    </div>
  )
}
