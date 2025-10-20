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
  const [isAuthorized, setIsAuthorized] = useState(false)
  
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
        console.log("[AuthGuard] 🔍 Verificando autenticación...");
        
        // VERIFICACIÓN CRÍTICA: Revisar localStorage
        const token = localStorage.getItem("fitzone_token");
        const accessToken = localStorage.getItem("accessToken");
        const hasTokenInStorage = !!token || !!accessToken;
        
        console.log("[AuthGuard] Token en localStorage:", hasTokenInStorage);
        console.log("[AuthGuard] Usuario en contexto:", !!user);
        
        // CASO 1: Se requiere autenticación
        if (requireAuth) {
          console.log("[AuthGuard] ✅ Requiere autenticación");
          
          // ❌ NO hay token Y NO hay usuario = RECHAZAR
          if (!hasTokenInStorage && !user) {
            console.log("[AuthGuard] ❌ NO HAY TOKEN NI USUARIO - RECHAZANDO");
            setIsAuthorized(false);
            setIsLoading(false);
            router.push("/login");
            return;
          }
          
          // ⚠️ Hay token en storage pero NO hay usuario = Puede ser temporal
          if (hasTokenInStorage && !user) {
            console.log("[AuthGuard] ⚠️ Token en storage pero sin usuario - esperando contexto");
            setIsLoading(false);
            return;
          }
          
          // ✅ Hay usuario = PERMITIR
          if (user) {
            console.log("[AuthGuard] ✅ Usuario autenticado permitido");
            
            // Verificar roles si es necesario
            if (allowedRoles && !allowedRoles.includes(user.role)) {
              console.log("[AuthGuard] ❌ Rol no permitido:", user.role);
              setIsAuthorized(false);
              setIsLoading(false);
              router.push(getRedirectPath());
              return;
            }
            
            console.log("[AuthGuard] ✅ Acceso autorizado");
            setIsAuthorized(true);
            setIsLoading(false);
            return;
          }
          
          // FALLBACK: No hay nada, rechazar
          console.log("[AuthGuard] ❌ FALLBACK: Rechazando acceso");
          setIsAuthorized(false);
          setIsLoading(false);
          router.push("/login");
          return;
        }
        
        // CASO 2: NO requiere autenticación
        if (!requireAuth) {
          console.log("[AuthGuard] ✅ NO requiere autenticación");
          
          // Si ya está autenticado, redirigir a dashboard
          if (user) {
            console.log("[AuthGuard] ⏭️ Usuario ya autenticado, redirigiendo a dashboard");
            router.push(getRedirectPath());
            return;
          }
          
          // Permitir acceso a página pública
          console.log("[AuthGuard] ✅ Acceso a página pública permitido");
          setIsAuthorized(true);
          setIsLoading(false);
          return;
        }
        
      } catch (error) {
        console.error("[AuthGuard] ❌ Error verificando autenticación:", error);
        if (requireAuth) {
          setIsAuthorized(false);
          router.push("/login");
        } else {
          setIsAuthorized(true);
        }
        setIsLoading(false);
      }
    }

    // Verificar inmediatamente
    checkAuth();
  }, [router, requireAuth, allowedRoles, user, getRedirectPath])

  // Mostrar pantalla de carga
  if (isLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-white text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-500 mx-auto mb-4"></div>
          <p>Verificando acceso...</p>
        </div>
      </div>
    )
  }

  // Si no está autorizado, NO mostrar nada
  if (!isAuthorized) {
    console.log("[AuthGuard] 🚫 Acceso denegado - No mostrando contenido");
    return null;
  }

  // ✅ Acceso autorizado - Mostrar contenido
  console.log("[AuthGuard] ✅ Mostrando contenido autorizado");
  return <>{children}</>;
}
