// app/dashboard/membresia/suspender/page.tsx
"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { ArrowLeft, PauseCircle, AlertCircle, Loader2, Calendar, Info } from "lucide-react"
import { AuthGuard } from "@/components/auth-guard"
import { useState, useEffect } from "react"
import { membershipManagementService } from "@/services/membershipManagementService"
import { MembershipInfo } from "@/types/membership"
import { userService } from "@/services/userService"
import { useToast } from "@/hooks/use-toast"

export default function SuspendMembershipPage() {
  const router = useRouter()
  const { success: showSuccess, error: showError, warning: showWarning } = useToast()
  const [loading, setLoading] = useState(true)
  const [processing, setProcessing] = useState(false)
  const [membership, setMembership] = useState<MembershipInfo | null>(null)
  const [userId, setUserId] = useState<number | null>(null)
  const [suspensionDays, setSuspensionDays] = useState<string>("30")
  const [reason, setReason] = useState("")
  const [canSuspend, setCanSuspend] = useState(true)
  const [suspensionMessage, setSuspensionMessage] = useState("")

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

      // Verificar si puede suspender
      const eligibility = await membershipManagementService.canSuspendMembership(userIdNumber)
      setCanSuspend(eligibility.canSuspend)
      if (!eligibility.canSuspend && eligibility.reason) {
        setSuspensionMessage(eligibility.reason)
      } else {
        setSuspensionMessage(`Has usado ${eligibility.suspensionsUsed} de 2 suspensiones disponibles este año`)
      }
    } catch (error) {
      console.error('Error loading membership:', error)
      showError("Error", "No se pudo cargar la información de tu membresía")
    } finally {
      setLoading(false)
    }
  }

  const calculateNewExpiryDate = () => {
    if (!membership?.endDate || !suspensionDays) return 'No disponible'
    const currentExpiry = new Date(membership.endDate)
    const newExpiry = new Date(currentExpiry)
    newExpiry.setDate(newExpiry.getDate() + parseInt(suspensionDays))
    return newExpiry.toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric' })
  }

  const handleSuspend = async () => {
    if (!userId || !membership?.id) {
      showError("Error", "Información de membresía incompleta")
      return
    }

    if (!reason.trim()) {
      showWarning("Campo requerido", "Por favor proporciona un motivo para la suspensión")
      return
    }

    if (!canSuspend) {
      showError("No disponible", suspensionMessage)
      return
    }

    setProcessing(true)

    try {
      const result = await membershipManagementService.suspendMembership({
        userId,
        membershipId: membership.id,
        suspensionDays: parseInt(suspensionDays),
        reason: reason.trim(),
      })

      if (result.success) {
        showSuccess(
          "Suspensión Exitosa", 
          `Tu membresía ha sido suspendida por ${suspensionDays} días`
        )
        setTimeout(() => router.push('/dashboard/membresia'), 2000)
      } else {
        showError("Error", result.message)
      }
    } catch (error: any) {
      console.error('Error suspending membership:', error)
      showError("Error", error.message || "No se pudo suspender la membresía")
    } finally {
      setProcessing(false)
    }
  }

  if (loading) {
    return (
      <AuthGuard requireAuth={true}>
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 text-white flex items-center justify-center">
          <Loader2 className="w-12 h-12 animate-spin text-yellow-500" />
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
                <h1 className="text-2xl font-bold">Suspender Membresía</h1>
                <p className="text-sm text-gray-400">Pausa temporalmente tu suscripción</p>
              </div>
            </div>
          </div>
        </header>

        <div className="container mx-auto px-4 md:px-6 py-8 max-w-3xl">
          <div className="space-y-6">
            {!canSuspend && (
              <Card className="bg-red-500/10 border-red-500/30">
                <CardContent className="pt-6">
                  <div className="flex items-start gap-3">
                    <AlertCircle className="w-6 h-6 text-red-400 flex-shrink-0 mt-1" />
                    <div>
                      <p className="text-red-300 font-semibold">No disponible</p>
                      <p className="text-red-200 text-sm mt-1">{suspensionMessage}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            <Card className="bg-gray-800/50 border-gray-700">
              <CardHeader>
                <CardTitle className="text-xl flex items-center gap-2">
                  <PauseCircle className="w-6 h-6 text-yellow-400" />
                  Detalles de Suspensión
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4">
                  <div className="flex items-start gap-3">
                    <Info className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
                    <div className="text-sm text-blue-200">
                      <p className="font-semibold mb-2">¿Qué significa suspender tu membresía?</p>
                      <ul className="space-y-1 list-disc list-inside">
                        <li>Tu membresía quedará pausada temporalmente</li>
                        <li>No se te cobrará durante el período de suspensión</li>
                        <li>Tu fecha de vencimiento se extenderá automáticamente</li>
                        <li>Puedes suspender de 15 a 90 días</li>
                        <li>Máximo 2 suspensiones por año</li>
                      </ul>
                      <p className="mt-2 font-semibold">{suspensionMessage}</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <Label htmlFor="suspension-days" className="text-gray-300 mb-2 block">
                      Días de suspensión *
                    </Label>
                    <Select value={suspensionDays} onValueChange={setSuspensionDays}>
                      <SelectTrigger id="suspension-days" className="bg-gray-900 border-gray-600">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="15">15 días</SelectItem>
                        <SelectItem value="30">30 días (1 mes)</SelectItem>
                        <SelectItem value="45">45 días</SelectItem>
                        <SelectItem value="60">60 días (2 meses)</SelectItem>
                        <SelectItem value="90">90 días (3 meses)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="reason" className="text-gray-300 mb-2 block">
                      Motivo de suspensión *
                    </Label>
                    <Textarea
                      id="reason"
                      value={reason}
                      onChange={(e) => setReason(e.target.value)}
                      placeholder="Por favor cuéntanos por qué necesitas suspender tu membresía..."
                      className="bg-gray-900 border-gray-600 min-h-[120px]"
                      required
                    />
                  </div>

                  {membership?.endDate && (
                    <div className="bg-gray-700/30 rounded-lg p-4">
                      <div className="flex items-center gap-2 text-sm">
                        <Calendar className="w-5 h-5 text-blue-400" />
                        <div>
                          <p className="text-gray-400">Nueva fecha de vencimiento:</p>
                          <p className="text-white font-semibold">{calculateNewExpiryDate()}</p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                <div className="flex flex-col sm:flex-row gap-4 pt-4">
                  <Link href="/dashboard/membresia" className="flex-1">
                    <Button 
                      variant="outline" 
                      className="w-full border-gray-600 text-gray-300 hover:bg-gray-700"
                      disabled={processing}
                    >
                      Cancelar
                    </Button>
                  </Link>
                  <Button 
                    onClick={handleSuspend}
                    disabled={processing || !canSuspend}
                    className="flex-1 bg-gradient-to-r from-yellow-600 to-yellow-700 hover:from-yellow-500 hover:to-yellow-600 text-white font-bold py-6"
                  >
                    {processing ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin mr-2" />
                        Procesando...
                      </>
                    ) : (
                      <>
                        <PauseCircle className="w-5 h-5 mr-2" />
                        Suspender Membresía
                      </>
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </AuthGuard>
  )
}
