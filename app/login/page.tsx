"use client"

import { useState } from "react"
import Link from "next/link"
import { FitZoneLogo } from "@/components/fitzone-logo"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Eye, EyeOff, AlertCircle } from "lucide-react"

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    email: "",
    password: ""
  })
  const [errors, setErrors] = useState({
    email: "",
    password: "",
    general: ""
  })

  // Función de validación
  const validateForm = () => {
    const newErrors = {
      email: "",
      password: "",
      general: ""
    }

    // Validar email
    if (!formData.email) {
      newErrors.email = "El email es requerido"
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Ingresa un email válido"
    }

    // Validar contraseña
    if (!formData.password) {
      newErrors.password = "La contraseña es requerida"
    } else if (formData.password.length < 6) {
      newErrors.password = "La contraseña debe tener al menos 6 caracteres"
    }

    setErrors(newErrors)
    return !newErrors.email && !newErrors.password
  }

  // Manejar envío del formulario
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) {
      return
    }

    setIsLoading(true)
    setErrors(prev => ({ ...prev, general: "" }))

    try {
      // Simular llamada a la API
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // Aquí iría tu lógica de autenticación real
      console.log('Datos de login:', formData)
      
      // Redirigir al dashboard o página principal
      // router.push('/dashboard')
      
    } catch (error) {
      setErrors(prev => ({ 
        ...prev, 
        general: "Error al iniciar sesión. Verifica tus credenciales." 
      }))
    } finally {
      setIsLoading(false)
    }
  }

  // Limpiar errores cuando el usuario escriba
  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    if (errors[field as keyof typeof errors]) {
      setErrors(prev => ({ ...prev, [field]: "" }))
    }
  }

  return (
    <div className="min-h-screen bg-black flex items-center justify-center px-4 py-8">
      <header className="absolute top-6 left-1/2 transform -translate-x-1/2">
        <FitZoneLogo />
      </header>

      <main className="w-full max-w-md mt-20">
        <Card className="bg-gray-800 border-gray-700">
          <CardContent className="p-8">
            <Link 
              href="/" 
              className="inline-flex items-center text-gray-400 hover:text-white mb-8 transition-colors"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Volver al inicio
            </Link>

            <h1 className="text-3xl font-bold text-red-500 text-center mb-8">Iniciar Sesión</h1>

            {errors.general && (
              <div className="mb-6 p-3 bg-red-600/20 border border-red-600/50 rounded-md flex items-center">
                <AlertCircle className="h-4 w-4 text-red-500 mr-2" />
                <span className="text-red-400 text-sm">{errors.general}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <Label htmlFor="email" className="text-gray-200">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                  className={`bg-gray-700 border-gray-600 text-white focus:border-red-500 ${
                    errors.email ? "border-red-500" : ""
                  }`}
                  placeholder="tu@email.com"
                />
                {errors.email && (
                  <p className="mt-1 text-sm text-red-400 flex items-center">
                    <AlertCircle className="h-3 w-3 mr-1" />
                    {errors.email}
                  </p>
                )}
              </div>

              <div>
                <Label htmlFor="password" className="text-gray-200">Contraseña</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={formData.password}
                    onChange={(e) => handleInputChange("password", e.target.value)}
                    className={`bg-gray-700 border-gray-600 text-white focus:border-red-500 pr-10 ${
                      errors.password ? "border-red-500" : ""
                    }`}
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
                {errors.password && (
                  <p className="mt-1 text-sm text-red-400 flex items-center">
                    <AlertCircle className="h-3 w-3 mr-1" />
                    {errors.password}
                  </p>
                )}
              </div>

              <div className="flex items-center justify-between">
                <Link href="/forgot-password" className="text-sm text-red-500 hover:underline">
                  ¿Olvidaste tu contraseña?
                </Link>
              </div>

              <Button
                type="submit"
                disabled={isLoading}
                className="w-full bg-red-600 hover:bg-red-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white font-semibold py-3"
              >
                {isLoading ? "Iniciando sesión..." : "Iniciar Sesión"}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-gray-400">
                ¿No tienes una cuenta?{" "}
                <Link href="/register" className="text-red-500 hover:underline">
                  Regístrate
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
