"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { useState } from "react"
import { WalletConnectModal } from "@/components/wallet-connect-modal"
import { ChevronDown, LogOut, Copy, RefreshCw, ExternalLink, AlertTriangle, Menu, X } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useWeb3 } from "@/contexts/web3-context"
import { NetworkSwitcher } from "@/components/network-switcher"

export function Header() {
  const { isConnected, address, balance, walletName, isCorrectNetwork, disconnect, switchToMantle, getCurrentNetwork } =
    useWeb3()
  const [showWalletModal, setShowWalletModal] = useState(false)
  const [copied, setCopied] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const currentNetwork = getCurrentNetwork()

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
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary">
              <span className="text-lg font-bold text-primary-foreground">G</span>
            </div>
            <span className="text-xl font-semibold tracking-tight">Garosta</span>
          </Link>

          <nav className="hidden items-center gap-8 md:flex">
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

          <div className="flex items-center gap-2 sm:gap-3">
            <NetworkSwitcher />

            {isConnected ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm" className="flex items-center gap-2 bg-transparent">
                    {!isCorrectNetwork && <AlertTriangle className="h-4 w-4 text-yellow-500" />}
                    <div className={`h-2 w-2 rounded-full ${isCorrectNetwork ? "bg-green-500" : "bg-yellow-500"}`} />
                    <span className="hidden text-sm font-medium sm:inline">
                      {address?.slice(0, 6)}...{address?.slice(-4)}
                    </span>
                    <span className="text-sm font-medium sm:hidden">{address?.slice(0, 4)}...</span>
                    <ChevronDown className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-64">
                  <div className="px-3 py-2.5">
                    <p className="text-xs text-muted-foreground">Connected with {walletName}</p>
                    <p className="font-mono text-sm mt-1.5">
                      {address?.slice(0, 10)}...{address?.slice(-8)}
                    </p>
                    {balance && (
                      <p className="text-sm font-semibold mt-2">
                        {balance} {currentNetwork.nativeCurrency.symbol}
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
                        {isCorrectNetwork ? currentNetwork.chainName : "Wrong Network"}
                      </span>
                    </div>
                  </div>

                  {!isCorrectNetwork && (
                    <DropdownMenuItem onClick={switchToMantle} className="text-yellow-600">
                      <RefreshCw className="mr-2 h-4 w-4" />
                      Switch to {currentNetwork.chainName}
                    </DropdownMenuItem>
                  )}

                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleCopy}>
                    <Copy className="mr-2 h-4 w-4" />
                    {copied ? "Copied!" : "Copy Address"}
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <a
                      href={`${currentNetwork.blockExplorerUrls[0]}/address/${address}`}
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

            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>

        {mobileMenuOpen && (
          <div className="border-t border-border md:hidden">
            <nav className="flex flex-col gap-1 px-4 py-3">
              <Link
                href="/"
                onClick={() => setMobileMenuOpen(false)}
                className="rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
              >
                Home
              </Link>
              <Link
                href="/dashboard"
                onClick={() => setMobileMenuOpen(false)}
                className="rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
              >
                Dashboard
              </Link>
              <Link
                href="/financials"
                onClick={() => setMobileMenuOpen(false)}
                className="rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
              >
                Financials
              </Link>
            </nav>
          </div>
        )}
      </header>

      <WalletConnectModal open={showWalletModal} onOpenChange={setShowWalletModal} />
    </>
  )
}
