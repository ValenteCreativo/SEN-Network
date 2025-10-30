"use client"

import type React from "react"

import { useState } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { DynamicGlowButton } from "@/components/ui/dynamic-glow-button"
import { Button } from "@/components/ui/button"

interface RegisterSensorFormProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function RegisterSensorForm({ open, onOpenChange }: RegisterSensorFormProps) {
  const [sensorName, setSensorName] = useState("")
  const [sensorType, setSensorType] = useState("")
  const [deviceKey, setDeviceKey] = useState("")
  const [frequency, setFrequency] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Mock registration
    console.log({ sensorName, sensorType, deviceKey, frequency })
    onOpenChange(false)
    // Reset form
    setSensorName("")
    setSensorType("")
    setDeviceKey("")
    setFrequency("")
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="glass-card border-primary/30 sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="text-2xl">Register New Sensor</DialogTitle>
          <DialogDescription>
            Connect your IoT device to the SolaData network and start earning from your data streams.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-6 pt-4">
          <div className="space-y-2">
            <Label htmlFor="sensor-name">Sensor Name</Label>
            <Input
              id="sensor-name"
              placeholder="e.g., Downtown AQI Monitor"
              value={sensorName}
              onChange={(e) => setSensorName(e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="sensor-type">Sensor Type</Label>
            <Select value={sensorType} onValueChange={setSensorType} required>
              <SelectTrigger id="sensor-type">
                <SelectValue placeholder="Select sensor type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="AQI">Air Quality (AQI)</SelectItem>
                <SelectItem value="Temperature">Temperature</SelectItem>
                <SelectItem value="Humidity">Humidity</SelectItem>
                <SelectItem value="Traffic">Traffic Counter</SelectItem>
                <SelectItem value="Noise">Noise Level</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="device-key">Device Secret Key</Label>
            <Input
              id="device-key"
              type="password"
              placeholder="Enter your device authentication key"
              value={deviceKey}
              onChange={(e) => setDeviceKey(e.target.value)}
              required
            />
            <p className="text-xs text-muted-foreground">
              This key is used to authenticate your device when streaming data.
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="frequency">Streaming Frequency (seconds)</Label>
            <Input
              id="frequency"
              type="number"
              placeholder="e.g., 60"
              value={frequency}
              onChange={(e) => setFrequency(e.target.value)}
              min="10"
              max="3600"
              required
            />
            <p className="text-xs text-muted-foreground">How often your sensor will send data updates.</p>
          </div>

          <div className="flex gap-3 pt-4">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} className="flex-1">
              Cancel
            </Button>
            <DynamicGlowButton type="submit" variant="primary" className="flex-1">
              Register Sensor
            </DynamicGlowButton>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
