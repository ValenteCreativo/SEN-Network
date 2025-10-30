"use client"

import { useState } from "react"
import { Sidebar } from "@/components/dashboard/sidebar"
import { DashboardHeader } from "@/components/dashboard/header"
import { SensorCard } from "@/components/sensor-card"
import { RegisterSensorForm } from "@/components/register-sensor-form"
import { DynamicGlowButton } from "@/components/ui/dynamic-glow-button"
import { Plus, Filter } from "lucide-react"
import { mockSensors } from "@/lib/mock-data"
import { Button } from "@/components/ui/button"

export default function SensorsPage() {
  const [isRegisterOpen, setIsRegisterOpen] = useState(false)

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="ml-64 flex-1">
        <DashboardHeader />
        <main className="p-8">
          <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-3xl font-bold">My Sensors</h2>
                <p className="text-muted-foreground">Manage your connected IoT devices and data streams</p>
              </div>
              <div className="flex gap-3">
                <Button variant="outline" className="gap-2 bg-transparent">
                  <Filter className="h-4 w-4" />
                  Filter
                </Button>
                <DynamicGlowButton variant="primary" className="gap-2" onClick={() => setIsRegisterOpen(true)}>
                  <Plus className="h-4 w-4" />
                  Register New Sensor
                </DynamicGlowButton>
              </div>
            </div>

            {/* Stats */}
            <div className="grid gap-4 md:grid-cols-3">
              <div className="glass-card rounded-lg p-4">
                <div className="text-sm text-muted-foreground">Total Sensors</div>
                <div className="text-3xl font-bold">{mockSensors.length}</div>
              </div>
              <div className="glass-card rounded-lg p-4">
                <div className="text-sm text-muted-foreground">Active Streams</div>
                <div className="text-3xl font-bold text-primary">
                  {mockSensors.filter((s) => s.status === "streaming").length}
                </div>
              </div>
              <div className="glass-card rounded-lg p-4">
                <div className="text-sm text-muted-foreground">Total Earnings</div>
                <div className="text-3xl font-bold text-primary">
                  ${mockSensors.reduce((acc, s) => acc + s.earnings, 0).toFixed(2)}
                </div>
              </div>
            </div>

            {/* Sensors Grid */}
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {mockSensors.map((sensor) => (
                <SensorCard
                  key={sensor.id}
                  name={sensor.name}
                  type={sensor.type}
                  status={sensor.status}
                  lastReading={sensor.lastReading}
                  earnings={sensor.earnings}
                />
              ))}
            </div>
          </div>
        </main>
      </div>

      <RegisterSensorForm open={isRegisterOpen} onOpenChange={setIsRegisterOpen} />
    </div>
  )
}
