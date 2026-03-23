'use client'

import { Button } from "@/components/ui/button"
import { Loader2 } from "lucide-react"
import { cn } from "@/lib/utils"

interface LoadingButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  loading?: boolean
  loadingText?: string
  icon?: React.ReactNode
  loadingIcon?: React.ReactNode
  disabledConditions?: boolean[] // multiple conditions
  children: React.ReactNode
}

export function LoadingButton({
  loading = false,
  loadingText,
  icon,
  loadingIcon,
  className,
  disabled,
  disabledConditions = [],
  children,
  ...props
}: LoadingButtonProps) {

  const isDisabled =
    loading ||
    disabled ||
    disabledConditions.some(Boolean)

  return (
    <Button
      className={cn("flex items-center gap-2", className)}
      disabled={isDisabled}
      {...props}
    >
      {/* Icon */}
      {loading
        ? (loadingIcon || <Loader2 className="h-4 w-4 animate-spin" />)
        : icon}

      {/* Text */}
      {loading && loadingText ? loadingText : children}
    </Button>
  )
}