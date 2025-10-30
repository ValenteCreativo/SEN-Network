import Link from "next/link"
import { ArrowRight, Database, Users, Globe, Github, Twitter } from "lucide-react"
import { DynamicGlowButton } from "@/components/ui/dynamic-glow-button"
import { GlassCard } from "@/components/ui/glass-card"

export default function LandingPage() {
  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="border-b border-border/50 backdrop-blur-sm">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-primary to-secondary" />
            <span className="text-xl font-bold">SolaData</span>
          </div>
          <nav className="hidden items-center gap-6 md:flex">
            <Link href="/market" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Marketplace
            </Link>
            <Link href="/dashboard" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Dashboard
            </Link>
            <Link href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Docs
            </Link>
          </nav>
          <Link href="/dashboard">
            <DynamicGlowButton variant="primary" className="gap-2">
              Launch App
              <ArrowRight className="h-4 w-4" />
            </DynamicGlowButton>
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-24 text-center">
        <div className="mx-auto max-w-4xl space-y-8">
          <div className="inline-block rounded-full border border-primary/30 bg-primary/10 px-4 py-1.5 text-sm text-primary">
            Powered by Solana
          </div>
          <h1 className="text-balance text-5xl font-bold leading-tight tracking-tight md:text-7xl">
            SolaData — Decentralized Sensor Data Marketplace
          </h1>
          <p className="text-pretty text-xl text-muted-foreground md:text-2xl">
            Earn for your sensors. Access trusted public data. Powered by Solana.
          </p>
          <div className="flex flex-col items-center justify-center gap-4 pt-4 sm:flex-row">
            <Link href="/sensors">
              <DynamicGlowButton variant="primary" className="gap-2 px-8 py-6 text-lg">
                Become a Sensor Node
                <ArrowRight className="h-5 w-5" />
              </DynamicGlowButton>
            </Link>
            <Link href="/market">
              <DynamicGlowButton variant="secondary" className="gap-2 px-8 py-6 text-lg">
                Browse Data Streams
                <Database className="h-5 w-5" />
              </DynamicGlowButton>
            </Link>
          </div>
        </div>

        {/* Holographic decoration */}
        <div className="relative mx-auto mt-16 h-64 w-full max-w-4xl">
          <div className="absolute inset-0 holographic rounded-2xl opacity-50 blur-3xl" />
          <div className="relative flex h-full items-center justify-center">
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <div className="text-4xl font-bold text-primary">10K+</div>
                <div className="text-sm text-muted-foreground">Active Sensors</div>
              </div>
              <div>
                <div className="text-4xl font-bold text-secondary">$2.4M</div>
                <div className="text-sm text-muted-foreground">Data Traded</div>
              </div>
              <div>
                <div className="text-4xl font-bold text-accent">150+</div>
                <div className="text-sm text-muted-foreground">Countries</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-24">
        <div className="grid gap-8 md:grid-cols-3">
          <GlassCard glow="primary" className="space-y-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/20">
              <Database className="h-6 w-6 text-primary" />
            </div>
            <h3 className="text-2xl font-bold">Sensor Owners</h3>
            <p className="text-muted-foreground leading-relaxed">
              Connect your IoT devices to the network. Stream real-time environmental data and earn passive income for
              every query served.
            </p>
            <div className="space-y-2 pt-4">
              <div className="flex items-center gap-2 text-sm">
                <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                <span>Connect device in minutes</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                <span>Stream data automatically</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                <span>Earn SOL for every query</span>
              </div>
            </div>
          </GlassCard>

          <GlassCard glow="secondary" className="space-y-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-secondary/20">
              <Users className="h-6 w-6 text-secondary" />
            </div>
            <h3 className="text-2xl font-bold">Data Buyers</h3>
            <p className="text-muted-foreground leading-relaxed">
              Access verified, real-time sensor data from around the world. Pay per query or subscribe monthly for
              unlimited access.
            </p>
            <div className="space-y-2 pt-4">
              <div className="flex items-center gap-2 text-sm">
                <div className="h-1.5 w-1.5 rounded-full bg-secondary" />
                <span>Query trusted data streams</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <div className="h-1.5 w-1.5 rounded-full bg-secondary" />
                <span>Real-time & historical data</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <div className="h-1.5 w-1.5 rounded-full bg-secondary" />
                <span>Flexible pricing models</span>
              </div>
            </div>
          </GlassCard>

          <GlassCard glow="accent" className="space-y-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-accent/20">
              <Globe className="h-6 w-6 text-accent" />
            </div>
            <h3 className="text-2xl font-bold">Public Good</h3>
            <p className="text-muted-foreground leading-relaxed">
              Building an open climate intelligence layer. Democratizing access to environmental data for researchers,
              governments, and communities.
            </p>
            <div className="space-y-2 pt-4">
              <div className="flex items-center gap-2 text-sm">
                <div className="h-1.5 w-1.5 rounded-full bg-accent" />
                <span>Open data standards</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <div className="h-1.5 w-1.5 rounded-full bg-accent" />
                <span>Transparent verification</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <div className="h-1.5 w-1.5 rounded-full bg-accent" />
                <span>Community governance</span>
              </div>
            </div>
          </GlassCard>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-24">
        <GlassCard className="text-center space-y-6 holographic">
          <h2 className="text-4xl font-bold">Ready to get started?</h2>
          <p className="text-xl text-muted-foreground">
            Join thousands of sensor operators earning passive income on the SolaData network.
          </p>
          <div className="flex flex-col items-center justify-center gap-4 pt-4 sm:flex-row">
            <Link href="/sensors">
              <DynamicGlowButton variant="primary" className="gap-2 px-6 py-4">
                Register Your Sensor
                <ArrowRight className="h-4 w-4" />
              </DynamicGlowButton>
            </Link>
            <Link href="/market">
              <DynamicGlowButton variant="accent" className="gap-2 px-6 py-4">
                Explore Marketplace
                <Database className="h-4 w-4" />
              </DynamicGlowButton>
            </Link>
          </div>
        </GlassCard>
      </section>

      {/* Footer */}
      <footer className="border-t border-border/50 py-12">
        <div className="container mx-auto px-4">
          <div className="grid gap-8 md:grid-cols-4">
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-primary to-secondary" />
                <span className="text-xl font-bold">SolaData</span>
              </div>
              <p className="text-sm text-muted-foreground">Decentralized sensor data marketplace powered by Solana.</p>
            </div>
            <div className="space-y-4">
              <h4 className="font-semibold">Product</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <Link href="/market" className="hover:text-foreground transition-colors">
                    Marketplace
                  </Link>
                </li>
                <li>
                  <Link href="/dashboard" className="hover:text-foreground transition-colors">
                    Dashboard
                  </Link>
                </li>
                <li>
                  <Link href="/sensors" className="hover:text-foreground transition-colors">
                    Sensors
                  </Link>
                </li>
              </ul>
            </div>
            <div className="space-y-4">
              <h4 className="font-semibold">Resources</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <Link href="#" className="hover:text-foreground transition-colors">
                    Documentation
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-foreground transition-colors">
                    API Reference
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-foreground transition-colors">
                    FAQ
                  </Link>
                </li>
              </ul>
            </div>
            <div className="space-y-4">
              <h4 className="font-semibold">Community</h4>
              <div className="flex gap-4">
                <Link href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                  <Twitter className="h-5 w-5" />
                </Link>
                <Link href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                  <Github className="h-5 w-5" />
                </Link>
              </div>
            </div>
          </div>
          <div className="mt-12 border-t border-border/50 pt-8 text-center text-sm text-muted-foreground">
            © 2025 SolaData. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  )
}
