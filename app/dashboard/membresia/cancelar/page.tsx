// app/dashboard/membresia/cancelar/page.tsx
"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { ArrowLeft, XCircle, AlertTriangle, Loader2, Heart } from "lucide-react"
import { AuthGuard } from "@/components/auth-guard"
import { useState, useEffect } from "react"
import { membershipManagementService } from "@/services/membershipManagementService"
import { MembershipDetailsResponse } from "@/types/membership"
import { userService } from "@/services/userService"
import { useToast } from "@/hooks/use-toast"

const cancellationReasons = [
  "Motivos económicos",
  "Cambio de ubicación",
  "Problemas de salud",
  "Falta de tiempo",
  "No cumplió mis expectativas",
  "Encontré otra alternativa",
  "Otro motivo"
]

export default function CancelMembershipPage() {
  const router = useRouter()
  const { success: showSuccess, error: showError, warning: showWarning } = useToast()
  const [loading, setLoading] = useState(true)
  const [processing, setProcessing] = useState(false)
  const [membership, setMembership] = useState<MembershipDetailsResponse | null>(null)
  const [userId, setUserId] = useState<number | null>(null)
  const [reason, setReason] = useState("")
  const [feedback, setFeedback] = useState("")
  const [requestRefund, setRequestRefund] = useState(false)
  const [confirmCancel, setConfirmCancel] = useState(false)

  useEffect(() => {
    loadMembershipData()
  }, [])

  const loadMembershipData = async () => {
    try {
      setLoading(true)
      const userData = userService.getCurrentUser()
      
      if (!userData || !userData.idUser) {
        showError("Error", "No se pudo obtener la información del usuario")
        router.push('/login')
        return
      }

      const userIdNumber = Number(userData.idUser)
      setUserId(userIdNumber)

      const membershipData = await membershipManagementService.getMembershipDetails(userIdNumber)
      setMembership(membershipData)
    } catch (error) {
      console.error('Error loading membership:', error)
      showError("Error", "No se pudo cargar la información de tu membresía")
    } finally {
      setLoading(false)
    }
  }

  const handleCancel = async () => {
    if (!userId || !membership?.membershipId) {
      showError("Error", "Información de membresía incompleta")
      return
    }

    if (!reason) {
      showWarning("Campo requerido", "Por favor selecciona un motivo de cancelación")
      return
    }

    if (!confirmCancel) {
      showWarning("Confirmación requerida", "Debes confirmar que deseas cancelar tu membresía")
      return
    }

    setProcessing(true)

    try {
      const result = await membershipManagementService.cancelMembership({
        userId,
        membershipId: membership.membershipId,
        reason,
        feedback: feedback.trim() || undefined,
        requestRefund,
      })

      if (result.success) {
        showSuccess(
          "Membresía Cancelada", 
          "Tu membresía ha sido cancelada. Lamentamos verte partir."
        )
        setTimeout(() => router.push('/dashboard'), 2500)
      } else {
        showError("Error", result.message)
      }
    } catch (error: any) {
      console.error('Error canceling membership:', error)
      showError("Error", error.message || "No se pudo cancelar la membresía")
    } finally {
      setProcessing(false)
    }
  }

  if (loading) {
    return (
      <AuthGuard requireAuth={true}>
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 text-white flex items-center justify-center">
          <Loader2 className="w-12 h-12 animate-spin text-red-500" />
        </div>
      </AuthGuard>
    )
  }

  return (
    <AuthGuard requireAuth={true}>
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 text-white">
        <header className="border-b border-gray-800 bg-black/50 backdrop-blur-md sticky top-0 z-10">
          <div className="container mx-auto px-4 md:px-6 py-4">
            <div className="flex items-center gap-4">
              <Link href="/dashboard/membresia">
                <Button variant="ghost" size="sm" className="text-gray-300 hover:text-white">
                  <ArrowLeft className="w-5 h-5" />
                </Button>
              </Link>
              <div>
                <h1 className="text-2xl font-bold">Cancelar Membresía</h1>
                <p className="text-sm text-gray-400">Terminar tu suscripción</p>
              </div>
            </div>
          </div>
        </header>

        <div className="container mx-auto px-4 md:px-6 py-8 max-w-3xl">
          <div className="space-y-6">
            {/* Advertencia */}
            <Card className="bg-red-500/10 border-red-500/30">
              <CardContent className="pt-6">
                <div className="flex items-start gap-3">
                  <AlertTriangle className="w-6 h-6 text-red-400 flex-shrink-0 mt-1" />
                  <div>
                    <p className="text-red-300 font-semibold text-lg">¡Espera! Antes de cancelar</p>
                    <p className="text-red-200 text-sm mt-2">
                      Perderás acceso a todos los beneficios de tu membresía de forma inmediata, incluyendo:
                    </p>
                    <ul className="text-red-200 text-sm mt-2 space-y-1 list-disc list-inside">
                      <li>Acceso a instalaciones y equipos</li>
                      <li>Clases grupales</li>
                      <li>Entrenamiento personalizado</li>
                      <li>Descuentos especiales</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Alternativas */}
            <Card className="bg-blue-500/10 border-blue-500/30">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2 text-blue-300">
                  <Heart className="w-5 h-5" />
                  ¿Consideraste estas alternativas?
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Link href="/dashboard/membresia/suspender">
                  <Button variant="outline" className="w-full justify-start text-left h-auto py-4 border-blue-500/50 hover:bg-blue-500/10">
                    <div>
                      <p className="font-semibold">Suspender temporalmente</p>
                      <p className="text-xs text-gray-400 mt-1">Pausa tu membresía de 15 a 90 días sin perder tu lugar</p>
                    </div>
                  </Button>
                </Link>
                <Link href="/membresias">
                  <Button variant="outline" className="w-full justify-start text-left h-auto py-4 border-blue-500/50 hover:bg-blue-500/10">
                    <div>
                      <p className="font-semibold">Cambiar de plan</p>
                      <p className="text-xs text-gray-400 mt-1">Explora un plan que se ajuste mejor a tu presupuesto</p>
                    </div>
                  </Button>
                </Link>
              </CardContent>
            </Card>

            {/* Formulario de cancelación */}
            <Card className="bg-gray-800/50 border-gray-700">
              <CardHeader>
                <CardTitle className="text-xl flex items-center gap-2">
                  <XCircle className="w-6 h-6 text-red-400" />
                  Formulario de Cancelación
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="reason" className="text-gray-300 mb-2 block">
                      Motivo de cancelación *
                    </Label>
                    <Select value={reason} onValueChange={setReason}>
                      <SelectTrigger id="reason" className="bg-gray-900 border-gray-600">
                        <SelectValue placeholder="Selecciona un motivo" />
                      </SelectTrigger>
                      <SelectContent>
                        {cancellationReasons.map((r) => (
                          <SelectItem key={r} value={r}>{r}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="feedback" className="text-gray-300 mb-2 block">
                      Comentarios adicionales (opcional)
                    </Label>
                    <Textarea
                      id="feedback"
                      value={feedback}
                      onChange={(e) => setFeedback(e.target.value)}
                      placeholder="Tu opinión nos ayuda a mejorar. Cuéntanos qué podríamos hacer mejor..."
                      className="bg-gray-900 border-gray-600 min-h-[120px]"
                    />
                  </div>

                  <div className="flex items-start gap-3 p-4 bg-gray-700/30 rounded-lg">
                    <Checkbox 
                      id="request-refund" 
                      checked={requestRefund}
                      onCheckedChange={(checked) => setRequestRefund(checked as boolean)}
                      className="mt-1"
                    />
                    <div className="flex-1">
                      <label htmlFor="request-refund" className="text-white cursor-pointer">
                        Solicitar reembolso proporcional
                      </label>
                      <p className="text-gray-400 text-xs mt-1">
                        Si has pagado por adelantado, podemos procesar un reembolso proporcional según nuestras políticas
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 p-4 bg-red-500/10 border border-red-500/30 rounded-lg">
                    <Checkbox 
                      id="confirm-cancel" 
                      checked={confirmCancel}
                      onCheckedChange={(checked) => setConfirmCancel(checked as boolean)}
                      className="mt-1"
                    />
                    <div className="flex-1">
                      <label htmlFor="confirm-cancel" className="text-red-300 font-semibold cursor-pointer">
                        Confirmo que deseo cancelar mi membresía *
                      </label>
                      <p className="text-red-200 text-xs mt-1">
                        Entiendo que perderé acceso inmediato a todas las instalaciones y beneficios
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-4 pt-4">
                  <Link href="/dashboard/membresia" className="flex-1">
                    <Button 
                      variant="outline" 
                      className="w-full border-gray-600 text-gray-300 hover:bg-gray-700"
                      disabled={processing}
                    >
                      Volver
                    </Button>
                  </Link>
                  <Button 
                    onClick={handleCancel}
                    disabled={processing || !reason || !confirmCancel}
                    className="flex-1 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 text-white font-bold py-6"
                  >
                    {processing ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin mr-2" />
                        Procesando...
                      </>
                    ) : (
                      <>
                        <XCircle className="w-5 h-5 mr-2" />
                        Cancelar Membresía
                      </>
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Política de cancelación */}
            <Card className="bg-gray-800/30 border-gray-700">
              <CardHeader>
                <CardTitle className="text-sm text-gray-400">Política de Cancelación</CardTitle>
              </CardHeader>
              <CardContent className="text-xs text-gray-400 space-y-2">
                <p>• La cancelación es efectiva inmediatamente</p>
                <p>• No se realizarán más cobros automáticos</p>
                <p>• Los reembolsos están sujetos a evaluación según el tiempo restante de tu membresía</p>
                <p>• Puedes reactivar tu membresía en cualquier momento registrándote nuevamente</p>
                <p>• Para más información, contacta a soporte@fitzone.com</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </AuthGuard>
  )
}
