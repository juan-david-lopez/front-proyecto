"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import Link from "next/link"
import { useState } from "react"
import { PlanModal } from "@/components/plan-modal"
import { AuthGuard } from "@/components/auth-guard"

export default function HomePage() {
  const [selectedPlan, setSelectedPlan] = useState<"basico" | "premium" | "elite" | null>(null)

  return (
    <AuthGuard requireAuth={false}>
      <div className="min-h-screen bg-black text-white">
        {/* Navigation */}
        <nav
          className="flex items-center justify-between px-6 py-4 bg-black"
          role="navigation"
          aria-label="Navegación principal"
        >
          <div className="flex items-center space-x-8">
            <a
              href="#"
              className="text-white hover:text-red-500 transition-colors focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 focus:ring-offset-black rounded px-2 py-1"
            >
              Inicio
            </a>
            <a
              href="#"
              className="text-white hover:text-red-500 transition-colors focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 focus:ring-offset-black rounded px-2 py-1"
            >
              Servicios
            </a>
            <Link
              href="/membresias"
              className="text-white hover:text-red-500 transition-colors focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 focus:ring-offset-black rounded px-2 py-1"
            >
              Membresías
            </Link>
            <a
              href="#"
              className="text-white hover:text-red-500 transition-colors focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 focus:ring-offset-black rounded px-2 py-1"
            >
              Contacto
            </a>
          </div>
          <div className="flex items-center space-x-4">
            <Link
              href="/login"
              className="text-white hover:text-red-500 transition-colors focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 focus:ring-offset-black rounded px-2 py-1"
            >
              Iniciar Sesión
            </Link>
            <Link
              href="/register"
              className="text-white hover:text-red-500 transition-colors focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 focus:ring-offset-black rounded px-2 py-1"
            >
              Registrarse
            </Link>
          </div>
        </nav>

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
            <Card className="bg-gray-800 border-gray-700 text-white">
              <CardContent className="p-8 text-center">
                <h3 className="text-2xl font-bold text-red-500 mb-4">Plan Básico</h3>
                <div className="text-3xl font-bold mb-6">
                  $50.000<span className="text-lg font-normal">/mes</span>
                </div>
                <ul className="space-y-3 mb-8 text-gray-300" role="list">
                  <li>Acceso al área de pesas</li>
                  <li>2 horas por día de entrenamiento</li>
                  <li>Máquinas cardiovasculares</li>
                  <li>Vestuarios y duchas</li>
                  <li>Solo puede estar en una sucursal</li>
                </ul>
                <Button
                  onClick={() => setSelectedPlan("basico")}
                  className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-2 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 focus:ring-offset-gray-800"
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
            <Card className="bg-gray-800 border-gray-700 text-white">
              <CardContent className="p-8 text-center">
                <h3 className="text-2xl font-bold text-red-500 mb-4">Plan Premium</h3>
                <div className="text-3xl font-bold mb-6">
                  $70.000<span className="text-lg font-normal">/mes</span>
                </div>
                <ul className="space-y-3 mb-8 text-gray-300" role="list">
                  <li>Todo lo del plan básico</li>
                  <li>Acceso 24/7</li>
                  <li>Entrenador personal (2 sesiones/mes)</li>
                  <li>Evaluación nutricional</li>
                  <li>Invitaciones para amigos (1/mes)</li>
                </ul>
                <Button
                  onClick={() => setSelectedPlan("premium")}
                  className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-2 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 focus:ring-offset-gray-800"
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
                <h3 className="text-2xl font-bold text-red-500 mb-4">Plan Elite</h3>
                <div className="text-3xl font-bold mb-6">
                  $90.000<span className="text-lg font-normal">/mes</span>
                </div>
                <ul className="space-y-3 mb-8 text-gray-300" role="list">
                  <li>Todo lo del plan Premium</li>
                  <li>Puede ingresar a cualquier sucursal</li>
                  <li>Entrenador personal (4 sesiones/mes)</li>
                  <li>Plan nutricional personalizado</li>
                  <li>Invitaciones para amigos (3/mes)</li>
                  <li>Nutricionista incluido</li>
                </ul>
                <Button
                  onClick={() => setSelectedPlan("elite")}
                  className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-2 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 focus:ring-offset-gray-800"
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
          <PlanModal isOpen={!!selectedPlan} onClose={() => setSelectedPlan(null)} plan={selectedPlan} />
        )}
      </div>
    </AuthGuard>
  )
}
