"use client"

import type React from "react"
import { createContext, useContext, useEffect, useState } from "react"

type Theme = "light" | "dark"
type FontSize = "text-xs" | "text-sm" | "text-base" | "text-lg" | "text-xl" | "text-2xl"

interface AccessibilityContextType {
  theme: Theme
  fontSize: FontSize
  toggleTheme: () => void
  setFontSize: (size: FontSize) => void
  increaseFontSize: () => void
  decreaseFontSize: () => void
  resetFontSize: () => void
}

const AccessibilityContext = createContext<AccessibilityContextType | undefined>(undefined)

const fontSizes: FontSize[] = ["text-xs", "text-sm", "text-base", "text-lg", "text-xl", "text-2xl"]
const fontSizeToClass = {
  "text-xs": "font-small",
  "text-sm": "font-small",
  "text-base": "font-medium",
  "text-lg": "font-medium",
  "text-xl": "font-large",
  "text-2xl": "font-extra-large",
}

export function AccessibilityProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>("dark")
  const [fontSize, setFontSizeState] = useState<FontSize>("text-base")

  useEffect(() => {
    console.log("[v0] AccessibilityProvider initializing...")

    // Load saved preferences from localStorage
    const savedTheme = localStorage.getItem("fitzone-theme") as Theme
    const savedFontSize = localStorage.getItem("fitzone-font-size") as FontSize

    console.log("[v0] Saved theme:", savedTheme, "Saved font size:", savedFontSize)

    if (savedTheme) {
      setTheme(savedTheme)
    }
    if (savedFontSize && fontSizes.includes(savedFontSize)) {
      setFontSizeState(savedFontSize)
    }

    // Apply initial theme and font size immediately
    document.documentElement.classList.remove("light", "dark")
    document.documentElement.classList.add(savedTheme || "dark")

    const initialFontClass = fontSizeToClass[(savedFontSize || "text-base") as keyof typeof fontSizeToClass]
    document.documentElement.classList.remove("font-small", "font-medium", "font-large", "font-extra-large")
    document.documentElement.classList.add(initialFontClass)
  }, [])

  useEffect(() => {
    console.log("[v0] Applying theme:", theme)

    // Apply theme to document
    document.documentElement.classList.remove("light", "dark")
    document.documentElement.classList.add(theme)
    localStorage.setItem("fitzone-theme", theme)
  }, [theme])

  useEffect(() => {
    console.log("[v0] Applying font size:", fontSize)

    // Apply font size to document
    document.documentElement.classList.remove("font-small", "font-medium", "font-large", "font-extra-large")
    const fontClass = fontSizeToClass[fontSize as keyof typeof fontSizeToClass]
    console.log("[v0] Font class:", fontClass)
    document.documentElement.classList.add(fontClass)
    localStorage.setItem("fitzone-font-size", fontSize)
  }, [fontSize])

  const toggleTheme = () => {
    setTheme((prev) => (prev === "light" ? "dark" : "light"))
  }

  const setFontSize = (size: FontSize) => {
    setFontSizeState(size)
  }

  const increaseFontSize = () => {
    const currentIndex = fontSizes.indexOf(fontSize)
    if (currentIndex < fontSizes.length - 1) {
      setFontSizeState(fontSizes[currentIndex + 1])
    }
  }

  const decreaseFontSize = () => {
    const currentIndex = fontSizes.indexOf(fontSize)
    if (currentIndex > 0) {
      setFontSizeState(fontSizes[currentIndex - 1])
    }
  }

  const resetFontSize = () => {
    setFontSizeState("text-base")
  }

  return (
    <AccessibilityContext.Provider
      value={{
        theme,
        fontSize,
        toggleTheme,
        setFontSize,
        increaseFontSize,
        decreaseFontSize,
        resetFontSize,
      }}
    >
      {children}
    </AccessibilityContext.Provider>
  )
}

export function useAccessibility() {
  const context = useContext(AccessibilityContext)
  if (context === undefined) {
    throw new Error("useAccessibility must be used within an AccessibilityProvider")
  }
  return context
}
