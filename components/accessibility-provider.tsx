"use client"

import type React from "react"
import { createContext, useContext, useEffect, useState } from "react"

type Theme = "light" | "dark"
export type FontSize = "small" | "medium" | "large" | "extra-large"

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

const fontSizes: FontSize[] = ["small", "medium", "large", "extra-large"]
const fontSizeToClass = {
  small: "text-sm",
  medium: "text-base",
  large: "text-lg",
  "extra-large": "text-xl",
}

export function AccessibilityProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>("dark")
  const [fontSize, setFontSizeState] = useState<FontSize>("medium")
  const [isInitialized, setIsInitialized] = useState(false)

  useEffect(() => {
    console.log("[v0] AccessibilityProvider initializing...")

    // Load saved preferences from localStorage
    let savedTheme: Theme = "dark"
    let savedFontSize: FontSize = "medium"
    
    try {
      const storedTheme = localStorage.getItem("fitzone-theme") as Theme
      const storedFontSize = localStorage.getItem("fitzone-font-size") as FontSize

      if (storedTheme && (storedTheme === "light" || storedTheme === "dark")) {
        savedTheme = storedTheme
      }
      if (storedFontSize && fontSizes.includes(storedFontSize)) {
        savedFontSize = storedFontSize
      }
    } catch (error) {
      console.warn("[v0] Error accessing localStorage:", error)
    }

    console.log("[v0] Loading theme:", savedTheme, "font size:", savedFontSize)

    // Update states
    setTheme(savedTheme)
    setFontSizeState(savedFontSize)

    // Apply initial theme and font size immediately
    document.documentElement.classList.remove("light", "dark")
    document.documentElement.classList.add(savedTheme)

    const initialFontClass = fontSizeToClass[savedFontSize]
    document.documentElement.classList.remove("text-sm", "text-base", "text-lg", "text-xl")
    document.documentElement.classList.add(initialFontClass)
    
    setIsInitialized(true)
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
    document.documentElement.classList.remove("text-sm", "text-base", "text-lg", "text-xl")
    const fontClass = fontSizeToClass[fontSize as keyof typeof fontSizeToClass]
    console.log("[v0] Font class:", fontClass)
    document.documentElement.classList.add(fontClass)
    localStorage.setItem("fitzone-font-size", fontSize)
  }, [fontSize])

  const toggleTheme = () => {
    console.log("[v0] Toggling theme from:", theme)
    const newTheme = theme === "light" ? "dark" : "light"
    console.log("[v0] New theme will be:", newTheme)
    setTheme(newTheme)
  }

  const setFontSize = (size: FontSize) => {
    console.log("[v0] Setting font size to:", size)
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
    setFontSizeState("medium")
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
