"use client"

import { useMemo, useState } from "react"
import { Bell, AlertCircle, Radio, DollarSign, Activity, CheckCircle2, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { cn } from "@/lib/utils"
import Link from "next/link"

type Notification = {
  id: string
  title: string
  description?: string
  href?: string
  type: "sensor" | "payout" | "system" | "alert"
  createdAt: number // ms
  read: boolean
}

const ICONS: Record<Notification["type"], React.ComponentType<{ className?: string }>> = {
  sensor: Radio,
  payout: DollarSign,
  system: Activity,
  alert: AlertCircle,
}

const TYPE_STYLES: Record<Notification["type"], string> = {
  sensor: "bg-blue-500/15 text-blue-600 dark:text-blue-400",
  payout: "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400",
  system: "bg-muted text-muted-foreground",
  alert: "bg-red-500/15 text-red-600 dark:text-red-400",
}

// 🔧 Mock inicial (puedes reemplazarlo luego con data real)
const initialMock: Notification[] = [
  {
    id: "n_1",
    title: "New reading from Sensor #A1",
    description: "PM2.5: 12 µg/m³ — Uptime 99.9%",
    href: "/sensors",
    type: "sensor",
    createdAt: Date.now() - 1000 * 60 * 3,
    read: false,
  },
  {
    id: "n_2",
    title: "Weekly payout processed",
    description: "+ 2.14 SOL to your wallet",
    href: "/dashboard",
    type: "payout",
    createdAt: Date.now() - 1000 * 60 * 45,
    read: false,
  },
  {
    id: "n_3",
    title: "RPC healthy",
    description: "Solana mainnet: all systems operational",
    type: "system",
    createdAt: Date.now() - 1000 * 60 * 60 * 2,
    read: true,
  },
  {
    id: "n_4",
    title: "Sensor #B7 offline",
    description: "No heartbeat in the last 10 minutes",
    href: "/sensors",
    type: "alert",
    createdAt: Date.now() - 1000 * 60 * 90,
    read: false,
  },
]

function timeAgo(ms: number) {
  const s = Math.floor((Date.now() - ms) / 1000)
  if (s < 60) return `${s}s`
  const m = Math.floor(s / 60)
  if (m < 60) return `${m}m`
  const h = Math.floor(m / 60)
  if (h < 24) return `${h}h`
  const d = Math.floor(h / 24)
  return `${d}d`
}

export function NotificationsBell() {
  const [items, setItems] = useState<Notification[]>(initialMock)

  const unread = useMemo(() => items.filter(i => !i.read).length, [items])

  const markAllRead = () => {
    setItems(prev => prev.map(i => ({ ...i, read: true })))
  }

  const clearAll = () => {
    setItems([])
  }

  const markOneRead = (id: string) => {
    setItems(prev => prev.map(i => i.id === id ? { ...i, read: true } : i))
  }

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" className="relative" aria-label="Notifications">
          <Bell className="h-5 w-5" />
          {unread > 0 && (
            <span
              className="absolute right-1 top-1 inline-flex h-4 min-w-4 items-center justify-center rounded-full bg-primary px-1 text-[10px] font-semibold text-primary-foreground"
              aria-label={`${unread} unread notifications`}
            >
              {unread}
            </span>
          )}
        </Button>
      </PopoverTrigger>

      <PopoverContent align="end" className="w-96 p-0 shadow-lg">
        <div className="flex items-center justify-between px-4 py-3">
          <div className="text-sm font-semibold">Notifications</div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" onClick={markAllRead} className="gap-2">
              <CheckCircle2 className="h-4 w-4" />
              Mark all read
            </Button>
            <Button variant="ghost" size="sm" onClick={clearAll} className="gap-2 text-red-600 hover:text-red-700">
              <Trash2 className="h-4 w-4" />
              Clear
            </Button>
          </div>
        </div>
        <Separator />

        {items.length === 0 ? (
          <div className="p-6 text-center text-sm text-muted-foreground">
            No notifications — you&apos;re all caught up 🍃
          </div>
        ) : (
          <ScrollArea className="max-h-[420px]">
            <ul className="divide-y divide-border/50">
              {items.map((n) => {
                const Icon = ICONS[n.type]
                return (
                  <li key={n.id}>
                    <div
                      className={cn(
                        "flex gap-3 px-4 py-3 transition-colors",
                        !n.read && "bg-primary/5"
                      )}
                    >
                      <div className={cn("mt-1 rounded-md p-2", TYPE_STYLES[n.type])}>
                        <Icon className="h-4 w-4" />
                      </div>

                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <div className="text-sm font-medium">{n.title}</div>
                          <span className="text-xs text-muted-foreground">{timeAgo(n.createdAt)}</span>
                        </div>
                        {n.description && (
                          <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">
                            {n.description}
                          </p>
                        )}

                        <div className="mt-2 flex items-center gap-2">
                          {n.href ? (
                            <Link
                              href={n.href}
                              onClick={() => markOneRead(n.id)}
                              className="text-xs font-medium text-primary underline underline-offset-4 hover:opacity-90"
                            >
                              View details
                            </Link>
                          ) : null}

                          {!n.read && (
                            <button
                              onClick={() => markOneRead(n.id)}
                              className="text-xs text-muted-foreground hover:text-foreground"
                            >
                              Mark as read
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  </li>
                )
              })}
            </ul>
          </ScrollArea>
        )}
      </PopoverContent>
    </Popover>
  )
}
