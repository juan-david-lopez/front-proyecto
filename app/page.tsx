"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { FitZoneLogo } from "@/components/fitzone-logo"
import Link from "next/link"
import { useState } from "react"
import { PlanModal } from "@/components/plan-modal"
import { MembershipType, MembershipTypeName } from "@/types/membership"
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
  Zap
} from "lucide-react"

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
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 text-white">
      {/* Navigation Premium */}
      <nav className="fixed top-0 w-full z-50 bg-black/90 backdrop-blur-md border-b border-gray-800">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <FitZoneLogo 
              size="lg" 
              variant="simple"
              href="/"
              showText={true}
            />
            
            <div className="hidden md:flex items-center space-x-8">
              <a href="#hero" className="text-gray-300 hover:text-white transition-colors flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-white/10">
                <Heart className="w-4 h-4" />
                Inicio
              </a>
              <a href="#servicios" className="text-gray-300 hover:text-white transition-colors flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-white/10">
                <Target className="w-4 h-4" />
                Servicios
              </a>
              <Link href="/membresias" className="text-gray-300 hover:text-white transition-colors flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-white/10">
                <Trophy className="w-4 h-4" />
                Membresías
              </Link>
              <Link href="/contacto" className="text-gray-300 hover:text-white transition-colors flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-white/10">
                <Phone className="w-4 h-4" />
                Contacto
              </Link>
            </div>
            
            <div className="flex items-center space-x-3">
              <Link href="/login">
                <Button variant="ghost" className="text-white hover:bg-white/10 border-white/20">
                  Iniciar Sesión
                </Button>
              </Link>
              <Link href="/register">
                <Button className="bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white shadow-lg">
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
        <div className="absolute inset-0 bg-gradient-to-br from-red-900/20 via-black to-orange-900/20" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_40%,rgba(255,0,0,0.1),transparent_50%)]" />
        
        <div className="relative z-10 text-center max-w-6xl mx-auto">
          <div className="mb-8">
            <div className="inline-flex items-center gap-2 bg-gradient-to-r from-red-600/20 to-orange-600/20 border border-red-500/30 rounded-full px-6 py-3 backdrop-blur-sm">
              <Zap className="w-5 h-5 text-red-400" />
              <span className="text-red-300 font-medium">Gimnasio con mas crecimiento en el país</span>
            </div>
          </div>
          
          <h1 id="hero-title" className="text-5xl md:text-7xl lg:text-8xl font-bold mb-8 leading-tight">
            <span className="bg-gradient-to-r from-white via-red-200 to-orange-200 bg-clip-text text-transparent">
              Transforma
            </span>
            <br />
            <span className="bg-gradient-to-r from-red-500 via-red-600 to-orange-500 bg-clip-text text-transparent">
              Tu Vida
            </span>
          </h1>
          
          <p className="text-xl md:text-2xl lg:text-3xl mb-12 text-gray-300 max-w-4xl mx-auto leading-relaxed">
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
              <h3 className="text-2xl font-bold text-white mb-2">5000+</h3>
              <p className="text-gray-400">Miembros Satisfechos</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                <MapPin className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-2">15</h3>
              <p className="text-gray-400">Ubicaciones en Colombia</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                <Clock className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-2">24/7</h3>
              <p className="text-gray-400">Acceso Disponible</p>
            </div>
          </div>
        </div>
      </section>

      {/* Memberships Section Premium */}
      <section id="membresias" className="py-20 px-6 bg-gradient-to-b from-gray-900 to-black relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_30%,rgba(255,0,0,0.05),transparent_50%)]" />
        
        <div className="relative z-10 max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 bg-gradient-to-r from-red-600/20 to-orange-600/20 border border-red-500/30 rounded-full px-6 py-3 backdrop-blur-sm mb-6">
              <Trophy className="w-5 h-5 text-red-400" />
              <span className="text-red-300 font-medium">Planes segun tu necesidad</span>
            </div>
            
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
              <span className="bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                Elige Tu
              </span>
              <br />
              <span className="bg-gradient-to-r from-red-500 to-orange-500 bg-clip-text text-transparent">
                Membresía Ideal
              </span>
            </h2>
            
            <p className="text-xl text-gray-400 max-w-3xl mx-auto">
              Planes diseñados para cada estilo de vida. Desde principiantes hasta atletas profesionales.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto pt-12">
            {plans.map((plan, index) => (
              <Card 
                key={plan.idMembershipType} 
                className={`relative border-2 transition-all duration-300 hover:scale-105 hover:shadow-2xl ${
                  index === 1 
                    ? 'bg-gradient-to-br from-red-900/20 to-orange-900/20 border-red-500/50 transform scale-105' 
                    : 'bg-gradient-to-br from-gray-800/50 to-gray-900/50 border-gray-700/50 hover:border-red-500/30'
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
                      index === 1 ? 'text-red-400' : 'text-white'
                    }`}>
                      {plan.description}
                    </h3>
                    
                    <div className="text-4xl font-bold mb-6 text-white">
                      <span className={index === 1 ? 'text-red-400' : 'text-white'}>
                        ${plan.monthlyPrice.toLocaleString("es-CO")}
                      </span>
                      <span className="text-lg font-normal text-gray-400">/mes</span>
                    </div>
                  </div>
                  
                  <ul className="space-y-4 mb-8 flex-1" role="list">
                    {plan.name === MembershipTypeName.BASIC && (
                      <>
                        <li className="flex items-center gap-3 text-gray-300">
                          <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                          <span>Acceso al área de pesas</span>
                        </li>
                        <li className="flex items-center gap-3 text-gray-300">
                          <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                          <span>2 horas por día de entrenamiento</span>
                        </li>
                        <li className="flex items-center gap-3 text-gray-300">
                          <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                          <span>Máquinas cardiovasculares</span>
                        </li>
                        <li className="flex items-center gap-3 text-gray-300">
                          <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                          <span>Vestuarios y duchas</span>
                        </li>
                        <li className="flex items-center gap-3 text-gray-300">
                          <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                          <span>Solo puede estar en una sucursal</span>
                        </li>
                      </>
                    )}
                    {plan.name === MembershipTypeName.PREMIUM && (
                      <>
                        <li className="flex items-center gap-3 text-gray-300">
                          <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                          <span>Todo lo del plan básico</span>
                        </li>
                        <li className="flex items-center gap-3 text-gray-300">
                          <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                          <span>Acceso 24/7</span>
                        </li>
                        <li className="flex items-center gap-3 text-gray-300">
                          <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                          <span>Entrenador personal (2 sesiones/mes)</span>
                        </li>
                        <li className="flex items-center gap-3 text-gray-300">
                          <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                          <span>Evaluación nutricional</span>
                        </li>
                        <li className="flex items-center gap-3 text-gray-300">
                          <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                          <span>Invitaciones para amigos (1/mes)</span>
                        </li>
                      </>
                    )}
                    {plan.name === MembershipTypeName.ELITE && (
                      <>
                        <li className="flex items-center gap-3 text-gray-300">
                          <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                          <span>Todo lo del plan Premium</span>
                        </li>
                        <li className="flex items-center gap-3 text-gray-300">
                          <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                          <span>Puede ingresar a cualquier sucursal</span>
                        </li>
                        <li className="flex items-center gap-3 text-gray-300">
                          <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                          <span>Entrenador personal (4 sesiones/mes)</span>
                        </li>
                        <li className="flex items-center gap-3 text-gray-300">
                          <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                          <span>Plan nutricional personalizado</span>
                        </li>
                        <li className="flex items-center gap-3 text-gray-300">
                          <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                          <span>Invitaciones para amigos (3/mes)</span>
                        </li>
                        <li className="flex items-center gap-3 text-gray-300">
                          <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                          <span>Nutricionista incluido</span>
                        </li>
                      </>
                    )}
                  </ul>
                  <Button
                    onClick={() => setSelectedPlan(plan)}
                    className={`w-full py-4 text-lg font-bold transition-all duration-300 transform hover:scale-105 shadow-lg ${
                      index === 1 
                        ? 'bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white shadow-red-500/25' 
                        : 'bg-gradient-to-r from-gray-700 to-gray-800 hover:from-gray-600 hover:to-gray-700 text-white'
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
        </div>
      </section>

      {/* Call to Action Premium */}
      <section id="contacto" className="py-20 px-6 text-center bg-gradient-to-br from-black via-red-900/20 to-black relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,0,0,0.1),transparent_70%)]" />
        
        <div className="relative z-10 max-w-4xl mx-auto">
          <div className="mb-8">
            <div className="inline-flex items-center gap-2 bg-gradient-to-r from-red-600/20 to-orange-600/20 border border-red-500/30 rounded-full px-6 py-3 backdrop-blur-sm mb-6">
              <Zap className="w-5 h-5 text-red-400" />
              <span className="text-red-300 font-medium">¡Únete Hoy!</span>
            </div>
          </div>
          
          <h2 className="text-4xl md:text-5xl font-bold mb-8">
            <span className="bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
              Tu Transformación
            </span>
            <br />
            <span className="bg-gradient-to-r from-red-500 to-orange-500 bg-clip-text text-transparent">
              Comienza Ahora
            </span>
          </h2>
          
          <p className="text-xl text-gray-300 mb-12 max-w-2xl mx-auto">
            No esperes más. Miles de personas ya han cambiado sus vidas con FitZone. 
            Sé parte de nuestra comunidad fitness.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <Button 
              size="lg"
              className="bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white px-12 py-6 text-xl font-bold shadow-2xl transform hover:scale-105 transition-all duration-300"
            >
              <Dumbbell className="w-6 h-6 mr-3" />
              ¡EMPIEZA YA!
              <Zap className="w-6 h-6 ml-3" />
            </Button>
            
            <Link href="/contacto">
              <button 
                className="w-full inline-flex items-center justify-center gap-3 px-12 py-3 text-xl font-semibold text-white bg-transparent border-2 border-white rounded-lg hover:bg-white hover:text-black transition-all duration-300 backdrop-blur-sm"
              >
                <Phone className="w-6 h-6" />
                Contactar
              </button>
            </Link>
          </div>
          
          <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-3xl mx-auto">
            <div className="text-center">
              <Phone className="w-8 h-8 text-red-400 mx-auto mb-3" />
              <p className="text-gray-300 font-medium">+57 300 123 4567</p>
            </div>
            
            <div className="text-center">
              <Mail className="w-8 h-8 text-red-400 mx-auto mb-3" />
              <p className="text-gray-300 font-medium">info@fitzone.com.co</p>
            </div>
            
            <div className="text-center">
              <MapPin className="w-8 h-8 text-red-400 mx-auto mb-3" />
              <p className="text-gray-300 font-medium">4 Sedes</p>
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
