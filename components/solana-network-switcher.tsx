"use client"

import { useSolanaWeb3 } from "@/contexts/solana-context"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuCheckboxItem,
} from "@/components/ui/dropdown-menu"
import { Globe, ExternalLink } from "lucide-react"
import type { SolanaNetworkType } from "@/lib/solana-config"

export function SolanaNetworkSwitcher() {
  const { networkType, setNetworkType, getCurrentNetwork } = useSolanaWeb3()
  const currentNetwork = getCurrentNetwork()

  const networks: { type: SolanaNetworkType; name: string; description: string }[] = [
    { type: "devnet", name: "Solana Devnet", description: "Development network with free SOL" },
    { type: "testnet", name: "Solana Testnet", description: "Test network" },
    { type: "mainnet", name: "Solana Mainnet", description: "Production network" },
  ]

  return (
    <DropdownMenu>
      <Button
        variant="outline"
        size="sm"
        className="gap-2 bg-transparent"
      >
        <Globe className="h-4 w-4" />
        <span className="hidden sm:inline text-xs font-medium">{currentNetwork.name}</span>
      </Button>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel>Select Network</DropdownMenuLabel>
        <DropdownMenuSeparator />
        
        {networks.map((network) => (
          <DropdownMenuCheckboxItem
            key={network.type}
            checked={networkType === network.type}
            onCheckedChange={() => setNetworkType(network.type)}
            className="flex flex-col items-start gap-1 py-2"
          >
            <span className="font-medium">{network.name}</span>
            <span className="text-xs text-muted-foreground">{network.description}</span>
          </DropdownMenuCheckboxItem>
        ))}

        <DropdownMenuSeparator />
        
        <DropdownMenuItem asChild>
          <a
            href="https://faucet.solana.com"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 cursor-pointer"
          >
            <span className="text-sm">Get Test SOL</span>
            <ExternalLink className="h-3 w-3" />
          </a>
        </DropdownMenuItem>

        <DropdownMenuItem asChild>
          <a
            href="https://explorer.solana.com"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 cursor-pointer"
          >
            <span className="text-sm">Solana Explorer</span>
            <ExternalLink className="h-3 w-3" />
          </a>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
