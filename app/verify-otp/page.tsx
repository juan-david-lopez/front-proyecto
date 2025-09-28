"use client"

import * as React from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ArrowLeft, Mail, RefreshCw } from "lucide-react"
import Link from "next/link"
import { FitZoneLogo } from "@/components/fitzone-logo"
import { useState, useEffect, useRef } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import authService from "@/services/authService"

// Props personalizadas para los inputs del OTP
interface OTPInputProps {
  value: string
  onChange: (value: string) => void
  onKeyDown: (e: React.KeyboardEvent) => void
  disabled?: boolean
}

// Componente individual de cada input OTP con forwardRef
const IndividualOTPInput = React.forwardRef<HTMLInputElement, OTPInputProps>(
  ({ value, onChange, onKeyDown, disabled }, ref) => {
    return (
      <Input
        ref={ref}
        type="text"
        inputMode="numeric"
        maxLength={1}
        value={value}
        onChange={(e) => onChange(e.target.value.replace(/\D/g, ""))}
        onKeyDown={onKeyDown}
        disabled={disabled}
        className="w-12 h-12 text-center text-xl font-bold bg-gray-700 border-gray-600 text-white focus:border-red-500"
      />
    )
  }
)

IndividualOTPInput.displayName = "IndividualOTPInput"

export default function VerifyOTPPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const email = searchParams.get("email") || ""
  const verificationType = searchParams.get("type") || "register"

  const [otp, setOtp] = useState(["", "", "", "", "", ""])
  const [isLoading, setIsLoading] = useState(false)
  const [isResending, setIsResending] = useState(false)
  const [timeLeft, setTimeLeft] = useState(300)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")

  const inputRefs = useRef<(HTMLInputElement | null)[]>([])

  useEffect(() => {
    if (!email) {
      router.push(verificationType === "login" ? "/login" : "/register")
    }
  }, [email, verificationType, router])

  useEffect(() => {
    if (timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000)
      return () => clearTimeout(timer)
    }
  }, [timeLeft])

  const handleOtpChange = (index: number, value: string) => {
    if (value.length > 1) return

    const newOtp = [...otp]
    newOtp[index] = value
    setOtp(newOtp)

    if (error) setError("")

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
    setSuccess("")

    try {
      console.log("[FitZone] Verificando OTP:", { email, otp: otpCode })

      const response = await authService.verifyOtp(email, otpCode)
      console.log("[FitZone] Respuesta de verificación OTP:", response)

      if (response.success) {
        setSuccess("¡Verificación exitosa! Redirigiendo...")

        if (response.accessToken && response.refreshToken) {
          authService.setTokens(response.accessToken, response.refreshToken)
        }

        authService.setUserInfo({
          email: response.email || email,
          isAuthenticated: true,
          loginTime: new Date().toISOString(),
        })

        localStorage.removeItem("pendingLogin")

        setTimeout(() => {
          router.push("/dashboard")
        }, 2000)
      } else {
        setError(response.error || "Error al verificar el código")
      }
    } catch (error: any) {
      console.error("[FitZone] Error verificando OTP:", error)
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
      console.log("[FitZone] Reenviando OTP para:", email)
      await authService.resendOtp(email)
      setSuccess("Código reenviado exitosamente")
      setTimeLeft(300)
      setOtp(["", "", "", "", "", ""])
      inputRefs.current[0]?.focus()
    } catch (error: any) {
      console.error("[FitZone] Error reenviando OTP:", error)
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

  if (!email) {
    return null
  }

  return (
    <div className="min-h-screen bg-black flex items-center justify-center px-4">
      <header className="absolute top-6 left-1/2 transform -translate-x-1/2">
        <FitZoneLogo />
      </header>

      <main className="w-full max-w-md">
        <Card className="bg-gray-800 border-gray-700">
          <CardContent className="p-8">
            <Link href={verificationType === "login" ? "/login" : "/register"} className="inline-block mb-8">
              <Button variant="outline" size="sm" className="bg-red-600 hover:bg-red-700 border-red-600 text-white">
                <ArrowLeft className="w-4 h-4 mr-2" />
                VOLVER
              </Button>
            </Link>

            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <Mail className="w-8 h-8 text-white" />
              </div>
              <h1 className="text-3xl font-bold text-red-500 mb-2">
                {verificationType === "login" ? "Verificar Inicio de Sesión" : "Verificar Código"}
              </h1>
              <p className="text-white font-medium">{email}</p>
            </div>

            {success && <div className="bg-green-900/50 border border-green-500 text-green-200 px-4 py-3 rounded mb-6 text-center">{success}</div>}
            {error && <div className="bg-red-900/50 border border-red-500 text-red-200 px-4 py-3 rounded mb-6 text-center">{error}</div>}

            <form onSubmit={handleVerifyOtp} className="space-y-6">
              <div className="space-y-2">
                <Label className="text-white text-sm text-center block">Código de Verificación</Label>
                <div className="flex justify-center space-x-2" onPaste={handlePaste}>
                  {otp.map((digit, index) => (
                    <IndividualOTPInput
                      key={index}
                      ref={(el) => { inputRefs.current[index] = el }}
                      value={digit}
                      onChange={(value) => handleOtpChange(index, value)}
                      onKeyDown={(e) => handleKeyDown(index, e)}
                      disabled={isLoading}
                    />
                  ))}
                </div>
                <div className="text-center mt-4">
                  {timeLeft > 0 ? (
                    <p className="text-gray-400 text-sm">Expira en: <span className="text-red-400 font-mono">{formatTime(timeLeft)}</span></p>
                  ) : (
                    <p className="text-red-400 text-sm">Código expirado</p>
                  )}
                </div>
              </div>

              <Button
                type="submit"
                disabled={isLoading || otp.join("").length !== 6}
                className="w-full bg-red-600 hover:bg-red-700 disabled:bg-red-800 text-white font-semibold py-3"
              >
                {isLoading ? "Verificando..." : "Verificar Código"}
              </Button>
            </form>

            <div className="text-center mt-6 space-y-4">
              <Button
                type="button"
                variant="outline"
                onClick={handleResendOtp}
                disabled={isResending || timeLeft > 240}
                className="bg-transparent border-gray-600 text-gray-300 hover:bg-gray-700 hover:text-white disabled:opacity-50"
              >
                {isResending ? <><RefreshCw className="w-4 h-4 mr-2 animate-spin" />Reenviando...</> : "Reenviar Código"}
              </Button>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
