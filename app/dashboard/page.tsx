import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { GoatCard } from "@/components/goat-card"
import { goatsData } from "@/lib/mock-data"
import { Badge } from "@/components/ui/badge"

export default function DashboardPage() {
  const totalGoats = goatsData.length
  const healthyGoats = goatsData.filter((g) => g.health === "Healthy").length
  const totalValue = goatsData.reduce((sum, g) => sum + g.value, 0)
  const avgWeight =
    goatsData.reduce((sum, g) => sum + (g.weightHistory[g.weightHistory.length - 1]?.weight || 0), 0) / totalGoats

  return (
    <div className="min-h-screen">
      <Header />
      <main className="container px-4 py-8 md:px-6 md:py-12">
        {/* Page Header */}
        <div className="mb-8">
          <div className="mb-2 flex items-center gap-2">
            <Badge variant="outline" className="text-xs">
              Live Data
            </Badge>
            <span className="text-xs text-muted-foreground">Last updated: Jan 14, 2026</span>
          </div>
          <h1 className="mb-2 text-3xl font-bold md:text-4xl">Live RWA Dashboard</h1>
          <p className="text-muted-foreground">
            Track all tokenized goat assets in real-time. Each card represents one NFT backed by a physical goat.
          </p>
        </div>

        {/* Stats Overview */}
        <div className="mb-10 grid grid-cols-2 gap-4 md:grid-cols-4">
          <div className="rounded-xl border border-border bg-card p-4">
            <p className="text-sm text-muted-foreground">Total Goats</p>
            <p className="text-2xl font-bold">{totalGoats}</p>
          </div>
          <div className="rounded-xl border border-border bg-card p-4">
            <p className="text-sm text-muted-foreground">Healthy</p>
            <p className="text-2xl font-bold text-primary">
              {healthyGoats}/{totalGoats}
            </p>
          </div>
          <div className="rounded-xl border border-border bg-card p-4">
            <p className="text-sm text-muted-foreground">Total Value</p>
            <p className="text-2xl font-bold">Rp {(totalValue / 1000000).toFixed(1)}M</p>
          </div>
          <div className="rounded-xl border border-border bg-card p-4">
            <p className="text-sm text-muted-foreground">Avg Weight</p>
            <p className="text-2xl font-bold">{avgWeight.toFixed(1)}kg</p>
          </div>
        </div>

        {/* Goat NFT Grid */}
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-xl font-semibold">Goat NFT Collection</h2>
          <p className="text-sm text-muted-foreground">{totalGoats} assets</p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {goatsData.map((goat) => (
            <GoatCard key={goat.nftId} goat={goat} />
          ))}
        </div>
      </main>
      <Footer />
    </div>
  )
}
