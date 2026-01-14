"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useWeb3 } from "@/contexts/web3-context"
import { GOAT_NFT_CONTRACT, MARKETPLACE_CONTRACT } from "@/lib/goat-contract"
import { Loader2, ShoppingCart, Tag, AlertCircle, ExternalLink } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import Image from "next/image"
import type { GoatNFT } from "@/lib/mock-data"

interface BuySellModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  goat: GoatNFT | null
  mode: "buy" | "sell"
  onSuccess?: () => void
}

export function BuySellModal({ open, onOpenChange, goat, mode, onSuccess }: BuySellModalProps) {
  const { isConnected, address, balance, isCorrectNetwork, switchToMantle } = useWeb3()
  const [isLoading, setIsLoading] = useState(false)
  const [txHash, setTxHash] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [sellPrice, setSellPrice] = useState("")

  if (!goat) return null

  // Convert goat value from Rupiah to MNT (mock conversion: 1 MNT = ~Rp 6,400,000)
  const mntConversionRate = 6400000
  const goatPriceInMNT = goat.value / mntConversionRate
  const currentWeight = goat.weightHistory[goat.weightHistory.length - 1]?.weight || 0

  const handleBuy = async () => {
    setError(null)
    setTxHash(null)

    if (!isConnected) {
      setError("Silakan hubungkan wallet terlebih dahulu")
      return
    }

    if (!isCorrectNetwork) {
      try {
        await switchToMantle()
      } catch {
        setError("Gagal switch ke Mantle network")
        return
      }
    }

    const requiredBalance = goatPriceInMNT
    if (Number(balance) < requiredBalance) {
      setError(`Saldo tidak cukup. Diperlukan ${requiredBalance.toFixed(4)} MNT`)
      return
    }

    setIsLoading(true)

    try {
      const provider = (window as any).ethereum

      if (!provider) {
        throw new Error("Wallet provider tidak ditemukan")
      }

      // Prepare buy transaction
      const gasEstimate = "0x" + (200000).toString(16)
      const gasPrice = await provider.request({ method: "eth_gasPrice" })
      const valueInWei = "0x" + BigInt(Math.floor(goatPriceInMNT * 1e18)).toString(16)

      const tx = {
        from: address,
        to: MARKETPLACE_CONTRACT.address,
        gas: gasEstimate,
        gasPrice: gasPrice,
        value: valueInWei,
        data: encodeBuyData(GOAT_NFT_CONTRACT.address, goat.tokenId),
      }

      // Send transaction
      const hash = await provider.request({
        method: "eth_sendTransaction",
        params: [tx],
      })

      setTxHash(hash)

      // Wait for confirmation
      setTimeout(() => {
        setIsLoading(false)
        onSuccess?.()
      }, 3000)
    } catch (err: any) {
      console.error("[v0] Buy error:", err)
      setError(err.message || "Gagal membeli NFT")
      setIsLoading(false)
    }
  }

  const handleSell = async () => {
    setError(null)
    setTxHash(null)

    if (!isConnected) {
      setError("Silakan hubungkan wallet terlebih dahulu")
      return
    }

    if (!sellPrice || Number(sellPrice) <= 0) {
      setError("Masukkan harga jual yang valid")
      return
    }

    if (!isCorrectNetwork) {
      try {
        await switchToMantle()
      } catch {
        setError("Gagal switch ke Mantle network")
        return
      }
    }

    setIsLoading(true)

    try {
      const provider = (window as any).ethereum

      if (!provider) {
        throw new Error("Wallet provider tidak ditemukan")
      }

      // Prepare list transaction
      const gasEstimate = "0x" + (150000).toString(16)
      const gasPrice = await provider.request({ method: "eth_gasPrice" })
      const priceInWei = BigInt(Math.floor(Number(sellPrice) * 1e18)).toString()

      const tx = {
        from: address,
        to: MARKETPLACE_CONTRACT.address,
        gas: gasEstimate,
        gasPrice: gasPrice,
        value: "0x0",
        data: encodeListData(GOAT_NFT_CONTRACT.address, goat.tokenId, priceInWei),
      }

      // Send transaction
      const hash = await provider.request({
        method: "eth_sendTransaction",
        params: [tx],
      })

      setTxHash(hash)

      // Wait for confirmation
      setTimeout(() => {
        setIsLoading(false)
        onSuccess?.()
      }, 3000)
    } catch (err: any) {
      console.error("[v0] Sell error:", err)
      setError(err.message || "Gagal listing NFT")
      setIsLoading(false)
    }
  }

  // Simple encoding functions (placeholders)
  function encodeBuyData(nftContract: string, tokenId: number): string {
    return "0xabcdef00" // Placeholder
  }

  function encodeListData(nftContract: string, tokenId: number, price: string): string {
    return "0x12345600" // Placeholder
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>{mode === "buy" ? "Beli NFT Kambing" : "Jual NFT Kambing"}</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Goat Info Card */}
          <div className="flex gap-4 rounded-lg border border-border p-4">
            <div className="relative h-20 w-20 overflow-hidden rounded-lg">
              <Image src={goat.image || "/placeholder.svg"} alt={goat.name} fill className="object-cover" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold">{goat.name}</h3>
              <p className="text-sm text-muted-foreground">{goat.nftId}</p>
              <div className="mt-1 flex gap-3 text-sm">
                <span>Umur: {goat.age}mo</span>
                <span>Berat: {currentWeight}kg</span>
              </div>
              <p className="mt-1 text-sm font-medium text-primary">{goatPriceInMNT.toFixed(4)} MNT</p>
            </div>
          </div>

          {!isConnected && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>Hubungkan wallet Anda terlebih dahulu</AlertDescription>
            </Alert>
          )}

          {!isCorrectNetwork && isConnected && (
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                Switch ke Mantle Network diperlukan
                <Button variant="link" className="h-auto p-0 ml-2" onClick={switchToMantle}>
                  Switch
                </Button>
              </AlertDescription>
            </Alert>
          )}

          <Tabs defaultValue={mode} className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="buy">
                <ShoppingCart className="mr-2 h-4 w-4" />
                Beli
              </TabsTrigger>
              <TabsTrigger value="sell">
                <Tag className="mr-2 h-4 w-4" />
                Jual
              </TabsTrigger>
            </TabsList>

            <TabsContent value="buy" className="space-y-4 pt-4">
              <div className="rounded-lg bg-secondary p-4">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Harga NFT</span>
                  <span className="font-semibold">{goatPriceInMNT.toFixed(4)} MNT</span>
                </div>
                <div className="mt-2 flex justify-between text-sm">
                  <span className="text-muted-foreground">Gas Fee (estimasi)</span>
                  <span>~0.001 MNT</span>
                </div>
                <div className="mt-3 flex justify-between border-t border-border pt-3">
                  <span className="font-medium">Total</span>
                  <span className="font-bold text-primary">{(goatPriceInMNT + 0.001).toFixed(4)} MNT</span>
                </div>
              </div>

              {balance && (
                <p className="text-sm text-muted-foreground">
                  Saldo Anda: <span className="font-medium">{balance} MNT</span>
                </p>
              )}

              {error && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              {txHash && (
                <Alert className="border-primary bg-primary/10">
                  <AlertDescription className="flex items-center justify-between">
                    <span>Transaksi terkirim!</span>
                    <a
                      href={`https://explorer.mantle.xyz/tx/${txHash}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1 text-primary underline"
                    >
                      Explorer <ExternalLink className="h-3 w-3" />
                    </a>
                  </AlertDescription>
                </Alert>
              )}

              <Button className="w-full" onClick={handleBuy} disabled={!isConnected || isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    <ShoppingCart className="mr-2 h-4 w-4" />
                    Beli Sekarang
                  </>
                )}
              </Button>
            </TabsContent>

            <TabsContent value="sell" className="space-y-4 pt-4">
              <div className="space-y-2">
                <Label htmlFor="sellPrice">Harga Jual (MNT)</Label>
                <Input
                  id="sellPrice"
                  type="number"
                  step="0.001"
                  placeholder="0.5"
                  value={sellPrice}
                  onChange={(e) => setSellPrice(e.target.value)}
                />
                <p className="text-xs text-muted-foreground">
                  Harga rekomendasi: {goatPriceInMNT.toFixed(4)} MNT (berdasarkan nilai aset)
                </p>
              </div>

              {sellPrice && Number(sellPrice) > 0 && (
                <div className="rounded-lg bg-secondary p-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Harga Listing</span>
                    <span className="font-semibold">{Number(sellPrice).toFixed(4)} MNT</span>
                  </div>
                  <div className="mt-2 flex justify-between text-sm">
                    <span className="text-muted-foreground">Platform Fee (2%)</span>
                    <span>-{(Number(sellPrice) * 0.02).toFixed(4)} MNT</span>
                  </div>
                  <div className="mt-3 flex justify-between border-t border-border pt-3">
                    <span className="font-medium">Anda Terima</span>
                    <span className="font-bold text-primary">{(Number(sellPrice) * 0.98).toFixed(4)} MNT</span>
                  </div>
                </div>
              )}

              {error && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              {txHash && (
                <Alert className="border-primary bg-primary/10">
                  <AlertDescription className="flex items-center justify-between">
                    <span>NFT berhasil di-listing!</span>
                    <a
                      href={`https://explorer.mantle.xyz/tx/${txHash}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1 text-primary underline"
                    >
                      Explorer <ExternalLink className="h-3 w-3" />
                    </a>
                  </AlertDescription>
                </Alert>
              )}

              <Button className="w-full" onClick={handleSell} disabled={!isConnected || isLoading || !sellPrice}>
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    <Tag className="mr-2 h-4 w-4" />
                    Listing untuk Dijual
                  </>
                )}
              </Button>
            </TabsContent>
          </Tabs>

          <p className="text-center text-xs text-muted-foreground">Transaksi diproses di Mantle Network (L2)</p>
        </div>
      </DialogContent>
    </Dialog>
  )
}
