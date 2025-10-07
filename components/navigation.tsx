"use client"

import Link from "next/link"
import { FitZoneLogo } from "@/components/fitzone-logo"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useState } from "react"
import { MobileMenu } from "@/components/mobile-menu"
import { ThemeToggle } from "@/components/theme-toggle"
import { useAuth } from "@/contexts/auth-context"
import { useNavigation } from "@/hooks/use-navigation"
import { LogOut, User, Settings, Users, BarChart3, ArrowLeft, ChevronDown, Bell, Search } from "lucide-react"

export function Navigation() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const { user, logout, getRedirectPath } = useAuth()
  const { goBack } = useNavigation()

  return (
    <>
      {/* Skip link para accesibilidad */}
      <a href="#main-content" className="skip-link">
        Saltar al contenido principal
      </a>
      
      <nav
        className="sticky top-0 z-50 flex items-center justify-between px-6 py-4 bg-theme-primary/90 backdrop-blur-md border-b border-theme transition-all duration-300"
        role="navigation"
        aria-label="Navegación principal"
      >
      {/* Logo estandarizado con responsive */}
      <div className="flex items-center gap-4">
        <div className="fitzone-logo-responsive">
          <FitZoneLogo 
            size="md" 
            variant="dark"
            href="/"
            showText={true}
            className="hidden sm:flex"
          />
          <FitZoneLogo 
            size="md" 
            variant="dark"
            href="/"
            showText={false}
            className="sm:hidden"
          />
        </div>
      </div>

      {/* Links desktop mejorados */}
      <div className="hidden lg:flex items-center space-x-1">
        {user ? (
          // Navegación para usuarios autenticados con mejor diseño
          <>
            {user.role === 'MEMBER' && (
              <>
                <Link href="/dashboard" className="group px-4 py-2 rounded-lg text-theme-primary hover:text-red-400 hover:bg-theme-secondary/20 transition-all duration-200 flex items-center gap-2">
                  <BarChart3 className="h-4 w-4 group-hover:scale-110 transition-transform" />
                  <span>Dashboard</span>
                </Link>
                <Link href="/membresias" className="group px-4 py-2 rounded-lg text-theme-primary hover:text-red-400 hover:bg-theme-secondary/20 transition-all duration-200 flex items-center gap-2">
                  <Users className="h-4 w-4 group-hover:scale-110 transition-transform" />
                  <span>Membresías</span>
                </Link>
                <Link href="/reservas" className="group px-4 py-2 rounded-lg text-theme-primary hover:text-red-400 hover:bg-theme-secondary/20 transition-all duration-200 flex items-center gap-2">
                  <User className="h-4 w-4 group-hover:scale-110 transition-transform" />
                  <span>Reservas</span>
                </Link>
              </>
            )}
            {(user.role === 'ADMIN' || user.role === 'RECEPTIONIST') && (
              <Link href="/recepcion" className="group px-4 py-2 rounded-lg text-theme-primary hover:text-red-400 hover:bg-theme-secondary/20 transition-all duration-200 flex items-center gap-2">
                <Users className="h-4 w-4 group-hover:scale-110 transition-transform" />
                <span>Recepción</span>
              </Link>
            )}
            {(user.role === 'ADMIN' || user.role === 'INSTRUCTOR') && (
              <Link href="/instructor" className="group px-4 py-2 rounded-lg text-theme-primary hover:text-red-400 hover:bg-theme-secondary/20 transition-all duration-200 flex items-center gap-2">
                <User className="h-4 w-4 group-hover:scale-110 transition-transform" />
                <span>Instructor</span>
              </Link>
            )}
            {user.role === 'ADMIN' && (
              <Link href="/admin" className="group px-4 py-2 rounded-lg text-theme-primary hover:text-red-400 hover:bg-theme-secondary/20 transition-all duration-200 flex items-center gap-2">
                <Settings className="h-4 w-4 group-hover:scale-110 transition-transform" />
                <span>Administración</span>
              </Link>
            )}
          </>
        ) : (
          // Navegación para usuarios no autenticados
          <>
            <Link href="/membresias" className="nav-link">
              <span>Membresías</span>
            </Link>
            <Link href="/reservas" className="nav-link">
              <span>Reservas</span>
            </Link>
            <Link href="/#clases" className="nav-link">
              <span>Clases</span>
            </Link>
            <Link href="/#instalaciones" className="nav-link">
              <span>Instalaciones</span>
            </Link>
            <Link href="/contacto" className="nav-link">
              <span>Contacto</span>
            </Link>
          </>
        )}
      </div>

      {/* Actions mejoradas */}
      <div className="hidden lg:flex items-center space-x-4">
        {user ? (
          // Usuario autenticado con mejor diseño
          <div className="flex items-center gap-4">
            {/* Info del usuario mejorada */}
            <div className="flex items-center gap-3 px-3 py-2 bg-theme-secondary/30 rounded-lg border border-theme">
              <div className="w-8 h-8 bg-gradient-to-br from-red-500 to-red-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
                {user.name?.charAt(0).toUpperCase() || 'U'}
              </div>
              <div className="flex flex-col">
                <span className="text-theme-primary text-sm font-medium">{user.name}</span>
                <Badge 
                  variant="secondary" 
                  className={`text-xs px-2 py-0.5 ${
                    user.role === 'ADMIN' ? 'bg-purple-900/50 text-purple-300 border-purple-500/30' :
                    user.role === 'RECEPTIONIST' ? 'bg-blue-900/50 text-blue-300 border-blue-500/30' :
                    user.role === 'INSTRUCTOR' ? 'bg-green-900/50 text-green-300 border-green-500/30' :
                    'bg-theme-secondary text-theme-secondary border-theme'
                  }`}
                >
                  {user.role === 'ADMIN' ? 'Admin' : 
                   user.role === 'RECEPTIONIST' ? 'Recepción' : 
                   user.role === 'INSTRUCTOR' ? 'Instructor' : 'Cliente'}
                </Badge>
              </div>
            </div>
            
            {/* Botones de acción mejorados */}
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={goBack}
                className="text-theme-secondary hover:text-theme-primary hover:bg-theme-secondary/20 transition-all duration-200"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Volver
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={logout}
                className="border-red-500/30 text-red-400 hover:bg-red-500/10 hover:text-red-300 hover:border-red-400/50 transition-all duration-200"
              >
                <LogOut className="h-4 w-4 mr-2" />
                Cerrar sesión
              </Button>
            </div>
          </div>
        ) : (
          // Usuario no autenticado con mejor diseño
          <>
            <ThemeToggle />
            <Link href="/login">
              <Button 
                variant="ghost" 
                className="text-theme-secondary hover:text-theme-primary hover:bg-theme-secondary/20 transition-all duration-300 font-medium hover:scale-105 hover:shadow-lg"
              >
                Iniciar sesión
              </Button>
            </Link>
            <Link href="/register">
              <Button className="btn-primary-red">
                Únete ahora
              </Button>
            </Link>
          </>
        )}
        <ThemeToggle />
      </div>

      {/* Mobile Menu */}
      <MobileMenu 
        isOpen={isMobileMenuOpen} 
        onToggle={() => setIsMobileMenuOpen(!isMobileMenuOpen)} 
      />
    </nav>
    </>
  )
}