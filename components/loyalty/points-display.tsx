// components/loyalty/points-display.tsx
"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Coins, TrendingUp, AlertTriangle } from "lucide-react"
import { Badge } from "@/components/ui/badge"

interface PointsDisplayProps {
  availablePoints: number
  totalPoints: number
  expiringPoints?: number
  className?: string
}

export function PointsDisplay({ 
  availablePoints, 
  totalPoints, 
  expiringPoints = 0,
  className = ""
}: PointsDisplayProps) {
  return (
    <Card className={`card-theme ${className}`}>
      <CardContent className="p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-3 rounded-full bg-gradient-to-br from-yellow-500 to-yellow-600">
            <Coins className="w-6 h-6 text-white" />
          </div>
          <div>
            <p className="text-sm text-theme-secondary">Tus Puntos</p>
            <h3 className="text-3xl font-bold text-theme-primary">{availablePoints.toLocaleString()}</h3>
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-theme-secondary flex items-center gap-2">
              <TrendingUp className="w-4 h-4" />
              Total acumulado
            </span>
            <span className="font-semibold text-theme-primary">{totalPoints.toLocaleString()}</span>
          </div>

          {expiringPoints > 0 && (
            <Badge variant="destructive" className="w-full justify-center gap-2">
              <AlertTriangle className="w-4 h-4" />
              {expiringPoints} puntos por expirar pronto
            </Badge>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
