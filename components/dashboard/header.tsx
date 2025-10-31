import { WalletStatusBadge } from "@/components/wallet-status-badge"
import { NotificationsBell } from "@/components/dashboard/notifications-bell"

export function DashboardHeader() {
  return (
    <header className="sticky top-0 z-30 border-b border-border/50 bg-background/80 backdrop-blur-sm">
      <div className="flex h-16 items-center justify-between px-8">
        <div>
          <h1 className="text-2xl font-bold">Dashboard</h1>
          <p className="text-sm text-muted-foreground">Monitor your sensors and earnings</p>
        </div>
        <div className="flex items-center gap-4">
          <NotificationsBell />
          <WalletStatusBadge />
        </div>
      </div>
    </header>
  )
}
