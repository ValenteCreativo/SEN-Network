"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { LayoutDashboard, Radio, ShoppingBag, Settings } from "lucide-react"
import { cn } from "@/lib/utils"

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/sensors", label: "My Sensors", icon: Radio },
  { href: "/market", label: "Market", icon: ShoppingBag },
  { href: "/settings", label: "Settings", icon: Settings },
]

export function Sidebar() {
  const pathname = usePathname()

  return (
    <aside className="fixed left-0 top-0 z-40 h-screen w-64 border-r border-border/50 bg-card/50 backdrop-blur-sm">
      <div className="flex h-full flex-col">
        {/* Logo */}
        <Link href="/" className="flex h-16 items-center gap-2 border-b border-border/50 px-6 hover:opacity-80 transition">
          <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-primary to-secondary" />
          <span className="text-xl font-bold">SEN NETWORK</span>
        </Link>

        {/* Navigation */}
        <nav className="flex-1 space-y-1 p-4">
          {navItems.map((item) => {
            const Icon = item.icon
            const isActive = pathname === item.href
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium transition-all",
                  isActive
                    ? "bg-primary/20 text-primary glow-primary"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground",
                )}
              >
                <Icon className="h-5 w-5" />
                {item.label}
              </Link>
            )
          })}
        </nav>

        {/* Footer */}
        <div className="border-t border-border/50 p-4">
          <div className="rounded-lg bg-muted/50 p-4 text-xs text-muted-foreground">
            <div className="font-semibold text-foreground">Network Status</div>
            <div className="mt-2 flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-primary pulse-live" />
              <span>All systems operational</span>
            </div>
          </div>
        </div>
      </div>
    </aside>
  )
}
