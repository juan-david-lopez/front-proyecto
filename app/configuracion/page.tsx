"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { AccessibilityControls } from "@/components/accessibility-controls"
import { AuthGuard } from "@/components/auth-guard"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"

export default function ConfiguracionPage() {
  return (
    <AuthGuard requireAuth={true}>
      <div className="min-h-screen bg-theme-primary text-theme-primary">
        {/* Header */}
        <header className="flex items-center justify-between px-6 py-4 bg-theme-primary border-b border-theme">
          <div className="flex items-center space-x-4">
            <Link href="/dashboard">
              <Button variant="ghost" size="sm" className="p-2" aria-label="Volver al dashboard">
                <ArrowLeft className="h-4 w-4" />
              </Button>
            </Link>
            <h1 className="text-2xl font-bold">Configuración</h1>
          </div>
        </header>

        <div className="px-6 py-8 max-w-4xl mx-auto">
          <div className="space-y-8">
            {/* Accessibility Settings */}
            <Card className="card-theme border-theme">
              <CardHeader>
                <CardTitle className="text-xl font-semibold text-theme-primary">
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

            {/* Account Settings */}
            <Card className="card-theme border-theme">
              <CardHeader>
                <CardTitle className="text-xl font-semibold text-theme-primary">Configuración de Cuenta</CardTitle>
                <p className="text-theme-secondary">Gestiona tu información personal y preferencias de cuenta</p>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button variant="outline" className="w-full justify-start bg-transparent border-theme text-theme-primary hover:bg-theme-secondary/20">
                  Editar Perfil
                </Button>
                <Button variant="outline" className="w-full justify-start bg-transparent border-theme text-theme-primary hover:bg-theme-secondary/20">
                  Cambiar Contraseña
                </Button>
                <Button variant="outline" className="w-full justify-start bg-transparent border-theme text-theme-primary hover:bg-theme-secondary/20">
                  Notificaciones
                </Button>
                <Button variant="outline" className="w-full justify-start bg-transparent border-theme text-theme-primary hover:bg-theme-secondary/20">
                  Privacidad
                </Button>
              </CardContent>
            </Card>

            {/* App Settings */}
            <Card className="card-theme border-theme">
              <CardHeader>
                <CardTitle className="text-xl font-semibold text-theme-primary">
                  Configuración de la Aplicación
                </CardTitle>
                <p className="text-theme-secondary">Ajustes generales de la aplicación</p>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button variant="outline" className="w-full justify-start bg-transparent border-theme text-theme-primary hover:bg-theme-secondary/20">
                  Idioma
                </Button>
                <Button variant="outline" className="w-full justify-start bg-transparent border-theme text-theme-primary hover:bg-theme-secondary/20">
                  Zona Horaria
                </Button>
                <Button variant="outline" className="w-full justify-start bg-transparent border-theme text-theme-primary hover:bg-theme-secondary/20">
                  Unidades de Medida
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </AuthGuard>
  )
}
