"use client"

import { useRouter } from "next/navigation"
import { useCallback } from "react"

export function useNavigation() {
  const router = useRouter()

  const goBack = useCallback(() => {
    // Intentar ir hacia atrás en el historial del navegador
    if (typeof window !== 'undefined') {
      if (window.history.length > 1) {
        window.history.back()
      } else {
        // Si no hay historial, ir a la página principal
        router.push('/')
      }
    }
  }, [router])

  const goHome = useCallback(() => {
    router.push('/')
  }, [router])

  return {
    goBack,
    goHome,
    push: router.push,
    replace: router.replace
  }
}