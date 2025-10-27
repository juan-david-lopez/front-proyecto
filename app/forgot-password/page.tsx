"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ArrowLeft, Mail, Loader2 } from "lucide-react"
import Link from "next/link"
import { FitZoneLogo } from "@/components/fitzone-logo"
import { useState } from "react"
import { AuthGuard } from "@/components/auth-guard"
import authService from "@/services/authService"

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setSuccess("")

    // Validación
    if (!email.trim()) {
      setError("El correo electrónico es requerido")
      return
    }

    if (!validateEmail(email)) {
      setError("Ingresa un correo electrónico válido")
      return
    }

    setIsLoading(true)

    try {
      console.log("[ForgotPassword] Solicitando recuperación para:", email)
      
      const response = await authService.forgotPassword(email)
      
      console.log("[ForgotPassword] Respuesta:", response)

      if (response.success) {
        setSuccess(
          "Te hemos enviado un correo electrónico con las instrucciones para recuperar tu contraseña. " +
          "Por favor, revisa tu bandeja de entrada y sigue el enlace."
        )
        setEmail("")
      } else {
        setError(response.error || response.message || "Error al procesar la solicitud")
      }
    } catch (error: any) {
      console.error("[ForgotPassword] Error:", error)
      
      let errorMessage = "Error al enviar el correo de recuperación. Intenta nuevamente."
      
      if (error.message) {
        if (error.message.includes("404") || error.message.includes("not found")) {
          errorMessage = "No encontramos una cuenta con ese correo electrónico."
        } else if (error.message.includes("network") || error.message.includes("fetch")) {
          errorMessage = "Error de conexión. Verifica tu internet."
        } else {
          errorMessage = error.message
        }
      }
      
      setError(errorMessage)
    } finally {
      setIsLoading(false)
    }
  }

  const handleInputChange = (value: string) => {
    setEmail(value)
    if (error) setError("")
    if (success) setSuccess("")
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
                  <Mail className="w-8 h-8 text-white" />
                </div>
                <h1 className="text-3xl font-bold text-red-500 mb-2">
                  ¿Olvidaste tu contraseña?
                </h1>
                <p className="text-gray-400 text-sm">
                  No te preocupes, te ayudaremos a recuperarla
                </p>
              </div>

              {error && (
                <div 
                  className="bg-red-900/50 border border-red-500 text-red-200 px-4 py-3 rounded mb-6" 
                  role="alert"
                >
                  {error}
                </div>
              )}

              {success && (
                <div 
                  className="bg-green-900/50 border border-green-500 text-green-200 px-4 py-3 rounded mb-6" 
                  role="alert"
                >
                  <p className="font-medium mb-2">✅ Correo enviado</p>
                  <p className="text-sm">{success}</p>
                </div>
              )}

              {!success ? (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-white text-sm">
                      Correo Electrónico
                    </Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                      <Input
                        id="email"
                        type="email"
                        placeholder="tu@email.com"
                        value={email}
                        onChange={(e) => handleInputChange(e.target.value)}
                        className={`bg-gray-700 border-gray-600 text-white pl-10 focus:border-red-500 ${
                          error ? "border-red-500" : ""
                        }`}
                        disabled={isLoading}
                        autoComplete="email"
                        aria-describedby={error ? "email-error" : undefined}
                        aria-invalid={!!error}
                      />
                    </div>
                    <p className="text-gray-400 text-xs mt-2">
                      Ingresa el correo electrónico asociado a tu cuenta
                    </p>
                  </div>

                  <Button
                    type="submit"
                    className="w-full bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white font-semibold py-3 rounded-lg transition-all duration-300 shadow-lg hover:shadow-red-500/50"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Enviando...
                      </>
                    ) : (
                      <>
                        <Mail className="w-4 h-4 mr-2" />
                        Enviar correo de recuperación
                      </>
                    )}
                  </Button>
                </form>
              ) : (
                <div className="space-y-4">
                  <Button
                    onClick={() => setSuccess("")}
                    variant="outline"
                    className="w-full border-gray-600 text-gray-300 hover:bg-gray-700"
                  >
                    Enviar otro correo
                  </Button>
                  
                  <Link href="/login" className="block">
                    <Button
                      className="w-full bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white"
                    >
                      Volver al Login
                    </Button>
                  </Link>
                </div>
              )}

              <div className="mt-6 text-center">
                <p className="text-gray-400 text-sm">
                  ¿Recordaste tu contraseña?{" "}
                  <Link
                    href="/login"
                    className="text-red-400 hover:text-red-300 font-medium transition-colors"
                  >
                    Iniciar sesión
                  </Link>
                </p>
              </div>
            </CardContent>
          </Card>
        </main>
      </div>
    </AuthGuard>
  )
}
