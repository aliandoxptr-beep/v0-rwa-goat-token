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
      <Card className="group overflow-hidden transition-all hover:shadow-lg hover:border-primary/50">
        <div className="relative aspect-[4/3] overflow-hidden">
          <Image
            src={goat.image || "/placeholder.svg"}
            alt={`${goat.name} - ${goat.nftId}`}
            fill
            className="object-cover transition-transform group-hover:scale-105"
          />
          <div className="absolute right-2 top-2">
            <Badge
              variant={goat.health === "Healthy" ? "default" : "secondary"}
              className="bg-background/90 text-foreground"
            >
              {goat.health}
            </Badge>
          </div>
          <div className="absolute left-2 top-2">
            <Badge className="bg-primary text-primary-foreground">{priceInMNT.toFixed(1)} MNT</Badge>
          </div>
        </div>

        <CardContent className="p-4">
          <div className="mb-3 flex items-center justify-between">
            <div>
              <h3 className="font-semibold">{goat.name}</h3>
              <p className="text-sm text-muted-foreground">{goat.nftId}</p>
            </div>
            <div className="text-right">
              <p className="text-sm text-muted-foreground">RFID</p>
              <p className="text-xs font-mono">{goat.rfid}</p>
            </div>
          </div>

          <div className="mb-4 grid grid-cols-3 gap-2 text-center">
            <div className="rounded-lg bg-secondary p-2">
              <p className="text-xs text-muted-foreground">Age</p>
              <p className="font-semibold">{goat.age}mo</p>
            </div>
            <div className="rounded-lg bg-secondary p-2">
              <p className="text-xs text-muted-foreground">Weight</p>
              <p className="font-semibold">{currentWeight}kg</p>
            </div>
            <div className="rounded-lg bg-secondary p-2">
              <p className="text-xs text-muted-foreground">Change</p>
              <p
                className={`flex items-center justify-center gap-0.5 font-semibold ${isPositive ? "text-primary" : "text-destructive"}`}
              >
                {isPositive ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
                {isPositive ? "+" : ""}
                {weightChange}kg
              </p>
            </div>
          </div>

          <div className="mb-4 flex items-center justify-between border-t border-border pt-3">
            <div>
              <p className="text-xs text-muted-foreground">Owner</p>
              <p className="font-mono text-xs">{goat.owner}</p>
            </div>
            <div className="text-right">
              <p className="text-xs text-muted-foreground">Value</p>
              <p className="font-semibold text-primary">${goat.value.toFixed(2)}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2 mb-3">
            <Button variant="default" size="sm" className="w-full" onClick={handleBuy}>
              <ShoppingCart className="mr-1 h-3 w-3" />
              Buy
            </Button>
            <Button variant="outline" size="sm" className="w-full bg-transparent" onClick={handleSell}>
              <Tag className="mr-1 h-3 w-3" />
              Sell
            </Button>
          </div>

          <Button asChild className="w-full bg-transparent" variant="outline">
            <Link href={`/goat/${goat.tokenId}`}>View Details</Link>
          </Button>
        </CardContent>
      </Card>

      <BuySellModal open={showBuySellModal} onOpenChange={setShowBuySellModal} goat={goat} mode={modalMode} />
    </>
  )
}
