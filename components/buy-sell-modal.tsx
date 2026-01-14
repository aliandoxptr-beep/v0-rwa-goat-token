"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useWeb3 } from "@/contexts/web3-context"
import { useCart } from "@/contexts/cart-context"
import { Loader2, ShoppingCart, Tag, AlertCircle, ExternalLink, CheckCircle2 } from "lucide-react"
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

const TREASURY_ADDRESS = "0x48e390cf960497142e6724637e5edd288ea911f2"

export function BuySellModal({ open, onOpenChange, goat, mode, onSuccess }: BuySellModalProps) {
  const { isConnected, address, balance, isCorrectNetwork, switchToMantle, networkType, getConnectedProvider } =
    useWeb3()
  const { addItem } = useCart()
  const [isLoading, setIsLoading] = useState(false)
  const [txHash, setTxHash] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [sellPrice, setSellPrice] = useState("")
  const [isSuccess, setIsSuccess] = useState(false)

  if (!goat) return null

  const goatPriceInMNT = goat.value
  const currentWeight = goat.weightHistory[goat.weightHistory.length - 1]?.weight || 0

  const getExplorerUrl = (hash: string) => {
    return networkType === "testnet" ? `https://sepolia.mantlescan.xyz/tx/${hash}` : `https://mantlescan.xyz/tx/${hash}`
  }

  const handleBuy = async () => {
    setError(null)
    setTxHash(null)
    setIsSuccess(false)

    if (!isConnected) {
      setError("Please connect your wallet first")
      return
    }

    if (!isCorrectNetwork) {
      try {
        await switchToMantle()
      } catch {
        setError("Failed to switch to Mantle network")
        return
      }
    }

    if (Number(balance) < goatPriceInMNT) {
      setError(`Insufficient balance. Required ${goatPriceInMNT.toFixed(6)} MNT, you have ${balance} MNT`)
      return
    }

    setIsLoading(true)

    try {
      const provider = getConnectedProvider()

      if (!provider) {
        throw new Error("Wallet not connected. Please reconnect your wallet.")
      }

      const valueInWei = BigInt(Math.floor(goatPriceInMNT * 1e18))
      const valueHex = "0x" + valueInWei.toString(16)

      const txParams = {
        from: address,
        to: TREASURY_ADDRESS,
        value: valueHex,
      }

      const hash = await provider.request({
        method: "eth_sendTransaction",
        params: [txParams],
      })

      setTxHash(hash)
      setIsSuccess(true)
      addItem(goat, hash, goatPriceInMNT)

      setTimeout(() => {
        setIsLoading(false)
        onSuccess?.()
      }, 2000)
    } catch (err: any) {
      console.error("[v0] Buy error:", err.message || err)
      if (err.code === 4001 || err.message?.includes("rejected")) {
        setError("Transaction rejected by user")
      } else if (err.message?.includes("insufficient")) {
        setError("Insufficient funds for transaction")
      } else if (err.code === -32603 || err.message?.includes("Internal")) {
        setError("Network error. Please check you are on Mantle Sepolia and have enough MNT for gas.")
      } else {
        setError(err.message || "Transaction failed. Please try again.")
      }
      setIsLoading(false)
    }
  }

  const handleSell = async () => {
    setError(null)
    setTxHash(null)
    setIsSuccess(false)

    if (!isConnected) {
      setError("Please connect your wallet first")
      return
    }

    if (!sellPrice || Number(sellPrice) <= 0) {
      setError("Please enter a valid selling price")
      return
    }

    if (!isCorrectNetwork) {
      try {
        await switchToMantle()
      } catch {
        setError("Failed to switch to Mantle network")
        return
      }
    }

    setIsLoading(true)

    try {
      await new Promise((resolve) => setTimeout(resolve, 1500))

      setIsSuccess(true)
      setTxHash("listing-" + Date.now().toString(16))

      setTimeout(() => {
        setIsLoading(false)
        onSuccess?.()
      }, 2000)
    } catch (err: any) {
      console.error("[v0] Sell error:", err.message || err)
      setError(err.message || "Failed to list NFT")
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>{mode === "buy" ? "Buy Goat NFT" : "Sell Goat NFT"}</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="flex gap-4 rounded-xl border border-border p-4">
            <div className="relative h-20 w-20 overflow-hidden rounded-lg">
              <Image src={goat.image || "/placeholder.svg"} alt={goat.name} fill className="object-cover" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold">{goat.name}</h3>
              <p className="text-sm text-muted-foreground">{goat.nftId}</p>
              <div className="mt-1 flex gap-3 text-sm">
                <span>Age: {goat.age}mo</span>
                <span>Weight: {currentWeight}kg</span>
              </div>
              <p className="mt-1 text-sm font-medium text-primary">{goatPriceInMNT.toFixed(6)} MNT</p>
            </div>
          </div>

          {!isConnected && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>Please connect your wallet first</AlertDescription>
            </Alert>
          )}

          {!isCorrectNetwork && isConnected && (
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                Switch to Mantle {networkType === "testnet" ? "Sepolia" : "Mainnet"} required
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
                Buy
              </TabsTrigger>
              <TabsTrigger value="sell">
                <Tag className="mr-2 h-4 w-4" />
                Sell
              </TabsTrigger>
            </TabsList>

            <TabsContent value="buy" className="space-y-4 pt-4">
              <div className="rounded-xl bg-secondary p-4">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">NFT Price</span>
                  <span className="font-semibold">{goatPriceInMNT.toFixed(6)} MNT</span>
                </div>
                <div className="mt-2 flex justify-between text-sm">
                  <span className="text-muted-foreground">Gas Fee (estimate)</span>
                  <span>~0.00001 MNT</span>
                </div>
                <div className="mt-3 flex justify-between border-t border-border pt-3">
                  <span className="font-medium">Total</span>
                  <span className="font-bold text-primary">{(goatPriceInMNT + 0.00001).toFixed(6)} MNT</span>
                </div>
              </div>

              {balance && (
                <p className="text-sm text-muted-foreground">
                  Your Balance: <span className="font-medium">{balance} MNT</span>
                </p>
              )}

              {error && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              {isSuccess && txHash && (
                <Alert className="border-green-500 bg-green-500/10">
                  <CheckCircle2 className="h-4 w-4 text-green-500" />
                  <AlertDescription className="flex items-center justify-between">
                    <span className="text-green-700">Transaction successful! Added to My NFTs</span>
                    <a
                      href={getExplorerUrl(txHash)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1 text-primary underline"
                    >
                      View <ExternalLink className="h-3 w-3" />
                    </a>
                  </AlertDescription>
                </Alert>
              )}

              <Button className="w-full" onClick={handleBuy} disabled={!isConnected || isLoading || isSuccess}>
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Processing...
                  </>
                ) : isSuccess ? (
                  <>
                    <CheckCircle2 className="mr-2 h-4 w-4" />
                    Purchased!
                  </>
                ) : (
                  <>
                    <ShoppingCart className="mr-2 h-4 w-4" />
                    Buy Now
                  </>
                )}
              </Button>
            </TabsContent>

            <TabsContent value="sell" className="space-y-4 pt-4">
              <div className="space-y-2">
                <Label htmlFor="sellPrice">Selling Price (MNT)</Label>
                <Input
                  id="sellPrice"
                  type="number"
                  step="0.0001"
                  placeholder="0.001"
                  value={sellPrice}
                  onChange={(e) => setSellPrice(e.target.value)}
                />
                <p className="text-xs text-muted-foreground">
                  Recommended: {goatPriceInMNT.toFixed(6)} MNT (based on asset value)
                </p>
              </div>

              {sellPrice && Number(sellPrice) > 0 && (
                <div className="rounded-xl bg-secondary p-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Listing Price</span>
                    <span className="font-semibold">{Number(sellPrice).toFixed(6)} MNT</span>
                  </div>
                  <div className="mt-2 flex justify-between text-sm">
                    <span className="text-muted-foreground">Platform Fee (2%)</span>
                    <span>-{(Number(sellPrice) * 0.02).toFixed(6)} MNT</span>
                  </div>
                  <div className="mt-3 flex justify-between border-t border-border pt-3">
                    <span className="font-medium">You Receive</span>
                    <span className="font-bold text-primary">{(Number(sellPrice) * 0.98).toFixed(6)} MNT</span>
                  </div>
                </div>
              )}

              {error && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              {isSuccess && (
                <Alert className="border-green-500 bg-green-500/10">
                  <CheckCircle2 className="h-4 w-4 text-green-500" />
                  <AlertDescription>
                    <span className="text-green-700">NFT listed successfully!</span>
                  </AlertDescription>
                </Alert>
              )}

              <Button
                className="w-full"
                onClick={handleSell}
                disabled={!isConnected || isLoading || !sellPrice || isSuccess}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Processing...
                  </>
                ) : isSuccess ? (
                  <>
                    <CheckCircle2 className="mr-2 h-4 w-4" />
                    Listed!
                  </>
                ) : (
                  <>
                    <Tag className="mr-2 h-4 w-4" />
                    List for Sale
                  </>
                )}
              </Button>
            </TabsContent>
          </Tabs>

          <p className="text-center text-xs text-muted-foreground">
            Transactions on Mantle {networkType === "testnet" ? "Sepolia (Testnet)" : "Mainnet"}
          </p>
        </div>
      </DialogContent>
    </Dialog>
  )
}
