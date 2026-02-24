import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight, Shield, TrendingUp, Globe } from "lucide-react"

export function HeroSection() {
  return (
    <section className="relative overflow-hidden border-b border-border">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-24 lg:px-8 lg:py-32">
        <div className="mx-auto max-w-3xl text-center">
          <div className="mb-8 inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-2 text-sm font-medium text-primary">
            <span className="h-2 w-2 rounded-full bg-primary animate-pulse" />
            Connecting Farmers to Global Capital
          </div>

          <h1 className="mb-6 text-balance text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
            <span className="text-primary">Garosta:</span> Digital Assets for Rural Prosperity
          </h1>

          <p className="mx-auto mb-10 max-w-2xl text-pretty text-base text-muted-foreground sm:text-lg lg:text-xl leading-relaxed">
            Garosta bridges the gap between small-scale farmers and global investors. Farmers access capital without collateral. Investors earn sustainable yields from real-world assets backed by transparent blockchain technology.
          </p>

          <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Button asChild size="lg" className="w-full gap-2 sm:w-auto">
              <Link href="/dashboard">
                Explore Investments
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="w-full sm:w-auto bg-transparent">
              <Link href="#how-it-works">How It Works</Link>
            </Button>
          </div>
        </div>

        <div className="mx-auto mt-16 grid max-w-5xl gap-6 sm:mt-20 lg:grid-cols-2">
          <div className="rounded-2xl border border-border bg-secondary/50 p-8">
            <div className="mb-4 text-2xl font-bold text-primary">For Farmers</div>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li className="flex items-start gap-3">
                <span className="mt-1 h-2 w-2 rounded-full bg-accent flex-shrink-0" />
                <span>Immediate access to capital without selling livestock</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="mt-1 h-2 w-2 rounded-full bg-accent flex-shrink-0" />
                <span>Retain ownership while generating revenue</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="mt-1 h-2 w-2 rounded-full bg-accent flex-shrink-0" />
                <span>Grow your business with transparent, fair terms</span>
              </li>
            </ul>
          </div>

          <div className="rounded-2xl border border-border bg-secondary/50 p-8">
            <div className="mb-4 text-2xl font-bold text-primary">For Investors</div>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li className="flex items-start gap-3">
                <span className="mt-1 h-2 w-2 rounded-full bg-accent flex-shrink-0" />
                <span>Diversify with real-world asset-backed investments</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="mt-1 h-2 w-2 rounded-full bg-accent flex-shrink-0" />
                <span>Earn sustainable yields with transparent data</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="mt-1 h-2 w-2 rounded-full bg-accent flex-shrink-0" />
                <span>Support rural communities and sustainable growth</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mx-auto mt-16 grid max-w-4xl grid-cols-2 gap-4 sm:mt-20 lg:grid-cols-4">
          {[
            { label: "Active Goats", value: "6", icon: Globe },
            { label: "Total Value", value: "$18.24", icon: TrendingUp },
            { label: "Farmers", value: "2", icon: Shield },
            { label: "Avg Yield", value: "12%", icon: TrendingUp },
          ].map((stat, i) => (
            <div
              key={i}
              className="flex flex-col items-center gap-3 rounded-2xl border border-border bg-card p-5 text-center transition-colors hover:border-primary/30"
            >
              <stat.icon className="h-5 w-5 text-primary" />
              <span className="text-2xl font-bold sm:text-3xl">{stat.value}</span>
              <span className="text-sm text-muted-foreground">{stat.label}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
