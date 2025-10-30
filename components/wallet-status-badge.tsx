"use client"

import { Wallet } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { useState } from "react"

export function WalletStatusBadge() {
  const [isConnected, setIsConnected] = useState(false)
  const [address, setAddress] = useState("")

  const handleConnect = () => {
    // Mock wallet connection
    setIsConnected(true)
    setAddress("7xKX...9mPq")
  }

  const handleDisconnect = () => {
    setIsConnected(false)
    setAddress("")
  }

  if (!isConnected) {
    return (
      <Button
        onClick={handleConnect}
        variant="outline"
        className="gap-2 border-primary/30 bg-primary/10 text-primary hover:bg-primary/20"
      >
        <Wallet className="h-4 w-4" />
        Connect Wallet
      </Button>
    )
  }

  return (
    <Badge
      onClick={handleDisconnect}
      className="cursor-pointer gap-2 bg-primary/20 px-4 py-2 text-primary hover:bg-primary/30"
    >
      <div className="h-2 w-2 rounded-full bg-primary pulse-live" />
      {address}
    </Badge>
  )
}
