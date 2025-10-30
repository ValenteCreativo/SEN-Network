import { WalletStatusBadge } from "@/components/wallet-status-badge"
import { Bell } from "lucide-react"
import { Button } from "@/components/ui/button"

export function DashboardHeader() {
  return (
    <header className="sticky top-0 z-30 border-b border-border/50 bg-background/80 backdrop-blur-sm">
      <div className="flex h-16 items-center justify-between px-8">
        <div>
          <h1 className="text-2xl font-bold">Dashboard</h1>
          <p className="text-sm text-muted-foreground">Monitor your sensors and earnings</p>
        </div>
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" className="relative">
            <Bell className="h-5 w-5" />
            <span className="absolute right-1 top-1 h-2 w-2 rounded-full bg-primary" />
          </Button>
          <WalletStatusBadge />
        </div>
      </div>
    </header>
  )
}
