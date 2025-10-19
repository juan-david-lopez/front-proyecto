"use client"

import { useEffect, useState } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { CheckCircle, Loader2 } from 'lucide-react'
import paymentService from '@/services/paymentService'
import { useAuth } from '@/contexts/auth-context'

export default function CheckoutSuccessPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const { refreshUser } = useAuth()
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const sessionId = searchParams.get('session_id')
    
    if (!sessionId) {
      setError('No se encontró el ID de sesión')
      setLoading(false)
      return
    }

    const verifyPayment = async () => {
      try {
        console.log('✅ Verificando pago con session_id:', sessionId)
        
        // Esperar más tiempo para que el backend procese el webhook de Stripe
        console.log('⏳ Esperando 5 segundos para procesamiento del backend...')
        await new Promise(resolve => setTimeout(resolve, 5000))
        
        // Recargar información del usuario desde el backend
        console.log('🔄 Recargando información del usuario desde backend...')
        await refreshUser()
        console.log('✅ Usuario recargado exitosamente')
        
        // Esperar un poco más para que el estado se actualice
        console.log('⏳ Esperando actualización de estado...')
        await new Promise(resolve => setTimeout(resolve, 1500))
        
        // Marcar como completado
        setLoading(false)
        
        // Esperar un momento para mostrar mensaje de éxito
        await new Promise(resolve => setTimeout(resolve, 2000))
        
        // Redirigir al dashboard de membresía
        console.log('➡️ Redirigiendo al dashboard de membresía...')
        router.push('/dashboard/membresia')
        
      } catch (err) {
        console.error('❌ Error verificando pago:', err)
        setError('Error al verificar el pago. Por favor contacta a soporte si el problema persiste.')
        setLoading(false)
      }
    }

    verifyPayment()
  }, [searchParams, refreshUser, router])

  if (error) {
    return (
      <div className="min-h-screen bg-theme-primary flex items-center justify-center p-4">
        <Card className="card-theme max-w-md w-full">
          <CardContent className="pt-6">
            <div className="text-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-red-500/20 flex items-center justify-center mx-auto">
                <span className="text-3xl">⚠️</span>
              </div>
              <h1 className="text-2xl font-bold text-theme-primary">Error en el Pago</h1>
              <p className="text-theme-secondary">{error}</p>
              <div className="flex gap-2 justify-center pt-4">
                <Button onClick={() => router.push('/membresias')} variant="outline">
                  Ver Planes
                </Button>
                <Button onClick={() => router.push('/dashboard')}>
                  Ir al Dashboard
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-theme-primary flex items-center justify-center p-4">
      <Card className="card-theme max-w-md w-full">
        <CardContent className="pt-6">
          <div className="text-center space-y-4">
            {loading ? (
              <>
                <Loader2 className="w-16 h-16 text-[#ff6b00] animate-spin mx-auto" />
                <h1 className="text-2xl font-bold text-theme-primary">
                  Procesando tu Pago...
                </h1>
                <p className="text-theme-secondary">
                  Estamos verificando tu pago y activando tu membresía.
                  <br />
                  Por favor espera un momento.
                </p>
              </>
            ) : (
              <>
                <CheckCircle className="w-16 h-16 text-green-500 mx-auto" />
                <h1 className="text-2xl font-bold text-theme-primary">
                  ¡Pago Exitoso!
                </h1>
                <p className="text-theme-secondary">
                  Tu membresía ha sido activada exitosamente.
                  <br />
                  Serás redirigido al dashboard en un momento...
                </p>
              </>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
