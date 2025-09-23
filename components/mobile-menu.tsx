"use client"

import { useState } from "react"
import Link from "next/link"
import { Menu, X } from "lucide-react"
import { Button } from "@/components/ui/button"

interface MobileMenuProps {
  isOpen: boolean
  onToggle: () => void
}

export function MobileMenu({ isOpen, onToggle }: MobileMenuProps) {
  return (
    <>
      <Button
        variant="ghost"
        size="icon"
        onClick={onToggle}
        className="md:hidden text-white hover:bg-gray-800"
        aria-label={isOpen ? "Cerrar menú" : "Abrir menú"}
      >
        {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
      </Button>

      {isOpen && (
        <div className="absolute top-full left-0 right-0 bg-black border-t border-gray-800 md:hidden z-50">
          <nav className="flex flex-col p-4 space-y-4">
            <Link
              href="/membresias"
              className="text-white hover:text-red-500 transition-colors py-2"
              onClick={onToggle}
            >
              Membresías
            </Link>
            <Link
              href="/clases"
              className="text-white hover:text-red-500 transition-colors py-2"
              onClick={onToggle}
            >
              Clases
            </Link>
            <Link
              href="/instalaciones"
              className="text-white hover:text-red-500 transition-colors py-2"
              onClick={onToggle}
            >
              Instalaciones
            </Link>
            <Link
              href="/contacto"
              className="text-white hover:text-red-500 transition-colors py-2"
              onClick={onToggle}
            >
              Contacto
            </Link>
            <div className="pt-4 border-t border-gray-800 space-y-2">
              <Link href="/login" onClick={onToggle}>
                <Button variant="outline" className="w-full border-gray-600 text-white hover:bg-gray-800">
                  Iniciar sesión
                </Button>
              </Link>
              <Link href="/register" onClick={onToggle}>
                <Button className="w-full bg-red-600 hover:bg-red-700">
                  Registrarse
                </Button>
              </Link>
            </div>
          </nav>
        </div>
      )}
    </>
  )
}

export function Header() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <header className="flex items-center justify-between p-4 bg-gray-800 text-white">
      <div className="text-2xl font-bold">
        <Link href="/">MyLogo</Link>
      </div>
      <nav className={`flex-1 ${isOpen ? "block" : "hidden"} md:block`}>
        <ul className="flex flex-col md:flex-row md:space-x-4">
          <li>
            <Link href="/" className="block py-2 px-3 rounded-md hover:bg-gray-700">
              Home
            </Link>
          </li>
          <li>
            <Link href="/about" className="block py-2 px-3 rounded-md hover:bg-gray-700">
              About
            </Link>
          </li>
          <li>
            <Link href="/services" className="block py-2 px-3 rounded-md hover:bg-gray-700">
              Services
            </Link>
          </li>
          <li>
            <Link href="/contact" className="block py-2 px-3 rounded-md hover:bg-gray-700">
              Contact
            </Link>
          </li>
        </ul>
      </nav>
      <div className="md:hidden">
        <Button onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? <X /> : <Menu />}
        </Button>
      </div>
    </header>
  )
}