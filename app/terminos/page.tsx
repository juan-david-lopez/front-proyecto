"use client"

import { ArrowLeft, Shield, FileText, AlertCircle } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

export default function TerminosPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black text-white">
      <header className="px-6 py-6 bg-black/50 backdrop-blur-sm border-b border-gray-800">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-white hover:text-red-500 transition-all duration-300 hover:translate-x-1"
        >
          <ArrowLeft size={20} />
          <span className="font-medium">Volver al inicio</span>
        </Link>
      </header>

      <main className="px-6 py-12">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 bg-red-600/20 border border-red-500/30 rounded-full px-6 py-3 backdrop-blur-sm mb-6">
              <FileText className="w-5 h-5 text-red-400" />
              <span className="text-red-300 font-medium">Documento legal</span>
            </div>
            
            <h1 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-white via-gray-200 to-gray-400 bg-clip-text text-transparent">
              Términos y Condiciones
            </h1>
            
            <div className="space-y-2 text-gray-400">
              <p className="text-xl">FitZone Gimnasio</p>
              <p className="text-sm">Última actualización: Enero 2025</p>
            </div>
          </div>

          {/* Contenido */}
          <div className="space-y-8">
            <Card className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 border-gray-700/50">
              <CardContent className="p-8">
                <div className="flex items-start gap-4 mb-6">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-red-500 to-red-600 flex items-center justify-center flex-shrink-0">
                    <AlertCircle className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-white mb-3">1. Aceptación de los Términos</h2>
                    <p className="text-gray-300 leading-relaxed">
                      Al registrarse y utilizar los servicios de FitZone, usted acepta estar sujeto a estos términos y
                      condiciones. Si no está de acuerdo con alguno de estos términos, no debe utilizar nuestros servicios.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 border-gray-700/50">
              <CardContent className="p-8">
                <div className="flex items-start gap-4 mb-6">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center flex-shrink-0">
                    <Shield className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-white mb-4">2. Membresías y Pagos</h2>
                    <div className="space-y-4 text-gray-300">
                      <p>
                        <strong className="text-white">2.1 Tipos de Membresía:</strong> Ofrecemos diferentes planes de membresía con beneficios
                        específicos detallados en nuestro sitio web.
                      </p>
                      <p>
                        <strong className="text-white">2.2 Pagos:</strong> Los pagos deben realizarse por adelantado según el plan seleccionado. No se
                        otorgan reembolsos por servicios no utilizados.
                      </p>
                      <p>
                        <strong className="text-white">2.3 Renovación:</strong> Las membresías se renuevan automáticamente a menos que se cancelen con
                        30 días de anticipación.
                      </p>
                      <p>
                        <strong className="text-white">2.4 Congelamiento:</strong> Las membresías pueden congelarse por razones médicas con certificado
                        médico, hasta por 3 meses al año.
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 border-gray-700/50">
              <CardContent className="p-8">
                <div className="flex items-start gap-4 mb-6">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center flex-shrink-0">
                    <FileText className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-white mb-4">3. Uso de las Instalaciones</h2>
                    <div className="space-y-4 text-gray-300">
                      <p>
                        <strong className="text-white">3.1 Horarios:</strong> Las instalaciones están disponibles según los horarios publicados,
                        sujetos a cambios con previo aviso.
                      </p>
                      <p>
                        <strong className="text-white">3.2 Código de Vestimenta:</strong> Se requiere ropa deportiva apropiada y calzado deportivo en
                        todo momento.
                      </p>
                      <p>
                        <strong className="text-white">3.3 Comportamiento:</strong> Se debe mantener un comportamiento respetuoso hacia otros miembros
                        y el personal.
                      </p>
                      <p>
                        <strong className="text-white">3.4 Equipos:</strong> Los miembros deben usar el equipo de manera apropiada y reportar cualquier
                        daño inmediatamente.
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 border-gray-700/50">
              <CardContent className="p-8">
                <div className="flex items-start gap-4 mb-6">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-yellow-500 to-yellow-600 flex items-center justify-center flex-shrink-0">
                    <Shield className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-white mb-4">4. Salud y Seguridad</h2>
                    <div className="space-y-4 text-gray-300">
                      <p>
                        <strong className="text-white">4.1 Evaluación Médica:</strong> Se recomienda consultar con un médico antes de comenzar
                        cualquier programa de ejercicios.
                      </p>
                      <p>
                        <strong className="text-white">4.2 Riesgo Asumido:</strong> El ejercicio físico conlleva riesgos inherentes que el miembro
                        asume voluntariamente.
                      </p>
                      <p>
                        <strong className="text-white">4.3 Lesiones:</strong> FitZone no se hace responsable por lesiones que puedan ocurrir durante el
                        uso de las instalaciones.
                      </p>
                      <p>
                        <strong className="text-white">4.4 Emergencias:</strong> En caso de emergencia médica, se contactará a los servicios de
                        emergencia y a los contactos proporcionados por el miembro.
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 border-gray-700/50">
              <CardContent className="p-8">
                <div className="grid md:grid-cols-2 gap-8">
                  <div>
                    <h2 className="text-2xl font-bold text-white mb-4">5. Suspensión y Terminación</h2>
                    <div className="space-y-4 text-gray-300">
                      <p>
                        <strong className="text-white">5.1 Suspensión:</strong> FitZone se reserva el derecho de suspender o terminar membresías por
                        violación de estos términos.
                      </p>
                      <p>
                        <strong className="text-white">5.2 Cancelación por el Miembro:</strong> Los miembros pueden cancelar con 30 días de aviso
                        previo por escrito.
                      </p>
                      <p>
                        <strong className="text-white">5.3 Reembolsos:</strong> No se otorgan reembolsos por cancelaciones, excepto en casos
                        específicos determinados por la administración.
                      </p>
                    </div>
                  </div>
                  
                  <div>
                    <h2 className="text-2xl font-bold text-white mb-4">6. Privacidad y Datos Personales</h2>
                    <p className="text-gray-300 leading-relaxed">
                      El manejo de datos personales se rige por nuestra <Link href="/privacidad" className="text-red-400 hover:text-red-300 underline">Política de Privacidad</Link>, la cual cumple con la normativa
                      colombiana de protección de datos personales (Ley 1581 de 2012).
                    </p>
                    
                    <h2 className="text-2xl font-bold text-white mb-4 mt-6">7. Limitación de Responsabilidad</h2>
                    <p className="text-gray-300 leading-relaxed">
                      FitZone no será responsable por daños indirectos, incidentales, especiales o consecuenciales que resulten
                      del uso de nuestras instalaciones o servicios, más allá de lo establecido por la ley colombiana.
                    </p>
                    
                    <h2 className="text-2xl font-bold text-white mb-4 mt-6">8. Modificaciones</h2>
                    <p className="text-gray-300 leading-relaxed">
                      FitZone se reserva el derecho de modificar estos términos en cualquier momento. Los cambios serán
                      notificados a los miembros con al menos 15 días de anticipación.
                    </p>
                    
                    <h2 className="text-2xl font-bold text-white mb-4 mt-6">9. Ley Aplicable</h2>
                    <p className="text-gray-300 leading-relaxed">
                      Estos términos se rigen por las leyes de la República de Colombia. Cualquier disputa será resuelta en los
                      tribunales competentes de Colombia.
                    </p>
                    
                    <h2 className="text-2xl font-bold text-white mb-4 mt-6">10. Contacto</h2>
                    <p className="text-gray-300 leading-relaxed">
                      Para preguntas sobre estos términos, puede contactarnos en: info@fitzone.com.co o visitarnos en nuestras
                      instalaciones.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}
