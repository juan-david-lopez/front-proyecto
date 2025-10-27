"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ArrowLeft, Lock, Eye, EyeOff, Loader2, CheckCircle2 } from "lucide-react"
import Link from "next/link"
import { FitZoneLogo } from "@/components/fitzone-logo"
import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { AuthGuard } from "@/components/auth-guard"
import authService from "@/services/authService"

export default function ResetPasswordPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const token = searchParams.get("token")

  const [formData, setFormData] = useState({
    password: "",
    confirmPassword: "",
  })
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [errors, setErrors] = useState<{ [key: string]: string }>({})
  const [success, setSuccess] = useState(false)

  useEffect(() => {
    // Verificar que haya un token
    if (!token) {
      setErrors({
        general: "Token de recuperación no válido o expirado. Por favor, solicita un nuevo enlace de recuperación."
      })
    }
  }, [token])

  const validatePassword = (password: string) => {
    if (password.length < 8) {
      return "La contraseña debe tener al menos 8 caracteres"
    }
    if (!/[A-Z]/.test(password)) {
      return "Debe incluir al menos una mayúscula"
    }
    if (!/[a-z]/.test(password)) {
      return "Debe incluir al menos una minúscula"
    }
    if (!/\d/.test(password)) {
      return "Debe incluir al menos un número"
    }
    if (!/[@$!%*?&]/.test(password)) {
      return "Debe incluir al menos un carácter especial (@$!%*?&)"
    }
    return ""
  }

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {}

    if (!formData.password) {
      newErrors.password = "La contraseña es requerida"
    } else {
      const passwordError = validatePassword(formData.password)
      if (passwordError) {
        newErrors.password = passwordError
      }
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "Confirma tu contraseña"
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Las contraseñas no coinciden"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!token) {
      setErrors({
        general: "Token no válido. Por favor, solicita un nuevo enlace de recuperación."
      })
      return
    }

    if (!validateForm()) {
      return
    }

    setIsLoading(true)
    setErrors({})

    try {
      console.log("[ResetPassword] Restableciendo contraseña con token")
      
      const response = await authService.resetPassword(token, formData.password)
      
      console.log("[ResetPassword] Respuesta:", response)

      if (response.success) {
        setSuccess(true)
        
        // Redirigir al login después de 3 segundos
        setTimeout(() => {
          router.push("/login")
        }, 3000)
      } else {
        setErrors({
          general: response.error || response.message || "Error al restablecer la contraseña"
        })
      }
    } catch (error: any) {
      console.error("[ResetPassword] Error:", error)
      
      let errorMessage = "Error al restablecer la contraseña. Intenta nuevamente."
      
      if (error.message) {
        if (error.message.includes("expired") || error.message.includes("expirado")) {
          errorMessage = "El enlace de recuperación ha expirado. Por favor, solicita uno nuevo."
        } else if (error.message.includes("invalid") || error.message.includes("inválido")) {
          errorMessage = "El enlace de recuperación no es válido. Por favor, solicita uno nuevo."
        } else if (error.message.includes("network") || error.message.includes("fetch")) {
          errorMessage = "Error de conexión. Verifica tu internet."
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
    
    // Limpiar errores cuando el usuario empieza a escribir
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }))
    }
    if (errors.general) {
      setErrors((prev) => ({ ...prev, general: "" }))
    }
  }

  const getPasswordStrength = (password: string) => {
    let strength = 0
    if (password.length >= 8) strength++
    if (/[A-Z]/.test(password)) strength++
    if (/[a-z]/.test(password)) strength++
    if (/\d/.test(password)) strength++
    if (/[@$!%*?&]/.test(password)) strength++
    
    return strength
  }

  const passwordStrength = getPasswordStrength(formData.password)

  return (
    <AuthGuard requireAuth={false}>
      <div className="min-h-screen bg-black flex items-center justify-center px-4">
        <header className="absolute top-6 left-1/2 transform -translate-x-1/2">
          <FitZoneLogo />
        </header>

        <main className="w-full max-w-md">
          <Card className="bg-gray-800 border-gray-700">
            <CardContent className="p-8">
              <Link href="/login" className="inline-block mb-8">
                <Button
                  variant="outline"
                  size="sm"
                  className="bg-red-600 hover:bg-red-700 border-red-600 text-white"
                >
                  <ArrowLeft className="w-4 h-4 mr-2" aria-hidden="true" />
                  VOLVER AL LOGIN
                </Button>
              </Link>

              <div className="text-center mb-8">
                <div className="w-16 h-16 bg-gradient-to-br from-red-500 to-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Lock className="w-8 h-8 text-white" />
                </div>
                <h1 className="text-3xl font-bold text-red-500 mb-2">
                  Restablecer Contraseña
                </h1>
                <p className="text-gray-400 text-sm">
                  Ingresa tu nueva contraseña
                </p>
              </div>

              {errors.general && (
                <div 
                  className="bg-red-900/50 border border-red-500 text-red-200 px-4 py-3 rounded mb-6" 
                  role="alert"
                >
                  {errors.general}
                </div>
              )}

              {success ? (
                <div className="text-center space-y-4">
                  <div className="bg-green-900/50 border border-green-500 text-green-200 px-4 py-6 rounded">
                    <CheckCircle2 className="w-12 h-12 mx-auto mb-3 text-green-400" />
                    <p className="font-medium text-lg mb-2">¡Contraseña actualizada!</p>
                    <p className="text-sm">
                      Tu contraseña ha sido restablecida exitosamente. 
                      Serás redirigido al login en unos segundos...
                    </p>
                  </div>
                  
                  <Button
                    onClick={() => router.push("/login")}
                    className="w-full bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white"
                  >
                    Ir al Login
                  </Button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Nueva Contraseña */}
                  <div className="space-y-2">
                    <Label htmlFor="password" className="text-white text-sm">
                      Nueva Contraseña
                    </Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                      <Input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        placeholder="Mínimo 8 caracteres"
                        value={formData.password}
                        onChange={(e) => handleInputChange("password", e.target.value)}
                        className={`bg-gray-700 border-gray-600 text-white pl-10 pr-10 focus:border-red-500 ${
                          errors.password ? "border-red-500" : ""
                        }`}
                        disabled={isLoading}
                        autoComplete="new-password"
                        aria-describedby={errors.password ? "password-error" : undefined}
                        aria-invalid={!!errors.password}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-300"
                        aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
                      >
                        {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                      </button>
                    </div>
                    {errors.password && (
                      <p id="password-error" className="text-red-400 text-xs" role="alert">
                        {errors.password}
                      </p>
                    )}
                    
                    {/* Indicador de seguridad */}
                    {formData.password && (
                      <div className="space-y-1">
                        <div className="flex gap-1">
                          {[...Array(5)].map((_, i) => (
                            <div
                              key={i}
                              className={`h-1 flex-1 rounded-full transition-colors ${
                                i < passwordStrength
                                  ? passwordStrength <= 2
                                    ? "bg-red-500"
                                    : passwordStrength <= 3
                                    ? "bg-yellow-500"
                                    : "bg-green-500"
                                  : "bg-gray-600"
                              }`}
                            />
                          ))}
                        </div>
                        <p className="text-xs text-gray-400">
                          {passwordStrength <= 2 && "Débil"}
                          {passwordStrength === 3 && "Media"}
                          {passwordStrength === 4 && "Fuerte"}
                          {passwordStrength === 5 && "Muy fuerte"}
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Confirmar Contraseña */}
                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword" className="text-white text-sm">
                      Confirmar Contraseña
                    </Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                      <Input
                        id="confirmPassword"
                        type={showConfirmPassword ? "text" : "password"}
                        placeholder="Repite tu contraseña"
                        value={formData.confirmPassword}
                        onChange={(e) => handleInputChange("confirmPassword", e.target.value)}
                        className={`bg-gray-700 border-gray-600 text-white pl-10 pr-10 focus:border-red-500 ${
                          errors.confirmPassword ? "border-red-500" : ""
                        }`}
                        disabled={isLoading}
                        autoComplete="new-password"
                        aria-describedby={errors.confirmPassword ? "confirm-error" : undefined}
                        aria-invalid={!!errors.confirmPassword}
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-300"
                        aria-label={showConfirmPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
                      >
                        {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                      </button>
                    </div>
                    {errors.confirmPassword && (
                      <p id="confirm-error" className="text-red-400 text-xs" role="alert">
                        {errors.confirmPassword}
                      </p>
                    )}
                  </div>

                  {/* Requisitos de la contraseña */}
                  <div className="bg-gray-700/50 p-4 rounded-lg">
                    <p className="text-white text-sm font-medium mb-2">La contraseña debe contener:</p>
                    <ul className="text-xs text-gray-400 space-y-1">
                      <li className={formData.password.length >= 8 ? "text-green-400" : ""}>
                        • Al menos 8 caracteres
                      </li>
                      <li className={/[A-Z]/.test(formData.password) ? "text-green-400" : ""}>
                        • Una letra mayúscula
                      </li>
                      <li className={/[a-z]/.test(formData.password) ? "text-green-400" : ""}>
                        • Una letra minúscula
                      </li>
                      <li className={/\d/.test(formData.password) ? "text-green-400" : ""}>
                        • Un número
                      </li>
                      <li className={/[@$!%*?&]/.test(formData.password) ? "text-green-400" : ""}>
                        • Un carácter especial (@$!%*?&)
                      </li>
                    </ul>
                  </div>

                  <Button
                    type="submit"
                    className="w-full bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white font-semibold py-3 rounded-lg transition-all duration-300 shadow-lg hover:shadow-red-500/50"
                    disabled={isLoading || !token}
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Restableciendo...
                      </>
                    ) : (
                      <>
                        <Lock className="w-4 h-4 mr-2" />
                        Restablecer Contraseña
                      </>
                    )}
                  </Button>
                </form>
              )}
            </CardContent>
          </Card>
        </main>
      </div>
    </AuthGuard>
  )
}
