"use client"

import { useState } from "react"
import { Sidebar } from "@/components/dashboard/sidebar"
import { DashboardHeader } from "@/components/dashboard/header"
import { GlassCard } from "@/components/ui/glass-card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Switch } from "@/components/ui/switch"
import { DynamicGlowButton } from "@/components/ui/dynamic-glow-button"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { User, Wallet, Bell, Shield, Trash2 } from "lucide-react"

export default function SettingsPage() {
  const [username, setUsername] = useState("sensor_operator_42")
  const [email, setEmail] = useState("operator@example.com")
  const [emailNotifications, setEmailNotifications] = useState(true)
  const [pushNotifications, setPushNotifications] = useState(false)
  const [dataAlerts, setDataAlerts] = useState(true)

  const handleSaveProfile = () => {
    console.log("Profile saved", { username, email })
  }

  const handleSaveNotifications = () => {
    console.log("Notifications saved", { emailNotifications, pushNotifications, dataAlerts })
  }

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="ml-64 flex-1">
        <DashboardHeader />
        <main className="p-8">
          <div className="mx-auto max-w-4xl space-y-8">
            {/* Header */}
            <div>
              <h2 className="text-3xl font-bold">Settings</h2>
              <p className="text-muted-foreground">Manage your account preferences and configurations</p>
            </div>

            {/* Profile Section */}
            <GlassCard className="space-y-6">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/20">
                  <User className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold">Profile</h3>
                  <p className="text-sm text-muted-foreground">Update your personal information</p>
                </div>
              </div>

              <Separator className="bg-border/50" />

              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="username">Username</Label>
                  <Input id="username" value={username} onChange={(e) => setUsername(e.target.value)} />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="avatar">Avatar URL</Label>
                  <Input id="avatar" placeholder="https://example.com/avatar.jpg" />
                </div>
              </div>

              <div className="flex justify-end gap-3">
                <Button variant="outline">Cancel</Button>
                <DynamicGlowButton variant="primary" onClick={handleSaveProfile}>
                  Save Changes
                </DynamicGlowButton>
              </div>
            </GlassCard>

            {/* Wallet Connections */}
            <GlassCard className="space-y-6">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-secondary/20">
                  <Wallet className="h-5 w-5 text-secondary" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold">Wallet Connections</h3>
                  <p className="text-sm text-muted-foreground">Manage your connected blockchain wallets</p>
                </div>
              </div>

              <Separator className="bg-border/50" />

              <div className="space-y-4">
                <div className="flex items-center justify-between rounded-lg border border-primary/30 bg-primary/10 p-4">
                  <div className="space-y-1">
                    <div className="font-semibold">Phantom Wallet</div>
                    <div className="font-mono text-sm text-muted-foreground">7xKX...9mPq</div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="h-2 w-2 rounded-full bg-primary pulse-live" />
                    <span className="text-sm text-primary">Connected</span>
                  </div>
                </div>

                <div className="flex items-center justify-between rounded-lg border border-border bg-muted/30 p-4">
                  <div className="space-y-1">
                    <div className="font-semibold text-muted-foreground">Solflare Wallet</div>
                    <div className="text-sm text-muted-foreground">Not connected</div>
                  </div>
                  <Button variant="outline" size="sm">
                    Connect
                  </Button>
                </div>

                <div className="flex items-center justify-between rounded-lg border border-border bg-muted/30 p-4">
                  <div className="space-y-1">
                    <div className="font-semibold text-muted-foreground">Backpack Wallet</div>
                    <div className="text-sm text-muted-foreground">Not connected</div>
                  </div>
                  <Button variant="outline" size="sm">
                    Connect
                  </Button>
                </div>
              </div>
            </GlassCard>

            {/* Notifications */}
            <GlassCard className="space-y-6">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent/20">
                  <Bell className="h-5 w-5 text-accent" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold">Notification Preferences</h3>
                  <p className="text-sm text-muted-foreground">Choose how you want to be notified</p>
                </div>
              </div>

              <Separator className="bg-border/50" />

              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <div className="font-medium">Email Notifications</div>
                    <div className="text-sm text-muted-foreground">Receive updates via email</div>
                  </div>
                  <Switch checked={emailNotifications} onCheckedChange={setEmailNotifications} />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <div className="font-medium">Push Notifications</div>
                    <div className="text-sm text-muted-foreground">Receive browser push notifications</div>
                  </div>
                  <Switch checked={pushNotifications} onCheckedChange={setPushNotifications} />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <div className="font-medium">Data Stream Alerts</div>
                    <div className="text-sm text-muted-foreground">Get notified when sensors go offline</div>
                  </div>
                  <Switch checked={dataAlerts} onCheckedChange={setDataAlerts} />
                </div>
              </div>

              <div className="flex justify-end gap-3">
                <Button variant="outline">Cancel</Button>
                <DynamicGlowButton variant="primary" onClick={handleSaveNotifications}>
                  Save Preferences
                </DynamicGlowButton>
              </div>
            </GlassCard>

            {/* Security */}
            <GlassCard className="space-y-6">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/20">
                  <Shield className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold">Security</h3>
                  <p className="text-sm text-muted-foreground">Manage your account security settings</p>
                </div>
              </div>

              <Separator className="bg-border/50" />

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <div className="font-medium">Two-Factor Authentication</div>
                    <div className="text-sm text-muted-foreground">Add an extra layer of security</div>
                  </div>
                  <Button variant="outline">Enable</Button>
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <div className="font-medium">API Keys</div>
                    <div className="text-sm text-muted-foreground">Manage your API access keys</div>
                  </div>
                  <Button variant="outline">Manage</Button>
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <div className="font-medium">Active Sessions</div>
                    <div className="text-sm text-muted-foreground">View and manage active sessions</div>
                  </div>
                  <Button variant="outline">View</Button>
                </div>
              </div>
            </GlassCard>

            {/* Danger Zone */}
            <GlassCard className="space-y-6 border-destructive/30">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-destructive/20">
                  <Trash2 className="h-5 w-5 text-destructive" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-destructive">Danger Zone</h3>
                  <p className="text-sm text-muted-foreground">Irreversible actions</p>
                </div>
              </div>

              <Separator className="bg-border/50" />

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <div className="font-medium">Delete Account</div>
                    <div className="text-sm text-muted-foreground">
                      Permanently delete your account and all associated data
                    </div>
                  </div>
                  <Button variant="destructive">Delete Account</Button>
                </div>
              </div>
            </GlassCard>
          </div>
        </main>
      </div>
    </div>
  )
}
