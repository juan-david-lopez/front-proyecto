"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"

interface AuthGuardProps {
  children: React.ReactNode
  requireAuth?: boolean
}

export function AuthGuard({ children, requireAuth = true }: AuthGuardProps) {
  const router = useRouter()
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null)

  useEffect(() => {
    const checkAuth = () => {
      try {
        const user = localStorage.getItem("user")
        const isAuth = user ? JSON.parse(user).isAuthenticated : false
        setIsAuthenticated(isAuth)

        if (requireAuth && !isAuth) {
          router.push("/login")
        } else if (!requireAuth && isAuth) {
          router.push("/dashboard")
        }
      } catch (error) {
        setIsAuthenticated(false)
        if (requireAuth) {
          router.push("/login")
        }
      }
    }

    checkAuth()
  }, [router, requireAuth])

  if (isAuthenticated === null) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-white">Cargando...</div>
      </div>
    )
  }

  if (requireAuth && !isAuthenticated) {
    return null
  }

  if (!requireAuth && isAuthenticated) {
    return null
  }

  return <>{children}</>
}
