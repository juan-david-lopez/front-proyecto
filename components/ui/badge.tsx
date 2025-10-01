import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex items-center justify-center rounded-full px-3 py-1.5 text-sm font-semibold w-fit whitespace-nowrap shrink-0 [&>svg]:size-3 gap-1.5 [&>svg]:pointer-events-none focus-visible:outline-2 focus-visible:outline-offset-2 transition-all duration-200 shadow-sm hover:shadow-md min-h-[32px]",
  {
    variants: {
      variant: {
        default:
          "bg-gradient-to-r from-blue-600 to-indigo-600 text-white [a&]:hover:from-blue-700 [a&]:hover:to-indigo-700 focus-visible:outline-blue-600",
        secondary:
          "bg-gradient-to-r from-gray-200 to-gray-300 text-gray-900 [a&]:hover:from-gray-300 [a&]:hover:to-gray-400 focus-visible:outline-gray-600",
        destructive:
          "bg-gradient-to-r from-red-600 to-rose-600 text-white [a&]:hover:from-red-700 [a&]:hover:to-rose-700 focus-visible:outline-red-600",
        outline:
          "border-2 border-gray-300 text-gray-800 bg-white [a&]:hover:bg-gray-50 [a&]:hover:border-gray-400 focus-visible:outline-gray-600",
        success:
          "bg-gradient-to-r from-green-600 to-emerald-600 text-white [a&]:hover:from-green-700 [a&]:hover:to-emerald-700 focus-visible:outline-green-600",
        warning:
          "bg-gradient-to-r from-amber-600 to-orange-600 text-white [a&]:hover:from-amber-700 [a&]:hover:to-orange-700 focus-visible:outline-amber-600",
        premium:
          "bg-gradient-to-r from-purple-600 via-pink-600 to-red-600 text-white [a&]:hover:from-purple-700 [a&]:hover:via-pink-700 [a&]:hover:to-red-700 shadow-lg focus-visible:outline-purple-600",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

function Badge({
  className,
  variant,
  asChild = false,
  ...props
}: React.ComponentProps<"span"> &
  VariantProps<typeof badgeVariants> & { asChild?: boolean }) {
  const Comp = asChild ? Slot : "span"

  return (
    <Comp
      data-slot="badge"
      className={cn(badgeVariants({ variant }), className)}
      {...props}
    />
  )
}

export { Badge, badgeVariants }
