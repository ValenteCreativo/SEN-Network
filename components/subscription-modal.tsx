"use client"

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { DynamicGlowButton } from "@/components/ui/dynamic-glow-button"
import { Button } from "@/components/ui/button"
import { Zap, Calendar } from "lucide-react"

interface SubscriptionModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  sensorName: string
  pricePerQuery: number
  monthlySubscription: number
}

export function SubscriptionModal({
  open,
  onOpenChange,
  sensorName,
  pricePerQuery,
  monthlySubscription,
}: SubscriptionModalProps) {
  const handlePayPerQuery = () => {
    console.log("Pay per query selected")
    onOpenChange(false)
  }

  const handleSubscribe = () => {
    console.log("Monthly subscription selected")
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="glass-card border-primary/30 sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="text-2xl">Subscribe to {sensorName}</DialogTitle>
          <DialogDescription>Choose your preferred pricing model to access this data stream.</DialogDescription>
        </DialogHeader>

        <div className="space-y-4 pt-4">
          {/* Pay per query option */}
          <div className="glass-card rounded-lg border-2 border-primary/30 p-6 space-y-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/20">
                <Zap className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold">Pay Per Query</h3>
                <p className="text-sm text-muted-foreground">Only pay for what you use</p>
              </div>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-bold text-primary">${pricePerQuery}</span>
              <span className="text-muted-foreground">per query</span>
            </div>
            <DynamicGlowButton variant="primary" className="w-full" onClick={handlePayPerQuery}>
              Select Pay Per Query
            </DynamicGlowButton>
          </div>

          {/* Monthly subscription option */}
          <div className="glass-card rounded-lg border-2 border-secondary/30 p-6 space-y-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-secondary/20">
                <Calendar className="h-5 w-5 text-secondary" />
              </div>
              <div>
                <h3 className="font-semibold">Monthly Subscription</h3>
                <p className="text-sm text-muted-foreground">Unlimited queries</p>
              </div>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-bold text-secondary">${monthlySubscription}</span>
              <span className="text-muted-foreground">per month</span>
            </div>
            <DynamicGlowButton variant="secondary" className="w-full" onClick={handleSubscribe}>
              Subscribe Monthly
            </DynamicGlowButton>
          </div>

          <Button variant="outline" onClick={() => onOpenChange(false)} className="w-full">
            Cancel
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
