"use client"

import Link from "next/link"
import { useSolanaWeb3 } from "@/contexts/solana-context"
import { useCart } from "@/contexts/cart-context"
import { Button } from "@/components/ui/button"
import { SolanaWalletConnectModal } from "./solana-wallet-modal"
import { SolanaNetworkSwitcher } from "./solana-network-switcher"
import { useCart as useMyNFTs } from "@/contexts/cart-context"
import { useState } from "react"
import { Menu, X, ShoppingBag, LogOut } from "lucide-react"
import Image from "next/image"

export function SolanaHeader() {
  const { isConnected, publicKey, walletName, disconnect, balance } = useSolanaWeb3()
  const { items } = useCart()
  const [walletModalOpen, setWalletModalOpen] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const truncateAddress = (address: string) => {
    return `${address.slice(0, 4)}...${address.slice(-4)}`
  }

  return (
    <>
      <header className="sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2">
              <div className="relative h-8 w-8">
                <Image
                  src="/garosta-logo.png"
                  alt="Garosta"
                  fill
                  className="object-contain"
                />
              </div>
              <span className="hidden font-semibold sm:inline">Garosta</span>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden gap-8 md:flex">
              <Link href="/" className="text-sm font-medium hover:text-primary transition-colors">
                Home
              </Link>
              <Link href="/dashboard" className="text-sm font-medium hover:text-primary transition-colors">
                Dashboard
              </Link>
              <Link href="/financials" className="text-sm font-medium hover:text-primary transition-colors">
                Financials
              </Link>
            </nav>

            {/* Right Section */}
            <div className="flex items-center gap-3">
              {/* Network Switcher */}
              <SolanaNetworkSwitcher />

              {/* My NFTs Button */}
              {isConnected && (
                <Button
                  variant="outline"
                  size="sm"
                  asChild
                  className="relative gap-2 bg-transparent"
                >
                  <Link href="/">
                    <ShoppingBag className="h-4 w-4" />
                    {items.length > 0 && (
                      <span className="absolute -top-2 -right-2 flex h-5 w-5 items-center justify-center rounded-full bg-accent text-[10px] font-bold text-accent-foreground">
                        {items.length}
                      </span>
                    )}
                  </Link>
                </Button>
              )}

              {/* Wallet Connection */}
              {isConnected ? (
                <div className="flex items-center gap-2">
                  <div className="hidden flex-col items-end gap-0.5 sm:flex">
                    <span className="text-xs font-medium">{walletName}</span>
                    <span className="text-xs text-muted-foreground">{truncateAddress(publicKey!.toBase58())}</span>
                    <span className="text-xs text-muted-foreground">{balance?.toFixed(4)} SOL</span>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={disconnect}
                    className="bg-transparent"
                  >
                    <LogOut className="h-4 w-4" />
                  </Button>
                </div>
              ) : (
                <Button
                  size="sm"
                  onClick={() => setWalletModalOpen(true)}
                >
                  Connect Wallet
                </Button>
              )}

              {/* Mobile Menu Button */}
              <Button
                variant="ghost"
                size="sm"
                className="md:hidden"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              >
                {mobileMenuOpen ? (
                  <X className="h-4 w-4" />
                ) : (
                  <Menu className="h-4 w-4" />
                )}
              </Button>
            </div>
          </div>

          {/* Mobile Navigation */}
          {mobileMenuOpen && (
            <nav className="grid gap-4 py-4 md:hidden">
              <Link href="/" className="text-sm font-medium hover:text-primary transition-colors">
                Home
              </Link>
              <Link href="/dashboard" className="text-sm font-medium hover:text-primary transition-colors">
                Dashboard
              </Link>
              <Link href="/financials" className="text-sm font-medium hover:text-primary transition-colors">
                Financials
              </Link>
            </nav>
          )}
        </div>
      </header>

      {/* Wallet Connect Modal */}
      <SolanaWalletConnectModal open={walletModalOpen} onOpenChange={setWalletModalOpen} />
    </>
  )
}
