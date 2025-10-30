"use client"

import { useState } from "react"
import { useParams } from "next/navigation"
import Link from "next/link"
import { Sidebar } from "@/components/dashboard/sidebar"
import { DashboardHeader } from "@/components/dashboard/header"
import { GlassCard } from "@/components/ui/glass-card"
import { RealtimeChart } from "@/components/realtime-chart"
import { SubscriptionModal } from "@/components/subscription-modal"
import { DynamicGlowButton } from "@/components/ui/dynamic-glow-button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowLeft, MapPin, TrendingUp, Zap, Calendar, Shield, Activity } from "lucide-react"
import { mockSensors } from "@/lib/mock-data"
import { LiveDataTicker } from "@/components/live-data-ticker"

export default function SensorDetailPage() {
  const params = useParams()
  const [isSubscribeOpen, setIsSubscribeOpen] = useState(false)

  // Find sensor by ID
  const sensor = mockSensors.find((s) => s.id === params.id)

  if (!sensor) {
    return <div>Sensor not found</div>
  }

  const sensorConfig = {
    AQI: { unit: "AQI", label: "Air Quality", min: 0, max: 100 },
    Temperature: { unit: "°C", label: "Temperature", min: -10, max: 40 },
    Humidity: { unit: "%", label: "Humidity", min: 30, max: 90 },
    Traffic: { unit: "veh/h", label: "Traffic", min: 0, max: 500 },
    Noise: { unit: "dB", label: "Noise", min: 30, max: 100 },
  }

  const config = sensorConfig[sensor.type]

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="ml-64 flex-1">
        <DashboardHeader />
        <main className="p-8">
          <div className="space-y-6">
            {/* Back button */}
            <Link
              href="/market"
              className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Marketplace
            </Link>

            {/* Header */}
            <div className="flex items-start justify-between">
              <div className="space-y-2">
                <div className="flex items-center gap-3">
                  <h1 className="text-4xl font-bold">{sensor.name}</h1>
                  {sensor.status === "streaming" && (
                    <Badge className="gap-1 bg-primary/20 text-primary">
                      <Zap className="h-3 w-3 pulse-live" />
                      Live
                    </Badge>
                  )}
                </div>
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <MapPin className="h-4 w-4" />
                    {sensor.location}
                  </span>
                  <span>•</span>
                  <Badge variant="outline">{sensor.type}</Badge>
                </div>
              </div>
              <div className="flex gap-3">
                <DynamicGlowButton variant="accent" className="gap-2" onClick={() => setIsSubscribeOpen(true)}>
                  <Zap className="h-4 w-4" />
                  Pay-per-query
                </DynamicGlowButton>
                <DynamicGlowButton variant="secondary" className="gap-2" onClick={() => setIsSubscribeOpen(true)}>
                  <Calendar className="h-4 w-4" />
                  Subscribe Monthly
                </DynamicGlowButton>
              </div>
            </div>

            {/* Stats Grid */}
            <div className="grid gap-6 md:grid-cols-4">
              <GlassCard className="space-y-2">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <TrendingUp className="h-4 w-4" />
                  Uptime
                </div>
                <div className="text-2xl font-bold text-primary">{sensor.uptime}%</div>
              </GlassCard>
              <GlassCard className="space-y-2">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Activity className="h-4 w-4" />
                  Requests Served
                </div>
                <div className="text-2xl font-bold">12.4K</div>
              </GlassCard>
              <GlassCard className="space-y-2">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Shield className="h-4 w-4" />
                  Reputation
                </div>
                <div className="text-2xl font-bold text-primary">98.5%</div>
              </GlassCard>
              <GlassCard className="space-y-2">
                <div className="text-sm text-muted-foreground">Owner</div>
                <div className="font-mono text-sm">{sensor.owner}</div>
              </GlassCard>
            </div>

            {/* Live Reading */}
            {sensor.status === "streaming" && (
              <GlassCard glow="primary" className="p-8">
                <div className="flex items-center justify-center">
                  <LiveDataTicker label={config.label} unit={config.unit} min={config.min} max={config.max} />
                </div>
              </GlassCard>
            )}

            {/* Tabs */}
            <Tabs defaultValue="overview" className="space-y-6">
              <TabsList className="glass-card">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="live-feed">Live Feed</TabsTrigger>
                <TabsTrigger value="pricing">Pricing</TabsTrigger>
                <TabsTrigger value="terms">Terms</TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="space-y-6">
                <RealtimeChart />
                <GlassCard className="space-y-4">
                  <h3 className="text-lg font-semibold">About This Sensor</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    This {sensor.type.toLowerCase()} sensor provides real-time environmental data from {sensor.location}
                    . The sensor has been operational with {sensor.uptime}% uptime and has served over 12,400 data
                    requests. All data is verified and timestamped on the Solana blockchain for transparency and
                    immutability.
                  </p>
                </GlassCard>
              </TabsContent>

              <TabsContent value="live-feed" className="space-y-6">
                <RealtimeChart />
                <GlassCard className="space-y-4">
                  <h3 className="text-lg font-semibold">Recent Readings</h3>
                  <div className="space-y-2">
                    {Array.from({ length: 10 }).map((_, i) => (
                      <div key={i} className="flex items-center justify-between border-b border-border/30 py-2">
                        <span className="font-mono text-sm text-muted-foreground">
                          {new Date(Date.now() - i * 60000).toLocaleTimeString()}
                        </span>
                        <span className="font-mono font-semibold">
                          {(Math.random() * (config.max - config.min) + config.min).toFixed(1)} {config.unit}
                        </span>
                      </div>
                    ))}
                  </div>
                </GlassCard>
              </TabsContent>

              <TabsContent value="pricing" className="space-y-6">
                <div className="grid gap-6 md:grid-cols-2">
                  <GlassCard glow="primary" className="space-y-4">
                    <div className="flex items-center gap-3">
                      <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/20">
                        <Zap className="h-6 w-6 text-primary" />
                      </div>
                      <div>
                        <h3 className="text-xl font-semibold">Pay Per Query</h3>
                        <p className="text-sm text-muted-foreground">Flexible usage-based pricing</p>
                      </div>
                    </div>
                    <div className="flex items-baseline gap-2">
                      <span className="text-4xl font-bold text-primary">${sensor.pricePerQuery}</span>
                      <span className="text-muted-foreground">per query</span>
                    </div>
                    <ul className="space-y-2 text-sm">
                      <li className="flex items-center gap-2">
                        <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                        No commitment required
                      </li>
                      <li className="flex items-center gap-2">
                        <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                        Pay only for what you use
                      </li>
                      <li className="flex items-center gap-2">
                        <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                        Instant access to data
                      </li>
                    </ul>
                  </GlassCard>

                  <GlassCard glow="secondary" className="space-y-4">
                    <div className="flex items-center gap-3">
                      <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-secondary/20">
                        <Calendar className="h-6 w-6 text-secondary" />
                      </div>
                      <div>
                        <h3 className="text-xl font-semibold">Monthly Subscription</h3>
                        <p className="text-sm text-muted-foreground">Unlimited queries</p>
                      </div>
                    </div>
                    <div className="flex items-baseline gap-2">
                      <span className="text-4xl font-bold text-secondary">${sensor.monthlySubscription}</span>
                      <span className="text-muted-foreground">per month</span>
                    </div>
                    <ul className="space-y-2 text-sm">
                      <li className="flex items-center gap-2">
                        <div className="h-1.5 w-1.5 rounded-full bg-secondary" />
                        Unlimited data queries
                      </li>
                      <li className="flex items-center gap-2">
                        <div className="h-1.5 w-1.5 rounded-full bg-secondary" />
                        Priority support
                      </li>
                      <li className="flex items-center gap-2">
                        <div className="h-1.5 w-1.5 rounded-full bg-secondary" />
                        Historical data access
                      </li>
                    </ul>
                  </GlassCard>
                </div>
              </TabsContent>

              <TabsContent value="terms" className="space-y-6">
                <GlassCard className="space-y-4">
                  <h3 className="text-lg font-semibold">Terms of Service</h3>
                  <div className="space-y-4 text-sm text-muted-foreground leading-relaxed">
                    <p>
                      By accessing this sensor data stream, you agree to use the data in accordance with the following
                      terms:
                    </p>
                    <ul className="list-disc space-y-2 pl-6">
                      <li>Data is provided as-is with no guarantees of accuracy or availability</li>
                      <li>You may not resell or redistribute the raw data without permission</li>
                      <li>The sensor owner reserves the right to modify pricing or discontinue service</li>
                      <li>All transactions are recorded on the Solana blockchain</li>
                      <li>Refunds are subject to the sensor owner's discretion</li>
                    </ul>
                  </div>
                </GlassCard>
              </TabsContent>
            </Tabs>
          </div>
        </main>
      </div>

      <SubscriptionModal
        open={isSubscribeOpen}
        onOpenChange={setIsSubscribeOpen}
        sensorName={sensor.name}
        pricePerQuery={sensor.pricePerQuery}
        monthlySubscription={sensor.monthlySubscription}
      />
    </div>
  )
}
