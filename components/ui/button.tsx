import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap font-semibold transition-all duration-200 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:outline-2 focus-visible:outline-offset-2 active:scale-95 min-h-[44px]",
  {
    variants: {
      variant: {
        default: "bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:from-blue-700 hover:to-indigo-700 shadow-lg hover:shadow-xl focus-visible:outline-blue-500 rounded-lg",
        destructive:
          "bg-gradient-to-r from-red-500 to-rose-600 text-white hover:from-red-600 hover:to-rose-700 shadow-lg hover:shadow-xl focus-visible:outline-red-500 rounded-lg",
        outline:
          "border-2 border-gray-300 bg-white hover:bg-gray-50 hover:border-gray-400 shadow-md hover:shadow-lg focus-visible:outline-blue-500 text-gray-800 rounded-lg",
        secondary:
          "bg-gradient-to-r from-gray-200 to-gray-300 text-gray-900 hover:from-gray-300 hover:to-gray-400 shadow-md hover:shadow-lg focus-visible:outline-gray-500 rounded-lg",
        ghost:
          "text-gray-800 hover:bg-gray-100 hover:text-gray-900 focus-visible:outline-gray-500 rounded-lg",
        link: "text-blue-600 underline-offset-4 hover:underline hover:text-blue-800 focus-visible:outline-blue-500 rounded-sm",
        premium: "bg-gradient-to-r from-purple-600 via-pink-600 to-red-600 text-white hover:from-purple-700 hover:via-pink-700 hover:to-red-700 shadow-2xl hover:shadow-purple-500/25 focus-visible:outline-purple-500 rounded-lg",
        success: "bg-gradient-to-r from-green-600 to-emerald-600 text-white hover:from-green-700 hover:to-emerald-700 shadow-lg hover:shadow-xl focus-visible:outline-green-500 rounded-lg",
      },
      size: {
        default: "h-11 px-6 py-2 text-sm has-[>svg]:px-5",
        sm: "h-9 px-4 py-1.5 text-xs gap-1.5 has-[>svg]:px-3",
        lg: "h-13 px-8 py-3 text-base has-[>svg]:px-7",
        icon: "size-11",
        xl: "h-14 px-10 py-4 text-lg has-[>svg]:px-9",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

const Button = React.forwardRef<
  HTMLButtonElement,
  React.ComponentProps<"button"> &
    VariantProps<typeof buttonVariants> & {
      asChild?: boolean
      "aria-label"?: string
      loading?: boolean
    }
>(({ className, variant, size, asChild = false, loading = false, children, disabled, ...props }, ref) => {
  const Comp = asChild ? Slot : "button"
  
  return (
    <Comp
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      ref={ref}
      disabled={disabled || loading}
      aria-disabled={disabled || loading}
      {...props}
    >
      {loading ? (
        <>
          <svg 
            className="animate-spin h-4 w-4" 
            xmlns="http://www.w3.org/2000/svg" 
            fill="none" 
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <circle 
              className="opacity-25" 
              cx="12" 
              cy="12" 
              r="10" 
              stroke="currentColor" 
              strokeWidth="4"
            />
            <path 
              className="opacity-75" 
              fill="currentColor" 
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
          <span className="sr-only">Cargando...</span>
        </>
      ) : null}
      {children}
    </Comp>
  )
})
Button.displayName = "Button"

export { Button, buttonVariants }
