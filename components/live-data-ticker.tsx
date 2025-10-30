"use client"

import { useEffect, useState } from "react"
import { Activity } from "lucide-react"

interface LiveDataTickerProps {
  label: string
  unit: string
  min: number
  max: number
}

export function LiveDataTicker({ label, unit, min, max }: LiveDataTickerProps) {
  const [value, setValue] = useState(min)

  useEffect(() => {
    const interval = setInterval(() => {
      setValue(Math.random() * (max - min) + min)
    }, 2000)

    return () => clearInterval(interval)
  }, [min, max])

  return (
    <div className="flex items-center gap-3">
      <Activity className="h-4 w-4 text-primary pulse-live" />
      <div className="flex flex-col">
        <span className="text-xs text-muted-foreground">{label}</span>
        <span className="font-mono text-lg font-semibold text-foreground">
          {value.toFixed(1)} {unit}
        </span>
      </div>
    </div>
  )
}
