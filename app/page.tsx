"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { FitZoneLogo } from "@/components/fitzone-logo"
import Link from "next/link"
import { useState, useEffect } from "react"
import { PlanModal } from "@/components/plan-modal"
import { MembershipType, MembershipTypeName } from "@/types/membership"
import membershipService from "@/services/membershipService"
import { 
  Dumbbell, 
  Star, 
  MapPin, 
  Clock, 
  Users, 
  Trophy, 
  Heart, 
  Target, 
  CheckCircle, 
  ArrowRight,
  Phone,
  Mail,
  Zap,
  Loader2
} from "lucide-react"

export default function HomePage() {
  const [selectedPlan, setSelectedPlan] = useState<MembershipType | null>(null)
  const [plans, setPlans] = useState<MembershipType[]>([])
  const [loading, setLoading] = useState(true)

  // Planes de fallback (por si el backend no responde)
  const fallbackPlans: MembershipType[] = [
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
      
      // Cargar datos desde el backend
      const types = await membershipService.getMembershipTypes()
      
      if (types && types.length > 0) {
        console.log('✅ [HomePage] Datos cargados desde el backend:', types)
        setPlans(types)
      } else {
        console.warn('⚠️ [HomePage] Backend devolvió datos vacíos, usando fallback')
        setPlans(fallbackPlans)
      }
    } catch (err) {
      console.error('❌ [HomePage] Error conectando con el backend:', err)
      console.log('🔄 [HomePage] Usando datos de fallback local')
      setPlans(fallbackPlans)
    } finally {
      setLoading(false)
    }
  }

  const getPlanDisplayName = (membershipTypeName: MembershipTypeName) => {
    switch (membershipTypeName) {
      case MembershipTypeName.BASIC:
        return "Plan Básico"
      case MembershipTypeName.PREMIUM:
        return "Plan Premium"
      case MembershipTypeName.ELITE:
        return "Plan Elite"
      default:
        return membershipTypeName
    }
  }

  return (
    <div className="min-h-screen bg-theme-primary text-theme-primary">
      {/* Navigation Premium */}
      <nav className="fixed top-0 w-full z-50 bg-theme-primary/90 backdrop-blur-md border-b border-theme">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <FitZoneLogo 
              size="lg" 
              variant="simple"
              href="/"
              showText={true}
            />
            
            <div className="hidden md:flex items-center space-x-8">
              <Link href="/membresias" className="nav-link flex items-center gap-2">
                <Trophy className="w-4 h-4 group-hover:rotate-12 transition-transform duration-300" />
                Membresías
              </Link>
              <Link href="/contacto" className="nav-link flex items-center gap-2">
                <Phone className="w-4 h-4 group-hover:rotate-12 transition-transform duration-300" />
                Contacto
              </Link>
            </div>
            
            <div className="flex items-center space-x-3">
              <Link href="/login">
                <Button variant="ghost" className="text-theme-primary hover:bg-theme-secondary/20 border-theme hover:border-opacity-40 transition-all duration-300 hover:scale-105 hover:shadow-lg">
                  Iniciar Sesión
                </Button>
              </Link>
              <Link href="/register">
                <Button className="btn-primary-red">
                  Regístrate
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section Premium */}
      <main id="main-content">
      <section id="hero" className="relative min-h-screen flex items-center justify-center px-6 pt-20 overflow-hidden" aria-labelledby="hero-title">
        <div className="absolute inset-0 bg-gradient-to-br from-red-900/20 via-theme-primary to-orange-900/20" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_40%,rgba(255,0,0,0.1),transparent_50%)]" />
        
        <div className="relative z-10 text-center max-w-6xl mx-auto">
          <div className="mb-8">
            <div className="inline-flex items-center gap-2 bg-gradient-banner border rounded-full px-6 py-3 backdrop-blur-sm">
              <Zap className="w-5 h-5 text-banner" />
              <span className="text-banner font-medium">Gimnasio con mas crecimiento en el país</span>
            </div>
          </div>
          
          <h1 id="hero-title" className="text-5xl md:text-7xl lg:text-8xl font-bold mb-8 leading-tight">
            <span className="text-gradient-hero">
              Transforma
            </span>
            <br />
            <span className="text-gradient-accent">
              Tu Vida
            </span>
          </h1>
          
          <p className="text-xl md:text-2xl lg:text-3xl mb-12 text-theme-secondary max-w-4xl mx-auto leading-relaxed">
            Únete a FitZone. Entrena con los mejores equipos, 
            instructores certificados y una comunidad que te impulsa a ser tu mejor versión.
          </p>
          
          <div className="flex justify-center items-center">
            <Button 
              variant="destructive"
              size="lg"
              className="px-12 py-6 text-xl font-bold shadow-2xl transform hover:scale-105 transition-all duration-300 !bg-gradient-to-r !from-red-600 !to-red-700 hover:!from-red-700 hover:!to-red-800 !text-white"
            >
              <Dumbbell className="w-6 h-6 mr-3" />
              Comienza Hoy
              <ArrowRight className="w-6 h-6 ml-3" />
            </Button>
          </div>
          
          <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-red-500 to-red-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                <Trophy className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-theme-primary mb-2">5000+</h3>
              <p className="text-theme-secondary">Miembros Satisfechos</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                <MapPin className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-theme-primary mb-2">15</h3>
              <p className="text-theme-secondary">Ubicaciones en Colombia</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                <Clock className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-theme-primary mb-2">24/7</h3>
              <p className="text-theme-secondary">Acceso Disponible</p>
            </div>
          </div>
        </div>
      </section>

      {/* Memberships Section Premium */}
      <section id="membresias" className="py-20 px-6 bg-theme-secondary relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_30%,rgba(255,0,0,0.05),transparent_50%)]" />
        
        <div className="relative z-10 max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 bg-gradient-to-r from-red-600/20 to-orange-600/20 border border-red-500/30 rounded-full px-6 py-3 backdrop-blur-sm mb-6">
              <Trophy className="w-5 h-5 text-red-400" />
              <span className="text-red-300 font-medium">Planes segun tu necesidad</span>
            </div>
            
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
              <span className="bg-gradient-to-r from-theme-primary to-theme-secondary bg-clip-text text-transparent">
                Elige Tu
              </span>
              <br />
              <span className="bg-gradient-to-r from-red-500 to-orange-500 bg-clip-text text-transparent">
                Membresía Ideal
              </span>
            </h2>
            
            <p className="text-xl text-theme-secondary max-w-3xl mx-auto">
              Planes diseñados para cada estilo de vida. Desde principiantes hasta atletas profesionales.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto pt-12">
            {loading ? (
              // Indicador de carga
              <div className="col-span-1 md:col-span-3 flex flex-col items-center justify-center py-20">
                <Loader2 className="w-12 h-12 text-red-500 animate-spin mb-4" />
                <p className="text-theme-secondary text-lg">Cargando planes de membresía...</p>
              </div>
            ) : (
              // Mostrar planes
              plans.map((plan, index) => (
              <Card 
                key={plan.idMembershipType} 
                className={`relative border-2 transition-all duration-500 hover:scale-110 hover:shadow-2xl hover:shadow-red-500/30 hover:-translate-y-2 group cursor-pointer ${
                  index === 1 
                    ? 'card-theme border-red-500/60 transform scale-105 shadow-xl shadow-red-600/20' 
                    : 'card-theme border-theme hover:border-red-500/50'
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
                
                <CardContent className="p-8 text-center flex flex-col flex-1">
                  <div className="mb-6">
                    <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg ${
                      index === 0 ? 'bg-gradient-to-br from-blue-500 to-blue-600' :
                      index === 1 ? 'bg-gradient-to-br from-red-500 to-red-600' :
                      'bg-gradient-to-br from-yellow-500 to-yellow-600'
                    }`}>
                      {index === 0 && <Heart className="w-8 h-8 text-white" />}
                      {index === 1 && <Star className="w-8 h-8 text-white" />}
                      {index === 2 && <Trophy className="w-8 h-8 text-white" />}
                    </div>
                    
                    <h3 className={`text-3xl font-bold mb-2 ${
                      index === 1 ? 'text-red-400' : 'text-theme-primary'
                    }`}>
                      {getPlanDisplayName(plan.name)}
                    </h3>
                    
                    <div className="text-4xl font-bold mb-6 text-theme-primary">
                      <span className={index === 1 ? 'text-red-400' : 'text-theme-primary'}>
                        ${plan.monthlyPrice.toLocaleString("es-CO")}
                      </span>
                      <span className="text-lg font-normal text-theme-secondary">/mes</span>
                    </div>
                  </div>
                  
                  <ul className="space-y-4 mb-8 flex-1" role="list">
                    {plan.name === MembershipTypeName.BASIC && (
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
                    {plan.name === MembershipTypeName.PREMIUM && (
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
                    {plan.name === MembershipTypeName.ELITE && (
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
                    onClick={() => setSelectedPlan(plan)}
                    className={`w-full py-4 text-lg font-bold transition-all duration-500 transform hover:scale-110 hover:-translate-y-1 shadow-lg group ${
                      index === 1 
                        ? 'btn-primary-red' 
                        : 'bg-gradient-to-r from-gray-700 to-gray-800 hover:from-red-600 hover:to-red-700 text-white hover:shadow-red-500/40 hover:shadow-xl'
                    }`}
                  >
                    <Trophy className="w-5 h-5 mr-2 group-hover:rotate-12 group-hover:scale-125 transition-all duration-300" />
                    Seleccionar Plan
                    <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-all duration-300" />
                  </Button>
                </CardContent>
              </Card>
              ))
            )}
          </div>
        </div>
      </section>

      {/* Call to Action Premium */}
      <section id="contacto" className="py-20 px-6 text-center bg-theme-tertiary relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,0,0,0.1),transparent_70%)]" />
        
        <div className="relative z-10 max-w-4xl mx-auto">
          <div className="mb-8">
            <div className="inline-flex items-center gap-2 bg-gradient-to-r from-red-600/20 to-orange-600/20 border border-red-500/30 rounded-full px-6 py-3 backdrop-blur-sm mb-6">
              <Zap className="w-5 h-5 text-red-400" />
              <span className="text-red-300 font-medium">¡Únete Hoy!</span>
            </div>
          </div>
          
          <h2 className="text-4xl md:text-5xl font-bold mb-8">
            <span className="bg-gradient-to-r from-theme-primary to-theme-secondary bg-clip-text text-transparent">
              Tu Transformación
            </span>
            <br />
            <span className="bg-gradient-to-r from-red-500 to-orange-500 bg-clip-text text-transparent">
              Comienza Ahora
            </span>
          </h2>
          
          <p className="text-xl text-theme-secondary mb-12 max-w-2xl mx-auto">
            No esperes más. Miles de personas ya han cambiado sus vidas con FitZone. 
            Sé parte de nuestra comunidad fitness.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <Button 
              size="lg"
              className="btn-primary-red px-12 py-6 text-xl font-bold shadow-2xl"
            >
              <Dumbbell className="w-6 h-6 mr-3" />
              ¡EMPIEZA YA!
              <Zap className="w-6 h-6 ml-3" />
            </Button>
            
            <Link href="/contacto">
              <button 
                className="w-full inline-flex items-center justify-center gap-3 px-12 py-3 text-xl font-semibold text-theme-primary bg-transparent border-2 border-theme rounded-lg hover:bg-theme-secondary hover:text-theme-primary transition-all duration-300 backdrop-blur-sm"
              >
                <Phone className="w-6 h-6" />
                Contactar
              </button>
            </Link>
          </div>
          
          <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-3xl mx-auto">
            <div className="text-center">
              <Phone className="w-8 h-8 text-red-400 mx-auto mb-3" />
              <p className="text-theme-secondary font-medium">+57 300 123 4567</p>
            </div>
            
            <div className="text-center">
              <Mail className="w-8 h-8 text-red-400 mx-auto mb-3" />
              <p className="text-theme-secondary font-medium">info@fitzone.com.co</p>
            </div>
            
            <div className="text-center">
              <MapPin className="w-8 h-8 text-red-400 mx-auto mb-3" />
              <p className="text-theme-secondary font-medium">4 Sedes</p>
            </div>
          </div>
        </div>
      </section>

        {/* Modal */}
        {selectedPlan && (
          <PlanModal isOpen={!!selectedPlan} onClose={() => setSelectedPlan(null)} plan={selectedPlan} />
        )}
      </main>
      </div>
  )
}
