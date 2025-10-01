"use client"

import { ArrowLeft, Shield, FileText, Lock, Eye, UserCheck, Database, Settings } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

export default function PrivacidadPage() {
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
              <Lock className="w-5 h-5 text-red-400" />
              <span className="text-red-300 font-medium">Protección de datos</span>
            </div>
            
            <h1 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-white via-gray-200 to-gray-400 bg-clip-text text-transparent">
              Política de Privacidad
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
                    <FileText className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-white mb-3">1. Introducción</h2>
                    <p className="text-gray-300 leading-relaxed">
                      FitZone S.A.S., en cumplimiento de la Ley 1581 de 2012 y el Decreto 1377 de 2013 sobre protección de datos
                      personales, informa sobre el tratamiento que damos a sus datos personales y los derechos que tiene sobre
                      los mismos.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 border-gray-700/50">
              <CardContent className="p-8">
                <div className="flex items-start gap-4 mb-6">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center flex-shrink-0">
                    <UserCheck className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-white mb-4">2. Responsable del Tratamiento</h2>
                    <div className="space-y-3 text-gray-300">
                      <p><strong className="text-white">Razón Social:</strong> FitZone S.A.S.</p>
                      <p><strong className="text-white">NIT:</strong> 900.XXX.XXX-X</p>
                      <p><strong className="text-white">Dirección:</strong> Calle XX # XX-XX, Bogotá, Colombia</p>
                      <p><strong className="text-white">Teléfono:</strong> +57 (1) XXX-XXXX</p>
                      <p><strong className="text-white">Email:</strong> privacidad@fitzone.com.co</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 border-gray-700/50">
              <CardContent className="p-8">
                <div className="flex items-start gap-4 mb-6">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center flex-shrink-0">
                    <Eye className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-white mb-4">3. Datos Personales Recolectados</h2>
                    <div className="space-y-4 text-gray-300">
                      <p><strong className="text-white">3.1 Datos de Identificación:</strong> Nombre completo, número de identificación, fecha de nacimiento, fotografía.</p>
                      <p><strong className="text-white">3.2 Datos de Contacto:</strong> Dirección, teléfono, correo electrónico.</p>
                      <p><strong className="text-white">3.3 Datos de Salud:</strong> Información médica relevante para el ejercicio físico, alergias, condiciones médicas.</p>
                      <p><strong className="text-white">3.4 Datos Financieros:</strong> Información de pago y facturación.</p>
                      <p><strong className="text-white">3.5 Datos Biométricos:</strong> Medidas corporales, progreso físico (con consentimiento expreso).</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 border-gray-700/50">
              <CardContent className="p-8">
                <div className="grid md:grid-cols-2 gap-8">
                  <div>
                    <h2 className="text-2xl font-bold text-white mb-4">4. Derechos del Titular</h2>
                    <div className="space-y-4 text-gray-300">
                      <p><strong className="text-white">4.1 Acceso:</strong> Conocer, actualizar y rectificar sus datos personales.</p>
                      <p><strong className="text-white">4.2 Cancelación:</strong> Solicitar la supresión de sus datos cuando sea procedente.</p>
                      <p><strong className="text-white">4.3 Oposición:</strong> Oponerse al tratamiento de sus datos personales.</p>
                      <p><strong className="text-white">4.4 Portabilidad:</strong> Obtener copia de sus datos en formato estructurado.</p>
                    </div>
                  </div>
                  
                  <div>
                    <h2 className="text-2xl font-bold text-white mb-4">5. Contacto</h2>
                    <p className="text-gray-300 leading-relaxed">
                      Para ejercer sus derechos o realizar consultas sobre esta política, puede contactarnos en: 
                      <span className="text-red-400 ml-1">privacidad@fitzone.com.co</span> o revisar nuestros 
                      <Link href="/terminos" className="text-red-400 hover:text-red-300 underline ml-1">
                        Términos y Condiciones
                      </Link>
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
