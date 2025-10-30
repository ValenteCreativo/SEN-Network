"use client"

import { useState } from "react"
import { Sidebar } from "@/components/dashboard/sidebar"
import { DashboardHeader } from "@/components/dashboard/header"
import { MarketplaceSensorCard } from "@/components/marketplace-sensor-card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, SlidersHorizontal } from "lucide-react"
import { mockSensors } from "@/lib/mock-data"
import { Button } from "@/components/ui/button"

export default function MarketPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [filterType, setFilterType] = useState("all")
  const [filterStatus, setFilterStatus] = useState("all")

  const filteredSensors = mockSensors.filter((sensor) => {
    const matchesSearch = sensor.name.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesType = filterType === "all" || sensor.type === filterType
    const matchesStatus = filterStatus === "all" || sensor.status === filterStatus
    return matchesSearch && matchesType && matchesStatus
  })

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="ml-64 flex-1">
        <DashboardHeader />
        <main className="p-8">
          <div className="space-y-6">
            {/* Header */}
            <div>
              <h2 className="text-3xl font-bold">Data Marketplace</h2>
              <p className="text-muted-foreground">Browse and subscribe to verified sensor data streams</p>
            </div>

            {/* Filters */}
            <div className="glass-card rounded-lg p-4">
              <div className="grid gap-4 md:grid-cols-4">
                <div className="relative md:col-span-2">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    placeholder="Search sensors..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-9"
                  />
                </div>
                <Select value={filterType} onValueChange={setFilterType}>
                  <SelectTrigger>
                    <SelectValue placeholder="Sensor Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    <SelectItem value="AQI">Air Quality</SelectItem>
                    <SelectItem value="Temperature">Temperature</SelectItem>
                    <SelectItem value="Humidity">Humidity</SelectItem>
                    <SelectItem value="Traffic">Traffic</SelectItem>
                    <SelectItem value="Noise">Noise</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={filterStatus} onValueChange={setFilterStatus}>
                  <SelectTrigger>
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="streaming">Live Only</SelectItem>
                    <SelectItem value="offline">Offline</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Results count */}
            <div className="flex items-center justify-between">
              <p className="text-sm text-muted-foreground">
                Showing {filteredSensors.length} of {mockSensors.length} sensors
              </p>
              <Button variant="outline" className="gap-2 bg-transparent">
                <SlidersHorizontal className="h-4 w-4" />
                Advanced Filters
              </Button>
            </div>

            {/* Sensors Grid */}
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {filteredSensors.map((sensor) => (
                <MarketplaceSensorCard
                  key={sensor.id}
                  id={sensor.id}
                  name={sensor.name}
                  type={sensor.type}
                  location={sensor.location}
                  owner={sensor.owner}
                  uptime={sensor.uptime}
                  pricePerQuery={sensor.pricePerQuery}
                  lastReading={sensor.lastReading}
                  status={sensor.status}
                />
              ))}
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
