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
            Web3 for Rural Inclusion
          </div>

          <h1 className="mb-6 text-balance text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
            Garosta: <span className="text-primary">One Goat, One NFT</span>
          </h1>

          <p className="mx-auto mb-10 max-w-2xl text-pretty text-base text-muted-foreground sm:text-lg lg:text-xl leading-relaxed">
            Tokenizing village-owned goats into transparent, yield-generating NFTs. A village enterprise initiative
            bringing blockchain transparency to rural livestock management.
          </p>

          <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Button asChild size="lg" className="w-full gap-2 sm:w-auto">
              <Link href="/dashboard">
                View Goat Dashboard
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="w-full sm:w-auto bg-transparent">
              <Link href="#how-it-works">Learn How It Works</Link>
            </Button>
          </div>
        </div>

        <div className="mx-auto mt-16 grid max-w-4xl grid-cols-2 gap-4 sm:mt-20 lg:grid-cols-4">
          {[
            { label: "Total Goats", value: "6", icon: Globe },
            { label: "Total Value", value: "2.72 MNT", icon: TrendingUp },
            { label: "NFT Holders", value: "6", icon: Shield },
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
