import type React from "react"
import { cn } from "@/lib/utils"

interface GlassCardProps extends React.HTMLAttributes<HTMLDivElement> {
  glow?: "primary" | "secondary" | "accent" | "none"
}

export function GlassCard({ className, glow = "none", children, ...props }: GlassCardProps) {
  return (
    <div
      className={cn(
        "glass-card rounded-lg p-6 transition-all duration-300 hover:border-primary/30",
        glow === "primary" && "glow-primary",
        glow === "secondary" && "glow-secondary",
        glow === "accent" && "glow-accent",
        className,
      )}
      {...props}
    >
      {children}
    </div>
  )
}
