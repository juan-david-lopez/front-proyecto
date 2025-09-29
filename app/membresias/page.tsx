// app/membresias/page.tsx
"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import Link from "next/link"
import { useState, useEffect } from "react"
import { PlanModal } from "@/components/plan-modal"
import { ArrowLeft, Check, Loader2 } from "lucide-react"
import membershipService from "@/services/membershipService"
import { MembershipType, MembershipTypeName } from "@/types/membership"

export default function MembresíasPage() {
  const [selectedPlan, setSelectedPlan] = useState<MembershipType | null>(null)
  const [membershipTypes, setMembershipTypes] = useState<MembershipType[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    loadMembershipTypes()
  }, [])

  const loadMembershipTypes = async () => {
    try {
      setLoading(true)
      const types = await membershipService.getMembershipTypes()
      setMembershipTypes(types)
    } catch (err) {
      setError('Error al cargar los planes de membresía')
      console.error('Error loading membership types:', err)
    } finally {
      setLoading(false)
    }
  }

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

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-red-500" />
        <span className="ml-2">Cargando planes...</span>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-500 mb-4">{error}</p>
          <Button onClick={loadMembershipTypes} className="bg-red-600 hover:bg-red-700">
            Reintentar
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <header className="px-6 py-6">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-white hover:text-red-500 transition-colors"
        >
          <ArrowLeft size={20} />
          <span>Volver</span>
        </Link>
      </header>

      <main className="px-6 pb-16">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Planes de Membresía</h1>
          <p className="text-xl text-gray-400">Elige el plan perfecto para alcanzar tus objetivos</p>
        </div>

        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
          {membershipTypes.map((membershipType, index) => (
            <Card 
              key={membershipType.idMembershipType}
              className={`bg-gray-800 text-white flex flex-col relative ${
                index === 1 ? "border-2 border-red-500" : "border border-gray-700"
              }`}
            >
              {index === 1 && (
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                  <span className="bg-red-500 text-white px-4 py-1 rounded-full text-sm font-bold">
                    MÁS POPULAR
                  </span>
                </div>
              )}

              <CardContent className="p-8 flex flex-col justify-between h-full">
                <div>
                  <div className="text-center mb-6">
                    <h2 className={`text-2xl font-bold mb-2 ${
                      index === 1 ? "text-red-500" : "text-gray-300"
                    }`}>
                      {getDisplayName(membershipType.name)}
                    </h2>
                    <p className="text-gray-400 mb-4">{membershipType.description}</p>
                    <div className="text-4xl font-bold text-green-400">
                      {formatPrice(membershipType.monthlyPrice)}
                      <span className="text-lg font-normal text-gray-400">/mes</span>
                    </div>
                  </div>

                  <h3 className="text-lg font-semibold mb-4">Incluye:</h3>
                  <ul className="space-y-3 mb-8">
                    {getPlanFeatures(membershipType).map((feature, idx) => (
                      <li key={idx} className="flex items-center gap-3">
                        <Check size={16} className="text-green-400 flex-shrink-0" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <Button
                  onClick={() => setSelectedPlan(membershipType)}
                  className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3"
                >
                  Seleccionar Plan
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </main>

      {selectedPlan && (
        <PlanModal 
          isOpen={!!selectedPlan} 
          onClose={() => setSelectedPlan(null)} 
          plan={selectedPlan} 
        />
      )}
    </div>
  )
}