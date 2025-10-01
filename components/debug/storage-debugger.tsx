"use client"

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Trash2, RefreshCw, Eye, EyeOff } from 'lucide-react'
import { clearAuthStorage, STORAGE_KEYS } from '@/utils/auth-storage'

export function StorageDebugger() {
  const [storageData, setStorageData] = useState<Record<string, string>>({})
  const [showValues, setShowValues] = useState(false)
  const [isVisible, setIsVisible] = useState(false)

  const loadStorageData = () => {
    if (typeof window === 'undefined') return

    const data: Record<string, string> = {}
    Object.keys(localStorage).forEach(key => {
      data[key] = localStorage.getItem(key) || ''
    })
    setStorageData(data)
  }

  useEffect(() => {
    loadStorageData()
  }, [])

  const handleClearAll = () => {
    if (confirm('¿Estás seguro de que quieres limpiar todo el localStorage? Esto cerrará tu sesión.')) {
      clearAuthStorage()
      loadStorageData()
      window.location.reload()
    }
  }

  const handleClearSpecific = (key: string) => {
    if (confirm(`¿Eliminar "${key}" del localStorage?`)) {
      localStorage.removeItem(key)
      loadStorageData()
    }
  }

  const getKeyType = (key: string): 'auth' | 'user' | 'notification' | 'other' => {
    if (key.includes('token') || key.includes('auth')) return 'auth'
    if (key.includes('user') || key.includes('fitzone_user')) return 'user'
    if (key.includes('notification') || key.includes('reservation')) return 'notification'
    return 'other'
  }

  const getKeyBadgeVariant = (type: 'auth' | 'user' | 'notification' | 'other') => {
    switch (type) {
      case 'auth': return 'destructive'
      case 'user': return 'default'
      case 'notification': return 'secondary'
      default: return 'outline'
    }
  }

  if (!isVisible) {
    return (
      <div className="fixed bottom-4 right-4 z-50">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setIsVisible(true)}
          className="bg-white shadow-md"
        >
          🔧 Debug Storage
        </Button>
      </div>
    )
  }

  return (
    <div className="fixed bottom-4 right-4 z-50 w-80">
      <Card className="bg-white shadow-lg">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-sm">Storage Debugger</CardTitle>
              <CardDescription className="text-xs">
                {Object.keys(storageData).length} elementos en localStorage
              </CardDescription>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsVisible(false)}
              className="h-6 w-6 p-0"
            >
              ×
            </Button>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={loadStorageData}
              className="text-xs h-7"
            >
              <RefreshCw className="h-3 w-3 mr-1" />
              Actualizar
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowValues(!showValues)}
              className="text-xs h-7"
            >
              {showValues ? <EyeOff className="h-3 w-3 mr-1" /> : <Eye className="h-3 w-3 mr-1" />}
              Valores
            </Button>
            <Button
              variant="destructive"
              size="sm"
              onClick={handleClearAll}
              className="text-xs h-7"
            >
              <Trash2 className="h-3 w-3 mr-1" />
              Limpiar
            </Button>
          </div>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="max-h-64 overflow-y-auto space-y-2">
            {Object.keys(storageData).length === 0 ? (
              <p className="text-xs text-gray-500 italic">localStorage vacío</p>
            ) : (
              Object.entries(storageData).map(([key, value]) => {
                const type = getKeyType(key)
                return (
                  <div key={key} className="flex items-start justify-between gap-2 p-2 bg-gray-50 rounded text-xs">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1 mb-1">
                        <Badge variant={getKeyBadgeVariant(type)} className="text-xs px-1 py-0">
                          {type}
                        </Badge>
                        <span className="font-mono text-xs truncate">{key}</span>
                      </div>
                      {showValues && (
                        <div className="text-xs text-gray-600 break-all">
                          {value.length > 100 ? `${value.substring(0, 100)}...` : value}
                        </div>
                      )}
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleClearSpecific(key)}
                      className="h-6 w-6 p-0 flex-shrink-0"
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                )
              })
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

// Hook para usar el debugger de storage
export function useStorageDebugger() {
  const clearStorage = () => {
    clearAuthStorage()
    if (typeof window !== 'undefined') {
      window.location.reload()
    }
  }

  const getStorageInfo = () => {
    if (typeof window === 'undefined') return { count: 0, keys: [] }
    
    const keys = Object.keys(localStorage)
    return {
      count: keys.length,
      keys,
      authKeys: keys.filter(k => k.includes('token') || k.includes('auth')),
      userKeys: keys.filter(k => k.includes('user')),
      notificationKeys: keys.filter(k => k.includes('notification') || k.includes('reservation')),
    }
  }

  return {
    clearStorage,
    getStorageInfo,
  }
}