import { GlassCard } from "@/components/ui/glass-card"
import type { LucideIcon } from "lucide-react"

interface StatCardProps {
  title: string
  value: string | number
  icon: LucideIcon
  trend?: string
  glow?: "primary" | "secondary" | "accent" | "none"
}

export function StatCard({ title, value, icon: Icon, trend, glow = "none" }: StatCardProps) {
  return (
    <GlassCard glow={glow} className="space-y-3">
      <div className="flex items-center justify-between">
        <span className="text-sm text-muted-foreground">{title}</span>
        <Icon className="h-5 w-5 text-muted-foreground" />
      </div>
      <div className="space-y-1">
        <div className="text-3xl font-bold">{value}</div>
        {trend && <div className="text-xs text-primary">{trend}</div>}
      </div>
    </GlassCard>
  )
}
