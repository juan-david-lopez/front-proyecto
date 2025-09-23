"use client"

import * as React from "react"
import { X } from "lucide-react"
import { cn } from "@/lib/utils"

interface ToastProps {
  title?: string
  description?: string
  type?: "success" | "error" | "warning" | "info"
  onClose?: () => void
}

export function Toast({ title, description, type = "info", onClose }: ToastProps) {
  React.useEffect(() => {
    const timer = setTimeout(() => {
      onClose?.()
    }, 5000)

    return () => clearTimeout(timer)
  }, [onClose])

  const typeStyles = {
    success: "bg-green-500 border-green-600",
    error: "bg-red-500 border-red-600",
    warning: "bg-yellow-500 border-yellow-600",
    info: "bg-blue-500 border-blue-600"
  }

  return (
    <div className={cn(
      "fixed top-4 right-4 z-50 p-4 rounded-lg border text-white shadow-lg animate-in slide-in-from-top-2",
      typeStyles[type]
    )}>
      <div className="flex items-start justify-between">
        <div>
          {title && <h4 className="font-semibold mb-1">{title}</h4>}
          {description && <p className="text-sm opacity-90">{description}</p>}
        </div>
        {onClose && (
          <button
            onClick={onClose}
            className="ml-4 opacity-70 hover:opacity-100"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>
    </div>
  )
}