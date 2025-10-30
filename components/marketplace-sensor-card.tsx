import Link from "next/link"
import { GlassCard } from "@/components/ui/glass-card"
import { Badge } from "@/components/ui/badge"
import { MapPin, TrendingUp, Zap } from "lucide-react"
import { DynamicGlowButton } from "@/components/ui/dynamic-glow-button"

interface MarketplaceSensorCardProps {
  id: string
  name: string
  type: string
  location: string
  owner: string
  uptime: number
  pricePerQuery: number
  lastReading: number
  status: "streaming" | "offline"
}

export function MarketplaceSensorCard({
  id,
  name,
  type,
  location,
  owner,
  uptime,
  pricePerQuery,
  lastReading,
  status,
}: MarketplaceSensorCardProps) {
  const isLive = status === "streaming"

  return (
    <GlassCard glow={isLive ? "primary" : "none"} className="space-y-4 transition-all hover:scale-[1.02]">
      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <h3 className="font-semibold">{name}</h3>
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <MapPin className="h-3 w-3" />
            {location}
          </div>
        </div>
        {isLive && (
          <Badge className="gap-1 bg-primary/20 text-primary">
            <Zap className="h-3 w-3 pulse-live" />
            Live
          </Badge>
        )}
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">Type</span>
          <Badge variant="outline">{type}</Badge>
        </div>
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">Owner</span>
          <span className="font-mono text-xs">{owner}</span>
        </div>
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">Uptime</span>
          <span className="flex items-center gap-1 font-semibold text-primary">
            <TrendingUp className="h-3 w-3" />
            {uptime}%
          </span>
        </div>
      </div>

      <div className="border-t border-border/50 pt-3">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-xs text-muted-foreground">Price per query</div>
            <div className="font-mono text-lg font-semibold text-primary">${pricePerQuery}</div>
          </div>
          <Link href={`/market/${id}`}>
            <DynamicGlowButton variant="primary" className="text-sm">
              View Details
            </DynamicGlowButton>
          </Link>
        </div>
      </div>
    </GlassCard>
  )
}
