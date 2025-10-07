// components/loyalty/loyalty-badge.tsx
"use client"

import { TierName } from "@/types/loyalty"
import { Crown, Award, Medal, Gem } from "lucide-react"

interface LoyaltyBadgeProps {
  tier: TierName
  size?: "small" | "medium" | "large"
  animated?: boolean
  className?: string
}

export function LoyaltyBadge({ tier, size = "medium", animated = false, className = "" }: LoyaltyBadgeProps) {
  const getTierIcon = () => {
    switch (tier) {
      case "BRONCE":
        return <Medal className="w-full h-full text-white" />
      case "PLATA":
        return <Award className="w-full h-full text-white" />
      case "ORO":
        return <Crown className="w-full h-full text-white" />
      case "PLATINO":
        return <Gem className="w-full h-full text-white" />
    }
  }

  const getTierClass = () => {
    switch (tier) {
      case "BRONCE":
        return "tier-bronce-gradient"
      case "PLATA":
        return "tier-plata-gradient"
      case "ORO":
        return "tier-oro-gradient"
      case "PLATINO":
        return "tier-platino-gradient"
    }
  }

  const getSizeClass = () => {
    switch (size) {
      case "small":
        return "w-12 h-12 p-2"
      case "medium":
        return "w-20 h-20 p-4"
      case "large":
        return "w-32 h-32 p-6"
    }
  }

  return (
    <div
      className={`
        loyalty-badge
        ${getTierClass()}
        ${getSizeClass()}
        ${animated ? "badge-shine" : ""}
        rounded-full
        shadow-2xl
        ${className}
      `}
    >
      {getTierIcon()}
    </div>
  )
}
