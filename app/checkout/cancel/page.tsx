"use client"

import { useRouter } from 'next/navigation'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { XCircle } from 'lucide-react'

export default function CheckoutCancelPage() {
  const router = useRouter()

  return (
    <div className="min-h-screen bg-theme-primary flex items-center justify-center p-4">
      <Card className="card-theme max-w-md w-full">
        <CardContent className="pt-6">
          <div className="text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-yellow-500/20 flex items-center justify-center mx-auto">
              <XCircle className="w-10 h-10 text-yellow-500" />
            </div>
            
            <h1 className="text-2xl font-bold text-theme-primary">
              Pago Cancelado
            </h1>
            
            <p className="text-theme-secondary">
              Has cancelado el proceso de pago.
              <br />
              No se realizó ningún cargo a tu tarjeta.
            </p>

            <div className="pt-4 space-y-2">
              <p className="text-sm text-theme-secondary">
                ¿Tuviste algún problema? No dudes en contactarnos.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-2 justify-center pt-4">
              <Button 
                onClick={() => router.push('/membresias')}
                className="bg-[#ff6b00] hover:bg-[#ff6b00]/90"
              >
                Ver Planes Nuevamente
              </Button>
              
              <Button 
                onClick={() => router.push('/dashboard')}
                variant="outline"
              >
                Ir al Dashboard
              </Button>
            </div>

            <div className="pt-4 border-t border-theme">
              <Button 
                onClick={() => router.push('/contacto')}
                variant="ghost"
                className="text-sm"
              >
                ¿Necesitas ayuda? Contáctanos
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
