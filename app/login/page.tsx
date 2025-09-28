"use client"

import type React from "react"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ArrowLeft, Eye, EyeOff } from "lucide-react"
import Link from "next/link"
import { FitZoneLogo } from "@/components/fitzone-logo"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { AuthGuard } from "@/components/auth-guard"
import authService from "@/services/authService"

export default function LoginPage() {
  const router = useRouter()
  const [showPassword, setShowPassword] = useState(false)
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  })
  const [errors, setErrors] = useState<{ [key: string]: string }>({})
  const [isLoading, setIsLoading] = useState(false)

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {}

    if (!formData.email.trim()) {
      newErrors.email = "El correo electrónico es requerido"
    } else if (!validateEmail(formData.email)) {
      newErrors.email = "Ingresa un correo electrónico válido"
    }

    if (!formData.password.trim()) {
      newErrors.password = "La contraseña es requerida"
    } else if (formData.password.length < 6) {
      newErrors.password = "La contraseña debe tener al menos 6 caracteres"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    setIsLoading(true)
    setErrors({})

    try {
      console.log("[FitZone] Intentando login para:", formData.email)
      
      // Llamar al backend real usando el servicio
      const response = await authService.login(formData.email, formData.password)
      console.log("[FitZone] Respuesta del login:", response)
      
      // El backend debería responder con success: true cuando el OTP se envía correctamente
      if (response.success) {
        console.log("[FitZone] Login exitoso, se requiere OTP")
        
        // Guardar email temporalmente para la verificación OTP
        localStorage.setItem("pendingLogin", formData.email)

        // Redirigir a verificación OTP con el contexto de login
        router.push(`/verify-otp?email=${encodeURIComponent(formData.email)}&type=login`)
      } else {
        // Respuesta inesperada del servidor
        setErrors({ general: response.error || "Error en el servidor. Intenta nuevamente." })
      }
    } catch (error: any) {
      console.error("[FitZone] Error en login:", error)
      
      // Mapear errores específicos del backend
      let errorMessage = "Error al iniciar sesión. Intenta nuevamente."
      
      if (error.message) {
        if (error.message.includes("Credenciales inválidas") || error.message.includes("401")) {
          errorMessage = "Credenciales incorrectas. Verifica tu email y contraseña."
        } else if (error.message.includes("network") || error.message.includes("fetch")) {
          errorMessage = "Error de conexión. Verifica tu conexión a internet y que el backend esté corriendo."
        } else if (error.message.includes("404")) {
          errorMessage = "Endpoint no encontrado. Verifica la configuración del backend."
        } else if (error.message.includes("500")) {
          errorMessage = "Error interno del servidor. Intenta más tarde."
        } else {
          errorMessage = error.message
        }
      }
      
      setErrors({ general: errorMessage })
    } finally {
      setIsLoading(false)
    }
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }))
    }
    // Clear general error when user modifies any field
    if (errors.general) {
      setErrors((prev) => ({ ...prev, general: "" }))
    }
  }

  return (
    <AuthGuard requireAuth={false}>
      <div className="min-h-screen bg-black flex items-center justify-center px-4">
        <header className="absolute top-6 left-1/2 transform -translate-x-1/2">
          <FitZoneLogo />
        </header>

        <main className="w-full max-w-md">
          <Card className="bg-gray-800 border-gray-700">
            <CardContent className="p-8">
              <Link href="/" className="inline-block mb-8" aria-label="Volver a la página principal">
                <Button
                  variant="outline"
                  size="sm"
                  className="bg-red-600 hover:bg-red-700 border-red-600 text-white"
                >
                  <ArrowLeft className="w-4 h-4 mr-2" aria-hidden="true" />
                  VOLVER
                </Button>
              </Link>

              <h1 className="text-3xl font-bold text-red-500 text-center mb-8">Iniciar Sesión</h1>

              {errors.general && (
                <div className="bg-red-900/50 border border-red-500 text-red-200 px-4 py-3 rounded mb-6" role="alert">
                  {errors.general}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Email Field */}
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-white text-sm">
                    Correo Electrónico
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="tu@email.com"
                    value={formData.email}
                    onChange={(e) => handleInputChange("email", e.target.value)}
                    className={`bg-gray-700 border-gray-600 text-white placeholder:text-gray-400 focus:border-red-500 ${
                      errors.email ? "border-red-500" : ""
                    }`}
                    required
                    autoComplete="email"
                    disabled={isLoading}
                  />
                  {errors.email && (
                    <p className="text-red-400 text-sm">{errors.email}</p>
                  )}
                </div>

                {/* Password Field */}
                <div className="space-y-2">
                  <Label htmlFor="password" className="text-white text-sm">
                    Contraseña
                  </Label>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="********"
                      value={formData.password}
                      onChange={(e) => handleInputChange("password", e.target.value)}
                      className={`bg-gray-700 border-gray-600 text-white placeholder:text-gray-400 focus:border-red-500 pr-10 ${
                        errors.password ? "border-red-500" : ""
                      }`}
                      required
                      autoComplete="current-password"
                      disabled={isLoading}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
                      disabled={isLoading}
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                  {errors.password && (
                    <p className="text-red-400 text-sm">{errors.password}</p>
                  )}
                </div>

                <Button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-red-600 hover:bg-red-700 disabled:bg-red-800 text-white font-semibold py-3 mt-8"
                >
                  {isLoading ? "Iniciando sesión..." : "INICIAR SESIÓN"}
                </Button>
              </form>

              <div className="text-center mt-6">
                <Link
                  href="/forgot-password"
                  className="text-red-500 hover:text-red-400 text-sm"
                >
                  ¿Olvidaste tu contraseña?
                </Link>
              </div>

              <div className="text-center mt-4">
                <span className="text-gray-300">¿No tienes una cuenta? </span>
                <Link
                  href="/register"
                  className="text-red-500 hover:text-red-400 font-medium"
                >
                  Regístrate aquí
                </Link>
              </div>

              {/* Información de debug (solo en desarrollo) */}
              {process.env.NODE_ENV === 'development' && (
                <div className="mt-6 p-3 bg-gray-700 rounded text-xs text-gray-300">
                  <p>🔧 Modo desarrollo</p>
                  <p>Backend: {typeof window !== 'undefined' ? 
                    window.location.hostname === 'localhost' ? 
                    'http://localhost:8080' : 'https://desplieguefitzone.onrender.com' : 
                    'Verificando...'}</p>
                </div>
              )}
            </CardContent>
          </Card>
        </main>
      </div>
    </AuthGuard>
  )
}