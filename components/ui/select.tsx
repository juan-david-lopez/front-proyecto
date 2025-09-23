"use client"

import * as React from "react"
import { useState, useContext, createContext } from "react"
import { ChevronDown } from "lucide-react"

interface SelectContextType {
  value: string
  onValueChange: (value: string) => void
  isOpen: boolean
  onOpenChange: (open: boolean) => void
}

const SelectContext = createContext<SelectContextType | undefined>(undefined)

interface SelectProps {
  children: React.ReactNode
  value?: string
  onValueChange?: (value: string) => void
  required?: boolean
}

interface SelectTriggerProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode
}

interface SelectContentProps {
  children: React.ReactNode
  className?: string
}

interface SelectItemProps {
  value: string
  children: React.ReactNode
  className?: string
}

interface SelectValueProps {
  placeholder?: string
}

const Select = ({ children, value = "", onValueChange, ...props }: SelectProps) => {
  const [isOpen, setIsOpen] = useState(false)
  const [selectedValue, setSelectedValue] = useState(value)

  const handleValueChange = (newValue: string) => {
    setSelectedValue(newValue)
    onValueChange?.(newValue)
    setIsOpen(false)
  }

  return (
    <SelectContext.Provider value={{
      value: selectedValue,
      onValueChange: handleValueChange,
      isOpen,
      onOpenChange: setIsOpen
    }}>
      <div className="relative" {...props}>
        {children}
      </div>
    </SelectContext.Provider>
  )
}

const SelectTrigger = React.forwardRef<HTMLButtonElement, SelectTriggerProps>(
  ({ className, children, ...props }, ref) => {
    const context = useContext(SelectContext)
    if (!context) throw new Error("SelectTrigger must be used within Select")

    return (
      <button
        ref={ref}
        type="button"
        onClick={() => context.onOpenChange(!context.isOpen)}
        className={`flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${className || ""}`}
        {...props}
      >
        {children}
        <ChevronDown className="h-4 w-4 opacity-50" />
      </button>
    )
  }
)
SelectTrigger.displayName = "SelectTrigger"

const SelectContent = ({ children, className }: SelectContentProps) => {
  const context = useContext(SelectContext)
  if (!context) throw new Error("SelectContent must be used within Select")

  if (!context.isOpen) return null

  return (
    <div className={`absolute z-50 mt-1 w-full rounded-md border bg-popover text-popover-foreground shadow-md ${className || ""}`}>
      {children}
    </div>
  )
}

const SelectItem = ({ children, value, className, ...props }: SelectItemProps) => {
  const context = useContext(SelectContext)
  if (!context) throw new Error("SelectItem must be used within Select")

  return (
    <div
      onClick={() => context.onValueChange(value)}
      className={`relative flex cursor-pointer select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none hover:bg-accent hover:text-accent-foreground ${className || ""}`}
      {...props}
    >
      {children}
    </div>
  )
}

const SelectValue = ({ placeholder }: SelectValueProps) => {
  const context = useContext(SelectContext)
  if (!context) throw new Error("SelectValue must be used within Select")

  return (
    <span className={context.value ? "" : "text-muted-foreground"}>
      {context.value || placeholder}
    </span>
  )
}

export { Select, SelectTrigger, SelectContent, SelectItem, SelectValue }