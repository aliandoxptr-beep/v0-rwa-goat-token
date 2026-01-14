"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { useState } from "react"
import { WalletConnectModal } from "@/components/wallet-connect-modal"
import { ChevronDown, LogOut, Copy, RefreshCw, ExternalLink, AlertTriangle } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useWeb3 } from "@/contexts/web3-context"
import { MANTLE_NETWORK } from "@/lib/web3-config"

export function Header() {
  const { isConnected, address, balance, walletName, isCorrectNetwork, disconnect, switchToMantle } = useWeb3()
  const [showWalletModal, setShowWalletModal] = useState(false)
  const [copied, setCopied] = useState(false)

  const handleCopy = () => {
    if (address) {
      navigator.clipboard.writeText(address)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  return (
    <>
      <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between px-4 md:px-6">
          <Link href="/" className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
              <span className="text-lg font-bold text-primary-foreground">G</span>
            </div>
            <span className="text-lg font-semibold">Garosta</span>
          </Link>

          <nav className="hidden items-center gap-6 md:flex">
            <Link
              href="/"
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              Home
            </Link>
            <Link
              href="/dashboard"
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              Dashboard
            </Link>
            <Link
              href="/financials"
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              Financials
            </Link>
          </nav>

          <div className="flex items-center gap-3">
            {isConnected && (
              <div className="hidden sm:flex items-center gap-1.5 rounded-full bg-secondary px-3 py-1.5">
                <div className={`h-2 w-2 rounded-full ${isCorrectNetwork ? "bg-green-500" : "bg-yellow-500"}`} />
                <span className="text-xs font-medium">
                  {isCorrectNetwork ? MANTLE_NETWORK.chainName : "Wrong Network"}
                </span>
              </div>
            )}

            {isConnected ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="flex items-center gap-2 bg-transparent">
                    {!isCorrectNetwork && <AlertTriangle className="h-4 w-4 text-yellow-500" />}
                    <div className={`h-2 w-2 rounded-full ${isCorrectNetwork ? "bg-green-500" : "bg-yellow-500"}`} />
                    <span className="text-sm font-medium">
                      {address?.slice(0, 6)}...{address?.slice(-4)}
                    </span>
                    <ChevronDown className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-64">
                  <div className="px-3 py-2">
                    <p className="text-xs text-muted-foreground">Connected with {walletName}</p>
                    <p className="font-mono text-sm mt-1">
                      {address?.slice(0, 10)}...{address?.slice(-8)}
                    </p>
                    {balance && (
                      <p className="text-sm font-medium mt-2">
                        {balance} {MANTLE_NETWORK.nativeCurrency.symbol}
                      </p>
                    )}
                  </div>

                  <DropdownMenuSeparator />
                  <div className="px-3 py-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-muted-foreground">Network</span>
                      <span
                        className={`text-xs font-medium ${isCorrectNetwork ? "text-green-600" : "text-yellow-600"}`}
                      >
                        {isCorrectNetwork ? MANTLE_NETWORK.chainName : "Wrong Network"}
                      </span>
                    </div>
                  </div>

                  {!isCorrectNetwork && (
                    <DropdownMenuItem onClick={switchToMantle} className="text-yellow-600">
                      <RefreshCw className="mr-2 h-4 w-4" />
                      Switch to {MANTLE_NETWORK.chainName}
                    </DropdownMenuItem>
                  )}

                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleCopy}>
                    <Copy className="mr-2 h-4 w-4" />
                    {copied ? "Copied!" : "Copy Address"}
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <a
                      href={`${MANTLE_NETWORK.blockExplorerUrls[0]}/address/${address}`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <ExternalLink className="mr-2 h-4 w-4" />
                      View on Explorer
                    </a>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setShowWalletModal(true)}>
                    <RefreshCw className="mr-2 h-4 w-4" />
                    Switch Wallet
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={disconnect} className="text-destructive">
                    <LogOut className="mr-2 h-4 w-4" />
                    Disconnect
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Button onClick={() => setShowWalletModal(true)} size="sm">
                Connect Wallet
              </Button>
            )}
          </div>
        </div>
      </header>

      <WalletConnectModal open={showWalletModal} onOpenChange={setShowWalletModal} />
    </>
  )
}
