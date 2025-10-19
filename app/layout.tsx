import type React from "react"
import type { Metadata } from "next"
import { GeistSans } from "geist/font/sans"
import { GeistMono } from "geist/font/mono"
import { Analytics } from "@vercel/analytics/next"
import { Suspense } from "react"
import { ClientLayout } from "@/components/client-layout"
import { StorageDebugger } from "@/components/debug/storage-debugger"
import { LogoutVerifier } from "@/components/debug/logout-verifier"
import "./globals.css"

export const metadata: Metadata = {
  title: "FitZone - Tu camino hacia una vida más saludable",
  description: "Transforma tu cuerpo, mente y espíritu con FitZone",
  generator: "v0.app",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="es" suppressHydrationWarning className="dark">
      <body className={`font-sans ${GeistSans.variable} ${GeistMono.variable} bg-theme-primary text-theme-primary`} suppressHydrationWarning>
        <ClientLayout>
          <Suspense fallback={null}>{children}</Suspense>
        </ClientLayout>
        <Analytics />
        {process.env.NODE_ENV === 'development' && (
          <>
            <StorageDebugger />
            <LogoutVerifier />
          </>
        )}
      </body>
    </html>
  )
}
