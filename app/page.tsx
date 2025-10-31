import Link from "next/link"
import { ArrowRight, Database, Users, Globe, Github, Twitter } from "lucide-react"
import { DynamicGlowButton } from "@/components/ui/dynamic-glow-button"
import { GlassCard } from "@/components/ui/glass-card"
import { ConnectButton } from "./components/ConnectButton"

export default function LandingPage() {
  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="border-b border-border/50 backdrop-blur-sm">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-primary to-secondary" />
            <span className="text-xl font-bold">SEN Network</span>
          </div>
          <nav className="hidden items-center gap-6 md:flex">
            <Link href="/market" className="text-sm text-muted-foreground transition-colors hover:text-foreground">
              Marketplace
            </Link>
            <Link href="/dashboard" className="text-sm text-muted-foreground transition-colors hover:text-foreground">
              Dashboard
            </Link>
            <Link href="/docs" className="text-sm text-muted-foreground transition-colors hover:text-foreground">
              Docs
            </Link>
          </nav>
          <div className="flex items-center gap-4">
            <ConnectButton />
            <Link href="/dashboard">
              <DynamicGlowButton variant="primary" className="gap-2">
                Launch App
                <ArrowRight className="h-4 w-4" />
              </DynamicGlowButton>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-24 text-center">
        <div className="mx-auto max-w-4xl space-y-6">
          <div className="inline-block rounded-full border border-primary/30 bg-primary/10 px-4 py-1.5 text-xs tracking-wide uppercase text-primary">
            Powered by Solana
          </div>

          <h1 className="text-balance text-5xl font-bold leading-tight tracking-tight md:text-7xl">
            SEN Network
          </h1>

          <h2 className="text-balance text-2xl font-semibold text-foreground/90 md:text-3xl">
            The Sensor Economy on Solana
          </h2>

          <p className="mx-auto max-w-3xl text-pretty text-lg text-muted-foreground md:text-xl">
            Earn from your sensors. Access verifiable environmental data. Accelerate open climate intelligence.
          </p>

          <div className="flex flex-col items-center justify-center gap-4 pt-2 sm:flex-row">
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

        {/* Metrics */}
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
            <p className="leading-relaxed text-muted-foreground">
              Plug your IoT devices into SEN. Stream real-time environmental data and earn per query served.
            </p>
            <div className="space-y-2 pt-4">
              <div className="flex items-center gap-2 text-sm">
                <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                <span>Connect in minutes</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                <span>Automatic data streaming</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                <span>Earn SOL per query</span>
              </div>
            </div>
          </GlassCard>

          <GlassCard glow="secondary" className="space-y-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-secondary/20">
              <Users className="h-6 w-6 text-secondary" />
            </div>
            <h3 className="text-2xl font-bold">Data Buyers</h3>
            <p className="leading-relaxed text-muted-foreground">
              Access verified, real-time sensor feeds worldwide. Pay-per-query or subscribe for predictable costs.
            </p>
            <div className="space-y-2 pt-4">
              <div className="flex items-center gap-2 text-sm">
                <div className="h-1.5 w-1.5 rounded-full bg-secondary" />
                <span>Trusted &amp; verifiable streams</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <div className="h-1.5 w-1.5 rounded-full bg-secondary" />
                <span>Real-time &amp; historical access</span>
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
            <h3 className="text-2xl font-bold">Open Intelligence</h3>
            <p className="leading-relaxed text-muted-foreground">
              Building a public climate intelligence layer. Democratizing access for researchers, governments, and communities.
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
        <GlassCard className="holographic space-y-6 text-center">
          <h2 className="text-4xl font-bold">Ready to get started?</h2>
          <p className="text-xl text-muted-foreground">
            Join thousands of sensor operators earning passive income on the SEN Network.
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
                <span className="text-xl font-bold">SEN Network</span>
              </div>
              <p className="text-sm text-muted-foreground">
                The Sensor Economy on Solana — a decentralized marketplace for real-world data.
              </p>
            </div>
            <div className="space-y-4">
              <h4 className="font-semibold">Product</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <Link href="/market" className="transition-colors hover:text-foreground">
                    Marketplace
                  </Link>
                </li>
                <li>
                  <Link href="/dashboard" className="transition-colors hover:text-foreground">
                    Dashboard
                  </Link>
                </li>
                <li>
                  <Link href="/sensors" className="transition-colors hover:text-foreground">
                    Sensors
                  </Link>
                </li>
              </ul>
            </div>
            <div className="space-y-4">
              <h4 className="font-semibold">Resources</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <Link href="/docs" className="transition-colors hover:text-foreground">
                    Documentation
                  </Link>
                </li>
                <li>
                  <Link href="/docs/api" className="transition-colors hover:text-foreground">
                    API Reference
                  </Link>
                </li>
                <li>
                  <Link href="/faq" className="transition-colors hover:text-foreground">
                    FAQ
                  </Link>
                </li>
              </ul>
            </div>
            <div className="space-y-4">
              <h4 className="font-semibold">Community</h4>
              <div className="flex gap-4">
                <Link
                  href="https://twitter.com"
                  className="text-muted-foreground transition-colors hover:text-foreground"
                  aria-label="Twitter"
                >
                  <Twitter className="h-5 w-5" />
                </Link>
                <Link
                  href="https://github.com/ValenteCreativo/SEN-Network"
                  className="text-muted-foreground transition-colors hover:text-foreground"
                  aria-label="GitHub"
                >
                  <Github className="h-5 w-5" />
                </Link>
              </div>
            </div>
          </div>
          <div className="mt-12 border-t border-border/50 pt-8 text-center text-sm text-muted-foreground">
            © 2025 SEN Network. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  )
}
