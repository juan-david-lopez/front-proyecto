"use client"

import { useRouter } from "next/navigation"
import { ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"

interface BackButtonProps {
  href?: string
  label?: string
  variant?: "default" | "outline" | "ghost"
  className?: string
  useBrowserBack?: boolean
}

export function BackButton({ 
  href, 
  label = "Volver", 
  variant = "ghost",
  className = "",
  useBrowserBack = false
}: BackButtonProps) {
  const router = useRouter()

  const handleClick = () => {
    if (useBrowserBack) {
      router.back()
    }
  }

  if (useBrowserBack) {
    return (
      <Button
        variant={variant}
        onClick={handleClick}
        className={`group hover:text-red-500 transition-all duration-300 ${className}`}
      >
        <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform duration-300" />
        {label}
      </Button>
    )
  }

  if (!href) {
    return null
  }

  return (
    <Link href={href}>
      <Button
        variant={variant}
        className={`group hover:text-red-500 transition-all duration-300 ${className}`}
      >
        <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform duration-300" />
        {label}
      </Button>
    </Link>
  )
}
