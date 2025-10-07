"use client"

import Link from "next/link"
import { Menu, X, LogOut, ArrowLeft, User, Settings, Users, BarChart3 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useAuth } from "@/contexts/auth-context"
import { useNavigation } from "@/hooks/use-navigation"

interface MobileMenuProps {
  isOpen: boolean
  onToggle: () => void
}

export function MobileMenu({ isOpen, onToggle }: MobileMenuProps) {
  const { user, logout } = useAuth()
  const { goBack } = useNavigation()

  const handleLogout = () => {
    logout()
    onToggle() // Cerrar el menú después de cerrar sesión
  }

  const handleGoBack = () => {
    goBack()
    onToggle() // Cerrar el menú después de navegar
  }

  return (
    <>
      <Button
        variant="ghost"
        size="icon"
        onClick={onToggle}
        className="md:hidden text-theme-primary hover:bg-theme-secondary/20"
        aria-label={isOpen ? "Cerrar menú" : "Abrir menú"}
      >
        {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
      </Button>

      {isOpen && (
        <div className="absolute top-full left-0 right-0 bg-theme-primary border-t border-theme md:hidden z-50">
          <nav className="flex flex-col p-4 space-y-4">
            {user ? (
              // Usuario autenticado
              <>
                {/* Información del usuario */}
                <div className="pb-2 border-b border-theme">
                  <div className="text-theme-primary text-sm mb-1">{user.name}</div>
                  <Badge variant="secondary" className="text-xs">
                    {user.role === 'ADMIN' ? 'Administrador' : 
                     user.role === 'RECEPTIONIST' ? 'Recepcionista' : 
                     user.role === 'INSTRUCTOR' ? 'Instructor' : 'Cliente'}
                  </Badge>
                </div>

                {/* Navegación específica por rol */}
                {user.role === 'RECEPTIONIST' && (
                  <Link
                    href="/recepcion"
                    className="text-theme-primary hover:text-red-500 transition-colors py-2 flex items-center gap-2"
                    onClick={onToggle}
                  >
                    <Users className="h-4 w-4" />
                    Recepción
                  </Link>
                )}
                {user.role === 'INSTRUCTOR' && (
                  <Link
                    href="/instructor"
                    className="text-theme-primary hover:text-red-500 transition-colors py-2 flex items-center gap-2"
                    onClick={onToggle}
                  >
                    <User className="h-4 w-4" />
                    Instructor
                  </Link>
                )}
                {user.role === 'ADMIN' && (
                  <Link
                    href="/admin"
                    className="text-theme-primary hover:text-red-500 transition-colors py-2 flex items-center gap-2"
                    onClick={onToggle}
                  >
                    <Settings className="h-4 w-4" />
                    Administración
                  </Link>
                )}

                {/* Acciones del usuario */}
                <div className="pt-4 border-t border-theme space-y-2">
                  <Button
                    variant="outline"
                    className="w-full border-theme text-theme-secondary hover:bg-theme-secondary/20 hover:text-theme-primary"
                    onClick={handleGoBack}
                  >
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Volver
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full border-red-600 text-red-600 hover:bg-red-600 hover:text-white"
                    onClick={handleLogout}
                  >
                    <LogOut className="h-4 w-4 mr-2" />
                    Cerrar sesión
                  </Button>
                </div>
              </>
            ) : (
              // Usuario no autenticado
              <>
                <Link
                  href="/membresias"
                  className="nav-link"
                  onClick={onToggle}
                >
                  Membresías
                </Link>
                <Link
                  href="/reservas"
                  className="nav-link"
                  onClick={onToggle}
                >
                  Reservas
                </Link>
                <Link
                  href="/clases"
                  className="nav-link"
                  onClick={onToggle}
                >
                  Clases
                </Link>
                <Link
                  href="/instalaciones"
                  className="nav-link"
                  onClick={onToggle}
                >
                  Instalaciones
                </Link>
                <Link
                  href="/contacto"
                  className="nav-link"
                  onClick={onToggle}
                >
                  Contacto
                </Link>
                <div className="pt-4 border-t border-theme space-y-2">
                  <Link href="/login" onClick={onToggle}>
                    <Button variant="outline" className="w-full border-theme text-theme-primary hover:bg-theme-secondary/20 hover:border-theme transition-all duration-300 hover:scale-105 hover:shadow-lg">
                      Iniciar sesión
                    </Button>
                  </Link>
                  <Link href="/register" onClick={onToggle}>
                    <Button className="btn-primary-red w-full">
                      Registrarse
                    </Button>
                  </Link>
                </div>
              </>
            )}
          </nav>
        </div>
      )}
    </>
  )
}