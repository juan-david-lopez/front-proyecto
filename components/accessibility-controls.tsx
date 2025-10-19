"use client"
import { useAccessibility, type FontSize } from "./accessibility-provider"
import { Button } from "@/components/ui/button"
import { Moon, Sun, Type, Minus, Plus } from "lucide-react"

export function AccessibilityControls() {
  const { theme, fontSize, toggleTheme, setFontSize } = useAccessibility()

  const fontSizes: Array<{ value: FontSize; label: string; icon: React.ReactNode }> = [
    { value: "small", label: "Pequeño", icon: <Minus className="h-3 w-3" /> },
    { value: "medium", label: "Mediano", icon: <Type className="h-4 w-4" /> },
    { value: "large", label: "Grande", icon: <Type className="h-5 w-5" /> },
    { value: "extra-large", label: "Extra Grande", icon: <Plus className="h-4 w-4" /> },
  ]

  return (
    <div className="space-y-6">
      {/* Theme Toggle */}
      <div className="space-y-3">
        <h3 className="text-lg font-semibold text-theme-primary">Tema</h3>
        <div className="flex gap-2">
          <Button
            variant={theme === "light" ? "default" : "outline"}
            size="sm"
            onClick={() => theme !== "light" && toggleTheme()}
            className="flex items-center gap-2"
            aria-label="Cambiar a tema claro"
          >
            <Sun className="h-4 w-4" />
            Claro
          </Button>
          <Button
            variant={theme === "dark" ? "default" : "outline"}
            size="sm"
            onClick={() => theme !== "dark" && toggleTheme()}
            className="flex items-center gap-2"
            aria-label="Cambiar a tema oscuro"
          >
            <Moon className="h-4 w-4" />
            Oscuro
          </Button>
        </div>
      </div>

      {/* Font Size Controls */}
      <div className="space-y-3">
        <h3 className="text-lg font-semibold text-theme-primary">Tamaño de Texto</h3>
        <div className="grid grid-cols-2 gap-2">
          {fontSizes.map((size) => (
            <Button
              key={size.value}
              variant={fontSize === size.value ? "default" : "outline"}
              size="sm"
              onClick={() => setFontSize(size.value)}
              className="flex items-center gap-2 justify-start"
              aria-label={`Cambiar tamaño de texto a ${size.label}`}
            >
              {size.icon}
              <span className="text-sm">{size.label}</span>
            </Button>
          ))}
        </div>
      </div>

      {/* Accessibility Info */}
      <div className="p-4 bg-theme-secondary rounded-lg border border-theme">
        <h4 className="font-medium text-theme-primary mb-2">Información de Accesibilidad</h4>
        <ul className="text-sm text-theme-secondary space-y-1">
          <li>• Usa Tab para navegar entre elementos</li>
          <li>• Usa Enter o Espacio para activar botones</li>
          <li>• Usa Escape para cerrar modales</li>
          <li>• Los lectores de pantalla están soportados</li>
        </ul>
      </div>
    </div>
  )
}
