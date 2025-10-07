"use client"

import { Moon, Sun } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useAccessibility } from "@/components/accessibility-provider"

export function ThemeToggle() {
  const { theme, toggleTheme } = useAccessibility()

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={toggleTheme}
      className="relative rounded-full transition-all duration-300 hover:scale-110 hover:bg-theme-secondary/20"
      aria-label={theme === "dark" ? "Cambiar a tema claro" : "Cambiar a tema oscuro"}
      title={theme === "dark" ? "Tema claro" : "Tema oscuro"}
    >
      {theme === "dark" ? (
        <Sun className="h-5 w-5 text-yellow-400 transition-all duration-300 hover:rotate-90" />
      ) : (
        <Moon className="h-5 w-5 text-gray-700 transition-all duration-300 hover:-rotate-12" />
      )}
    </Button>
  )
}
