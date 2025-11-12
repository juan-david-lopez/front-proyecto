// app/membresias/page.tsx
"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { BackButton } from "@/components/back-button"
import Link from "next/link"
import { useState, useEffect } from "react"
import { PlanModal } from "@/components/plan-modal"
import { Check, Loader2, Crown, Star, Zap, Users, Shield, Heart, Trophy, CheckCircle, ArrowRight } from "lucide-react"
import membershipService from "@/services/membershipService"
import { MembershipType, MembershipTypeName } from "@/types/membership"
import { useAuth } from "@/contexts/auth-context"

export default function MembresíasPage() {
  const { user } = useAuth()
  const [selectedPlan, setSelectedPlan] = useState<MembershipType | null>(null)
  const [membershipTypes, setMembershipTypes] = useState<MembershipType[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [dataSource, setDataSource] = useState<'backend' | 'local'>('local')

  // Planes correctos que coinciden con la página principal
  const correctPlans: MembershipType[] = [
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

  useEffect(() => {
    loadMembershipTypes()
  }, [])

  const loadMembershipTypes = async () => {
    try {
      setLoading(true)
      setError(null)
      
      // Cargar datos desde el backend
      const types = await membershipService.getMembershipTypes()
      
      if (types && types.length > 0) {
        console.log('✅ Datos cargados exitosamente desde el backend:', types)
        setMembershipTypes(types)
        setDataSource('backend')
      } else {
        console.warn('⚠️ Backend devolvió datos vacíos, usando fallback local')
        setMembershipTypes(correctPlans)
        setDataSource('local')
      }
    } catch (err) {
      console.error('❌ Error conectando con el backend:', err)
      console.log('🔄 Usando datos de fallback local')
      setMembershipTypes(correctPlans)
      setDataSource('local')
      // No establecer error para que la página funcione con datos locales
    } finally {
      setLoading(false)
    }
  }

  const formatPrice = (price: number) => {
    return `$${price.toLocaleString("es-CO")}`
  }

  const getPlanDisplayName = (membershipTypeName: MembershipTypeName | string) => {
    const name = membershipTypeName.toString().toLowerCase()
    
    if (name === 'basic' || name === 'basico') {
      return "Plan Básico"
    } else if (name === 'premium') {
      return "Plan Premium"
    } else if (name === 'elite' || name === 'vip') {
      return "Plan Elite"
    }
    
    return membershipTypeName.toString()
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-theme-primary text-theme-primary flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-red-500" />
        <span className="ml-2">Cargando planes...</span>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-theme-primary text-theme-primary flex items-center justify-center">
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
    <div className="min-h-screen bg-theme-primary text-theme-primary">
      <header className="px-6 py-6 bg-theme-primary/50 backdrop-blur-sm border-b border-theme">
        <div className="flex items-center justify-between">
          <BackButton href="/" label="Volver al inicio" />
        </div>
      </header>

      <main className="px-6 pb-16">
        <div className="text-center mb-16 pt-8">
          <div className="inline-flex items-center gap-2 bg-red-600/20 border border-red-500/30 rounded-full px-4 py-2 mb-6">
            <Zap className="w-5 h-5 text-red-400" />
            <span className="text-red-400 font-medium">Planes exclusivos</span>
          </div>
          <h1 className="text-5xl md:text-6xl font-bold mb-6 text-gradient-hero">
            Planes de Membresía
          </h1>
          <p className="text-xl text-theme-secondary max-w-2xl mx-auto leading-relaxed mb-8">
            Transforma tu cuerpo y mente con nuestros planes diseñados para cada etapa de tu journey fitness
          </p>
          
          {/* Información adicional */}
          <div className="flex flex-wrap justify-center gap-4 text-sm text-theme-secondary">
            <div className="flex items-center gap-2">
              <Shield className="w-4 h-4 text-green-400" />
              <span>Sin permanencia</span>
            </div>
            <div className="flex items-center gap-2">
              <Check className="w-4 h-4 text-green-400" />
              <span>Cancela cuando quieras</span>
            </div>
            <div className="flex items-center gap-2">
              <Zap className="w-4 h-4 text-green-400" />
              <span>Activación inmediata</span>
            </div>
            {/* Indicador de fuente de datos (solo en desarrollo) */}
            {process.env.NODE_ENV === 'development' && (
              <div className="flex items-center gap-2">
                <div className={`w-2 h-2 rounded-full ${dataSource === 'backend' ? 'bg-green-400' : 'bg-orange-400'}`} />
                <span className="text-xs opacity-70">
                  {dataSource === 'backend' ? 'Datos del servidor' : 'Datos locales'}
                </span>
              </div>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto pt-12">
          {membershipTypes.map((membershipType, index) => (
            <Card 
              key={membershipType.idMembershipType} 
              className={`relative border-2 transition-all duration-300 hover:scale-105 hover:shadow-2xl ${
                index === 1 
                  ? 'card-theme border-red-500/50 transform scale-105' 
                  : 'card-theme border-theme hover:border-red-500/30'
              }`}
            >
              {index === 1 && (
                <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 z-20">
                  <div className="bg-gradient-to-r from-red-600 to-orange-600 text-white px-6 py-2 rounded-full text-sm font-bold shadow-lg whitespace-nowrap">
                    <Star className="w-4 h-4 inline mr-2" />
                    MÁS POPULAR
                  </div>
                </div>
              )}
              
              <CardContent className="p-8 flex flex-col flex-1">
                <div className="mb-6">
                  <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-4 shadow-lg ${
                    index === 0 ? 'bg-gradient-to-br from-blue-500 to-blue-600 dark:from-blue-400 dark:to-blue-500' :
                    index === 1 ? 'bg-gradient-to-br from-red-500 to-red-600 dark:from-red-400 dark:to-red-500' :
                    'bg-gradient-to-br from-yellow-500 to-yellow-600 dark:from-yellow-400 dark:to-yellow-500'
                  }`}>
                    {index === 0 && <Heart className="w-8 h-8 text-white" />}
                    {index === 1 && <Star className="w-8 h-8 text-white" />}
                    {index === 2 && <Trophy className="w-8 h-8 text-white" />}
                  </div>
                  
                  <h3 className={`text-3xl font-bold mb-2 ${
                    index === 1 ? 'text-red-400' : 'text-theme-primary'
                  }`}>
                    {getPlanDisplayName(membershipType.name)}
                  </h3>
                  
                  <div className="text-4xl font-bold mb-6 text-theme-primary">
                    <span className={index === 1 ? 'text-red-400' : 'text-theme-primary'}>
                      ${membershipType.monthlyPrice.toLocaleString("es-CO")}
                    </span>
                    <span className="text-lg font-normal text-theme-secondary">/mes</span>
                  </div>
                </div>
                
                <ul className="space-y-4 mb-8 flex-1" role="list">
                  {(membershipType.name === MembershipTypeName.BASIC || membershipType.name.toString().toLowerCase() === 'basico' || membershipType.name.toString().toUpperCase() === 'BASIC') && (
                    <>
                      <li className="flex items-center gap-3 text-theme-secondary">
                        <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                        <span>Acceso al área de pesas</span>
                      </li>
                      <li className="flex items-center gap-3 text-theme-secondary">
                        <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                        <span>2 horas por día de entrenamiento</span>
                      </li>
                      <li className="flex items-center gap-3 text-theme-secondary">
                        <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                        <span>Máquinas cardiovasculares</span>
                      </li>
                      <li className="flex items-center gap-3 text-theme-secondary">
                        <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                        <span>Vestuarios y duchas</span>
                      </li>
                      <li className="flex items-center gap-3 text-theme-secondary">
                        <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                        <span>Solo puede estar en una sucursal</span>
                      </li>
                    </>
                  )}
                  {(membershipType.name === MembershipTypeName.PREMIUM || membershipType.name.toString().toLowerCase() === 'premium') && (
                    <>
                      <li className="flex items-center gap-3 text-theme-secondary">
                        <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                        <span>Todo lo del plan básico</span>
                      </li>
                      <li className="flex items-center gap-3 text-theme-secondary">
                        <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                        <span>Acceso 24/7</span>
                      </li>
                      <li className="flex items-center gap-3 text-theme-secondary">
                        <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                        <span>Entrenador personal (2 sesiones/mes)</span>
                      </li>
                      <li className="flex items-center gap-3 text-theme-secondary">
                        <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                        <span>Evaluación nutricional</span>
                      </li>
                      <li className="flex items-center gap-3 text-theme-secondary">
                        <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                        <span>Invitaciones para amigos (1/mes)</span>
                      </li>
                    </>
                  )}
                  {(membershipType.name === MembershipTypeName.ELITE || membershipType.name.toString().toLowerCase() === 'elite' || membershipType.name.toString().toLowerCase() === 'vip') && (
                    <>
                      <li className="flex items-center gap-3 text-theme-secondary">
                        <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                        <span>Todo lo del plan Premium</span>
                      </li>
                      <li className="flex items-center gap-3 text-theme-secondary">
                        <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                        <span>Puede ingresar a cualquier sucursal</span>
                      </li>
                      <li className="flex items-center gap-3 text-theme-secondary">
                        <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                        <span>Entrenador personal (4 sesiones/mes)</span>
                      </li>
                      <li className="flex items-center gap-3 text-theme-secondary">
                        <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                        <span>Plan nutricional personalizado</span>
                      </li>
                      <li className="flex items-center gap-3 text-theme-secondary">
                        <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                        <span>Invitaciones para amigos (3/mes)</span>
                      </li>
                      <li className="flex items-center gap-3 text-theme-secondary">
                        <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                        <span>Nutricionista incluido</span>
                      </li>
                    </>
                  )}
                </ul>
                <Button
                  onClick={() => setSelectedPlan(membershipType)}
                  className={`w-full py-4 text-lg font-bold transition-all duration-300 transform hover:scale-105 shadow-lg ${
                    index === 1 
                      ? 'btn-primary-red' 
                      : 'bg-theme-secondary hover:bg-theme-secondary/80 text-theme-primary border border-theme'
                  }`}
                >
                  <Trophy className="w-5 h-5 mr-2" />
                  Seleccionar Plan
                  <ArrowRight className="w-5 h-5 ml-2" />
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