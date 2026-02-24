"use client"

import { useState } from "react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { GoatCard } from "@/components/goat-card"
import { AddGoatModal } from "@/components/add-goat-modal"
import { useGoats } from "@/contexts/goats-context"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Plus, Filter } from "lucide-react"
import { useWeb3 } from "@/contexts/web3-context"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export default function DashboardPage() {
  const { isConnected, isCorrectNetwork } = useWeb3()
  const { goats } = useGoats()
  const [showAddModal, setShowAddModal] = useState(false)
  const [filter, setFilter] = useState("all")

  const filteredGoats = goats.filter((goat) => {
    if (filter === "all") return true
    if (filter === "healthy") return goat.health === "Healthy"
    if (filter === "monitoring") return goat.health === "Under Monitoring"
    return true
  })

  const totalGoats = goats.length
  const healthyGoats = goats.filter((g) => g.health === "Healthy").length
  const totalValue = goats.reduce((sum, g) => sum + g.value, 0)
  const avgWeight =
    goats.length > 0
      ? goats.reduce((sum, g) => sum + (g.weightHistory[g.weightHistory.length - 1]?.weight || 0), 0) / totalGoats
      : 0

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <div className="mb-3 flex flex-wrap items-center gap-2">
              <Badge variant="outline" className="text-xs">
                Live Data
              </Badge>
              <span className="text-xs text-muted-foreground">Last updated: {new Date().toLocaleDateString()}</span>
            </div>
            <h1 className="mb-2 text-2xl font-bold sm:text-3xl lg:text-4xl">Live RWA Dashboard</h1>
            <p className="text-muted-foreground max-w-xl">
              Track all tokenized goat assets in real-time. Each card represents one NFT backed by a physical goat.
            </p>
          </div>

          <Button
            onClick={() => setShowAddModal(true)}
            className="shrink-0 w-full sm:w-auto"
            disabled={!isConnected || !isCorrectNetwork}
          >
            <Plus className="mr-2 h-4 w-4" />
            Add Goat
          </Button>
        </div>

        <div className="mb-10 grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
          <div className="rounded-2xl border border-border bg-card p-4 sm:p-5">
            <p className="text-xs sm:text-sm text-muted-foreground">Total Goats</p>
            <p className="text-xl sm:text-2xl font-bold mt-1">{totalGoats}</p>
          </div>
          <div className="rounded-2xl border border-border bg-card p-4 sm:p-5">
            <p className="text-xs sm:text-sm text-muted-foreground">Healthy</p>
            <p className="text-xl sm:text-2xl font-bold text-primary mt-1">
              {healthyGoats}/{totalGoats}
            </p>
          </div>
          <div className="rounded-2xl border border-border bg-card p-4 sm:p-5">
            <p className="text-xs sm:text-sm text-muted-foreground">Total Value (MNT)</p>
            <p className="text-xl sm:text-2xl font-bold mt-1">{totalValue.toFixed(4)} MNT</p>
          </div>
          <div className="rounded-2xl border border-border bg-card p-4 sm:p-5">
            <p className="text-xs sm:text-sm text-muted-foreground">Avg Weight</p>
            <p className="text-xl sm:text-2xl font-bold mt-1">{avgWeight.toFixed(1)}kg</p>
          </div>
        </div>

        <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <h2 className="text-lg font-semibold sm:text-xl">Goat NFT Collection</h2>
          <div className="flex items-center gap-3">
            <p className="text-sm text-muted-foreground">{filteredGoats.length} assets</p>
            <Select value={filter} onValueChange={setFilter}>
              <SelectTrigger className="w-[140px]">
                <Filter className="mr-2 h-4 w-4" />
                <SelectValue placeholder="Filter" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Goats</SelectItem>
                <SelectItem value="healthy">Healthy</SelectItem>
                <SelectItem value="monitoring">Monitoring</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="grid gap-4 sm:gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filteredGoats.map((goat) => (
            <GoatCard key={goat.nftId} goat={goat} />
          ))}
        </div>

        {filteredGoats.length === 0 && (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <p className="text-muted-foreground">No goats found. Add your first goat NFT!</p>
            <Button onClick={() => setShowAddModal(true)} className="mt-4" disabled={!isConnected || !isCorrectNetwork}>
              <Plus className="mr-2 h-4 w-4" />
              Add Goat
            </Button>
          </div>
        )}
      </main>
      <Footer />

      <AddGoatModal open={showAddModal} onOpenChange={setShowAddModal} />
    </div>
  )
}
