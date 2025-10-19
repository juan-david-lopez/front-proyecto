"use client"

import * as React from "react"
import * as LabelPrimitive from "@radix-ui/react-label"

import { cn } from "@/lib/utils"

function Label({
  className,
  required = false,
  children,
  ...props
}: React.ComponentProps<typeof LabelPrimitive.Root> & {
  required?: boolean
}) {
  return (
    <LabelPrimitive.Root
      data-slot="label"
      className={cn(
        "flex items-center gap-2 text-base leading-tight font-semibold text-gray-900 select-none group-data-[disabled=true]:pointer-events-none group-data-[disabled=true]:opacity-50 peer-disabled:cursor-not-allowed peer-disabled:opacity-50 mb-2",
        className
      )}
      {...props}
    >
      {children}
      {required && (
        <span className="text-red-600 font-bold" aria-label="campo obligatorio">
          *
        </span>
      )}
    </LabelPrimitive.Root>
  )
}

export { Label }
