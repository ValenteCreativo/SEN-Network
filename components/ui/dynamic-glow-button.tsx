import type React from "react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface DynamicGlowButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "accent"
  children: React.ReactNode
}

export function DynamicGlowButton({ variant = "primary", className, children, ...props }: DynamicGlowButtonProps) {
  const variantStyles = {
    primary: "bg-primary text-primary-foreground hover:bg-primary/90 glow-primary",
    secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/90 glow-secondary",
    accent: "bg-accent text-accent-foreground hover:bg-accent/90 glow-accent",
  }

  return (
    <Button
      className={cn("font-semibold transition-all duration-300 hover:scale-105", variantStyles[variant], className)}
      {...props}
    >
      {children}
    </Button>
  )
}
