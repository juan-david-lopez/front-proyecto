"use client"

import { createContext, useContext, useEffect, useState, ReactNode } from "react"
import { useRouter } from "next/navigation"
import { UserRole } from "../types/user"
import { WorkerProfile, DEFAULT_PERMISSIONS } from "../types/worker"
import { clearAuthStorage, hasValidSession, getAuthToken, setAuthToken, getUserData, setUserData, forceCompleteLogout, clearLoginFormData } from "../utils/auth-storage"
import authService from "../services/authService"
import userService from "../services/userService"

interface User {
  id: string
  email: string
  name: string
  membershipType: "basico" | "premium" | "elite" | null
  role: UserRole
  workerProfile?: WorkerProfile
  avatar?: string
}

interface AuthContextType {
  user: User | null
  isLoading: boolean
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string; requiresOtp?: boolean; message?: string }>
  completeLoginWithOtp: (email: string, otp: string) => Promise<{ success: boolean; error?: string }>
  register: (email: string, password: string, name: string) => Promise<{ success: boolean; error?: string }>
  logout: () => void
  updateUser: (userData: Partial<User>) => void
  refreshUser: () => Promise<void>
  hasPermission: (resource: string, action: string) => boolean
  getRedirectPath: () => string
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
      // Verificar si hay tokens guardados
      const token = authService.getAccessToken()
      if (!token) {
        setIsLoading(false)
        return
      }

      console.log("[AuthContext] Verificando estado de autenticación...")

      // Intentar obtener información del usuario guardada
      const savedUserData = authService.getUserInfo()
      if (savedUserData) {
        console.log("[AuthContext] Usuario encontrado en localStorage:", savedUserData)
        setUser(savedUserData)
      } else {
        console.log("[AuthContext] No se encontró información del usuario")
        // Si no hay datos del usuario, limpiar tokens
        authService.clearAuth()
      }
    } catch (error) {
      console.error("[AuthContext] Error verificando autenticación:", error)
      // Limpiar datos en caso de error
      authService.clearAuth()
      localStorage.removeItem("fitzone_token")
      localStorage.removeItem("fitzone_user")
    } finally {
      setIsLoading(false)
    }
  }

  const login = async (email: string, password: string) => {
    try {
      setIsLoading(true)

      console.log("[AuthContext] Intentando login con:", email)
      
      // Primer paso: autenticar credenciales
      const response = await authService.login(email, password)
      
      console.log("[AuthContext] Respuesta del login:", response)

      if (response.success) {
        // El login fue exitoso pero requiere verificación OTP
        console.log("[AuthContext] Credenciales válidas, se requiere OTP")
        
        // Si hay un token temporal, guardarlo para el flujo OTP
        if (response.accessToken) {
          console.log("[AuthContext] Guardando token temporal para OTP:", response.accessToken)
          authService.setTokens(response.accessToken, response.refreshToken || response.accessToken)
        } else if ((response as any).sessionToken || (response.data as any)?.sessionToken) {
          // Posible token de sesión temporal
          const sessionToken = (response as any).sessionToken || (response.data as any)?.sessionToken;
          console.log("[AuthContext] Guardando token de sesión temporal:", sessionToken)
          authService.setTokens(sessionToken, sessionToken)
        } else {
          console.log("[AuthContext] No se recibió token temporal del login inicial")
        }
        
        // Guardar email temporalmente para el flujo OTP
        if (typeof window !== "undefined") {
          sessionStorage.setItem("pending_login_email", email)
        }
        
        // Retornar éxito pero indicando que se requiere OTP
        return { 
          success: true, 
          requiresOtp: true,
          message: "Credenciales válidas. Se ha enviado un código OTP a tu email." 
        }
      } else {
        console.log("[AuthContext] Login fallido:", response.error || response.message)
        return { 
          success: false, 
          error: response.error || response.message || "Credenciales incorrectas" 
        }
      }
    } catch (error: any) {
      console.error("[AuthContext] Error en login:", error)
      return { 
        success: false, 
        error: error.message || "Error del servidor. Intenta nuevamente." 
      }
    } finally {
      setIsLoading(false)
    }
  }

  // Nueva función para completar el login después del OTP
  const completeLoginWithOtp = async (email: string, otp: string) => {
    try {
      console.log("[AuthContext] Verificando OTP para completar login")
      
      // Usar el método específico para login OTP
      const response = await authService.verifyLoginOtp(email, otp)
      
      if (response.success && response.accessToken) {
        // Guardar tokens
        authService.setTokens(
          response.accessToken, 
          response.refreshToken || response.accessToken
        )

        // Extraer idUser del response de diferentes posibles ubicaciones
        const responseAny = response as any;
        const idUser = response.data?.idUser 
          || response.data?.id 
          || responseAny.idUser 
          || responseAny.id
          || responseAny.userId;

        console.log("[AuthContext] ID de usuario detectado:", idUser)
        console.log("[AuthContext] Response data completa:", response.data)

        // Validar que el idUser sea válido (no 0, no undefined, no null)
        if (!idUser || idUser === 0) {
          console.error("[AuthContext] ⚠️ ID de usuario inválido recibido del backend:", idUser)
          
          // Intentar obtener el usuario del backend usando el email
          try {
            console.log("[AuthContext] Intentando obtener usuario por email:", email)
            const userByEmail = await userService.getUserByEmail(email)
            
            if (userByEmail?.idUser) {
              console.log("[AuthContext] ✅ Usuario obtenido por email con ID:", userByEmail.idUser)
              
              // Crear userData con el ID correcto
              const userData: any = {
                id: userByEmail.idUser.toString(),
                idUser: userByEmail.idUser,
                email: userByEmail.email || email,
                name: userByEmail.name || "Usuario",
                membershipType: response.membershipStatus || null,
                role: userByEmail.userRole || UserRole.MEMBER,
                userRole: userByEmail.userRole || UserRole.MEMBER,
                avatar: "/avatar-placeholder.jpg",
                isActive: userByEmail.isActive !== undefined ? userByEmail.isActive : true,
                createdAt: userByEmail.createdAt || new Date().toISOString(),
                updatedAt: userByEmail.updatedAt || new Date().toISOString(),
              }

              // Si es un trabajador, agregar el perfil de trabajador
              if (userData.role !== UserRole.MEMBER) {
                userData.workerProfile = {
                  id: `worker-${userData.id}`,
                  userId: userData.idUser,
                  role: userData.role,
                  permissions: DEFAULT_PERMISSIONS[userData.role as UserRole] || [],
                  isActive: true,
                  createdAt: new Date().toISOString(),
                  updatedAt: new Date().toISOString()
                }
              }

              console.log("[AuthContext] Usuario logueado completamente (recuperado por email):", userData)
              
              // Guardar en localStorage
              setAuthToken(response.accessToken)
              setUserData(userData)
              authService.setUserInfo(userData)
              setUser(userData)

              // Limpiar email temporal
              if (typeof window !== "undefined") {
                sessionStorage.removeItem("pending_login_email")
              }

              return { success: true }
            }
          } catch (emailError) {
            console.error("[AuthContext] Error obteniendo usuario por email:", emailError)
          }
          
          return { 
            success: false, 
            error: "No se pudo obtener la información completa del usuario. Por favor, contacta al administrador." 
          }
        }

        // Crear objeto de usuario básico con los datos disponibles
        const userData: any = {
          id: idUser.toString(),
          idUser: idUser,
          email: email,
          name: response.data?.name || response.data?.firstName || "Usuario",
          membershipType: response.membershipStatus || null,
          role: response.data?.role || response.data?.userRole || UserRole.MEMBER,
          userRole: response.data?.role || response.data?.userRole || UserRole.MEMBER,
          avatar: response.data?.avatar || "/avatar-placeholder.jpg",
          isActive: response.data?.isActive !== undefined ? response.data.isActive : true,
          createdAt: response.data?.createdAt || new Date().toISOString(),
          updatedAt: response.data?.updatedAt || new Date().toISOString(),
        }

        // Si es un trabajador, agregar el perfil de trabajador
        if (userData.role !== UserRole.MEMBER) {
          userData.workerProfile = {
            id: response.data?.workerProfile?.id || `worker-${userData.id}`,
            userId: userData.idUser,
            role: userData.role,
            permissions: DEFAULT_PERMISSIONS[userData.role as UserRole] || [],
            isActive: true,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          }
        }

        console.log("[AuthContext] Usuario logueado completamente:", userData)
        
        // Guardar en localStorage usando las funciones del auth-storage
        setAuthToken(response.accessToken)
        setUserData(userData)
        authService.setUserInfo(userData)
        setUser(userData)

        // Limpiar email temporal
        if (typeof window !== "undefined") {
          sessionStorage.removeItem("pending_login_email")
        }

        return { success: true }
      } else {
        return { 
          success: false, 
          error: response.error || response.message || "Código OTP inválido" 
        }
      }
    } catch (error: any) {
      console.error("[AuthContext] Error verificando OTP:", error)
      return { 
        success: false, 
        error: error.message || "Error verificando código OTP" 
      }
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
        membershipType: null,
        role: UserRole.MEMBER
      }

      const token = "token_" + Date.now()
      
      setAuthToken(token)
      setUserData(userData)
      setUser(userData)

      return { success: true }
    } catch (error) {
      return { success: false, error: "Error al crear la cuenta" }
    } finally {
      setIsLoading(false)
    }
  }

  const logout = () => {
    console.log("[AuthContext] Cerrando sesión...")
    
    // Limpiar datos del servicio de autenticación
    authService.clearAuth()
    
    // Limpiar completamente todos los datos de autenticación y sesión
    forceCompleteLogout()
    
    // Limpiar específicamente los datos de formularios de login
    clearLoginFormData()
    
    // Limpiar estado de la aplicación
    setUser(null)
    
    console.log("[AuthContext] Sesión cerrada correctamente")
    
    // Redirigir al inicio
    router.push("/")
    
    // Opcional: Recargar la página para asegurar limpieza completa
    // Esto garantiza que no queden datos en memoria del navegador
    setTimeout(() => {
      window.location.reload()
    }, 100)
  }

  const updateUser = (userData: Partial<User>) => {
    if (user) {
      const updatedUser = { ...user, ...userData }
      setUser(updatedUser)
      setUserData(updatedUser)
    }
  }

  const refreshUser = async () => {
    try {
      console.log("[AuthContext] Recargando información del usuario desde backend...")
      const token = authService.getAccessToken()
      
      if (!token || !user) {
        console.warn("[AuthContext] No hay token o usuario para recargar")
        return
      }

      // Obtener información actualizada del usuario desde el BACKEND
      console.log("[AuthContext] Obteniendo usuario actualizado del backend con ID:", user.id)
      const updatedUser = await userService.getUserById(parseInt(user.id, 10))
      
      if (updatedUser) {
        console.log("[AuthContext] ✅ Usuario actualizado desde backend:", updatedUser)
        console.log("[AuthContext] 📋 MembershipType del backend:", updatedUser.membershipType)
        console.log("[AuthContext] 📋 Tipo de membershipType:", typeof updatedUser.membershipType)
        
        // Mapear el membershipType del backend al tipo esperado
        let membershipType: "basico" | "premium" | "elite" | null = null
        if (updatedUser.membershipType) {
          const membershipTypeStr = updatedUser.membershipType.toLowerCase()
          console.log("[AuthContext] 🔄 Mapeando membershipType:", membershipTypeStr)
          if (membershipTypeStr === 'basico' || membershipTypeStr === 'basic') {
            membershipType = 'basico'
          } else if (membershipTypeStr === 'premium') {
            membershipType = 'premium'
          } else if (membershipTypeStr === 'elite' || membershipTypeStr === 'vip') {
            membershipType = 'elite'
          }
        } else {
          console.warn("[AuthContext] ⚠️ membershipType es null o undefined, el backend no actualizó el campo")
        }
        
        // Crear el objeto de usuario actualizado manteniendo la estructura
        const refreshedUserData: User = {
          id: updatedUser.idUser.toString(),
          email: updatedUser.email,
          name: updatedUser.name,
          membershipType: membershipType,
          role: updatedUser.userRole || user.role,
          workerProfile: user.workerProfile, // Mantener perfil de trabajador si existe
          avatar: updatedUser.avatar || user.avatar
        }
        
        console.log("[AuthContext] 🔄 Actualizando usuario en contexto y localStorage:", refreshedUserData)
        
        // Actualizar en localStorage
        setUserData(refreshedUserData)
        authService.setUserInfo(refreshedUserData)
        
        // Actualizar estado del contexto
        setUser(refreshedUserData)
        
        console.log("[AuthContext] ✅ Usuario recargado exitosamente con membresía:", refreshedUserData.membershipType)
      }
    } catch (error) {
      console.error("[AuthContext] ❌ Error recargando usuario desde backend:", error)
      throw error // Propagar el error para que la página de éxito lo maneje
    }
  }

  const hasPermission = (resource: string, action: string): boolean => {
    if (!user || !user.workerProfile) return false;
    const permission = user.workerProfile.permissions.find(p => p.resource === resource);
    return permission ? permission.actions.includes(action) : false;
  }

  const getRedirectPath = (): string => {
    if (!user) return "/login";
    
    switch (user.role) {
      case UserRole.ADMIN:
        return "/admin";
      case UserRole.RECEPTIONIST:
        return "/recepcion";
      case UserRole.INSTRUCTOR:
        return "/instructor";
      case UserRole.MEMBER:
        return "/dashboard";
      default:
        return "/dashboard";
    }
  }

  return (
    <AuthContext.Provider value={{
      user,
      isLoading,
      login,
      completeLoginWithOtp,
      register,
      logout,
      updateUser,
      refreshUser,
      hasPermission,
      getRedirectPath
    }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    // Devolver valores por defecto en lugar de lanzar error
    // Esto permite que los componentes se monten correctamente
    console.warn("useAuth used outside of AuthProvider - returning default values")
    return {
      user: null,
      isLoading: false,
      login: async () => ({ success: false, error: "Auth not initialized" }),
      completeLoginWithOtp: async () => ({ success: false, error: "Auth not initialized" }),
      register: async () => ({ success: false, error: "Auth not initialized" }),
      logout: () => {},
      updateUser: () => {},
      refreshUser: async () => {},
      hasPermission: () => false,
      getRedirectPath: () => "/login"
    }
  }
  return context
}