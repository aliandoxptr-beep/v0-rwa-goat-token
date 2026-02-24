"use client"

import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Heart, TrendingUp, Info } from "lucide-react"
import Image from "next/image"
import { useState } from "react"
import { BuySolanaGoatModal } from "./buy-solana-goat-modal"

interface SolanaNFTCardProps {
  id: string
  name: string
  image: string
  rfid: string
  age: number
  weight: number
  goatType: string
  priceSOL: number
  owner: string
  isMinted: boolean
  mint?: string
}

export function SolanaNFTCard({
  id,
  name,
  image,
  rfid,
  age,
  weight,
  goatType,
  priceSOL,
  owner,
  isMinted,
  mint,
}: SolanaNFTCardProps) {
  const [liked, setLiked] = useState(false)
  const [buyModalOpen, setBuyModalOpen] = useState(false)

  return (
    <>
      <Card className="group overflow-hidden transition-all hover:shadow-lg hover:border-primary/30">
        <CardHeader className="p-0">
          <div className="relative h-48 w-full overflow-hidden bg-secondary">
            <Image
              src={image}
              alt={name}
              fill
              className="object-cover transition-transform group-hover:scale-105"
            />
            {isMinted && (
              <Badge className="absolute top-2 right-2 bg-green-500/90">
                NFT Minted
              </Badge>
            )}
          </div>
        </CardHeader>
        <CardContent className="space-y-4 p-4">
          <div className="space-y-2">
            <h3 className="text-lg font-bold line-clamp-1">{name}</h3>
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1 rounded-full bg-accent/10 px-2 py-1 text-xs font-medium text-accent">
                <span className="h-1.5 w-1.5 rounded-full bg-accent" />
                {goatType}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 text-sm">
            <div className="space-y-1">
              <span className="block text-xs text-muted-foreground">RFID</span>
              <span className="font-mono text-xs font-semibold truncate">{rfid}</span>
            </div>
            <div className="space-y-1">
              <span className="block text-xs text-muted-foreground">Age</span>
              <span className="font-semibold">{age} months</span>
            </div>
            <div className="space-y-1">
              <span className="block text-xs text-muted-foreground">Weight</span>
              <span className="font-semibold">{weight} kg</span>
            </div>
            <div className="space-y-1">
              <span className="block text-xs text-muted-foreground">Price</span>
              <span className="font-semibold">{priceSOL} SOL</span>
            </div>
          </div>

          {isMinted && mint && (
            <div className="space-y-1 rounded-lg bg-secondary/50 p-2">
              <span className="block text-xs text-muted-foreground">Mint Address</span>
              <a
                href={`https://explorer.solana.com/address/${mint}?cluster=devnet`}
                target="_blank"
                rel="noopener noreferrer"
                className="font-mono text-xs truncate hover:text-primary transition-colors"
              >
                {mint}
              </a>
            </div>
          )}
        </CardContent>
        <CardFooter className="flex gap-2 p-4 pt-0">
          <Button
            variant="outline"
            size="sm"
            className="flex-1 bg-transparent"
            onClick={() => setBuyModalOpen(true)}
            disabled={!isMinted}
          >
            <TrendingUp className="mr-2 h-4 w-4" />
            Buy
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="bg-transparent"
            onClick={() => setLiked(!liked)}
          >
            <Heart
              className={`h-4 w-4 ${liked ? "fill-red-500 text-red-500" : ""}`}
            />
          </Button>
        </CardFooter>
      </Card>

      <BuySolanaGoatModal
        open={buyModalOpen}
        onOpenChange={setBuyModalOpen}
        goat={{
          id,
          name,
          priceSOL,
          owner,
          mint: mint || "",
        }}
      />
    </>
  )
}
