"use client"

import * as React from "react"
import { X, CheckCircle, AlertTriangle, Info, XCircle } from "lucide-react"
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

  const typeConfig = {
    success: {
      icon: CheckCircle,
      className: "bg-gradient-to-r from-green-500 to-emerald-600 border border-green-400/50",
      iconColor: "text-green-100"
    },
    error: {
      icon: XCircle,
      className: "bg-gradient-to-r from-red-500 to-rose-600 border border-red-400/50",
      iconColor: "text-red-100"
    },
    warning: {
      icon: AlertTriangle,
      className: "bg-gradient-to-r from-amber-500 to-orange-600 border border-amber-400/50",
      iconColor: "text-amber-100"
    },
    info: {
      icon: Info,
      className: "bg-gradient-to-r from-blue-500 to-indigo-600 border border-blue-400/50",
      iconColor: "text-blue-100"
    }
  }

  const config = typeConfig[type]
  const Icon = config.icon

  return (
    <div 
      role="alert"
      aria-live="polite"
      aria-atomic="true"
      className={cn(
        "fixed top-4 right-4 z-50 p-4 rounded-xl text-white shadow-2xl backdrop-blur-sm transition-all duration-300 ease-out animate-in slide-in-from-top-2 hover:shadow-3xl hover:scale-105 min-w-[320px] max-w-[480px]",
        config.className
      )}
    >
      <div className="flex items-start gap-3">
        <Icon className={cn("h-5 w-5 mt-0.5 flex-shrink-0", config.iconColor)} aria-hidden="true" />
        <div className="flex-1">
          {title && <h4 className="font-semibold mb-1 text-white text-base">{title}</h4>}
          {description && <p className="text-sm text-white/90 leading-relaxed">{description}</p>}
        </div>
        {onClose && (
          <button
            onClick={onClose}
            aria-label="Cerrar notificación"
            className="ml-2 p-2 rounded-full opacity-70 hover:opacity-100 hover:bg-white/20 transition-all duration-200 min-h-[44px] min-w-[44px] flex items-center justify-center"
          >
            <X className="h-4 w-4" aria-hidden="true" />
          </button>
        )}
      </div>
    </div>
  )
}