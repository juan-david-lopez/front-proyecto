// app/fidelizacion/recompensas/page.tsx
"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/contexts/auth-context"
import loyaltyService from "@/services/loyaltyService"
import type { LoyaltyReward, LoyaltyProfile } from "@/types/loyalty"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Loader2, Gift, Lock, CheckCircle2, Sparkles, Copy, ArrowLeft } from "lucide-react"
import { toast } from "sonner"

export default function RecompensasPage() {
  const { user } = useAuth()
  const router = useRouter()
  const [rewards, setRewards] = useState<LoyaltyReward[]>([])
  const [profile, setProfile] = useState<LoyaltyProfile | null>(null)
  const [loading, setLoading] = useState(true)
  const [selectedReward, setSelectedReward] = useState<LoyaltyReward | null>(null)
  const [notes, setNotes] = useState("")
  const [redeeming, setRedeeming] = useState(false)
  const [successModal, setSuccessModal] = useState(false)
  const [redemptionCode, setRedemptionCode] = useState("")
  const [filter, setFilter] = useState<"all" | "affordable">("all")

  useEffect(() => {
    if (!user) {
      router.push("/login?redirect=/fidelizacion/recompensas")
      return
    }
    loadData()
  }, [user, router])

  const loadData = async () => {
    try {
      setLoading(true)
      const [rewardsData, profileData] = await Promise.all([
        loyaltyService.getRewards(),
        loyaltyService.getProfile()
      ])
      setRewards(rewardsData)
      setProfile(profileData)
    } catch (error) {
      console.error("Error loading data:", error)
      toast.error("Error al cargar recompensas")
    } finally {
      setLoading(false)
    }
  }

  const handleRedeemClick = (reward: LoyaltyReward) => {
    if (!reward.canUserAfford || !reward.meetsMinimumTier) {
      toast.error("No cumples los requisitos para esta recompensa")
      return
    }
    setSelectedReward(reward)
  }

  const confirmRedeem = async () => {
    if (!selectedReward || !profile) return

    try {
      setRedeeming(true)
      const redemption = await loyaltyService.redeemReward({
        rewardId: selectedReward.idLoyaltyReward,
        notes
      })
      
      setRedemptionCode(redemption.redemptionCode)
      setSuccessModal(true)
      setSelectedReward(null)
      setNotes("")
      
      // Actualizar perfil
      setProfile({
        ...profile,
        availablePoints: profile.availablePoints - selectedReward.pointsCost
      })
      
      toast.success("¡Recompensa canjeada exitosamente!")
    } catch (error: any) {
      console.error("Error redeeming reward:", error)
      toast.error(error.message || "Error al canjear recompensa")
    } finally {
      setRedeeming(false)
    }
  }

  const copyCode = () => {
    navigator.clipboard.writeText(redemptionCode)
    toast.success("Código copiado")
  }

  const getRewardIcon = (type: string) => {
    const icons: Record<string, string> = {
      FREE_CLASS: "🎓",
      RENEWAL_DISCOUNT: "💰",
      TEMPORARY_UPGRADE: "⭐",
      PERSONAL_TRAINING: "🏋️",
      GUEST_PASS: "🎫",
      MERCHANDISE_DISCOUNT: "🛍️",
      NUTRITIONAL_CONSULTATION: "🥗",
      EXTENSION_DAYS: "📅"
    }
    return icons[type] || "🎁"
  }

  const filteredRewards = filter === "affordable" 
    ? rewards.filter(r => r.canUserAfford && r.meetsMinimumTier)
    : rewards

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background text-foreground p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <Button
            onClick={() => router.push("/fidelizacion")}
            variant="ghost"
            size="icon"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div>
            <h1 className="text-4xl font-bold text-gradient-hero">Catálogo de Recompensas</h1>
            <p className="text-theme-secondary">
              Tienes <span className="font-bold text-green-400">{profile?.availablePoints || 0} puntos</span> disponibles
            </p>
          </div>
        </div>

        {/* Filtros */}
        <div className="mb-6 flex gap-4">
          <Select value={filter} onValueChange={(v: any) => setFilter(v)}>
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Filtrar" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas</SelectItem>
              <SelectItem value="affordable">Solo alcanzables</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Grid de Recompensas */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredRewards.map((reward) => {
            const canRedeem = reward.canUserAfford && reward.meetsMinimumTier

            return (
              <Card
                key={reward.idLoyaltyReward}
                className={`card-theme transition-all duration-300 hover:scale-105 ${
                  canRedeem ? "reward-card-affordable" : "reward-card-locked"
                }`}
              >
                <CardContent className="p-6">
                  <div className="text-4xl mb-3 text-center">
                    {getRewardIcon(reward.rewardType)}
                  </div>
                  
                  <h3 className="text-xl font-bold text-theme-primary mb-2 text-center">
                    {reward.name}
                  </h3>
                  
                  <p className="text-sm text-theme-secondary mb-4 text-center min-h-[40px]">
                    {reward.description}
                  </p>

                  <div className="flex items-center justify-center gap-2 mb-4">
                    {!reward.meetsMinimumTier && (
                      <Badge variant="secondary">
                        Requiere {reward.minimumTierRequired}
                      </Badge>
                    )}
                  </div>

                  <div className="text-center mb-4">
                    <div className="text-3xl font-bold text-theme-primary">
                      {reward.pointsCost}
                      <span className="text-sm text-theme-secondary"> puntos</span>
                    </div>
                    <p className="text-xs text-theme-secondary mt-1">
                      Válido por {reward.validityDays} días
                    </p>
                  </div>

                  <Button
                    onClick={() => handleRedeemClick(reward)}
                    disabled={!canRedeem}
                    className="w-full"
                    variant={canRedeem ? "default" : "outline"}
                  >
                    {canRedeem ? (
                      <>
                        <Gift className="w-4 h-4 mr-2" />
                        Canjear
                      </>
                    ) : (
                      <>
                        <Lock className="w-4 h-4 mr-2" />
                        Bloqueado
                      </>
                    )}
                  </Button>
                </CardContent>
              </Card>
            )
          })}
        </div>

        {/* Modal de Confirmación */}
        {selectedReward && (
          <Dialog open={!!selectedReward} onOpenChange={() => setSelectedReward(null)}>
            <DialogContent className="card-theme">
              <DialogHeader>
                <DialogTitle className="text-2xl text-theme-primary">Confirmar Canje</DialogTitle>
                <DialogDescription className="sr-only">
                  Confirma el canje de {selectedReward.name} por {selectedReward.pointsCost} puntos
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div className="p-4 rounded-lg bg-theme-secondary/20">
                  <p className="text-sm text-theme-secondary mb-1">Recompensa:</p>
                  <p className="text-lg font-bold text-theme-primary">{selectedReward.name}</p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-theme-secondary">Costo:</p>
                    <p className="text-2xl font-bold text-red-400">{selectedReward.pointsCost} pts</p>
                  </div>
                  <div>
                    <p className="text-sm text-theme-secondary">Tus puntos:</p>
                    <p className="text-2xl font-bold text-green-400">{profile?.availablePoints || 0} pts</p>
                  </div>
                </div>

                <div className="p-4 rounded-lg bg-blue-500/10 border border-blue-500/30">
                  <p className="text-sm text-theme-secondary mb-1">Puntos después del canje:</p>
                  <p className="text-3xl font-bold text-theme-primary">
                    {(profile?.availablePoints || 0) - selectedReward.pointsCost} pts
                  </p>
                </div>

                <div>
                  <label className="text-sm text-theme-secondary mb-2 block">
                    Notas (opcional):
                  </label>
                  <Textarea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Agrega alguna nota sobre el canje..."
                    className="min-h-[80px]"
                  />
                </div>

                <div className="flex gap-3">
                  <Button
                    onClick={() => setSelectedReward(null)}
                    variant="outline"
                    className="flex-1"
                    disabled={redeeming}
                  >
                    Cancelar
                  </Button>
                  <Button
                    onClick={confirmRedeem}
                    className="flex-1 btn-primary-red"
                    disabled={redeeming}
                  >
                    {redeeming ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Canjeando...
                      </>
                    ) : (
                      <>
                        <CheckCircle2 className="w-4 h-4 mr-2" />
                        Confirmar Canje
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        )}

        {/* Modal de Éxito */}
        {successModal && (
          <Dialog open={successModal} onOpenChange={setSuccessModal}>
            <DialogContent className="card-theme">
              <DialogHeader>
                <DialogTitle className="text-2xl text-theme-primary text-center">
                  <Sparkles className="w-8 h-8 mx-auto mb-2 text-yellow-400" />
                  ¡Canje Exitoso! 🎉
                </DialogTitle>
                <DialogDescription className="sr-only">
                  Canje completado exitosamente. Tu código de canje es {redemptionCode}
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 text-center">
                <p className="text-theme-secondary">Tu código de canje:</p>
                
                <div className="redemption-code">
                  {redemptionCode}
                </div>

                <Button
                  onClick={copyCode}
                  variant="outline"
                  className="w-full"
                >
                  <Copy className="w-4 h-4 mr-2" />
                  Copiar Código
                </Button>

                <p className="text-sm text-theme-secondary">
                  Presenta este código al personal del gimnasio para usar tu recompensa.
                </p>

                <div className="flex gap-3">
                  <Button
                    onClick={() => router.push("/fidelizacion/mis-canjes")}
                    variant="outline"
                    className="flex-1"
                  >
                    Ver Mis Canjes
                  </Button>
                  <Button
                    onClick={() => setSuccessModal(false)}
                    className="flex-1 btn-primary-red"
                  >
                    Cerrar
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        )}
      </div>
    </div>
  )
}
