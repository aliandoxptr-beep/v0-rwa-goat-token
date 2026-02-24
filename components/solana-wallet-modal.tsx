"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { useState } from "react"
import { Loader2, ExternalLink, AlertCircle } from "lucide-react"
import { SUPPORTED_SOLANA_WALLETS, type SolanaWalletInfo } from "@/lib/solana-config"
import { useSolanaWeb3 } from "@/contexts/solana-context"
import Image from "next/image"

interface SolanaWalletConnectModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function SolanaWalletConnectModal({ open, onOpenChange }: SolanaWalletConnectModalProps) {
  const { connect, getProvider, getCurrentNetwork } = useSolanaWeb3()
  const [connecting, setConnecting] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  const handleConnect = async (wallet: SolanaWalletInfo) => {
    setConnecting(wallet.id)
    setError(null)

    try {
      await connect(wallet)
      onOpenChange(false)
    } catch (err: any) {
      setError(err.message || `Failed to connect to ${wallet.name}`)
    } finally {
      setConnecting(null)
    }
  }

  const isWalletInstalled = (wallet: SolanaWalletInfo) => {
    return !!getProvider(wallet)
  }

  const network = getCurrentNetwork()

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">Connect Wallet</DialogTitle>
          <DialogDescription className="flex items-center gap-2">
            <span>Connect to</span>
            <span className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">
              <span className="h-1.5 w-1.5 rounded-full bg-primary" />
              {network.name}
            </span>
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-2 py-4">
          {SUPPORTED_SOLANA_WALLETS.map((wallet) => {
            const installed = isWalletInstalled(wallet)
            return (
              <Button
                key={wallet.id}
                variant="outline"
                className="flex h-auto items-center justify-start gap-4 p-4 text-left bg-transparent hover:bg-secondary/50 transition-colors"
                onClick={() => handleConnect(wallet)}
                disabled={connecting !== null}
              >
                <div className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-secondary overflow-hidden">
                  <Image
                    src={wallet.icon || "/placeholder.svg"}
                    alt={wallet.name}
                    width={28}
                    height={28}
                    className="object-contain"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-medium">{wallet.name}</span>
                    {installed && (
                      <span className="rounded-full bg-green-500/10 px-2 py-0.5 text-[10px] font-medium text-green-600">
                        Installed
                      </span>
                    )}
                  </div>
                  <div className="text-xs text-muted-foreground truncate">{wallet.description}</div>
                </div>
                {connecting === wallet.id ? (
                  <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
                ) : !installed ? (
                  <a
                    href={wallet.downloadUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => e.stopPropagation()}
                    className="text-muted-foreground hover:text-foreground"
                  >
                    <ExternalLink className="h-4 w-4" />
                  </a>
                ) : null}
              </Button>
            )
          })}
        </div>

        {error && (
          <div className="flex items-start gap-2 rounded-lg bg-destructive/10 p-3 text-sm text-destructive">
            <AlertCircle className="h-4 w-4 mt-0.5 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <div className="space-y-2 border-t pt-4">
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>Network</span>
            <span className="font-medium text-foreground">{network.name}</span>
          </div>
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>Cluster</span>
            <span className="font-mono text-foreground">{network.cluster}</span>
          </div>
        </div>

        <div className="text-center text-xs text-muted-foreground">
          By connecting your wallet, you agree to our{" "}
          <a href="#" className="underline hover:text-foreground">
            Terms of Service
          </a>{" "}
          and{" "}
          <a href="#" className="underline hover:text-foreground">
            Privacy Policy
          </a>
        </div>
      </DialogContent>
    </Dialog>
  )
}

// Alias for compatibility
export const SolanaWalletModal = SolanaWalletConnectModal
