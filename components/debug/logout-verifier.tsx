"use client"

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { AlertCircle, CheckCircle, Info, RefreshCw } from 'lucide-react'
import { forceCompleteLogout, clearLoginFormData } from '@/utils/auth-storage'

export function LogoutVerifier() {
  const [showDetails, setShowDetails] = useState(false)
  const [verificationResult, setVerificationResult] = useState<{
    storage: boolean
    sessionStorage: boolean
    formData: boolean
    cookies: boolean
  } | null>(null)

  const verifyLogoutCleanup = () => {
    if (typeof window === 'undefined') return

    const result = {
      storage: checkLocalStorage(),
      sessionStorage: checkSessionStorage(),
      formData: checkFormData(),
      cookies: checkCookies()
    }

    setVerificationResult(result)
  }

  const checkLocalStorage = (): boolean => {
    const keys = Object.keys(localStorage)
    const authKeys = keys.filter(key => 
      key.startsWith('fitzone_') ||
      key.startsWith('auth_') ||
      key.startsWith('user_') ||
      key.startsWith('access') ||
      key.includes('token')
    )
    return authKeys.length === 0
  }

  const checkSessionStorage = (): boolean => {
    const keys = Object.keys(sessionStorage)
    const authKeys = keys.filter(key => 
      key.startsWith('fitzone_') ||
      key.startsWith('auth_') ||
      key.startsWith('user_') ||
      key.startsWith('access') ||
      key.includes('token')
    )
    return authKeys.length === 0
  }

  const checkFormData = (): boolean => {
    // Verificar si hay elementos de formulario con datos persitentes
    const emailInputs = document.querySelectorAll('input[type="email"]')
    const passwordInputs = document.querySelectorAll('input[type="password"]')
    
    let hasData = false
    emailInputs.forEach(input => {
      if ((input as HTMLInputElement).value) hasData = true
    })
    passwordInputs.forEach(input => {
      if ((input as HTMLInputElement).value) hasData = true
    })
    
    return !hasData
  }

  const checkCookies = (): boolean => {
    const cookies = document.cookie
    const authCookies = ['fitzone_token', 'auth_token', 'session_id', 'remember_token', 'access_token']
    
    return !authCookies.some(cookieName => cookies.includes(cookieName))
  }

  const forceCleanup = () => {
    forceCompleteLogout()
    clearLoginFormData()
    
    // Limpiar formularios visibles
    const forms = document.querySelectorAll('form')
    forms.forEach(form => {
      if (form instanceof HTMLFormElement) {
        form.reset()
      }
    })
    
    setTimeout(() => {
      verifyLogoutCleanup()
    }, 500)
  }

  const getStatusIcon = (status: boolean) => {
    return status ? (
      <CheckCircle className="h-4 w-4 text-green-500" />
    ) : (
      <AlertCircle className="h-4 w-4 text-red-500" />
    )
  }

  const getStatusText = (status: boolean) => {
    return status ? 'Limpio' : 'Contiene datos'
  }

  if (!showDetails) {
    return (
      <div className="fixed bottom-20 right-4 z-50">
        <Button
          variant="outline"
          size="sm"
          onClick={() => {
            setShowDetails(true)
            verifyLogoutCleanup()
          }}
          className="bg-white shadow-md"
        >
          🔍 Verificar Logout
        </Button>
      </div>
    )
  }

  return (
    <div className="fixed bottom-4 left-4 z-50 w-80">
      <Card className="bg-white shadow-lg">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-sm">Verificación de Logout</CardTitle>
              <CardDescription className="text-xs">
                Estado después del cierre de sesión
              </CardDescription>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowDetails(false)}
              className="h-6 w-6 p-0"
            >
              ×
            </Button>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={verifyLogoutCleanup}
              className="text-xs h-7"
            >
              <RefreshCw className="h-3 w-3 mr-1" />
              Verificar
            </Button>
            <Button
              variant="destructive"
              size="sm"
              onClick={forceCleanup}
              className="text-xs h-7"
            >
              Forzar Limpieza
            </Button>
          </div>
        </CardHeader>
        <CardContent className="pt-0">
          {verificationResult ? (
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span>LocalStorage:</span>
                <div className="flex items-center gap-1">
                  {getStatusIcon(verificationResult.storage)}
                  <span className={verificationResult.storage ? 'text-green-600' : 'text-red-600'}>
                    {getStatusText(verificationResult.storage)}
                  </span>
                </div>
              </div>
              
              <div className="flex items-center justify-between text-xs">
                <span>SessionStorage:</span>
                <div className="flex items-center gap-1">
                  {getStatusIcon(verificationResult.sessionStorage)}
                  <span className={verificationResult.sessionStorage ? 'text-green-600' : 'text-red-600'}>
                    {getStatusText(verificationResult.sessionStorage)}
                  </span>
                </div>
              </div>
              
              <div className="flex items-center justify-between text-xs">
                <span>Datos de Formulario:</span>
                <div className="flex items-center gap-1">
                  {getStatusIcon(verificationResult.formData)}
                  <span className={verificationResult.formData ? 'text-green-600' : 'text-red-600'}>
                    {getStatusText(verificationResult.formData)}
                  </span>
                </div>
              </div>
              
              <div className="flex items-center justify-between text-xs">
                <span>Cookies:</span>
                <div className="flex items-center gap-1">
                  {getStatusIcon(verificationResult.cookies)}
                  <span className={verificationResult.cookies ? 'text-green-600' : 'text-red-600'}>
                    {getStatusText(verificationResult.cookies)}
                  </span>
                </div>
              </div>
              
              <div className="mt-3 p-2 bg-gray-50 rounded text-xs">
                <div className="flex items-center gap-1 mb-1">
                  <Info className="h-3 w-3" />
                  <span className="font-medium">Estado General:</span>
                </div>
                <span className={
                  Object.values(verificationResult).every(Boolean) 
                    ? 'text-green-600 font-medium' 
                    : 'text-orange-600'
                }>
                  {Object.values(verificationResult).every(Boolean)
                    ? '✅ Logout completamente limpio'
                    : '⚠️ Algunos datos persisten'
                  }
                </span>
              </div>
            </div>
          ) : (
            <p className="text-xs text-gray-500 italic">
              Haz clic en "Verificar" para comprobar el estado
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  )
}