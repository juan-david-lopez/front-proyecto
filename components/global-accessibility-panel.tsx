"use client"

import { useState } from "react"
import { useAccessibility } from "./accessibility-provider"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Sun, Moon, Type, Plus, Minus, X, Accessibility } from "lucide-react"

export function GlobalAccessibilityPanel() {
  const [isOpen, setIsOpen] = useState(false)
  const { theme, fontSize, toggleTheme, increaseFontSize, decreaseFontSize, resetFontSize } = useAccessibility()

  const fontSizeLabels = {
    "text-xs": "Muy Pequeño",
    "text-sm": "Pequeño",
    "text-base": "Normal",
    "text-lg": "Grande",
    "text-xl": "Muy Grande",
    "text-2xl": "Extra Grande",
  }

  const handleToggleTheme = () => {
    console.log("[v0] Toggling theme from:", theme)
    toggleTheme()
  }

  const handleIncreaseFontSize = () => {
    console.log("[v0] Increasing font size from:", fontSize)
    increaseFontSize()
  }

  const handleDecreaseFontSize = () => {
    console.log("[v0] Decreasing font size from:", fontSize)
    decreaseFontSize()
  }

  const handleResetFontSize = () => {
    console.log("[v0] Resetting font size")
    resetFontSize()
  }

  return (
    <>
      {/* Floating Accessibility Button */}
      <Button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 z-50 h-14 w-14 rounded-full bg-red-600 hover:bg-red-700 text-white shadow-lg transition-all duration-300 hover:scale-110"
        aria-label="Abrir panel de accesibilidad"
        title="Configuración de Accesibilidad"
      >
        <Accessibility className="h-6 w-6" />
      </Button>

      {/* Accessibility Panel Overlay */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <Card className="w-full max-w-md mx-4 bg-background border-border shadow-2xl">
            <div className="p-6">
              {/* Header */}
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-red-600 rounded-lg">
                    <Accessibility className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <h2 className="text-lg font-semibold text-foreground">Accesibilidad</h2>
                    <p className="text-sm text-muted-foreground">Personaliza tu experiencia</p>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsOpen(false)}
                  className="h-8 w-8 p-0 hover:bg-muted"
                  aria-label="Cerrar panel"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>

              {/* Theme Toggle */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    {theme === "dark" ? (
                      <Moon className="h-5 w-5 text-muted-foreground" />
                    ) : (
                      <Sun className="h-5 w-5 text-muted-foreground" />
                    )}
                    <div>
                      <p className="font-medium text-foreground">Tema</p>
                      <p className="text-sm text-muted-foreground">{theme === "dark" ? "Modo Oscuro" : "Modo Claro"}</p>
                    </div>
                  </div>
                  <Button
                    onClick={handleToggleTheme}
                    variant="outline"
                    size="sm"
                    className="min-w-[80px] bg-transparent"
                    aria-label={`Cambiar a ${theme === "dark" ? "modo claro" : "modo oscuro"}`}
                  >
                    {theme === "dark" ? (
                      <>
                        <Sun className="h-4 w-4 mr-2" />
                        Claro
                      </>
                    ) : (
                      <>
                        <Moon className="h-4 w-4 mr-2" />
                        Oscuro
                      </>
                    )}
                  </Button>
                </div>

                {/* Font Size Controls */}
                <div className="border-t border-border pt-4">
                  <div className="flex items-center gap-3 mb-3">
                    <Type className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="font-medium text-foreground">Tamaño de Texto</p>
                      <p className="text-sm text-muted-foreground">
                        {fontSizeLabels[fontSize as keyof typeof fontSizeLabels]}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <Button
                      onClick={handleDecreaseFontSize}
                      variant="outline"
                      size="sm"
                      className="flex-1 bg-transparent"
                      aria-label="Disminuir tamaño de texto"
                    >
                      <Minus className="h-4 w-4 mr-2" />
                      Menor
                    </Button>
                    <Button
                      onClick={handleResetFontSize}
                      variant="outline"
                      size="sm"
                      className="px-3 bg-transparent"
                      aria-label="Restablecer tamaño de texto"
                      title="Restablecer a tamaño normal"
                    >
                      <Type className="h-4 w-4" />
                    </Button>
                    <Button
                      onClick={handleIncreaseFontSize}
                      variant="outline"
                      size="sm"
                      className="flex-1 bg-transparent"
                      aria-label="Aumentar tamaño de texto"
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Mayor
                    </Button>
                  </div>
                </div>

                {/* Preview Text */}
                <div className="border-t border-border pt-4">
                  <p className="text-sm text-muted-foreground mb-2">Vista previa:</p>
                  <div className="p-3 bg-muted rounded-lg">
                    <p className="text-foreground font-medium">FitZone</p>
                    <p className="text-muted-foreground text-sm">Tu camino hacia una vida más saludable</p>
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="mt-6 pt-4 border-t border-border">
                <Button onClick={() => setIsOpen(false)} className="w-full bg-red-600 hover:bg-red-700 text-white">
                  Aplicar Cambios
                </Button>
              </div>
            </div>
          </Card>
        </div>
      )}
    </>
  )
}
