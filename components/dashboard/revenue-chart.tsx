"use client"

import { GlassCard } from "@/components/ui/glass-card"
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"
import { mockRevenueData } from "@/lib/mock-data"

export function RevenueChart() {
  return (
    <GlassCard className="space-y-4">
      <div>
        <h3 className="text-lg font-semibold">Revenue History</h3>
        <p className="text-sm text-muted-foreground">Your earnings over the last 7 months</p>
      </div>
      <ResponsiveContainer width="100%" height={300}>
        <AreaChart data={mockRevenueData}>
          <defs>
            {/* Background fill with gradient fading to transparent */}
            <linearGradient id="colorRevenueFill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity={0.55} />
              <stop offset="60%" stopColor="#4FE5FF" stopOpacity={0.28} />
              <stop offset="95%" stopColor="#4FE5FF" stopOpacity={0.05} />
            </linearGradient>

            {/* **Line stroke gradient (jade ➜ turquoise)** */}
            <linearGradient id="colorRevenueLine" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="hsl(var(--primary))" />
              <stop offset="45%" stopColor="#3AD7E6" />
              <stop offset="100%" stopColor="#4FE5FF" /> 
            </linearGradient>
          </defs>

          <CartesianGrid strokeDasharray="4 4" stroke="hsl(var(--border))" opacity={0.45} />

          <XAxis
            dataKey="date"
            stroke="hsl(var(--foreground))"
            fontSize={12}
            tickLine={false}
            axisLine={{ stroke: "hsl(var(--border))" }}
          />

          <YAxis
            stroke="hsl(var(--foreground))"
            fontSize={12}
            tickLine={false}
            axisLine={{ stroke: "hsl(var(--border))" }}
          />

          <Tooltip
            contentStyle={{
              backgroundColor: "rgba(0,0,0,0.75)",
              border: "1px solid #4FE5FF",
              borderRadius: "8px",
              color: "white",
              backdropFilter: "blur(6px)",
            }}
            labelStyle={{ color: "#4FE5FF" }}
            cursor={{ stroke: "#4FE5FF", strokeWidth: 1 }}
          />

          <Area
            type="monotone"
            dataKey="revenue"
            stroke="url(#colorRevenueLine)"
            strokeWidth={3}
            fill="url(#colorRevenueFill)"
            fillOpacity={1}
          />
        </AreaChart>
      </ResponsiveContainer>
    </GlassCard>
  )
}
