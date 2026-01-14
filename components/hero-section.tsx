import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight, Shield, TrendingUp, Globe } from "lucide-react"

export function HeroSection() {
  return (
    <section className="relative overflow-hidden border-b border-border">
      <div className="container px-4 py-20 md:px-6 md:py-32">
        <div className="mx-auto max-w-4xl text-center">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary">
            <span className="h-1.5 w-1.5 rounded-full bg-primary" />
            Web3 for Rural Inclusion
          </div>

          <h1 className="mb-6 text-balance text-4xl font-bold tracking-tight md:text-6xl lg:text-7xl">
            Real World Asset Tokenization: <span className="text-primary">One Goat, One NFT</span>
          </h1>

          <p className="mx-auto mb-10 max-w-2xl text-pretty text-lg text-muted-foreground md:text-xl">
            Tokenizing village-owned goats into transparent, yield-generating NFTs. A BUMDes initiative bringing
            blockchain transparency to rural livestock management.
          </p>

          <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Button asChild size="lg" className="gap-2">
              <Link href="/dashboard">
                View Goat Dashboard
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link href="#how-it-works">Learn How It Works</Link>
            </Button>
          </div>
        </div>

        {/* Stats */}
        <div className="mx-auto mt-20 grid max-w-4xl grid-cols-2 gap-4 md:grid-cols-4">
          {[
            { label: "Total Goats", value: "6", icon: Globe },
            { label: "Total Value", value: "Rp 17.4M", icon: TrendingUp },
            { label: "NFT Holders", value: "6", icon: Shield },
            { label: "Avg Yield", value: "12%", icon: TrendingUp },
          ].map((stat, i) => (
            <div
              key={i}
              className="flex flex-col items-center gap-2 rounded-xl border border-border bg-card p-6 text-center"
            >
              <stat.icon className="h-5 w-5 text-primary" />
              <span className="text-2xl font-bold md:text-3xl">{stat.value}</span>
              <span className="text-sm text-muted-foreground">{stat.label}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
