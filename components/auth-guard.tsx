"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/contexts/auth-context"

interface AuthGuardProps {
  children: React.ReactNode
  requireAuth?: boolean
  allowedRoles?: string[]
}

export function AuthGuard({ children, requireAuth = true, allowedRoles }: AuthGuardProps) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)
  
  // Usar el hook de manera segura
  let user = null
  let getRedirectPath = () => "/login"
  
  try {
    const auth = useAuth()
    user = auth.user
    getRedirectPath = auth.getRedirectPath
  } catch (error) {
    // Si el AuthProvider no está disponible, manejar graciosamente
    console.warn("AuthGuard usado fuera de AuthProvider")
  }

  useEffect(() => {
    const checkAuth = () => {
      try {
        const token = localStorage.getItem("fitzone_token")
        const isAuth = !!token && !!user
        
        if (requireAuth && !isAuth) {
          router.push("/login")
          return
        } 
        
        if (!requireAuth && isAuth && user) {
          router.push(getRedirectPath())
          return
        }

        // Verificar roles permitidos
        if (allowedRoles && user && !allowedRoles.includes(user.role)) {
          // Redireccionar al dashboard apropiado según el rol
          router.push(getRedirectPath())
          return
        }

        setIsLoading(false)
      } catch (error) {
        if (requireAuth) {
          router.push("/login")
        } else {
          setIsLoading(false)
        }
      }
    }

    // Si no se require auth, podemos continuar inmediatamente sin esperar el contexto
    if (!requireAuth && !user) {
      setIsLoading(false)
      return
    }

    checkAuth()
  }, [router, requireAuth, allowedRoles, user, getRedirectPath])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-white">Cargando...</div>
      </div>
    )
  }

  if (requireAuth && !user) {
    return null
  }

  if (allowedRoles && user && !allowedRoles.includes(user.role)) {
    return null
  }

  if (!requireAuth && user) {
    return null
  }

  return <>{children}</>
}
