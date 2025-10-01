"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { FitZoneLogo } from "@/components/fitzone-logo"
import { 
  Mail, 
  Phone, 
  Instagram, 
  Twitter, 
  Facebook, 
  MapPin,
  Clock,
  MessageCircle,
  ExternalLink,
  ArrowLeft
} from "lucide-react"
import Link from "next/link"

export default function ContactoPage() {
  const handleContactClick = (type: string, value: string) => {
    switch (type) {
      case 'email':
        window.open(`mailto:${value}`, '_blank')
        break
      case 'phone':
        window.open(`tel:${value}`, '_blank')
        break
      case 'instagram':
        window.open('https://instagram.com/fitzone', '_blank')
        break
      case 'twitter':
        window.open('https://twitter.com/fitzone', '_blank')
        break
      case 'facebook':
        window.open('https://facebook.com/fitzone', '_blank')
        break
      default:
        break
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-800">
      {/* Header con navegación de regreso */}
      <div className="relative bg-gradient-to-r from-red-600/20 to-orange-600/20 backdrop-blur-sm border-b border-red-500/20">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center gap-4 mb-4">
            <Link href="/">
              <Button variant="ghost" className="text-white hover:bg-white/10">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Volver al Inicio
              </Button>
            </Link>
          </div>
          
          <div className="text-center">
            {/* Logo centrado */}
            <div className="flex justify-center mb-6">
              <FitZoneLogo 
                size="xl" 
                variant="gradient"
                showText={true}
              />
            </div>
            
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4">
              <span className="bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                Contáctanos
              </span>
            </h1>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto">
              Estamos aquí para ayudarte. Conecta con nosotros a través de cualquiera de nuestros canales.
            </p>
          </div>
        </div>
      </div>

      {/* Sección principal de contacto */}
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          
          {/* Teléfono */}
          <Card className="bg-gradient-to-br from-blue-900/20 to-blue-800/20 border-blue-500/30 hover:border-blue-400/50 transition-all duration-300 hover:scale-105 cursor-pointer"
                onClick={() => handleContactClick('phone', '+573001234567')}>
            <CardHeader className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                <Phone className="w-8 h-8 text-white" />
              </div>
              <CardTitle className="text-blue-400 text-xl">Llámanos</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <p className="text-gray-300 mb-4">Habla directamente con nuestro equipo</p>
              <div className="flex items-center justify-center gap-2 text-white font-semibold">
                <span>+57 300 123 4567</span>
                <ExternalLink className="w-4 h-4" />
              </div>
              <p className="text-sm text-gray-400 mt-2">Lun - Vie: 6:00 AM - 10:00 PM</p>
            </CardContent>
          </Card>

          {/* Email */}
          <Card className="bg-gradient-to-br from-green-900/20 to-green-800/20 border-green-500/30 hover:border-green-400/50 transition-all duration-300 hover:scale-105 cursor-pointer"
                onClick={() => handleContactClick('email', 'info@fitzone.com')}>
            <CardHeader className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                <Mail className="w-8 h-8 text-white" />
              </div>
              <CardTitle className="text-green-400 text-xl">Email</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <p className="text-gray-300 mb-4">Envíanos un correo electrónico</p>
              <div className="flex items-center justify-center gap-2 text-white font-semibold">
                <span>info@fitzone.com</span>
                <ExternalLink className="w-4 h-4" />
              </div>
              <p className="text-sm text-gray-400 mt-2">Respuesta en 24 horas</p>
            </CardContent>
          </Card>

          {/* Instagram */}
          <Card className="bg-gradient-to-br from-pink-900/20 to-purple-800/20 border-pink-500/30 hover:border-pink-400/50 transition-all duration-300 hover:scale-105 cursor-pointer"
                onClick={() => handleContactClick('instagram', '')}>
            <CardHeader className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-pink-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                <Instagram className="w-8 h-8 text-white" />
              </div>
              <CardTitle className="text-pink-400 text-xl">Instagram</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <p className="text-gray-300 mb-4">Síguenos para tips y motivación</p>
              <div className="flex items-center justify-center gap-2 text-white font-semibold">
                <span>@fitzone</span>
                <ExternalLink className="w-4 h-4" />
              </div>
              <p className="text-sm text-gray-400 mt-2">Contenido diario</p>
            </CardContent>
          </Card>

          {/* Twitter/X */}
          <Card className="bg-gradient-to-br from-gray-700/20 to-gray-800/20 border-gray-500/30 hover:border-gray-400/50 transition-all duration-300 hover:scale-105 cursor-pointer"
                onClick={() => handleContactClick('twitter', '')}>
            <CardHeader className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-gray-600 to-gray-700 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                <Twitter className="w-8 h-8 text-white" />
              </div>
              <CardTitle className="text-gray-300 text-xl">X (Twitter)</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <p className="text-gray-300 mb-4">Noticias y actualizaciones</p>
              <div className="flex items-center justify-center gap-2 text-white font-semibold">
                <span>@fitzone</span>
                <ExternalLink className="w-4 h-4" />
              </div>
              <p className="text-sm text-gray-400 mt-2">Últimas noticias</p>
            </CardContent>
          </Card>

          {/* Facebook */}
          <Card className="bg-gradient-to-br from-blue-700/20 to-blue-800/20 border-blue-600/30 hover:border-blue-500/50 transition-all duration-300 hover:scale-105 cursor-pointer"
                onClick={() => handleContactClick('facebook', '')}>
            <CardHeader className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-blue-700 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                <Facebook className="w-8 h-8 text-white" />
              </div>
              <CardTitle className="text-blue-400 text-xl">Facebook</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <p className="text-gray-300 mb-4">Únete a nuestra comunidad</p>
              <div className="flex items-center justify-center gap-2 text-white font-semibold">
                <span>/fitzone</span>
                <ExternalLink className="w-4 h-4" />
              </div>
              <p className="text-sm text-gray-400 mt-2">Eventos y grupo</p>
            </CardContent>
          </Card>

          {/* Ubicación */}
          <Card className="bg-gradient-to-br from-red-900/20 to-orange-800/20 border-red-500/30 hover:border-red-400/50 transition-all duration-300 hover:scale-105">
            <CardHeader className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-red-500 to-orange-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                <MapPin className="w-8 h-8 text-white" />
              </div>
              <CardTitle className="text-red-400 text-xl">Ubicación</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <p className="text-gray-300 mb-4">Visítanos en persona</p>
              <div className="text-white font-semibold mb-2">
                Calle 123 #45-67
              </div>
              <div className="text-white font-semibold">
                Armenia, Colombia
              </div>
              <p className="text-sm text-gray-400 mt-2">Abierto todos los días</p>
            </CardContent>
          </Card>
        </div>

        {/* Sección de horarios */}
        <div className="mt-16 max-w-4xl mx-auto">
          <Card className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 border-gray-700/50">
            <CardHeader className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-yellow-500 to-orange-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                <Clock className="w-8 h-8 text-white" />
              </div>
              <CardTitle className="text-2xl text-white mb-4">Horarios de Atención</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-center">
                <div>
                  <h4 className="text-lg font-semibold text-red-400 mb-3">Gimnasio</h4>
                  <div className="space-y-2 text-gray-300">
                    <p><span className="font-medium">Lunes - Viernes:</span> 5:00 AM - 11:00 PM</p>
                    <p><span className="font-medium">Sábados:</span> 6:00 AM - 10:00 PM</p>
                    <p><span className="font-medium">Domingos:</span> 7:00 AM - 9:00 PM</p>
                  </div>
                </div>
                <div>
                  <h4 className="text-lg font-semibold text-red-400 mb-3">Atención al Cliente</h4>
                  <div className="space-y-2 text-gray-300">
                    <p><span className="font-medium">Lunes - Viernes:</span> 8:00 AM - 8:00 PM</p>
                    <p><span className="font-medium">Sábados:</span> 9:00 AM - 6:00 PM</p>
                    <p><span className="font-medium">Domingos:</span> 10:00 AM - 4:00 PM</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Call to action final */}
        <div className="mt-16 text-center">
          <h3 className="text-3xl font-bold text-white mb-4">
            ¿Listo para comenzar tu transformación?
          </h3>
          <p className="text-gray-400 mb-8 max-w-2xl mx-auto">
            Nuestro equipo está esperando para ayudarte a alcanzar tus objetivos de fitness.
          </p>
          <Link href="/register">
            <Button 
              size="lg"
              className="bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-700 hover:to-orange-700 text-white px-12 py-6 text-xl font-bold shadow-2xl transform hover:scale-105 transition-all duration-300"
            >
              <MessageCircle className="w-6 h-6 mr-3" />
              Únete Ahora
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}