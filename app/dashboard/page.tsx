"use client"

import { useState } from "react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { GoatCard } from "@/components/goat-card"
import { AddGoatModal } from "@/components/add-goat-modal"
import { goatsData } from "@/lib/mock-data"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Plus, Filter } from "lucide-react"
import { useWeb3 } from "@/contexts/web3-context"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export default function DashboardPage() {
  const { isConnected, isCorrectNetwork } = useWeb3()
  const [showAddModal, setShowAddModal] = useState(false)
  const [filter, setFilter] = useState("all")

  const filteredGoats = goatsData.filter((goat) => {
    if (filter === "all") return true
    if (filter === "healthy") return goat.health === "Healthy"
    if (filter === "monitoring") return goat.health === "Under Monitoring"
    return true
  })

  const totalGoats = goatsData.length
  const healthyGoats = goatsData.filter((g) => g.health === "Healthy").length
  const totalValue = goatsData.reduce((sum, g) => sum + g.value, 0)
  const avgWeight =
    goatsData.reduce((sum, g) => sum + (g.weightHistory[g.weightHistory.length - 1]?.weight || 0), 0) / totalGoats

  // Convert to MNT
  const mntConversionRate = 6400000
  const totalValueMNT = totalValue / mntConversionRate

  return (
    <div className="min-h-screen">
      <Header />
      <main className="container px-4 py-8 md:px-6 md:py-12">
        {/* Page Header */}
        <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
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

          <Button
            onClick={() => setShowAddModal(true)}
            className="shrink-0"
            disabled={!isConnected || !isCorrectNetwork}
          >
            <Plus className="mr-2 h-4 w-4" />
            Tambah Kambing
          </Button>
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
            <p className="text-sm text-muted-foreground">Total Value (MNT)</p>
            <p className="text-2xl font-bold">{totalValueMNT.toFixed(2)} MNT</p>
          </div>
          <div className="rounded-xl border border-border bg-card p-4">
            <p className="text-sm text-muted-foreground">Avg Weight</p>
            <p className="text-2xl font-bold">{avgWeight.toFixed(1)}kg</p>
          </div>
        </div>

        {/* Filter and Count */}
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-xl font-semibold">Goat NFT Collection</h2>
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

        {/* Goat NFT Grid */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filteredGoats.map((goat) => (
            <GoatCard key={goat.nftId} goat={goat} />
          ))}
        </div>

        {filteredGoats.length === 0 && (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <p className="text-muted-foreground">Tidak ada kambing yang ditemukan</p>
          </div>
        )}
      </main>
      <Footer />

      {/* Add Goat Modal */}
      <AddGoatModal
        open={showAddModal}
        onOpenChange={setShowAddModal}
        onSuccess={() => {
          // In real app, would refresh data from blockchain
        }}
      />
    </div>
  )
}
