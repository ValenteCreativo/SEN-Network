import { GlassCard } from "@/components/ui/glass-card"
import { Badge } from "@/components/ui/badge"
import { Activity, Wifi, WifiOff } from "lucide-react"
import { LiveDataTicker } from "@/components/live-data-ticker"

interface SensorCardProps {
  name: string
  type: "AQI" | "Temperature" | "Humidity" | "Traffic" | "Noise"
  status: "streaming" | "offline"
  lastReading: number
  earnings: number
}

const sensorConfig = {
  AQI: { unit: "AQI", label: "Air Quality", min: 0, max: 100 },
  Temperature: { unit: "°C", label: "Temperature", min: -10, max: 40 },
  Humidity: { unit: "%", label: "Humidity", min: 30, max: 90 },
  Traffic: { unit: "veh/h", label: "Traffic", min: 0, max: 500 },
  Noise: { unit: "dB", label: "Noise", min: 30, max: 100 },
}

export function SensorCard({ name, type, status, lastReading, earnings }: SensorCardProps) {
  const config = sensorConfig[type]
  const isOnline = status === "streaming"

  return (
    <GlassCard glow={isOnline ? "primary" : "none"} className="space-y-4">
      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <h3 className="font-semibold">{name}</h3>
          <Badge variant="outline" className="text-xs">
            {type}
          </Badge>
        </div>
        {isOnline ? (
          <Wifi className="h-5 w-5 text-primary pulse-live" />
        ) : (
          <WifiOff className="h-5 w-5 text-muted-foreground" />
        )}
      </div>

      <div className="space-y-3">
        {isOnline ? (
          <LiveDataTicker label={config.label} unit={config.unit} min={config.min} max={config.max} />
        ) : (
          <div className="flex items-center gap-3">
            <Activity className="h-4 w-4 text-muted-foreground" />
            <div className="flex flex-col">
              <span className="text-xs text-muted-foreground">{config.label}</span>
              <span className="font-mono text-lg font-semibold text-muted-foreground">
                {lastReading} {config.unit}
              </span>
            </div>
          </div>
        )}

        <div className="flex items-center justify-between border-t border-border/50 pt-3">
          <span className="text-sm text-muted-foreground">Total Earnings</span>
          <span className="font-mono font-semibold text-primary">${earnings.toFixed(2)}</span>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <Badge variant={isOnline ? "default" : "secondary"} className={isOnline ? "bg-primary/20 text-primary" : ""}>
          {isOnline ? "Streaming" : "Offline"}
        </Badge>
        <button className="text-sm text-muted-foreground hover:text-foreground transition-colors">View Details</button>
      </div>
    </GlassCard>
  )
}
