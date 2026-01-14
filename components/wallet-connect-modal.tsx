"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { useState } from "react"
import { Loader2, ExternalLink, AlertCircle } from "lucide-react"
import { SUPPORTED_WALLETS, MANTLE_NETWORK, type WalletInfo } from "@/lib/web3-config"
import { useWeb3 } from "@/contexts/web3-context"
import Image from "next/image"

interface WalletConnectModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function WalletConnectModal({ open, onOpenChange }: WalletConnectModalProps) {
  const { connect, getProvider } = useWeb3()
  const [connecting, setConnecting] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  const handleConnect = async (wallet: WalletInfo) => {
    setConnecting(wallet.id)
    setError(null)

    try {
      await connect(wallet)
      onOpenChange(false)
    } catch (err: any) {
      setError(err.message || `Gagal terhubung ke ${wallet.name}`)
    } finally {
      setConnecting(null)
    }
  }

  const isWalletInstalled = (wallet: WalletInfo) => {
    return !!getProvider(wallet)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">Connect Wallet</DialogTitle>
          <DialogDescription className="flex items-center gap-2">
            <span>Connect to</span>
            <span className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">
              <span className="h-1.5 w-1.5 rounded-full bg-primary" />
              {MANTLE_NETWORK.chainName}
            </span>
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-2 py-4">
          {SUPPORTED_WALLETS.map((wallet) => {
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
            <span className="font-medium text-foreground">{MANTLE_NETWORK.chainName}</span>
          </div>
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>Chain ID</span>
            <span className="font-mono text-foreground">{MANTLE_NETWORK.chainId}</span>
          </div>
        </div>

        <div className="text-center text-xs text-muted-foreground">
          Dengan menghubungkan wallet, Anda menyetujui{" "}
          <a href="#" className="underline hover:text-foreground">
            Terms of Service
          </a>{" "}
          dan{" "}
          <a href="#" className="underline hover:text-foreground">
            Privacy Policy
          </a>
        </div>
      </DialogContent>
    </Dialog>
  )
}
