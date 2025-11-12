// components/loyalty/earn-points-actions.tsx
"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import loyaltyService from "@/services/loyaltyService"
import { 
  Share2, 
  UserPlus, 
  CheckCircle2, 
  Calendar,
  Loader2,
  Sparkles,
  Trophy,
  Gift
} from "lucide-react"
import { toast } from "sonner"

interface EarnableAction {
  type: string
  title: string
  description: string
  points: number
  icon: React.ReactNode
  buttonText: string
  color: string
  requiresInput?: boolean
  cooldown?: string
  disabled?: boolean
  disabledReason?: string
}

interface EarnPointsActionsProps {
  onPointsEarned?: () => void
}

export function EarnPointsActions({ onPointsEarned }: EarnPointsActionsProps) {
  const [loading, setLoading] = useState(false)
  const [selectedAction, setSelectedAction] = useState<EarnableAction | null>(null)
  const [referralEmail, setReferralEmail] = useState("")
  const [shareMessage, setShareMessage] = useState("")
  const [completedToday, setCompletedToday] = useState<Set<string>>(new Set())

  // Definir acciones que el usuario puede hacer
  const earnableActions: EarnableAction[] = [
    {
      type: "LOGIN_STREAK",
      title: "Racha Diaria",
      description: "Mantén tu racha de login diario activa",
      points: 5,
      icon: <Calendar className="w-6 h-6" />,
      buttonText: "Registrar Login",
      color: "from-blue-500 to-cyan-500",
      cooldown: "1 vez al día",
      disabled: completedToday.has("LOGIN_STREAK"),
      disabledReason: "Ya registrado hoy"
    },
    {
      type: "SOCIAL_SHARE",
      title: "Compartir en Redes",
      description: "Comparte FitZone en tus redes sociales",
      points: 10,
      icon: <Share2 className="w-6 h-6" />,
      buttonText: "Compartir",
      color: "from-purple-500 to-pink-500",
      requiresInput: true,
      cooldown: "1 vez al día",
      disabled: completedToday.has("SOCIAL_SHARE"),
      disabledReason: "Ya compartido hoy"
    },
    {
      type: "REFERRAL",
      title: "Referir un Amigo",
      description: "Invita a un amigo y gana puntos cuando se registre",
      points: 100,
      icon: <UserPlus className="w-6 h-6" />,
      buttonText: "Invitar Amigo",
      color: "from-green-500 to-emerald-500",
      requiresInput: true
    },
    {
      type: "PROFILE_COMPLETION",
      title: "Completar Perfil",
      description: "Completa toda tu información de perfil",
      points: 20,
      icon: <CheckCircle2 className="w-6 h-6" />,
      buttonText: "Ir a Perfil",
      color: "from-orange-500 to-red-500",
      disabled: completedToday.has("PROFILE_COMPLETION"),
      disabledReason: "Perfil completado"
    }
  ]

  const handleActionClick = (action: EarnableAction) => {
    if (action.disabled) {
      toast.info(action.disabledReason || "Esta acción no está disponible")
      return
    }

    if (action.type === "PROFILE_COMPLETION") {
      // Redirigir a la página de perfil
      window.location.href = "/perfil"
      return
    }

    setSelectedAction(action)
  }

  const handleConfirmAction = async () => {
    if (!selectedAction) return

    try {
      setLoading(true)

      // Validaciones según el tipo de acción
      if (selectedAction.type === "REFERRAL" && !referralEmail) {
        toast.error("Por favor ingresa el email de tu amigo")
        return
      }

      if (selectedAction.type === "SOCIAL_SHARE" && !shareMessage) {
        toast.error("Por favor ingresa un mensaje para compartir")
        return
      }

      // Llamar al backend para registrar la actividad
      const activity = await loyaltyService.logActivity(
        selectedAction.type,
        selectedAction.type === "REFERRAL" 
          ? `Referido: ${referralEmail}`
          : selectedAction.type === "SOCIAL_SHARE"
          ? shareMessage
          : selectedAction.description
      )

      // Mostrar notificación de éxito con animación
      toast.success(
        <div className="flex items-center gap-3">
          <Sparkles className="w-5 h-5 text-yellow-500 animate-pulse" />
          <div>
            <p className="font-bold">¡Puntos Ganados!</p>
            <p className="text-sm">+{activity.pointsEarned} puntos por {selectedAction.title}</p>
          </div>
        </div>,
        {
          duration: 5000,
        }
      )

      // Marcar como completada hoy
      setCompletedToday(prev => new Set(prev).add(selectedAction.type))

      // Limpiar formulario
      setReferralEmail("")
      setShareMessage("")
      setSelectedAction(null)

      // Notificar al padre para que actualice el dashboard
      if (onPointsEarned) {
        onPointsEarned()
      }

    } catch (error: any) {
      console.error("Error registrando actividad:", error)
      toast.error(
        error.message || "No se pudo registrar la actividad. Intenta de nuevo."
      )
    } finally {
      setLoading(false)
    }
  }

  const handleShareAction = (platform: string) => {
    const shareUrl = "https://fitzone.com"
    const shareText = shareMessage || "¡Únete a FitZone y transforma tu vida! 💪"

    const urls: Record<string, string> = {
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}&quote=${encodeURIComponent(shareText)}`,
      twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`,
      whatsapp: `https://wa.me/?text=${encodeURIComponent(shareText + " " + shareUrl)}`,
      linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`
    }

    if (urls[platform]) {
      window.open(urls[platform], "_blank", "width=600,height=400")
      
      // Después de compartir, confirmar la acción
      setTimeout(() => {
        handleConfirmAction()
      }, 1000)
    }
  }

  return (
    <>
      <Card className="card-theme">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-theme-primary">
            <Trophy className="w-5 h-5" />
            Gana Puntos Ahora
          </CardTitle>
          <CardDescription>
            Realiza estas actividades y acumula puntos de fidelización
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {earnableActions.map((action) => (
              <div
                key={action.type}
                className={`
                  relative overflow-hidden rounded-lg border-2
                  ${action.disabled ? 'border-gray-600 opacity-50' : 'border-transparent'}
                  bg-gradient-to-br ${action.color}
                  p-4 transition-all hover:scale-105 cursor-pointer
                  ${action.disabled ? 'cursor-not-allowed' : ''}
                `}
                onClick={() => handleActionClick(action)}
              >
                <div className="relative z-10 text-white">
                  <div className="flex items-start justify-between mb-3">
                    <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm">
                      {action.icon}
                    </div>
                    <Badge className="bg-white/90 text-gray-900 font-bold">
                      +{action.points} pts
                    </Badge>
                  </div>
                  
                  <h3 className="font-bold text-lg mb-1">{action.title}</h3>
                  <p className="text-white/90 text-sm mb-3">{action.description}</p>
                  
                  {action.cooldown && (
                    <p className="text-white/70 text-xs mb-2">
                      📅 {action.cooldown}
                    </p>
                  )}

                  <Button
                    variant="secondary"
                    size="sm"
                    className="w-full"
                    disabled={action.disabled}
                  >
                    {action.disabled ? action.disabledReason : action.buttonText}
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Dialog para acciones que requieren input */}
      <Dialog open={!!selectedAction} onOpenChange={(open) => !open && setSelectedAction(null)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Gift className="w-5 h-5 text-primary" />
              {selectedAction?.title}
            </DialogTitle>
            <DialogDescription>
              {selectedAction?.description}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            {selectedAction?.type === "REFERRAL" && (
              <div className="space-y-2">
                <Label htmlFor="referral-email">Email de tu amigo</Label>
                <Input
                  id="referral-email"
                  type="email"
                  placeholder="amigo@ejemplo.com"
                  value={referralEmail}
                  onChange={(e) => setReferralEmail(e.target.value)}
                />
                <p className="text-xs text-muted-foreground">
                  Le enviaremos una invitación a unirse a FitZone
                </p>
              </div>
            )}

            {selectedAction?.type === "SOCIAL_SHARE" && (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="share-message">Mensaje para compartir</Label>
                  <Textarea
                    id="share-message"
                    placeholder="¡Únete a FitZone y transforma tu vida! 💪"
                    value={shareMessage}
                    onChange={(e) => setShareMessage(e.target.value)}
                    rows={3}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Compartir en:</Label>
                  <div className="grid grid-cols-2 gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleShareAction("facebook")}
                      className="justify-start"
                    >
                      📘 Facebook
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleShareAction("twitter")}
                      className="justify-start"
                    >
                      🐦 Twitter
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleShareAction("whatsapp")}
                      className="justify-start"
                    >
                      💬 WhatsApp
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleShareAction("linkedin")}
                      className="justify-start"
                    >
                      💼 LinkedIn
                    </Button>
                  </div>
                </div>
              </div>
            )}

            {selectedAction?.type === "LOGIN_STREAK" && (
              <div className="text-center space-y-3">
                <div className="inline-flex p-4 bg-primary/10 rounded-full">
                  <Calendar className="w-12 h-12 text-primary" />
                </div>
                <p className="text-sm text-muted-foreground">
                  Registra tu login diario para mantener tu racha activa y ganar {selectedAction.points} puntos
                </p>
              </div>
            )}
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setSelectedAction(null)}
              disabled={loading}
            >
              Cancelar
            </Button>
            {selectedAction?.type !== "SOCIAL_SHARE" && (
              <Button
                onClick={handleConfirmAction}
                disabled={loading}
              >
                {loading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                Confirmar y Ganar {selectedAction?.points} pts
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
