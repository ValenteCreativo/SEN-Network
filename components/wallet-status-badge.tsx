"use client"

import { useWallet } from '@solana/wallet-adapter-react'
import { Badge } from "@/components/ui/badge"
import { ConnectButton } from "@/app/components/ConnectButton"

export function WalletStatusBadge() {
  const { publicKey, connected } = useWallet()

  if (!connected || !publicKey) {
    return <ConnectButton />
  }

  const address = publicKey.toBase58()
  const displayAddress = `${address.slice(0, 4)}…${address.slice(-4)}`

  return (
    <div className="flex items-center gap-3">
      <Badge className="gap-2 bg-primary/20 px-4 py-2 text-primary hover:bg-primary/30">
        <div className="h-2 w-2 rounded-full bg-primary pulse-live" />
        {displayAddress}
      </Badge>
      <ConnectButton />
    </div>
  )
}
