"use client"

import type React from "react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ArrowLeft, Check, CreditCard } from "lucide-react"
import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { useState } from "react"
import { FitZoneLogo } from "@/components/fitzone-logo"

const planData = {
  basico: {
    title: "Básico",
    price: "$50,000",
    description: "Perfecto para comenzar tu journey fitness",
    benefits: [
      "Acceso al área de pesas",
      "2 horas diarias de entrenamiento",
      "Máquinas cardiovasculares",
      "Vestuarios y duchas",
      "Horario: 6AM - 8PM",
      "Acceso a una sola sucursal",
    ],
  },
  premium: {
    title: "Premium",
    price: "$70,000",
    description: "La opción más completa para resultados óptimos",
    benefits: [
      "Todo lo del plan básico",
      "Acceso 24/7 con tiempo ilimitado",
      "Clases grupales ilimitadas",
      "Entrenador personal (2 sesiones/mes)",
      "Área de funcional",
      "Evaluación nutricional",
      "Gamificación y retos mensuales",
    ],
  },
  elite: {
    title: "ELITE",
    price: "$90,000",
    description: "El mejor valor para miembros comprometidos",
    benefits: [
      "Todo lo del plan Premium",
      "Acceso a cualquier sucursal",
      "Entrenador personal (4 sesiones/mes)",
      "Sauna y jacuzzi",
      "Plan nutricional personalizado",
      "Invitaciones para amigos (2/mes)",
      "20% de descuento en reservas de espacios",
    ],
  },
}

export default function CheckoutPage() {
  const searchParams = useSearchParams()
  const planType = (searchParams.get("plan") || "premium") as keyof typeof planData
  const selectedPlan = planData[planType]

  const [formData, setFormData] = useState({
    cardNumber: "",
    expiryDate: "",
    cvv: "",
    cardName: "",
    billingName: "",
    billingEmail: "",
    address: "",
    city: "",
    postalCode: "",
  })

  const [errors, setErrors] = useState<Record<string, string>>({})

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }))
    }
  }

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.cardNumber || formData.cardNumber.length < 16) {
      newErrors.cardNumber = "Número de tarjeta inválido"
    }
    if (!formData.expiryDate) {
      newErrors.expiryDate = "Fecha de expiración requerida"
    }
    if (!formData.cvv || formData.cvv.length < 3) {
      newErrors.cvv = "CVV inválido"
    }
    if (!formData.cardName.trim()) {
      newErrors.cardName = "Nombre en la tarjeta requerido"
    }
    if (!formData.billingName.trim()) {
      newErrors.billingName = "Nombre de facturación requerido"
    }
    if (!formData.billingEmail.includes("@")) {
      newErrors.billingEmail = "Email inválido"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (validateForm()) {
      // Procesar pago
      console.log("Procesando pago...", { plan: planType, ...formData })
      // Aquí iría la integración con el procesador de pagos
    }
  }

  const formatCardNumber = (value: string) => {
    const v = value.replace(/\s+/g, "").replace(/[^0-9]/gi, "")
    const matches = v.match(/\d{4,16}/g)
    const match = (matches && matches[0]) || ""
    const parts = []
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4))
    }
    if (parts.length) {
      return parts.join(" ")
    } else {
      return v
    }
  }

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <header className="border-b border-gray-800 p-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <Link href="/" className="flex items-center space-x-2" aria-label="Volver al inicio">
            <ArrowLeft className="w-5 h-5" />
            <span>Volver</span>
          </Link>
          <FitZoneLogo />
        </div>
      </header>

      <div className="max-w-6xl mx-auto p-6">
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Payment Form */}
          <div className="space-y-8">
            <div className="text-center">
              <h1 className="text-3xl font-bold text-red-500 mb-2">FINALIZAR COMPRA</h1>
              <p className="text-gray-400">Completa tu información para procesar el pago</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Card Information */}
              <section className="bg-gray-900 p-6 rounded-lg">
                <h2 className="text-xl font-semibold mb-6 flex items-center">
                  <CreditCard className="w-5 h-5 mr-2" />
                  Datos de tarjeta
                </h2>

                <div className="space-y-4">
                  <div>
                    <Label htmlFor="cardNumber" className="text-gray-300">
                      Número de tarjeta
                    </Label>
                    <Input
                      id="cardNumber"
                      type="text"
                      placeholder="1234 5678 9012 3456"
                      value={formData.cardNumber}
                      onChange={(e) => handleInputChange("cardNumber", formatCardNumber(e.target.value))}
                      className="bg-gray-800 border-gray-700 text-white mt-2"
                      maxLength={19}
                      aria-describedby={errors.cardNumber ? "cardNumber-error" : undefined}
                      aria-invalid={!!errors.cardNumber}
                    />
                    {errors.cardNumber && (
                      <p id="cardNumber-error" className="text-red-500 text-sm mt-1" role="alert">
                        {errors.cardNumber}
                      </p>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="expiryDate" className="text-gray-300">
                        Fecha de expiración
                      </Label>
                      <Input
                        id="expiryDate"
                        type="text"
                        placeholder="MM/YY"
                        value={formData.expiryDate}
                        onChange={(e) => {
                          let value = e.target.value.replace(/\D/g, "")
                          if (value.length >= 2) {
                            value = value.substring(0, 2) + "/" + value.substring(2, 4)
                          }
                          handleInputChange("expiryDate", value)
                        }}
                        className="bg-gray-800 border-gray-700 text-white mt-2"
                        maxLength={5}
                        aria-describedby={errors.expiryDate ? "expiryDate-error" : undefined}
                        aria-invalid={!!errors.expiryDate}
                      />
                      {errors.expiryDate && (
                        <p id="expiryDate-error" className="text-red-500 text-sm mt-1" role="alert">
                          {errors.expiryDate}
                        </p>
                      )}
                    </div>
                    <div>
                      <Label htmlFor="cvv" className="text-gray-300">
                        CVV
                      </Label>
                      <Input
                        id="cvv"
                        type="text"
                        placeholder="123"
                        value={formData.cvv}
                        onChange={(e) => handleInputChange("cvv", e.target.value.replace(/\D/g, ""))}
                        className="bg-gray-800 border-gray-700 text-white mt-2"
                        maxLength={4}
                        aria-describedby={errors.cvv ? "cvv-error" : undefined}
                        aria-invalid={!!errors.cvv}
                      />
                      {errors.cvv && (
                        <p id="cvv-error" className="text-red-500 text-sm mt-1" role="alert">
                          {errors.cvv}
                        </p>
                      )}
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="cardName" className="text-gray-300">
                      Nombre en la tarjeta
                    </Label>
                    <Input
                      id="cardName"
                      type="text"
                      placeholder="Juan Pérez"
                      value={formData.cardName}
                      onChange={(e) => handleInputChange("cardName", e.target.value)}
                      className="bg-gray-800 border-gray-700 text-white mt-2"
                      aria-describedby={errors.cardName ? "cardName-error" : undefined}
                      aria-invalid={!!errors.cardName}
                    />
                    {errors.cardName && (
                      <p id="cardName-error" className="text-red-500 text-sm mt-1" role="alert">
                        {errors.cardName}
                      </p>
                    )}
                  </div>
                </div>

                {/* Test Cards Info */}
                <div className="mt-6 p-4 bg-gray-800 rounded-lg">
                  <h3 className="font-semibold mb-2">Tarjetas de prueba</h3>
                  <div className="text-sm text-gray-400 space-y-1">
                    <p>
                      <strong>Visa:</strong> 4242 4242 4242 4242
                    </p>
                    <p>
                      <strong>Mastercard:</strong> 5555 5555 5555 4444
                    </p>
                    <p>
                      <strong>AMEX:</strong> 3782 822463 10005
                    </p>
                    <p className="mt-2">
                      Usa cualquier fecha futura, CVC aleatorio (ej. 123) y cualquier código postal
                    </p>
                  </div>
                </div>
              </section>

              {/* Billing Information */}
              <section className="bg-gray-900 p-6 rounded-lg">
                <h2 className="text-xl font-semibold mb-6">Información de facturación</h2>

                <div className="space-y-4">
                  <div>
                    <Label htmlFor="billingName" className="text-gray-300">
                      Nombre
                    </Label>
                    <Input
                      id="billingName"
                      type="text"
                      placeholder="Tu nombre completo"
                      value={formData.billingName}
                      onChange={(e) => handleInputChange("billingName", e.target.value)}
                      className="bg-gray-800 border-gray-700 text-white mt-2"
                      aria-describedby={errors.billingName ? "billingName-error" : undefined}
                      aria-invalid={!!errors.billingName}
                    />
                    {errors.billingName && (
                      <p id="billingName-error" className="text-red-500 text-sm mt-1" role="alert">
                        {errors.billingName}
                      </p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="billingEmail" className="text-gray-300">
                      Email
                    </Label>
                    <Input
                      id="billingEmail"
                      type="email"
                      placeholder="tu@email.com"
                      value={formData.billingEmail}
                      onChange={(e) => handleInputChange("billingEmail", e.target.value)}
                      className="bg-gray-800 border-gray-700 text-white mt-2"
                      aria-describedby={errors.billingEmail ? "billingEmail-error" : undefined}
                      aria-invalid={!!errors.billingEmail}
                    />
                    {errors.billingEmail && (
                      <p id="billingEmail-error" className="text-red-500 text-sm mt-1" role="alert">
                        {errors.billingEmail}
                      </p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="address" className="text-gray-300">
                      Dirección
                    </Label>
                    <Input
                      id="address"
                      type="text"
                      placeholder="Calle 123 #45-67"
                      value={formData.address}
                      onChange={(e) => handleInputChange("address", e.target.value)}
                      className="bg-gray-800 border-gray-700 text-white mt-2"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="city" className="text-gray-300">
                        Ciudad
                      </Label>
                      <Input
                        id="city"
                        type="text"
                        placeholder="Bogotá"
                        value={formData.city}
                        onChange={(e) => handleInputChange("city", e.target.value)}
                        className="bg-gray-800 border-gray-700 text-white mt-2"
                      />
                    </div>
                    <div>
                      <Label htmlFor="postalCode" className="text-gray-300">
                        Código postal
                      </Label>
                      <Input
                        id="postalCode"
                        type="text"
                        placeholder="110111"
                        value={formData.postalCode}
                        onChange={(e) => handleInputChange("postalCode", e.target.value)}
                        className="bg-gray-800 border-gray-700 text-white mt-2"
                      />
                    </div>
                  </div>
                </div>
              </section>

              {/* Security Notice */}
              <div className="text-center text-gray-400 text-sm">
                Los pagos son procesados de forma segura mediante Stripe. No almacenamos la información de tu tarjeta.
              </div>

              {/* Action Buttons */}
              <div className="space-y-4">
                <Button
                  type="submit"
                  className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-4 text-lg"
                  aria-label={`Pagar ${selectedPlan.price} por plan ${selectedPlan.title}`}
                >
                  PAGAR AHORA
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  className="w-full border-red-600 text-red-600 hover:bg-red-600 hover:text-white py-4 bg-transparent"
                  onClick={() => window.history.back()}
                >
                  Cancelar
                </Button>
              </div>
            </form>
          </div>

          {/* Order Summary */}
          <div className="lg:sticky lg:top-6">
            <div className="bg-gray-900 p-6 rounded-lg">
              <h2 className="text-2xl font-bold text-red-500 mb-4 text-center">{selectedPlan.title}</h2>

              <p className="text-gray-400 text-center mb-6">{selectedPlan.description}</p>

              <div className="text-center mb-6">
                <span className="text-4xl font-bold text-white">{selectedPlan.price}</span>
                <span className="text-gray-400 ml-2">/mes</span>
              </div>

              <div className="space-y-3">
                {selectedPlan.benefits.map((benefit, index) => (
                  <div key={index} className="flex items-center space-x-3">
                    <Check className="w-5 h-5 text-red-500 flex-shrink-0" />
                    <span className="text-gray-300 text-sm">{benefit}</span>
                  </div>
                ))}
              </div>

              <div className="mt-8 pt-6 border-t border-gray-700">
                <div className="flex justify-between items-center text-lg font-semibold">
                  <span>Total:</span>
                  <span className="text-red-500">{selectedPlan.price}</span>
                </div>
                <p className="text-gray-400 text-sm mt-2">Facturación mensual • Cancela en cualquier momento</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
