"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Check } from "lucide-react"

interface MembershipCardProps {
  title: string
  price: string
  description?: string
  features: string[]
  highlight?: boolean
  onSelect: () => void
}

export function MembershipCard({ title, price, description, features, highlight, onSelect }: MembershipCardProps) {
  return (
    <Card
      className={`bg-gray-800 text-white flex flex-col relative ${
        highlight ? "border-2 border-red-500" : "border border-gray-700"
      }`}
    >
      {/* Badge de más popular */}
      {highlight && (
        <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
          <span className="bg-red-500 text-white px-4 py-1 rounded-full text-sm font-bold">
            MÁS POPULAR
          </span>
        </div>
      )}

      <CardContent className="p-8 flex flex-col justify-between h-full">
        <div>
          <div className="text-center mb-6">
            <h2 className={`text-2xl font-bold mb-2 ${highlight ? "text-red-500" : "text-gray-300"}`}>
              {title}
            </h2>
            {description && <p className="text-gray-400 mb-4">{description}</p>}
            <div className="text-4xl font-bold text-green-400">{price}</div>
          </div>

          <h3 className="text-lg font-semibold mb-4">Incluye:</h3>
          <ul className="space-y-3 mb-8" role="list">
            {features.map((feature, idx) => (
              <li key={idx} className="flex items-center gap-3">
                <Check size={16} className="text-green-400 flex-shrink-0" aria-hidden="true" />
                <span>{feature}</span>
              </li>
            ))}
          </ul>
        </div>

        <Button
          onClick={onSelect}
          className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3"
        >
          Seleccionar Plan
        </Button>
      </CardContent>
    </Card>
  )
}