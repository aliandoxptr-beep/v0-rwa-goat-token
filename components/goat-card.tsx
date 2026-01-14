"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { TrendingUp, TrendingDown, ShoppingCart, Tag } from "lucide-react"
import { BuySellModal } from "@/components/buy-sell-modal"
import type { GoatNFT } from "@/lib/mock-data"

interface GoatCardProps {
  goat: GoatNFT
}

export function GoatCard({ goat }: GoatCardProps) {
  const [showBuySellModal, setShowBuySellModal] = useState(false)
  const [modalMode, setModalMode] = useState<"buy" | "sell">("buy")

  const currentWeight = goat.weightHistory[goat.weightHistory.length - 1]?.weight || 0
  const previousWeight = goat.weightHistory[goat.weightHistory.length - 2]?.weight || currentWeight
  const weightChange = currentWeight - previousWeight
  const isPositive = weightChange >= 0

  const mntConversionRate = 0.4
  const priceInMNT = goat.value / mntConversionRate

  const handleBuy = () => {
    setModalMode("buy")
    setShowBuySellModal(true)
  }

  const handleSell = () => {
    setModalMode("sell")
    setShowBuySellModal(true)
  }

  return (
    <>
      <Card className="group overflow-hidden transition-all duration-200 hover:shadow-lg hover:border-primary/50">
        <div className="relative aspect-[4/3] overflow-hidden">
          <Image
            src={goat.image || "/placeholder.svg"}
            alt={`${goat.name} - ${goat.nftId}`}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
          />
          <div className="absolute right-2.5 top-2.5">
            <Badge
              variant={goat.health === "Healthy" ? "default" : "secondary"}
              className="bg-background/90 text-foreground shadow-sm"
            >
              {goat.health}
            </Badge>
          </div>
          <div className="absolute left-2.5 top-2.5">
            <Badge className="bg-primary text-primary-foreground shadow-sm">{priceInMNT.toFixed(1)} MNT</Badge>
          </div>
        </div>

        <CardContent className="p-4 sm:p-5">
          <div className="mb-4 flex items-start justify-between gap-3">
            <div className="min-w-0">
              <h3 className="font-semibold truncate">{goat.name}</h3>
              <p className="text-sm text-muted-foreground">{goat.nftId}</p>
            </div>
            <div className="text-right shrink-0">
              <p className="text-xs text-muted-foreground">RFID</p>
              <p className="text-xs font-mono">{goat.rfid}</p>
            </div>
          </div>

          <div className="mb-4 grid grid-cols-3 gap-2">
            <div className="rounded-lg bg-secondary p-2.5 text-center">
              <p className="text-xs text-muted-foreground">Age</p>
              <p className="font-semibold text-sm mt-0.5">{goat.age}mo</p>
            </div>
            <div className="rounded-lg bg-secondary p-2.5 text-center">
              <p className="text-xs text-muted-foreground">Weight</p>
              <p className="font-semibold text-sm mt-0.5">{currentWeight}kg</p>
            </div>
            <div className="rounded-lg bg-secondary p-2.5 text-center">
              <p className="text-xs text-muted-foreground">Change</p>
              <p
                className={`flex items-center justify-center gap-0.5 font-semibold text-sm mt-0.5 ${isPositive ? "text-primary" : "text-destructive"}`}
              >
                {isPositive ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
                {isPositive ? "+" : ""}
                {weightChange}kg
              </p>
            </div>
          </div>

          <div className="mb-4 flex items-center justify-between border-t border-border pt-4">
            <div className="min-w-0">
              <p className="text-xs text-muted-foreground">Owner</p>
              <p className="font-mono text-xs truncate max-w-[120px]">{goat.owner}</p>
            </div>
            <div className="text-right shrink-0">
              <p className="text-xs text-muted-foreground">Value</p>
              <p className="font-semibold text-primary">${goat.value.toFixed(2)}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2 mb-3">
            <Button variant="default" size="sm" className="w-full" onClick={handleBuy}>
              <ShoppingCart className="mr-1.5 h-3.5 w-3.5" />
              Buy
            </Button>
            <Button variant="outline" size="sm" className="w-full bg-transparent" onClick={handleSell}>
              <Tag className="mr-1.5 h-3.5 w-3.5" />
              Sell
            </Button>
          </div>

          <Button asChild className="w-full bg-transparent" variant="outline" size="sm">
            <Link href={`/goat/${goat.tokenId}`}>View Details</Link>
          </Button>
        </CardContent>
      </Card>

      <BuySellModal open={showBuySellModal} onOpenChange={setShowBuySellModal} goat={goat} mode={modalMode} />
    </>
  )
}
