"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import Link from "next/link"
import { useState } from "react"
import { PlanModal } from "@/components/plan-modal"
import { MembershipType, MembershipTypeName } from "@/types/membership"
import { AuthGuard } from "@/components/auth-guard"

export default function HomePage() {
  const [selectedPlan, setSelectedPlan] = useState<MembershipType | null>(null)

  // Definimos los planes completos
  const plans: MembershipType[] = [
    {
      idMembershipType: 1,
      name: MembershipTypeName.BASIC,
      description: "Plan básico",
      monthlyPrice: 50000,
      accessToAllLocation: false,
      groupClassesSessionsIncluded: 0,
      personalTrainingIncluded: 0,
      specializedClassesIncluded: false,
    },
    {
      idMembershipType: 2,
      name: MembershipTypeName.PREMIUM,
      description: "Plan premium",
      monthlyPrice: 70000,
      accessToAllLocation: true,
      groupClassesSessionsIncluded: 0,
      personalTrainingIncluded: 2,
      specializedClassesIncluded: false,
    },
    {
      idMembershipType: 3,
      name: MembershipTypeName.ELITE,
      description: "Plan elite",
      monthlyPrice: 90000,
      accessToAllLocation: true,
      groupClassesSessionsIncluded: -1, // ilimitadas
      personalTrainingIncluded: 4,
      specializedClassesIncluded: true,
    },
  ]

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
            <a href="#" className="text-white hover:text-red-500 transition-colors rounded px-2 py-1">
              Inicio
            </a>
            <a href="#" className="text-white hover:text-red-500 transition-colors rounded px-2 py-1">
              Servicios
            </a>
            <Link href="/membresias" className="text-white hover:text-red-500 transition-colors rounded px-2 py-1">
              Membresías
            </Link>
            <a href="#" className="text-white hover:text-red-500 transition-colors rounded px-2 py-1">
              Contacto
            </a>
          </div>
          <div className="flex items-center space-x-4">
            <Link href="/login" className="text-white hover:text-red-500 transition-colors rounded px-2 py-1">
              Iniciar Sesión
            </Link>
            <Link href="/register" className="text-white hover:text-red-500 transition-colors rounded px-2 py-1">
              Registrarse
            </Link>
          </div>
        </nav>

        {/* Hero Section */}
        <section className="flex flex-col items-center justify-center min-h-[60vh] px-6 text-center bg-gradient-to-b from-black to-gray-900">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 text-balance">
            FitZone - Tu camino hacia una vida más saludable
          </h1>
          <p className="text-xl md:text-2xl mb-8 text-gray-300">Transforma tu cuerpo, mente y espíritu</p>
          <Button className="bg-red-600 hover:bg-red-700 text-white px-8 py-3 text-lg font-semibold rounded-lg">
            Únete Ahora
          </Button>
        </section>

        {/* Memberships Section */}
        <section className="py-16 px-6 bg-gray-900" aria-labelledby="memberships-heading">
          <h2 id="memberships-heading" className="text-3xl md:text-4xl font-bold text-center mb-12">
            Nuestras Membresías
          </h2>

          <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Iteramos sobre los planes */}
            {plans.map((plan) => (
              <Card key={plan.idMembershipType} className="bg-gray-800 border-gray-700 text-white flex flex-col">
                <CardContent className="p-8 text-center flex flex-col flex-1">
                  <h3 className="text-2xl font-bold text-red-500 mb-4">{plan.description}</h3>
                  <div className="text-3xl font-bold mb-6">
                    ${plan.monthlyPrice.toLocaleString("es-CO")}<span className="text-lg font-normal">/mes</span>
                  </div>
                  <ul className="space-y-3 mb-8 text-gray-300 flex-1" role="list">
                    {plan.name === MembershipTypeName.BASIC && (
                      <>
                        <li>Acceso al área de pesas</li>
                        <li>2 horas por día de entrenamiento</li>
                        <li>Máquinas cardiovasculares</li>
                        <li>Vestuarios y duchas</li>
                        <li>Solo puede estar en una sucursal</li>
                      </>
                    )}
                    {plan.name === MembershipTypeName.PREMIUM && (
                      <>
                        <li>Todo lo del plan básico</li>
                        <li>Acceso 24/7</li>
                        <li>Entrenador personal (2 sesiones/mes)</li>
                        <li>Evaluación nutricional</li>
                        <li>Invitaciones para amigos (1/mes)</li>
                      </>
                    )}
                    {plan.name === MembershipTypeName.ELITE && (
                      <>
                        <li>Todo lo del plan Premium</li>
                        <li>Puede ingresar a cualquier sucursal</li>
                        <li>Entrenador personal (4 sesiones/mes)</li>
                        <li>Plan nutricional personalizado</li>
                        <li>Invitaciones para amigos (3/mes)</li>
                        <li>Nutricionista incluido</li>
                      </>
                    )}
                  </ul>
                  <Button
                    onClick={() => setSelectedPlan(plan)}
                    className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-2 mt-auto"
                  >
                    Seleccionar Plan
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Call to Action Section */}
        <section className="py-16 px-6 text-center bg-black">
          <h2 className="text-3xl md:text-4xl font-bold mb-8">Empieza a mejorar tu salud hoy</h2>
          <Button className="bg-red-600 hover:bg-red-700 text-white px-12 py-4 text-xl font-bold rounded-lg">
            ¡EMPIEZA YA!
          </Button>
        </section>

        {/* Modal */}
        {selectedPlan && (
          <PlanModal isOpen={!!selectedPlan} onClose={() => setSelectedPlan(null)} plan={selectedPlan} />
        )}
      </div>
    </AuthGuard>
  )
}
