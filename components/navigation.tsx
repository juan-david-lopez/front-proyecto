"use client"

import Link from "next/link"
import { FitZoneLogo } from "@/components/fitzone-logo"
import { Button } from "@/components/ui/button"
import { useState } from "react"
import { MobileMenu } from "@/components/mobile-menu"

export function Navigation() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  return (
    <nav
      className="flex items-center justify-between px-6 py-4 bg-black"
      role="navigation"
      aria-label="Navegación principal"
    >
      {/* Logo */}
      <FitZoneLogo />

      {/* Links desktop */}
      <div className="hidden md:flex items-center space-x-8">
        <Link href="/membresias" className="text-white hover:text-red-500 transition-colors">
          Membresías
        </Link>
        <Link href="/clases" className="text-white hover:text-red-500 transition-colors">
          Clases
        </Link>
        <Link href="/instalaciones" className="text-white hover:text-red-500 transition-colors">
          Instalaciones
        </Link>
        <Link href="/contacto" className="text-white hover:text-red-500 transition-colors">
          Contacto
        </Link>
      </div>

      {/* Actions */}
      <div className="hidden md:flex items-center space-x-4">
        <Link href="/login">
          <Button variant="secondary" className="bg-gray-700 hover:bg-gray-600 text-white">
            Iniciar sesión
          </Button>
        </Link>
        <Link href="/register">
          <Button className="bg-red-600 hover:bg-red-700 text-white">
            Registrarse
          </Button>
        </Link>
      </div>

      {/* Mobile Menu */}
      <MobileMenu 
        isOpen={isMobileMenuOpen} 
        onToggle={() => setIsMobileMenuOpen(!isMobileMenuOpen)} 
      />
    </nav>
  )
}