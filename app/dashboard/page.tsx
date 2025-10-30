import { Sidebar } from "@/components/dashboard/sidebar"
import { DashboardHeader } from "@/components/dashboard/header"
import { StatCard } from "@/components/dashboard/stat-card"
import { RevenueChart } from "@/components/dashboard/revenue-chart"
import { Wallet, Radio, ShoppingCart, TrendingUp } from "lucide-react"

export default function DashboardPage() {
  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="ml-64 flex-1">
        <DashboardHeader />
        <main className="p-8">
          <div className="space-y-8">
            {/* Stats Grid */}
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
              <StatCard
                title="Total Earnings"
                value="$1,247.50"
                icon={Wallet}
                trend="+12.5% from last month"
                glow="primary"
              />
              <StatCard title="Active Sensors" value="8" icon={Radio} trend="2 added this week" glow="secondary" />
              <StatCard title="Data Purchased" value="$342.80" icon={ShoppingCart} trend="+8.2% from last month" />
              <StatCard title="Avg. Revenue/Day" value="$41.58" icon={TrendingUp} trend="+5.3% from last week" />
            </div>

            {/* Revenue Chart */}
            <RevenueChart />

            {/* Quick Actions */}
            <div className="grid gap-6 md:grid-cols-2">
              <div className="glass-card rounded-lg p-6 space-y-4">
                <h3 className="text-lg font-semibold">Quick Actions</h3>
                <div className="space-y-2">
                  <button className="w-full rounded-lg border border-primary/30 bg-primary/10 px-4 py-3 text-left text-sm font-medium text-primary transition-all hover:bg-primary/20">
                    Register New Sensor
                  </button>
                  <button className="w-full rounded-lg border border-border bg-muted/50 px-4 py-3 text-left text-sm font-medium transition-all hover:bg-muted">
                    View Marketplace
                  </button>
                  <button className="w-full rounded-lg border border-border bg-muted/50 px-4 py-3 text-left text-sm font-medium transition-all hover:bg-muted">
                    Withdraw Earnings
                  </button>
                </div>
              </div>

              <div className="glass-card rounded-lg p-6 space-y-4">
                <h3 className="text-lg font-semibold">Recent Activity</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Data query from 7xKX...9mPq</span>
                    <span className="font-mono text-primary">+$0.12</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Monthly subscription renewed</span>
                    <span className="font-mono text-primary">+$5.00</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Data query from 4mNb...7xQw</span>
                    <span className="font-mono text-primary">+$0.08</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Sensor uptime bonus</span>
                    <span className="font-mono text-primary">+$2.50</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
