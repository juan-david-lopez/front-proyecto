"use client"

import { ReactNode } from "react"
import { AuthProvider } from "@/contexts/auth-context"
import { AccessibilityProvider } from "@/components/accessibility-provider"
import { GlobalAccessibilityPanel } from "@/components/global-accessibility-panel"

interface ClientLayoutProps {
  children: ReactNode
}

export function ClientLayout({ children }: ClientLayoutProps) {
  return (
    <AccessibilityProvider>
      <AuthProvider>
        {children}
        <GlobalAccessibilityPanel />
      </AuthProvider>
    </AccessibilityProvider>
  )
}