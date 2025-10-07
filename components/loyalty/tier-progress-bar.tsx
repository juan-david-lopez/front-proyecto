// components/loyalty/tier-progress-bar.tsx
"use client"

import { TierName } from "@/types/loyalty"
import { Progress } from "@/components/ui/progress"

interface TierProgressBarProps {
  currentTier: TierName
  nextTier: TierName | null
  monthsRemaining: number
  totalMonths: number
  className?: string
}

export function TierProgressBar({
  currentTier,
  nextTier,
  monthsRemaining,
  totalMonths,
  className = ""
}: TierProgressBarProps) {
  if (!nextTier) {
    return (
      <div className={`p-4 rounded-lg bg-theme-secondary/20 border border-theme ${className}`}>
        <p className="text-center text-theme-primary font-semibold">
          🎉 ¡Has alcanzado el nivel máximo!
        </p>
      </div>
    )
  }

  const progress = ((totalMonths - monthsRemaining) / totalMonths) * 100

  return (
    <div className={`p-6 rounded-lg bg-theme-secondary/20 border border-theme ${className}`}>
      <div className="flex justify-between items-center mb-3">
        <span className="text-sm font-semibold text-theme-secondary">
          {currentTier}
        </span>
        <span className="text-sm font-semibold text-theme-secondary">
          {nextTier}
        </span>
      </div>

      <Progress value={progress} className="h-3 mb-2" />

      <p className="text-center text-sm text-theme-secondary">
        <span className="font-bold text-theme-primary">{monthsRemaining} meses</span> para alcanzar {nextTier}
      </p>
    </div>
  )
}
