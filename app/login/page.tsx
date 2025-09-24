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

    // Simulate API call
    try {
      await new Promise((resolve) => setTimeout(resolve, 1500))
      console.log("[v0] Login attempt:", formData)

      localStorage.setItem(
        "user",
        JSON.stringify({
          email: formData.email,
          isAuthenticated: true,
          loginTime: new Date().toISOString(),
        }),
      )

      router.push("/dashboard")
    } catch (error) {
      setErrors({ general: "Error al iniciar sesión. Intenta nuevamente." })
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
                  className="bg-red-600 hover:bg-red-700 border-red-600 text-white focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 focus:ring-offset-gray-800"
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

              <form onSubmit={handleSubmit} className="space-y-6" role="form" aria-labelledby="login-form">
                <div id="login-form" className="sr-only">
                  Formulario de inicio de sesión
                </div>

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
                    className={`bg-gray-700 border-gray-600 text-white placeholder:text-gray-400 focus:border-red-500 focus:ring-red-500 ${
                      errors.email ? "border-red-500" : ""
                    }`}
                    required
                    aria-describedby="email-help email-error"
                    autoComplete="email"
                  />
                  <div id="email-help" className="sr-only">
                    Ingresa tu dirección de correo electrónico registrada
                  </div>
                  {errors.email && (
                    <p id="email-error" className="text-red-400 text-sm" role="alert">
                      {errors.email}
                    </p>
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
                      className={`bg-gray-700 border-gray-600 text-white placeholder:text-gray-400 focus:border-red-500 focus:ring-red-500 pr-10 ${
                        errors.password ? "border-red-500" : ""
                      }`}
                      required
                      aria-describedby="password-help password-error"
                      autoComplete="current-password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white focus:outline-none focus:ring-2 focus:ring-red-500 rounded"
                      aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                  <div id="password-help" className="sr-only">
                    Ingresa tu contraseña
                  </div>
                  {errors.password && (
                    <p id="password-error" className="text-red-400 text-sm" role="alert">
                      {errors.password}
                    </p>
                  )}
                </div>

                <Button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-gray-600 hover:bg-gray-500 disabled:bg-gray-700 disabled:cursor-not-allowed text-white font-semibold py-3 mt-8 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 focus:ring-offset-gray-800"
                  aria-describedby="login-button-help"
                >
                  {isLoading ? "Iniciando sesión..." : "INICIAR SESIÓN"}
                </Button>
                <div id="login-button-help" className="sr-only">
                  Hacer clic para iniciar sesión con tus credenciales
                </div>
              </form>

              <nav className="text-center mt-6" aria-label="Enlaces de registro">
                <span className="text-gray-300">¿No tienes una cuenta? </span>
                <Link
                  href="/register"
                  className="text-red-500 hover:text-red-400 font-medium focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 focus:ring-offset-gray-800 rounded px-1"
                  aria-label="Ir a la página de registro"
                >
                  Regístrate aquí
                </Link>
              </nav>
            </CardContent>
          </Card>
        </main>
      </div>
    </AuthGuard>
  )
}
