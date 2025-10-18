"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { AccessibilityControls } from "@/components/accessibility-controls"
import { AuthGuard } from "@/components/auth-guard"
import { BackButton } from "@/components/back-button"
import { User, Lock, Bell, Shield, Globe, Clock, Ruler } from "lucide-react"
import Link from "next/link"
import { useToast } from "@/hooks/use-toast"

export default function ConfiguracionPage() {
  const { success } = useToast()
  const [emailNotifications, setEmailNotifications] = useState(true)
  const [pushNotifications, setPushNotifications] = useState(true)
  const [reservationReminders, setReservationReminders] = useState(true)

  const handleChangePassword = () => {
    success(
      "Cambio de contraseña",
      "Se ha enviado un enlace a tu correo para cambiar la contraseña"
    )
  }

  const handleSaveNotifications = () => {
    success(
      "Configuración guardada",
      "Tus preferencias de notificación han sido actualizadas"
    )
  }

  return (
    <AuthGuard requireAuth={true}>
      <div className="min-h-screen bg-theme-primary text-theme-primary">
        {/* Header */}
        <header className="flex items-center justify-between px-6 py-4 bg-theme-primary border-b border-theme">
          <div className="flex items-center space-x-4">
            <BackButton href="/dashboard" label="Volver al Dashboard" />
            <h1 className="text-2xl font-bold">Configuración</h1>
          </div>
        </header>

        <div className="px-6 py-8 max-w-4xl mx-auto">
          <div className="space-y-8">
            {/* Accessibility Settings */}
            <Card className="card-theme border-theme">
              <CardHeader>
                <CardTitle className="text-xl font-semibold text-theme-primary flex items-center gap-2">
                  <Globe className="w-5 h-5 text-red-500" />
                  Configuración de Accesibilidad
                </CardTitle>
                <p className="text-theme-secondary">
                  Personaliza la apariencia y el tamaño del texto para una mejor experiencia
                </p>
              </CardHeader>
              <CardContent>
                <AccessibilityControls />
              </CardContent>
            </Card>

            {/* Profile Settings - Link to dedicated page */}
            <Card className="card-theme border-theme">
              <CardHeader>
                <CardTitle className="text-xl font-semibold text-theme-primary flex items-center gap-2">
                  <User className="w-5 h-5 text-blue-500" />
                  Perfil Personal
                </CardTitle>
                <p className="text-theme-secondary">Gestiona tu información personal y cuenta</p>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="bg-blue-600/10 border border-blue-600/30 rounded-lg p-4">
                  <p className="text-theme-secondary mb-4">
                    Edita tu nombre, correo, teléfono, dirección y otros datos personales en una página dedicada.
                  </p>
                  <Link href="/perfil">
                    <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white">
                      <User className="w-4 h-4 mr-2" />
                      Ir a Mi Perfil
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>

            {/* Password Settings */}
            <Card className="card-theme border-theme">
              <CardHeader>
                <CardTitle className="text-xl font-semibold text-theme-primary flex items-center gap-2">
                  <Lock className="w-5 h-5 text-yellow-500" />
                  Cambiar Contraseña
                </CardTitle>
                <p className="text-theme-secondary">Actualiza tu contraseña de acceso</p>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="current-password">Contraseña Actual</Label>
                  <Input
                    id="current-password"
                    type="password"
                    placeholder="••••••••"
                    className="bg-theme-primary border-theme"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="new-password">Nueva Contraseña</Label>
                  <Input
                    id="new-password"
                    type="password"
                    placeholder="••••••••"
                    className="bg-theme-primary border-theme"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirm-password">Confirmar Nueva Contraseña</Label>
                  <Input
                    id="confirm-password"
                    type="password"
                    placeholder="••••••••"
                    className="bg-theme-primary border-theme"
                  />
                </div>
                <Button 
                  onClick={handleChangePassword}
                  variant="outline"
                  className="w-full border-yellow-500 text-yellow-600 hover:bg-yellow-50"
                >
                  <Lock className="w-4 h-4 mr-2" />
                  Cambiar Contraseña
                </Button>
              </CardContent>
            </Card>

            {/* Notification Settings */}
            <Card className="card-theme border-theme">
              <CardHeader>
                <CardTitle className="text-xl font-semibold text-theme-primary flex items-center gap-2">
                  <Bell className="w-5 h-5 text-orange-500" />
                  Notificaciones
                </CardTitle>
                <p className="text-theme-secondary">Gestiona cómo quieres recibir notificaciones</p>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Notificaciones por Email</Label>
                    <p className="text-sm text-theme-secondary">Recibe actualizaciones en tu correo</p>
                  </div>
                  <Switch
                    checked={emailNotifications}
                    onCheckedChange={setEmailNotifications}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Notificaciones Push</Label>
                    <p className="text-sm text-theme-secondary">Alertas en tiempo real</p>
                  </div>
                  <Switch
                    checked={pushNotifications}
                    onCheckedChange={setPushNotifications}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Recordatorios de Reservas</Label>
                    <p className="text-sm text-theme-secondary">Avisos antes de tus clases</p>
                  </div>
                  <Switch
                    checked={reservationReminders}
                    onCheckedChange={setReservationReminders}
                  />
                </div>
                <Button 
                  onClick={handleSaveNotifications}
                  className="w-full bg-red-600 hover:bg-red-700 text-white"
                >
                  <Check className="w-4 h-4 mr-2" />
                  Guardar Preferencias
                </Button>
              </CardContent>
            </Card>

            {/* Privacy Settings */}
            <Card className="card-theme border-theme">
              <CardHeader>
                <CardTitle className="text-xl font-semibold text-theme-primary flex items-center gap-2">
                  <Shield className="w-5 h-5 text-green-500" />
                  Privacidad y Seguridad
                </CardTitle>
                <p className="text-theme-secondary">Controla tu privacidad y datos</p>
              </CardHeader>
              <CardContent className="space-y-4">
                <Link href="/privacidad">
                  <Button variant="outline" className="w-full justify-start bg-transparent border-theme text-theme-primary hover:bg-theme-secondary/20">
                    <Shield className="w-4 h-4 mr-2" />
                    Política de Privacidad
                  </Button>
                </Link>
                <Link href="/terminos">
                  <Button variant="outline" className="w-full justify-start bg-transparent border-theme text-theme-primary hover:bg-theme-secondary/20">
                    <Shield className="w-4 h-4 mr-2" />
                    Términos y Condiciones
                  </Button>
                </Link>
                <Button 
                  variant="outline" 
                  className="w-full justify-start bg-transparent border-theme text-theme-primary hover:bg-theme-secondary/20"
                  onClick={() => success(
                    "Descarga iniciada",
                    "Tus datos serán enviados a tu correo"
                  )}
                >
                  <Shield className="w-4 h-4 mr-2" />
                  Descargar Mis Datos
                </Button>
              </CardContent>
            </Card>

            {/* App Settings */}
            <Card className="card-theme border-theme">
              <CardHeader>
                <CardTitle className="text-xl font-semibold text-theme-primary flex items-center gap-2">
                  <Clock className="w-5 h-5 text-purple-500" />
                  Configuración de la Aplicación
                </CardTitle>
                <p className="text-theme-secondary">Ajustes generales de la aplicación</p>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Idioma</Label>
                  <select className="w-full p-2 rounded-md border border-theme bg-theme-primary">
                    <option>Español</option>
                    <option>English</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <Label>Zona Horaria</Label>
                  <select className="w-full p-2 rounded-md border border-theme bg-theme-primary">
                    <option>América/Bogotá (GMT-5)</option>
                    <option>América/New_York (GMT-5)</option>
                    <option>Europa/Madrid (GMT+1)</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <Label>Unidades de Medida</Label>
                  <select className="w-full p-2 rounded-md border border-theme bg-theme-primary">
                    <option>Métrico (kg, cm)</option>
                    <option>Imperial (lb, in)</option>
                  </select>
                </div>
                <Button 
                  className="w-full bg-red-600 hover:bg-red-700 text-white"
                  onClick={() => success(
                    "Configuración guardada",
                    "Las preferencias de la aplicación han sido actualizadas"
                  )}
                >
                  <Check className="w-4 h-4 mr-2" />
                  Guardar Configuración
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </AuthGuard>
  )
}
