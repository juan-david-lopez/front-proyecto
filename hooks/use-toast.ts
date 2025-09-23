"use client"

import { useState, useCallback } from "react"

interface ToastState {
  id: string
  title?: string
  description?: string
  type?: "success" | "error" | "warning" | "info"
}

export function useToast() {
  const [toasts, setToasts] = useState<ToastState[]>([])

  const addToast = useCallback((toast: Omit<ToastState, "id">) => {
    const id = Math.random().toString(36).substr(2, 9)
    setToasts(prev => [...prev, { ...toast, id }])
  }, [])

  const removeToast = useCallback((id: string) => {
    setToasts(prev => prev.filter(toast => toast.id !== id))
  }, [])

  const success = useCallback((title: string, description?: string) => {
    addToast({ title, description, type: "success" })
  }, [addToast])

  const error = useCallback((title: string, description?: string) => {
    addToast({ title, description, type: "error" })
  }, [addToast])

  const warning = useCallback((title: string, description?: string) => {
    addToast({ title, description, type: "warning" })
  }, [addToast])

  const info = useCallback((title: string, description?: string) => {
    addToast({ title, description, type: "info" })
  }, [addToast])

  return {
    toasts,
    addToast,
    removeToast,
    success,
    error,
    warning,
    info
  }
}