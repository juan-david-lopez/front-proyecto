"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { User, BarChart3, CreditCard, Settings, Calendar, Clock, Flame, MapPin, LogOut, X } from "lucide-react"
import { AuthGuard } from "@/components/auth-guard"

export default function DashboardPage() {
  const router = useRouter()

  const handleLogout = () => {
    localStorage.removeItem("user")
    router.push("/")
  }

  const currentDate = new Date().toLocaleDateString("es-ES", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  })

  return (
    <AuthGuard requireAuth={true}>
      <div className="min-h-screen bg-black text-white">
        {/* Header */}
        <header className="flex items-center justify-between px-6 py-4 bg-black border-b border-gray-800">
          <div className="flex items-center space-x-4">
            <div className="w-10 h-10 bg-red-600 rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-lg">U</span>
            </div>
            <h1 className="text-xl font-semibold">¡Hola, Usuario!</h1>
          </div>

          <Button
            onClick={handleLogout}
            variant="outline"
            className="border-red-600 text-red-600 hover:bg-red-600 hover:text-white bg-transparent"
          >
            <LogOut className="w-4 h-4 mr-2" />
            Cerrar Sesión
          </Button>
        </header>

        <div className="px-6 py-8 space-y-8">
          {/* Membership Status */}
          <section>
            <h2 className="text-2xl font-bold text-red-500 mb-4">Estado de Membresía</h2>
            <Card className="bg-gray-900 border-gray-700">
              <CardContent className="p-6">
                <div className="flex items-start space-x-4">
                  <div className="w-8 h-8 bg-red-600 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <X className="w-4 h-4 text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold text-white mb-2">Sin Membresía Activa</h3>
                    <p className="text-gray-400 mb-4">Adquiere una membresía para acceder a todos los beneficios</p>
                    <Link href="/membresias">
                      <Button className="bg-red-600 hover:bg-red-700 text-white">Adquirir Membresía</Button>
                    </Link>
                  </div>
                </div>
              </CardContent>
            </Card>
          </section>

          {/* Quick Actions */}
          <section>
            <h2 className="text-2xl font-bold text-red-500 mb-6">Acciones Rápidas</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card className="bg-gray-900 border-gray-700 hover:bg-gray-800 transition-colors cursor-pointer">
                <CardContent className="p-6 text-center">
                  <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center mx-auto mb-4">
                    <User className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-lg font-semibold text-white mb-2">Mi Perfil</h3>
                  <p className="text-gray-400 text-sm">Configurar información personal</p>
                </CardContent>
              </Card>

              <Card className="bg-gray-900 border-red-600 border-2 hover:bg-gray-800 transition-colors cursor-pointer">
                <CardContent className="p-6 text-center">
                  <div className="w-12 h-12 bg-green-600 rounded-lg flex items-center justify-center mx-auto mb-4">
                    <BarChart3 className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-lg font-semibold text-white mb-2">Estadísticas</h3>
                  <p className="text-gray-400 text-sm">Ver progreso y métricas</p>
                </CardContent>
              </Card>

              <Card className="bg-gray-900 border-gray-700 hover:bg-gray-800 transition-colors cursor-pointer">
                <CardContent className="p-6 text-center">
                  <div className="w-12 h-12 bg-orange-600 rounded-lg flex items-center justify-center mx-auto mb-4">
                    <CreditCard className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-lg font-semibold text-white mb-2">Membresías</h3>
                  <p className="text-gray-400 text-sm">Gestionar planes y pagos</p>
                </CardContent>
              </Card>

              <Card className="bg-gray-900 border-gray-700 hover:bg-gray-800 transition-colors cursor-pointer">
                <CardContent className="p-6 text-center">
                  <div className="w-12 h-12 bg-gray-600 rounded-lg flex items-center justify-center mx-auto mb-4">
                    <Settings className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-lg font-semibold text-white mb-2">Configuración</h3>
                  <p className="text-gray-400 text-sm">Ajustes de la aplicación</p>
                </CardContent>
              </Card>
            </div>
          </section>

          {/* Today's Statistics */}
          <section>
            <h2 className="text-2xl font-bold text-red-500 mb-2">Estadísticas de Hoy</h2>
            <p className="text-gray-400 mb-6 capitalize">{currentDate}</p>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card className="bg-gray-900 border-gray-700">
                <CardContent className="p-6">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center">
                      <Calendar className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-white">1</div>
                      <div className="text-gray-400 text-sm">Entrenamientos</div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gray-900 border-gray-700">
                <CardContent className="p-6">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-orange-600 rounded-lg flex items-center justify-center">
                      <Clock className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-white">45min</div>
                      <div className="text-gray-400 text-sm">Tiempo Entrenado</div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gray-900 border-gray-700">
                <CardContent className="p-6">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-red-600 rounded-lg flex items-center justify-center">
                      <Flame className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-white">320</div>
                      <div className="text-gray-400 text-sm">Calorías Quemadas</div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gray-900 border-gray-700">
                <CardContent className="p-6">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-green-600 rounded-lg flex items-center justify-center">
                      <MapPin className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-white">1</div>
                      <div className="text-gray-400 text-sm">Visitas al Gimnasio</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </section>
        </div>
      </div>
    </AuthGuard>
  )
}
