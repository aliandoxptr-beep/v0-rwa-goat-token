"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { useState } from "react"
import { useSolanaWeb3 } from "@/contexts/solana-context"
import { buyGoatNFT } from "@/lib/solana-transactions"
import { Loader2, AlertCircle, CheckCircle, ExternalLink } from "lucide-react"
import { useCart } from "@/contexts/cart-context"
import { PublicKey } from "@solana/web3.js"

interface BuySolanaGoatModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  goat: {
    id: string
    name: string
    priceSOL: number
    owner: string
    mint: string
  }
}

export function BuySolanaGoatModal({
  open,
  onOpenChange,
  goat,
}: BuySolanaGoatModalProps) {
  const { publicKey, getConnection, getConnectedProvider } = useSolanaWeb3()
  const { addItem } = useCart()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [txSignature, setTxSignature] = useState<string | null>(null)

  const handleBuy = async () => {
    if (!publicKey) {
      setError("Please connect your wallet first")
      return
    }

    setLoading(true)
    setError(null)

    try {
      console.log("[v0] Starting purchase for:", goat.name)

      const provider = getConnectedProvider()
      const connection = getConnection()

      const result = await buyGoatNFT({
        connection,
        buyer: publicKey,
        seller: new PublicKey(goat.owner),
        provider,
        nftMint: new PublicKey(goat.mint),
        price: goat.priceSOL,
      })

      console.log("[v0] Purchase successful:", result)

      setTxSignature(result.signature)
      setSuccess(true)

      // Add to cart
      addItem({
        id: goat.id,
        name: goat.name,
        price: goat.priceSOL,
        quantity: 1,
        image: "",
        mint: goat.mint,
        transactionSignature: result.signature,
      })

      // Close modal after 3 seconds
      setTimeout(() => {
        onOpenChange(false)
        setSuccess(false)
        setTxSignature(null)
      }, 3000)
    } catch (err: any) {
      console.error("[v0] Buy error:", err)
      setError(err.message || "Failed to purchase goat NFT")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Buy Goat NFT</DialogTitle>
          <DialogDescription>
            Purchase {goat.name} NFT and earn yield from this real-world asset
          </DialogDescription>
        </DialogHeader>

        {success ? (
          <div className="space-y-4 py-4">
            <div className="flex flex-col items-center gap-3 text-center">
              <CheckCircle className="h-12 w-12 text-green-500" />
              <h3 className="font-semibold">Purchase Successful!</h3>
              <p className="text-sm text-muted-foreground">
                You now own {goat.name} NFT. Check your wallet for the digital asset.
              </p>
            </div>

            {txSignature && (
              <a
                href={`https://explorer.solana.com/tx/${txSignature}?cluster=devnet`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 rounded-lg bg-secondary p-3 text-sm font-medium hover:bg-secondary/80 transition-colors"
              >
                <span>View on Explorer</span>
                <ExternalLink className="h-4 w-4" />
              </a>
            )}
          </div>
        ) : (
          <div className="space-y-4 py-4">
            <div className="space-y-3 rounded-lg bg-secondary/50 p-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Goat Name</span>
                <span className="font-semibold">{goat.name}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Price</span>
                <span className="font-semibold">{goat.priceSOL} SOL</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Network</span>
                <span className="font-mono text-xs">Solana Devnet</span>
              </div>
            </div>

            {error && (
              <div className="flex items-start gap-2 rounded-lg bg-destructive/10 p-3 text-sm text-destructive">
                <AlertCircle className="h-4 w-4 mt-0.5 flex-shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <Button
              onClick={handleBuy}
              disabled={loading || !publicKey}
              className="w-full"
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Processing...
                </>
              ) : (
                "Confirm Purchase"
              )}
            </Button>

            <p className="text-center text-xs text-muted-foreground">
              You will be prompted to sign this transaction with your wallet.
            </p>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
