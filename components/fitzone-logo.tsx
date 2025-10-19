import Link from "next/link"
import { cn } from "@/lib/utils"

interface FitZoneLogoProps {
  className?: string
  size?: "sm" | "md" | "lg" | "xl"
  variant?: "default" | "light" | "dark" | "gradient" | "simple"
  showText?: boolean
  href?: string
}

export function FitZoneLogo({ 
  className,
  size = "md", 
  variant = "default",
  showText = true,
  href = "/"
}: FitZoneLogoProps) {
  const sizeClasses = {
    sm: {
      container: "gap-2",
      svg: "w-6 h-6",
      text: "text-lg font-bold"
    },
    md: {
      container: "gap-3", 
      svg: "w-8 h-8",
      text: "text-xl font-bold"
    },
    lg: {
      container: "gap-3",
      svg: "w-10 h-10", 
      text: "text-2xl font-bold"
    },
    xl: {
      container: "gap-4",
      svg: "w-12 h-12",
      text: "text-3xl font-bold"
    }
  }

  const variantClasses = {
    default: {
      svg: "text-red-500",
      textPrimary: "text-white",
      textAccent: "text-red-500"
    },
    light: {
      svg: "text-red-600", 
      textPrimary: "text-gray-900",
      textAccent: "text-red-600"
    },
    dark: {
      svg: "text-red-400",
      textPrimary: "text-white", 
      textAccent: "text-red-400"
    },
    gradient: {
      svg: "text-red-500",
      textPrimary: "bg-gradient-to-r from-white to-gray-200 bg-clip-text text-transparent",
      textAccent: "bg-gradient-to-r from-red-500 to-orange-500 bg-clip-text text-transparent"
    },
    simple: {
      svg: "text-white bg-red-500",
      textPrimary: "text-red-500",
      textAccent: "text-red-500"
    }
  }

  const currentSize = sizeClasses[size]
  const currentVariant = variantClasses[variant]

  const LogoContent = () => (
    <div 
      className={cn(
        "fitzone-logo flex items-center",
        currentSize.container,
        className
      )}
    >
      {/* Contenedor del icono */}
      <div className={cn(
        "rounded-lg flex items-center justify-center",
        variant === "simple" ? "bg-red-500 p-2" : "",
        variant === "simple" ? currentSize.svg : ""
      )}>
        {variant === "simple" ? (
          // Icono simple como en la imagen
          <svg
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className={cn("text-white w-6 h-6")}
            aria-hidden="true"
            role="img"
          >
            {/* Símbolo de pesas muy simple */}
            <rect x="2" y="9" width="4" height="6" rx="1" fill="currentColor" />
            <rect x="18" y="9" width="4" height="6" rx="1" fill="currentColor" />
            <rect x="6" y="11" width="12" height="2" rx="1" fill="currentColor" />
          </svg>
        ) : (
          // SVG complejo para otras variantes
          <svg
            viewBox="0 0 40 40"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className={cn(currentSize.svg, currentVariant.svg)}
            aria-hidden="true"
            role="img"
          >
            {/* Pesas laterales con gradiente */}
            <defs>
              <linearGradient id="logoGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="currentColor" stopOpacity="1" />
                <stop offset="100%" stopColor="currentColor" stopOpacity="0.8" />
              </linearGradient>
            </defs>
            
            {/* Pesa izquierda */}
            <rect x="2" y="15" width="7" height="10" rx="2" fill="url(#logoGradient)" />
            
            {/* Pesa derecha */}
            <rect x="31" y="15" width="7" height="10" rx="2" fill="url(#logoGradient)" />
            
            {/* Barra central */}
            <rect x="9" y="18.5" width="22" height="3" rx="1.5" fill="currentColor" />
            
            {/* Agarres */}
            <rect x="15" y="16" width="3" height="8" rx="1.5" fill="currentColor" />
            <rect x="22" y="16" width="3" height="8" rx="1.5" fill="currentColor" />
            
            {/* Detalles decorativos */}
            <circle cx="5.5" cy="20" r="1" fill="currentColor" opacity="0.6" />
            <circle cx="34.5" cy="20" r="1" fill="currentColor" opacity="0.6" />
          </svg>
        )}
      </div>

      {/* Texto del logo */}
      {showText && (
        <span className={cn("fitzone-logo-text", currentSize.text)}>
          <span className={currentVariant.textPrimary}>Fit</span>
          <span className={currentVariant.textAccent}>Zone</span>
        </span>
      )}
    </div>
  )

  // Si se proporciona href, envolver en Link
  if (href) {
    return (
      <Link 
        href={href}
        className="focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-500 rounded-lg transition-all duration-200"
        aria-label="Ir a la página de inicio de FitZone"
      >
        <LogoContent />
      </Link>
    )
  }

  return <LogoContent />
}
