"use client"

import { GlassCard } from "@/components/ui/glass-card"
import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis, CartesianGrid } from "recharts"
import { mockSensorData } from "@/lib/mock-data"

export function RealtimeChart() {
  return (
    <GlassCard className="space-y-4">
      <div>
        <h3 className="text-lg font-semibold">Last 24 Hours</h3>
        <p className="text-sm text-muted-foreground">Real-time data stream visualization</p>
      </div>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={mockSensorData}>
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.3} />
          <XAxis dataKey="time" stroke="hsl(var(--muted-foreground))" fontSize={12} />
          <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
          <Tooltip
            contentStyle={{
              backgroundColor: "hsl(var(--card))",
              border: "1px solid hsl(var(--border))",
              borderRadius: "8px",
            }}
          />
          <Line
            type="monotone"
            dataKey="value"
            stroke="hsl(var(--primary))"
            strokeWidth={2}
            dot={false}
            animationDuration={300}
          />
        </LineChart>
      </ResponsiveContainer>
    </GlassCard>
  )
}
