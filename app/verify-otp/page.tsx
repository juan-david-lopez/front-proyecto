"use client"

import type React from "react"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ArrowLeft, Mail, RefreshCw } from "lucide-react"
import Link from "next/link"
import { FitZoneLogo } from "@/components/fitzone-logo"
import { useState, useEffect, useRef } from "react"
import { useRouter, useSearchParams } from "next/navigation"

export default function VerifyOTPPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const email = searchParams.get("email") || ""

  const [otp, setOtp] = useState(["", "", "", "", "", ""])
  const [isLoading, setIsLoading] = useState(false)
  const [isResending, setIsResending] = useState(false)
  const [timeLeft, setTimeLeft] = useState(300) // 5 minutes
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")

  const inputRefs = useRef<(HTMLInputElement | null)[]>([])

  useEffect(() => {
    if (timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000)
      return () => clearTimeout(timer)
    }
  }, [timeLeft])

  const handleOtpChange = (index: number, value: string) => {
    if (value.length > 1) return // Prevent multiple characters

    const newOtp = [...otp]
    newOtp[index] = value
    setOtp(newOtp)

    // Clear error when user starts typing
    if (error) setError("")

    // Auto-focus next input
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus()
    }
  }

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus()
    }
    if (e.key === "ArrowLeft" && index > 0) {
      inputRefs.current[index - 1]?.focus()
    }
    if (e.key === "ArrowRight" && index < 5) {
      inputRefs.current[index + 1]?.focus()
    }
  }

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault()
    const pastedData = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6)
    const newOtp = [...otp]

    for (let i = 0; i < pastedData.length; i++) {
      newOtp[i] = pastedData[i]
    }

    setOtp(newOtp)

    // Focus the next empty input or the last one
    const nextEmptyIndex = newOtp.findIndex((digit) => !digit)
    const focusIndex = nextEmptyIndex === -1 ? 5 : nextEmptyIndex
    inputRefs.current[focusIndex]?.focus()
  }

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault()

    const otpCode = otp.join("")

    if (otpCode.length !== 6) {
      setError("Por favor ingresa el código completo de 6 dígitos")
      return
    }

    setIsLoading(true)
    setError("")

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000))

      // Simulate validation (in real app, this would be an API call)
      if (otpCode === "123456") {
        setSuccess("¡Cuenta verificada exitosamente!")

        localStorage.setItem(
          "user",
          JSON.stringify({
            email: email,
            isAuthenticated: true,
            registrationTime: new Date().toISOString(),
          }),
        )

        setTimeout(() => {
          router.push("/dashboard")
        }, 2000)
      } else {
        setError("Código incorrecto. Intenta nuevamente.")
      }
    } catch (error) {
      setError("Error al verificar el código. Intenta nuevamente.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleResendOtp = async () => {
    setIsResending(true)
    setError("")
    setSuccess("")

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500))
      setSuccess("Código reenviado exitosamente")
      setTimeLeft(300) // Reset timer
      setOtp(["", "", "", "", "", ""]) // Clear current OTP
      inputRefs.current[0]?.focus()
    } catch (error) {
      setError("Error al reenviar el código. Intenta nuevamente.")
    } finally {
      setIsResending(false)
    }
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, "0")}`
  }

  return (
    <div className="min-h-screen bg-black flex items-center justify-center px-4">
      <header className="absolute top-6 left-1/2 transform -translate-x-1/2">
        <FitZoneLogo />
      </header>

      <main className="w-full max-w-md">
        <Card className="bg-gray-800 border-gray-700">
          <CardContent className="p-8">
            <Link href="/register" className="inline-block mb-8" aria-label="Volver al registro">
              <Button
                variant="outline"
                size="sm"
                className="bg-red-600 hover:bg-red-700 border-red-600 text-white focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 focus:ring-offset-gray-800"
              >
                <ArrowLeft className="w-4 h-4 mr-2" aria-hidden="true" />
                VOLVER
              </Button>
            </Link>

            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <Mail className="w-8 h-8 text-white" aria-hidden="true" />
              </div>
              <h1 className="text-3xl font-bold text-red-500 mb-2">Verificar Código</h1>
              <p className="text-gray-300 text-sm">Hemos enviado un código de verificación de 6 dígitos a</p>
              <p className="text-white font-medium">{email}</p>
            </div>

            {success && (
              <div
                className="bg-green-900/50 border border-green-500 text-green-200 px-4 py-3 rounded mb-6 text-center"
                role="alert"
              >
                {success}
              </div>
            )}

            {error && (
              <div
                className="bg-red-900/50 border border-red-500 text-red-200 px-4 py-3 rounded mb-6 text-center"
                role="alert"
              >
                {error}
              </div>
            )}

            <form onSubmit={handleVerifyOtp} className="space-y-6">
              <div className="space-y-2">
                <Label className="text-white text-sm text-center block">Código de Verificación</Label>

                <div className="flex justify-center space-x-2" onPaste={handlePaste}>
                  {otp.map((digit, index) => (
                    <Input
                      key={index}
                      ref={(el) => { inputRefs.current[index] = el }}
                      type="text"
                      inputMode="numeric"
                      pattern="[0-9]"
                      maxLength={1}
                      value={digit}
                      onChange={(e) => handleOtpChange(index, e.target.value.replace(/\D/g, ""))}
                      onKeyDown={(e) => handleKeyDown(index, e)}
                      className="w-12 h-12 text-center text-xl font-bold bg-gray-700 border-gray-600 text-white focus:border-red-500 focus:ring-red-500"
                      aria-label={`Dígito ${index + 1} del código de verificación`}
                      autoComplete="off"
                    />
                  ))}
                </div>

                <div className="text-center mt-4">
                  {timeLeft > 0 ? (
                    <p className="text-gray-400 text-sm">
                      El código expira en: <span className="text-red-400 font-mono">{formatTime(timeLeft)}</span>
                    </p>
                  ) : (
                    <p className="text-red-400 text-sm">El código ha expirado</p>
                  )}
                </div>
              </div>

              <Button
                type="submit"
                disabled={isLoading || otp.join("").length !== 6}
                className="w-full bg-red-600 hover:bg-red-700 disabled:bg-red-800 disabled:cursor-not-allowed text-white font-semibold py-3 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 focus:ring-offset-gray-800"
              >
                {isLoading ? "Verificando..." : "Verificar Código"}
              </Button>
            </form>

            <div className="text-center mt-6 space-y-4">
              <p className="text-gray-300 text-sm">¿No recibiste el código?</p>

              <Button
                type="button"
                variant="outline"
                onClick={handleResendOtp}
                disabled={isResending || timeLeft > 240} // Allow resend after 1 minute
                className="bg-transparent border-gray-600 text-gray-300 hover:bg-gray-700 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 focus:ring-offset-gray-800"
              >
                {isResending ? (
                  <>
                    <RefreshCw className="w-4 h-4 mr-2 animate-spin" aria-hidden="true" />
                    Reenviando...
                  </>
                ) : (
                  "Reenviar Código"
                )}
              </Button>

              {timeLeft > 240 && (
                <p className="text-gray-500 text-xs">Podrás reenviar el código en {formatTime(timeLeft - 240)}</p>
              )}
            </div>

            <nav className="text-center mt-6" aria-label="Enlaces de ayuda">
              <p className="text-gray-400 text-sm">
                ¿Problemas con la verificación?{" "}
                <Link
                  href="/support"
                  className="text-red-500 hover:text-red-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 focus:ring-offset-gray-800 rounded"
                >
                  Contacta soporte
                </Link>
              </p>
            </nav>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
