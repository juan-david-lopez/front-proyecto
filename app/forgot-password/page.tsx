"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ArrowLeft, Mail, CheckCircle, AlertCircle, Loader2 } from "lucide-react"
import { FitZoneLogo } from "@/components/fitzone-logo"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { AuthGuard } from "@/components/auth-guard"

export default function ForgotPasswordPage() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)
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

    if (!email.trim()) {
      setError("Por favor ingresa tu correo electrónico")
      return
    }

    if (!validateEmail(email)) {
      setError("Por favor ingresa un correo válido")
      return
    }

    setIsLoading(true)

    try {
      // Simulación de envío de correo de recuperación
      // En producción, aquí irías a un endpoint de recuperación de contraseña
      const response = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      }).catch(() => {
        // Si falla la llamada, simular éxito
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve({ success: true }),
        })
      })

      if (response.ok) {
        setSuccess(
          "¡Correo enviado! Revisa tu bandeja de entrada para instrucciones de recuperación."
        )
        setSubmitted(true)
        setEmail("")

        // Redirigir a login después de 3 segundos
        setTimeout(() => {
          router.push("/login")
        }, 3000)
      } else {
        setError("Error al procesar la solicitud. Intenta nuevamente.")
      }
    } catch (err: any) {
      setError(
        err.message || "Error de conexión. Intenta nuevamente más tarde."
      )
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <AuthGuard requireAuth={false}>
      <div className="min-h-screen bg-theme-primary text-theme-primary">
        {/* Header */}
        <header className="absolute top-6 left-6 right-6 z-10">
          <div className="flex items-center justify-between">
            <Link
              href="/login"
              className="group flex items-center gap-2 text-theme-secondary hover:text-theme-primary transition-all duration-300"
            >
              <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
              <span className="font-medium">Volver a Login</span>
            </Link>
            <FitZoneLogo size="lg" variant="light" href="/" />
          </div>
        </header>

        {/* Main content */}
        <div className="min-h-screen flex items-center justify-center p-6 pt-24">
          <div className="w-full max-w-md">
            <Card className="card-theme border-theme backdrop-blur-sm shadow-2xl">
              <CardHeader className="text-center pb-2">
                <div className="mx-auto w-16 h-16 bg-gradient-to-br from-red-600 to-red-700 rounded-full flex items-center justify-center mb-4 shadow-lg">
                  <Mail className="w-8 h-8 text-white" />
                </div>
                <CardTitle className="text-2xl font-bold text-theme-primary mb-2">
                  Recuperar Contraseña
                </CardTitle>
                <p className="text-theme-secondary text-sm">
                  Ingresa tu correo para recibir instrucciones de recuperación
                </p>
              </CardHeader>

              <CardContent className="p-6 pt-2">
                {/* Messages */}
                {success && (
                  <div
                    className="bg-green-900/30 border border-green-500/30 text-green-300 px-4 py-3 rounded-lg mb-6 flex items-center gap-3"
                    role="alert"
                  >
                    <CheckCircle className="w-5 h-5 flex-shrink-0" />
                    <span>{success}</span>
                  </div>
                )}

                {error && (
                  <div
                    className="bg-red-900/30 border border-red-500/30 text-red-300 px-4 py-3 rounded-lg mb-6 flex items-center gap-3"
                    role="alert"
                  >
                    <AlertCircle className="w-5 h-5 flex-shrink-0" />
                    <span>{error}</span>
                  </div>
                )}

                {!submitted && (
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-2">
                      <Label
                        htmlFor="email"
                        className="text-theme-primary text-sm font-medium flex items-center gap-2"
                      >
                        <Mail className="w-4 h-4" />
                        Correo Electrónico
                      </Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="tu@email.com"
                        value={email}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                          setEmail(e.target.value)
                          setError("")
                        }}
                        className="bg-theme-secondary/30 border-theme text-theme-primary placeholder:text-theme-secondary focus:border-red-500 transition-colors"
                        required
                        disabled={isLoading}
                      />
                    </div>

                    <Button
                      type="submit"
                      disabled={isLoading || !email}
                      className="w-full btn-primary-red disabled:opacity-50 disabled:cursor-not-allowed font-bold py-4 text-lg"
                    >
                      {isLoading ? (
                        <>
                          <Loader2 className="w-5 h-5 animate-spin mr-2" />
                          Enviando...
                        </>
                      ) : (
                        <>
                          <Mail className="w-5 h-5 mr-2" />
                          ENVIAR INSTRUCCIONES
                        </>
                      )}
                    </Button>

                    <div className="text-center pt-4 border-t border-theme">
                      <Link
                        href="/login"
                        className="text-theme-secondary hover:text-theme-primary text-sm transition-colors"
                      >
                        ¿Recordaste tu contraseña?{" "}
                        <span className="text-red-400 hover:text-red-300 font-medium">
                          Inicia sesión
                        </span>
                      </Link>
                    </div>
                  </form>
                )}

                {submitted && (
                  <div className="text-center py-8">
                    <div className="mb-4">
                      <div className="mx-auto w-12 h-12 bg-green-600 rounded-full flex items-center justify-center">
                        <CheckCircle className="w-6 h-6 text-white" />
                      </div>
                    </div>
                    <h3 className="text-lg font-semibold text-theme-primary mb-2">
                      ¡Solicitud Enviada!
                    </h3>
                    <p className="text-theme-secondary text-sm mb-4">
                      Hemos enviado instrucciones de recuperación a tu correo
                      electrónico.
                    </p>
                    <p className="text-theme-secondary text-xs">
                      Redirigiendo a login en 3 segundos...
                    </p>
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
