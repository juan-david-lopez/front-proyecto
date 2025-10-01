"use client"

import type React from "react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Eye, EyeOff, Mail, Lock, AlertCircle, CheckCircle, Loader2 } from "lucide-react"
import Link from "next/link"
import { FitZoneLogo } from "@/components/fitzone-logo"
import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { AuthGuard } from "@/components/auth-guard"
import { useAuth } from "@/contexts/auth-context"
import authService from "@/services/authService"
import { clearLoginFormData } from "@/utils/auth-storage"

export default function LoginPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  
  // Verificar si el usuario viene de verificación exitosa
  const isVerified = searchParams.get("verified") === "true"
  
  // Usar el hook de manera segura
  let login = async (email: string, password: string): Promise<{ success: boolean; error?: string; requiresOtp?: boolean; message?: string }> => ({ success: false, error: "Auth not available" })
  let getRedirectPath = () => "/dashboard"
  
  try {
    const auth = useAuth()
    login = auth.login
    getRedirectPath = auth.getRedirectPath
  } catch (error) {
    // Manejar el caso donde el AuthProvider no está disponible aún
    console.warn("Login page: AuthProvider no disponible aún")
  }
  
  const [showPassword, setShowPassword] = useState(false)
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  })
  const [errors, setErrors] = useState<{ [key: string]: string }>({})
  const [isLoading, setIsLoading] = useState(false)
  const [fieldTouched, setFieldTouched] = useState<{ [key: string]: boolean }>({})
  const [loginAttempts, setLoginAttempts] = useState(0)

  // Limpiar datos de formularios anteriores al cargar la página
  useEffect(() => {
    clearLoginFormData()
    
    // Limpiar el formulario actual y todos los estados
    setFormData({
      email: "",
      password: ""
    })
    setIsLoading(false) // Reset del estado de carga
    setFieldTouched({}) // Reset de campos tocados
    setLoginAttempts(0) // Reset de intentos de login
    
    // Mostrar mensaje si viene de verificación
    if (isVerified) {
      setErrors({
        success: "¡Verificación completada! Ahora inicia sesión con tu contraseña."
      })
    } else {
      setErrors({}) // Limpiar errores si no viene de verificación
    }
  }, [isVerified])

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }

  const getFieldValidationState = (field: string) => {
    if (!fieldTouched[field]) return 'none'
    if (errors[field]) return 'error'
    if (field === 'email' && formData.email && validateEmail(formData.email)) return 'success'
    if (field === 'password' && formData.password && formData.password.length >= 6) return 'success'
    return 'none'
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
      // Marcar todos los campos como tocados para mostrar errores
      setFieldTouched({ email: true, password: true })
      return
    }

    setIsLoading(true)
    setErrors({})
    setLoginAttempts(prev => prev + 1)

    try {
      console.log("[FitZone] Intentando login para:", formData.email)
      
      // Simular delay mínimo para mejor UX
      const loginPromise = login(formData.email, formData.password)
      const minDelayPromise = new Promise(resolve => setTimeout(resolve, 800))
      
      const [result] = await Promise.all([loginPromise, minDelayPromise])
      
      if (result.success) {
        if (result.requiresOtp) {
          // Redirigir a verificación OTP para login
          console.log("[FitZone] Login exitoso, redirigiendo a verificación OTP")
          
          setErrors({ success: result.message || "¡Credenciales válidas! Redirigiendo a verificación..." })
          
          setTimeout(() => {
            router.push(`/verify-otp?type=login&email=${encodeURIComponent(formData.email)}`)
          }, 1000)
        } else {
          // Login completo sin OTP (caso excepcional)
          console.log("[FitZone] Login completamente exitoso - redirigiendo")
          
          // Limpiar el formulario después del login exitoso
          setFormData({ email: "", password: "" })
          setFieldTouched({})
          
          // Simular success state antes de redirigir
          setErrors({ success: "¡Login exitoso! Redirigiendo..." })
          
          setTimeout(() => {
            const redirectPath = getRedirectPath()
            router.push(redirectPath)
          }, 1000)
        }
      } else {
        // Incrementar intentos fallidos
        setFormData(prev => ({ ...prev, password: "" }))
        setFieldTouched(prev => ({ ...prev, password: false }))
        
        let errorMessage = result.error || "Credenciales incorrectas"
        if (loginAttempts >= 2) {
          errorMessage += " • ¿Olvidaste tu contraseña?"
        }
        
        setErrors({ general: errorMessage })
      }
    } catch (error: any) {
      console.error("[FitZone] Error en login:", error)
      
      let errorMessage = "Error al iniciar sesión. Intenta nuevamente."
      
      if (error.message) {
        if (error.message.includes("Credenciales inválidas") || error.message.includes("401")) {
          errorMessage = "Credenciales incorrectas. Verifica tu email y contraseña."
        } else if (error.message.includes("network") || error.message.includes("fetch")) {
          errorMessage = "Error de conexión. Verifica tu conexión a internet."
        } else if (error.message.includes("404")) {
          errorMessage = "Servicio no disponible temporalmente."
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
    setFieldTouched((prev) => ({ ...prev, [field]: true }))
    
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
      <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black text-white">
        {/* Header mejorado */}
        <header className="absolute top-6 left-6 right-6 z-10">
          <div className="flex items-center justify-between">
            <Link href="/" className="group flex items-center gap-2 text-white/80 hover:text-white transition-all duration-300">
              <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
              <span className="font-medium">Volver al inicio</span>
            </Link>
            <FitZoneLogo 
              size="lg" 
              variant="light" 
              href="/"
            />
          </div>
        </header>

        {/* Main content con layout mejorado */}
        <div className="min-h-screen flex items-center justify-center p-6 pt-24">
          <div className="w-full max-w-md">
            <Card className="bg-gradient-to-b from-gray-800/80 to-gray-900/80 border-gray-700/50 backdrop-blur-sm shadow-2xl">
              <CardHeader className="text-center pb-2">
                <div className="mx-auto w-16 h-16 bg-gradient-to-br from-red-600 to-red-700 rounded-full flex items-center justify-center mb-4 shadow-lg">
                  <Lock className="w-8 h-8 text-white" />
                </div>
                <CardTitle className="text-2xl font-bold text-white mb-2">
                  Bienvenido de nuevo
                </CardTitle>
                <p className="text-gray-400 text-sm">
                  Inicia sesión para acceder a tu cuenta
                </p>
              </CardHeader>
              
              <CardContent className="p-6 pt-2">
                {/* Messages con mejor diseño */}
                {errors.success && (
                  <div className="bg-green-900/30 border border-green-500/30 text-green-300 px-4 py-3 rounded-lg mb-6 flex items-center gap-3" role="alert">
                    <CheckCircle className="w-5 h-5 flex-shrink-0" />
                    <span>{errors.success}</span>
                  </div>
                )}
                
                {errors.general && !errors.success && (
                  <div className="bg-red-900/30 border border-red-500/30 text-red-300 px-4 py-3 rounded-lg mb-6 flex items-center gap-3" role="alert">
                    <AlertCircle className="w-5 h-5 flex-shrink-0" />
                    <span>{errors.general}</span>
                  </div>
                )}
                
                {loginAttempts >= 3 && !errors.success && (
                  <div className="bg-yellow-900/30 border border-yellow-500/30 text-yellow-300 px-4 py-3 rounded-lg mb-6 flex items-center gap-3">
                    <AlertCircle className="w-5 h-5 flex-shrink-0" />
                    <div className="text-sm">
                      <p className="font-medium">¿Tienes problemas para acceder?</p>
                      <p className="text-yellow-400/80 mt-1">Contacta al administrador o verifica tus credenciales</p>
                    </div>
                  </div>
                )}

                <form 
                  onSubmit={handleSubmit} 
                  className="space-y-6"
                  autoComplete="off"
                  noValidate
                  data-form-type="other"
                >
                  {/* Email Field mejorado */}
                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-white text-sm font-medium flex items-center gap-2">
                      <Mail className="w-4 h-4" />
                      Correo Electrónico
                    </Label>
                    <div className="relative">
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        placeholder="tu@email.com"
                        value={formData.email}
                        onChange={(e) => handleInputChange("email", e.target.value)}
                        className={`bg-gray-700/50 border-gray-600 text-white placeholder:text-gray-400 focus:border-red-500 transition-colors pl-4 ${
                          getFieldValidationState('email') === 'error' ? "border-red-500" : 
                          getFieldValidationState('email') === 'success' ? "border-green-500" : ""
                        }`}
                        required
                        autoComplete="off"
                        autoCorrect="off"
                        autoCapitalize="off"
                        spellCheck={false}
                        data-form-type="other"
                        disabled={isLoading}
                      />
                      {getFieldValidationState('email') === 'success' && (
                        <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                          <CheckCircle className="w-5 h-5 text-green-500" />
                        </div>
                      )}
                    </div>
                    {errors.email && (
                      <p className="text-red-400 text-sm flex items-center gap-1">
                        <AlertCircle className="w-4 h-4" />
                        {errors.email}
                      </p>
                    )}
                  </div>

                  {/* Password Field mejorado */}
                  <div className="space-y-2">
                    <Label htmlFor="password" className="text-white text-sm font-medium flex items-center gap-2">
                      <Lock className="w-4 h-4" />
                      Contraseña
                    </Label>
                    <div className="relative">
                      <Input
                        id="password"
                        name="password"
                        type={showPassword ? "text" : "password"}
                        placeholder="Ingresa tu contraseña"
                        value={formData.password}
                        onChange={(e) => handleInputChange("password", e.target.value)}
                        className={`bg-gray-700/50 border-gray-600 text-white placeholder:text-gray-400 focus:border-red-500 pr-20 transition-colors ${
                          getFieldValidationState('password') === 'error' ? "border-red-500" : 
                          getFieldValidationState('password') === 'success' ? "border-green-500" : ""
                        }`}
                        required
                        autoComplete="new-password"
                        autoCorrect="off"
                        autoCapitalize="off"
                        spellCheck={false}
                        data-form-type="other"
                        disabled={isLoading}
                      />
                      <div className="absolute right-3 top-1/2 transform -translate-y-1/2 flex items-center gap-1">
                        {getFieldValidationState('password') === 'success' && (
                          <CheckCircle className="w-4 h-4 text-green-500" />
                        )}
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="text-gray-400 hover:text-white transition-colors p-1"
                          disabled={isLoading}
                          aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
                        >
                          {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>
                    {errors.password && (
                      <p className="text-red-400 text-sm flex items-center gap-1">
                        <AlertCircle className="w-4 h-4" />
                        {errors.password}
                      </p>
                    )}
                    {formData.password && formData.password.length > 0 && formData.password.length < 6 && (
                      <p className="text-yellow-400 text-sm flex items-center gap-1">
                        <AlertCircle className="w-4 h-4" />
                        Mínimo 6 caracteres
                      </p>
                    )}
                  </div>

                  <Button
                    type="submit"
                    disabled={isLoading}
                    className="w-full bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold py-4 text-lg transition-all duration-300 transform hover:scale-[1.02] mt-8 shadow-lg"
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin mr-2" />
                        Iniciando sesión...
                      </>
                    ) : (
                      <>
                        <Lock className="w-5 h-5 mr-2" />
                        INICIAR SESIÓN
                      </>
                    )}
                  </Button>
                </form>

                <div className="text-center mt-6">
                  <Link
                    href="/register"
                    className="text-gray-400 hover:text-white text-sm transition-colors"
                  >
                    ¿No tienes cuenta? <span className="text-red-400 hover:text-red-300 font-medium">Regístrate aquí</span>
                  </Link>
                </div>

                <div className="text-center mt-4">
                  <Link
                    href="/forgot-password"
                    className="text-red-500 hover:text-red-400 text-sm transition-colors"
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

              {/* Credenciales de demostración */}
              <div className="mt-6 p-4 bg-gray-700 rounded">
                <h3 className="text-white font-medium mb-3 text-center">🎭 Credenciales Demo</h3>
                <div className="space-y-2 text-xs text-gray-300">
                  <div className="flex justify-between items-center p-2 bg-gray-600 rounded">
                    <span><strong>Administrador:</strong></span>
                    <button 
                      type="button"
                      onClick={() => {
                        setFormData({ email: "admin@fitzone.com", password: "admin123" })
                        setErrors({})
                      }}
                      className="text-red-400 hover:text-red-300"
                    >
                      admin@fitzone.com / admin123
                    </button>
                  </div>
                  <div className="flex justify-between items-center p-2 bg-gray-600 rounded">
                    <span><strong>Recepcionista:</strong></span>
                    <button 
                      type="button"
                      onClick={() => {
                        setFormData({ email: "recepcion@fitzone.com", password: "recep123" })
                        setErrors({})
                      }}
                      className="text-red-400 hover:text-red-300"
                    >
                      recepcion@fitzone.com / recep123
                    </button>
                  </div>
                  <div className="flex justify-between items-center p-2 bg-gray-600 rounded">
                    <span><strong>Instructor:</strong></span>
                    <button 
                      type="button"
                      onClick={() => {
                        setFormData({ email: "instructor@fitzone.com", password: "inst123" })
                        setErrors({})
                      }}
                      className="text-red-400 hover:text-red-300"
                    >
                      instructor@fitzone.com / inst123
                    </button>
                  </div>
                  <div className="flex justify-between items-center p-2 bg-gray-600 rounded">
                    <span><strong>Cliente:</strong></span>
                    <button 
                      type="button"
                      onClick={() => {
                        setFormData({ email: "demo@fitzone.com", password: "123456" })
                        setErrors({})
                      }}
                      className="text-red-400 hover:text-red-300"
                    >
                      demo@fitzone.com / 123456
                    </button>
                  </div>
                </div>
                <p className="text-xs text-gray-400 mt-2 text-center">
                  Haz clic en cualquier credencial para autocompletarlas
                </p>
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
          </div>
        </div>
      </div>
    </AuthGuard>
  )
}