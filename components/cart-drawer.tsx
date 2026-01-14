"use client"

import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ShoppingCart, Trash2, ExternalLink, Package } from "lucide-react"
import { useCart } from "@/contexts/cart-context"
import { useWeb3 } from "@/contexts/web3-context"
import Image from "next/image"

export function CartDrawer() {
  const { items, removeItem, clearCart, totalItems, totalValue } = useCart()
  const { networkType } = useWeb3()

  const getExplorerUrl = (hash: string) => {
    return networkType === "testnet" ? `https://sepolia.mantlescan.xyz/tx/${hash}` : `https://mantlescan.xyz/tx/${hash}`
  }

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline" size="sm" className="relative bg-transparent">
          <ShoppingCart className="h-4 w-4" />
          {totalItems > 0 && (
            <Badge className="absolute -right-2 -top-2 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs">
              {totalItems}
            </Badge>
          )}
          <span className="ml-2 hidden sm:inline">My NFTs</span>
        </Button>
      </SheetTrigger>
      <SheetContent className="w-full sm:max-w-md">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2">
            <Package className="h-5 w-5" />
            My Purchased NFTs
            {totalItems > 0 && <Badge variant="secondary">{totalItems}</Badge>}
          </SheetTitle>
        </SheetHeader>

        <div className="mt-6 flex flex-col gap-4 h-[calc(100vh-200px)] overflow-y-auto">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <ShoppingCart className="h-12 w-12 text-muted-foreground mb-4" />
              <p className="text-muted-foreground">No purchased NFTs yet</p>
              <p className="text-sm text-muted-foreground mt-1">Your purchased goat NFTs will appear here</p>
            </div>
          ) : (
            items.map((item) => (
              <div key={item.nftId} className="flex gap-3 rounded-xl border border-border p-3 bg-card">
                <div className="relative h-16 w-16 overflow-hidden rounded-lg shrink-0">
                  <Image src={item.image || "/placeholder.svg"} alt={item.name} fill className="object-cover" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h4 className="font-semibold text-sm">{item.name}</h4>
                      <p className="text-xs text-muted-foreground">{item.nftId}</p>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7 shrink-0"
                      onClick={() => removeItem(item.nftId)}
                    >
                      <Trash2 className="h-3.5 w-3.5 text-destructive" />
                    </Button>
                  </div>
                  <div className="mt-1.5 flex items-center gap-2 text-xs">
                    <span className="font-medium text-primary">{item.purchasePrice.toFixed(6)} MNT</span>
                    <span className="text-muted-foreground">•</span>
                    <span className="text-muted-foreground">{new Date(item.purchaseDate).toLocaleDateString()}</span>
                  </div>
                  <a
                    href={getExplorerUrl(item.txHash)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-1.5 inline-flex items-center gap-1 text-xs text-primary hover:underline"
                  >
                    View TX <ExternalLink className="h-3 w-3" />
                  </a>
                </div>
              </div>
            ))
          )}
        </div>

        {items.length > 0 && (
          <div className="absolute bottom-0 left-0 right-0 border-t border-border bg-background p-4">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm text-muted-foreground">Total Value</span>
              <span className="font-bold text-primary">{totalValue.toFixed(6)} MNT</span>
            </div>
            <Button variant="outline" className="w-full bg-transparent" onClick={clearCart}>
              <Trash2 className="mr-2 h-4 w-4" />
              Clear All
            </Button>
          </div>
        )}
      </SheetContent>
    </Sheet>
  )
}
