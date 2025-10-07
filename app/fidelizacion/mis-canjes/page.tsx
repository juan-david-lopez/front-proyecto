// app/fidelizacion/mis-canjes/page.tsx
"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/contexts/auth-context"
import loyaltyService from "@/services/loyaltyService"
import type { LoyaltyRedemption } from "@/types/loyalty"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Loader2, Copy, CheckCircle2, XCircle, Clock, Gift, ArrowLeft, Calendar } from "lucide-react"
import { formatDistanceToNow } from "date-fns"
import { es } from "date-fns/locale"
import { toast } from "sonner"

export default function MisCanjesPage() {
  const { user } = useAuth()
  const router = useRouter()
  const [redemptions, setRedemptions] = useState<LoyaltyRedemption[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<"all" | "ACTIVE" | "USED" | "EXPIRED">("all")
  const [copiedCode, setCopiedCode] = useState<string | null>(null)

  useEffect(() => {
    if (!user) {
      router.push("/login?redirect=/fidelizacion/mis-canjes")
      return
    }
    loadRedemptions()
  }, [user, router])

  const loadRedemptions = async () => {
    try {
      setLoading(true)
      const data = await loyaltyService.getRedemptions()
      setRedemptions(data)
    } catch (error) {
      console.error("Error loading redemptions:", error)
      toast.error("Error al cargar canjes")
    } finally {
      setLoading(false)
    }
  }

  const copyCode = (code: string) => {
    navigator.clipboard.writeText(code)
    setCopiedCode(code)
    toast.success("Código copiado al portapapeles")
    setTimeout(() => setCopiedCode(null), 2000)
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "ACTIVE":
        return (
          <Badge className="bg-green-600 text-white">
            <CheckCircle2 className="w-3 h-3 mr-1" />
            ACTIVO
          </Badge>
        )
      case "USED":
        return (
          <Badge className="bg-blue-600 text-white">
            <CheckCircle2 className="w-3 h-3 mr-1" />
            USADO
          </Badge>
        )
      case "EXPIRED":
        return (
          <Badge variant="secondary" className="bg-gray-600 text-white">
            <Clock className="w-3 h-3 mr-1" />
            EXPIRADO
          </Badge>
        )
      case "CANCELLED":
        return (
          <Badge variant="destructive">
            <XCircle className="w-3 h-3 mr-1" />
            CANCELADO
          </Badge>
        )
      default:
        return <Badge>{status}</Badge>
    }
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

  const filteredRedemptions = filter === "all" 
    ? redemptions 
    : redemptions.filter(r => r.status === filter)

  const stats = {
    total: redemptions.length,
    active: redemptions.filter(r => r.status === "ACTIVE").length,
    used: redemptions.filter(r => r.status === "USED").length,
    expired: redemptions.filter(r => r.status === "EXPIRED").length
  }

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
            <h1 className="text-4xl font-bold text-gradient-hero">Mis Canjes</h1>
            <p className="text-theme-secondary">
              Gestiona tus recompensas canjeadas
            </p>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <Card className="card-theme">
            <CardContent className="p-4 text-center">
              <p className="text-2xl font-bold text-theme-primary">{stats.total}</p>
              <p className="text-xs text-theme-secondary">Total</p>
            </CardContent>
          </Card>
          <Card className="card-theme border-green-500/30">
            <CardContent className="p-4 text-center">
              <p className="text-2xl font-bold text-green-400">{stats.active}</p>
              <p className="text-xs text-theme-secondary">Activos</p>
            </CardContent>
          </Card>
          <Card className="card-theme border-blue-500/30">
            <CardContent className="p-4 text-center">
              <p className="text-2xl font-bold text-blue-400">{stats.used}</p>
              <p className="text-xs text-theme-secondary">Usados</p>
            </CardContent>
          </Card>
          <Card className="card-theme border-gray-500/30">
            <CardContent className="p-4 text-center">
              <p className="text-2xl font-bold text-gray-400">{stats.expired}</p>
              <p className="text-xs text-theme-secondary">Expirados</p>
            </CardContent>
          </Card>
        </div>

        {/* Filtros */}
        <div className="mb-6 flex gap-4">
          <Select value={filter} onValueChange={(v: any) => setFilter(v)}>
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Filtrar por estado" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos ({stats.total})</SelectItem>
              <SelectItem value="ACTIVE">Activos ({stats.active})</SelectItem>
              <SelectItem value="USED">Usados ({stats.used})</SelectItem>
              <SelectItem value="EXPIRED">Expirados ({stats.expired})</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Lista de Canjes */}
        {filteredRedemptions.length === 0 ? (
          <Card className="card-theme">
            <CardContent className="p-12 text-center">
              <Gift className="w-16 h-16 mx-auto mb-4 text-theme-secondary opacity-50" />
              <h3 className="text-xl font-bold text-theme-primary mb-2">
                No hay canjes
              </h3>
              <p className="text-theme-secondary mb-4">
                {filter === "all" 
                  ? "Aún no has canjeado ninguna recompensa" 
                  : `No tienes canjes ${filter === "ACTIVE" ? "activos" : filter === "USED" ? "usados" : "expirados"}`
                }
              </p>
              <Button
                onClick={() => router.push("/fidelizacion/recompensas")}
                className="btn-primary-red"
              >
                Explorar Recompensas
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredRedemptions.map((redemption) => (
              <Card
                key={redemption.idLoyaltyRedemption}
                className={`card-theme transition-all duration-300 hover:scale-105 ${
                  redemption.status === "ACTIVE" ? "border-2 border-green-500/50 shadow-lg shadow-green-500/20" :
                  redemption.status === "USED" ? "border-blue-500/30" :
                  "opacity-70"
                }`}
              >
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="text-3xl mb-2">
                      {getRewardIcon(redemption.rewardType)}
                    </div>
                    {getStatusBadge(redemption.status)}
                  </div>
                  <CardTitle className="text-lg text-theme-primary">
                    {redemption.rewardName}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {/* Código de canje */}
                    <div>
                      <p className="text-xs text-theme-secondary mb-1">Código:</p>
                      <div className="redemption-code text-lg p-2">
                        {redemption.redemptionCode}
                      </div>
                      <Button
                        onClick={() => copyCode(redemption.redemptionCode)}
                        variant="outline"
                        size="sm"
                        className="w-full mt-2"
                        disabled={redemption.status !== "ACTIVE"}
                      >
                        {copiedCode === redemption.redemptionCode ? (
                          <>
                            <CheckCircle2 className="w-3 h-3 mr-2" />
                            Copiado
                          </>
                        ) : (
                          <>
                            <Copy className="w-3 h-3 mr-2" />
                            Copiar Código
                          </>
                        )}
                      </Button>
                    </div>

                    {/* Información de fechas */}
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center justify-between">
                        <span className="text-theme-secondary flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          Canjeado:
                        </span>
                        <span className="text-theme-primary">
                          {formatDistanceToNow(new Date(redemption.redemptionDate), {
                            addSuffix: true,
                            locale: es
                          })}
                        </span>
                      </div>

                      {redemption.status === "ACTIVE" && (
                        <div className="flex items-center justify-between">
                          <span className="text-theme-secondary flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            Expira:
                          </span>
                          <span className="text-yellow-400 font-semibold">
                            {new Date(redemption.expirationDate).toLocaleDateString("es-ES")}
                          </span>
                        </div>
                      )}

                      {redemption.status === "USED" && redemption.usedDate && (
                        <div className="flex items-center justify-between">
                          <span className="text-theme-secondary flex items-center gap-1">
                            <CheckCircle2 className="w-3 h-3" />
                            Usado:
                          </span>
                          <span className="text-blue-400">
                            {new Date(redemption.usedDate).toLocaleDateString("es-ES")}
                          </span>
                        </div>
                      )}

                      {redemption.status === "EXPIRED" && (
                        <div className="flex items-center justify-between">
                          <span className="text-theme-secondary flex items-center gap-1">
                            <XCircle className="w-3 h-3" />
                            Expiró:
                          </span>
                          <span className="text-gray-400">
                            {new Date(redemption.expirationDate).toLocaleDateString("es-ES")}
                          </span>
                        </div>
                      )}

                      <div className="flex items-center justify-between pt-2 border-t border-theme">
                        <span className="text-theme-secondary">Puntos gastados:</span>
                        <span className="text-red-400 font-bold">{redemption.pointsSpent} pts</span>
                      </div>
                    </div>

                    {redemption.notes && (
                      <div className="p-2 bg-theme-secondary/10 rounded text-xs text-theme-secondary">
                        <p className="font-semibold mb-1">Notas:</p>
                        <p>{redemption.notes}</p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
