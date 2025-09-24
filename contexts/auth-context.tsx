"use client"

import { createContext, useContext, useEffect, useState, ReactNode } from "react"
import { useRouter } from "next/navigation"

interface User {
  id: string
  email: string
  name: string
  membershipType: "basico" | "premium" | "elite" | null
  avatar?: string
}

interface AuthContextType {
  user: User | null
  isLoading: boolean
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>
  register: (email: string, password: string, name: string) => Promise<{ success: boolean; error?: string }>
  logout: () => void
  updateUser: (userData: Partial<User>) => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  // Verificar token al cargar la app
  useEffect(() => {
    checkAuthStatus()
  }, [])

  const checkAuthStatus = async () => {
    try {
      const token = localStorage.getItem("fitzone_token")
      if (!token) {
        setIsLoading(false)
        return
      }

      // Simular validación de token (aquí iría tu API real)
      const userData = localStorage.getItem("fitzone_user")
      if (userData) {
        setUser(JSON.parse(userData))
      }
    } catch (error) {
      console.error("Error checking auth status:", error)
      localStorage.removeItem("fitzone_token")
      localStorage.removeItem("fitzone_user")
    } finally {
      setIsLoading(false)
    }
  }

  const login = async (email: string, password: string) => {
    try {
      setIsLoading(true)

      // Simular llamada a API (reemplazar con tu endpoint real)
      await new Promise(resolve => setTimeout(resolve, 1000))

      // Validación básica para demo
      if (email === "demo@fitzone.com" && password === "123456") {
        const userData: User = {
          id: "1",
          email,
          name: "Usuario Demo",
          membershipType: "premium",
          avatar: "/avatar-placeholder.jpg"
        }

        const token = "demo_token_" + Date.now()
        
        localStorage.setItem("fitzone_token", token)
        localStorage.setItem("fitzone_user", JSON.stringify(userData))
        setUser(userData)

        return { success: true }
      } else {
        return { success: false, error: "Credenciales incorrectas" }
      }
    } catch (error) {
      return { success: false, error: "Error del servidor" }
    } finally {
      setIsLoading(false)
    }
  }

  const register = async (email: string, password: string, name: string) => {
    try {
      setIsLoading(true)

      // Simular llamada a API
      await new Promise(resolve => setTimeout(resolve, 1000))

      const userData: User = {
        id: Date.now().toString(),
        email,
        name,
        membershipType: null
      }

      const token = "token_" + Date.now()
      
      localStorage.setItem("fitzone_token", token)
      localStorage.setItem("fitzone_user", JSON.stringify(userData))
      setUser(userData)

      return { success: true }
    } catch (error) {
      return { success: false, error: "Error al crear la cuenta" }
    } finally {
      setIsLoading(false)
    }
  }

  const logout = () => {
    localStorage.removeItem("fitzone_token")
    localStorage.removeItem("fitzone_user")
    setUser(null)
    router.push("/")
  }

  const updateUser = (userData: Partial<User>) => {
    if (user) {
      const updatedUser = { ...user, ...userData }
      setUser(updatedUser)
      localStorage.setItem("fitzone_user", JSON.stringify(updatedUser))
    }
  }

  return (
    <AuthContext.Provider value={{
      user,
      isLoading,
      login,
      register,
      logout,
      updateUser
    }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}