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
      <div className="min-h-screen bg-background text-foreground">
        {/* Header */}
        <header className="flex items-center justify-between px-6 py-4 bg-background border-b border-border">
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
            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle className="text-xl font-semibold text-card-foreground">
                  Configuración de Accesibilidad
                </CardTitle>
                <p className="text-muted-foreground">
                  Personaliza la apariencia y el tamaño del texto para una mejor experiencia
                </p>
              </CardHeader>
              <CardContent>
                <AccessibilityControls />
              </CardContent>
            </Card>

            {/* Account Settings */}
            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle className="text-xl font-semibold text-card-foreground">Configuración de Cuenta</CardTitle>
                <p className="text-muted-foreground">Gestiona tu información personal y preferencias de cuenta</p>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button variant="outline" className="w-full justify-start bg-transparent">
                  Editar Perfil
                </Button>
                <Button variant="outline" className="w-full justify-start bg-transparent">
                  Cambiar Contraseña
                </Button>
                <Button variant="outline" className="w-full justify-start bg-transparent">
                  Notificaciones
                </Button>
                <Button variant="outline" className="w-full justify-start bg-transparent">
                  Privacidad
                </Button>
              </CardContent>
            </Card>

            {/* App Settings */}
            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle className="text-xl font-semibold text-card-foreground">
                  Configuración de la Aplicación
                </CardTitle>
                <p className="text-muted-foreground">Ajustes generales de la aplicación</p>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button variant="outline" className="w-full justify-start bg-transparent">
                  Idioma
                </Button>
                <Button variant="outline" className="w-full justify-start bg-transparent">
                  Zona Horaria
                </Button>
                <Button variant="outline" className="w-full justify-start bg-transparent">
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
