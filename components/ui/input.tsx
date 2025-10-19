"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type = "text", ...props }, ref) => {
    return (
      <input
        ref={ref}
        type={type}
        className={cn(
          "flex h-11 w-full rounded-lg border-2 border-gray-300 bg-white px-4 py-2 text-base font-medium transition-all duration-200",
          "file:border-0 file:bg-transparent file:text-base file:font-medium",
          "placeholder:text-gray-500 focus:outline-none focus:outline-2 focus:outline-offset-2 focus:outline-blue-600 focus:border-blue-500",
          "hover:border-gray-400 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50 disabled:bg-gray-100",
          "shadow-sm focus:shadow-md",
          "aria-invalid:border-red-500 aria-invalid:focus:outline-red-600",
          className
        )}
        aria-describedby={props['aria-describedby']}
        {...props}
      />
    )
  }
)

Input.displayName = "Input"

export { Input }