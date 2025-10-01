"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

interface LoadingSpinnerProps {
  size?: "sm" | "md" | "lg"
  className?: string
  "aria-label"?: string
}

export function LoadingSpinner({ 
  size = "md", 
  className,
  "aria-label": ariaLabel = "Cargando..."
}: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: "w-4 h-4",
    md: "w-6 h-6", 
    lg: "w-8 h-8"
  }

  return (
    <div
      role="status"
      aria-label={ariaLabel}
      className={cn("fitzone-loader", sizeClasses[size], className)}
    >
      <span className="sr-only">{ariaLabel}</span>
    </div>
  )
}

interface SkeletonProps {
  className?: string
  children?: React.ReactNode
}

export function Skeleton({ className, children, ...props }: SkeletonProps) {
  return (
    <div
      className={cn("fitzone-skeleton", className)}
      {...props}
    >
      {children}
    </div>
  )
}

// Componente de estado vacío accesible
interface EmptyStateProps {
  title: string
  description?: string
  icon?: React.ReactNode
  action?: React.ReactNode
  className?: string
}

export function EmptyState({ 
  title, 
  description, 
  icon, 
  action, 
  className 
}: EmptyStateProps) {
  return (
    <div 
      className={cn(
        "flex flex-col items-center justify-center text-center p-8 min-h-[200px]",
        className
      )}
      role="region"
      aria-labelledby="empty-state-title"
    >
      {icon && (
        <div className="mb-4 text-gray-400" aria-hidden="true">
          {icon}
        </div>
      )}
      
      <h3 
        id="empty-state-title"
        className="text-lg font-semibold text-gray-900 mb-2"
      >
        {title}
      </h3>
      
      {description && (
        <p className="text-gray-600 mb-4 max-w-sm">
          {description}
        </p>
      )}
      
      {action && action}
    </div>
  )
}