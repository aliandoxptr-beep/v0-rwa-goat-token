"use client"

import { useWeb3 } from "@/contexts/web3-context"
import { MANTLE_MAINNET, MANTLE_TESTNET, MANTLE_FAUCET_URL } from "@/lib/web3-config"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { ChevronDown, TestTube, Globe, ExternalLink, Droplets } from "lucide-react"

export function NetworkSwitcher() {
  const { networkType, setNetworkType, isConnected } = useWeb3()

  const currentNetwork = networkType === "mainnet" ? MANTLE_MAINNET : MANTLE_TESTNET

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2 bg-transparent">
          {networkType === "testnet" ? (
            <TestTube className="h-4 w-4 text-orange-500" />
          ) : (
            <Globe className="h-4 w-4 text-green-500" />
          )}
          <span className="hidden sm:inline">{currentNetwork.chainName}</span>
          <ChevronDown className="h-3 w-3" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <div className="px-2 py-1.5">
          <p className="text-xs font-medium text-muted-foreground">Select Network</p>
        </div>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={() => setNetworkType("mainnet")}
          className={networkType === "mainnet" ? "bg-accent" : ""}
        >
          <Globe className="mr-2 h-4 w-4 text-green-500" />
          <div className="flex flex-col">
            <span>Mantle Mainnet</span>
            <span className="text-xs text-muted-foreground">Production network</span>
          </div>
          {networkType === "mainnet" && <span className="ml-auto text-xs text-green-500">Active</span>}
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => setNetworkType("testnet")}
          className={networkType === "testnet" ? "bg-accent" : ""}
        >
          <TestTube className="mr-2 h-4 w-4 text-orange-500" />
          <div className="flex flex-col">
            <span>Mantle Sepolia</span>
            <span className="text-xs text-muted-foreground">Test network</span>
          </div>
          {networkType === "testnet" && <span className="ml-auto text-xs text-orange-500">Active</span>}
        </DropdownMenuItem>

        {networkType === "testnet" && (
          <>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <a href={MANTLE_FAUCET_URL} target="_blank" rel="noopener noreferrer" className="cursor-pointer">
                <Droplets className="mr-2 h-4 w-4 text-blue-500" />
                <div className="flex flex-col">
                  <span>Get Test MNT</span>
                  <span className="text-xs text-muted-foreground">Mantle Sepolia Faucet</span>
                </div>
                <ExternalLink className="ml-auto h-3 w-3 text-muted-foreground" />
              </a>
            </DropdownMenuItem>
          </>
        )}

        <DropdownMenuSeparator />
        <div className="px-2 py-1.5">
          <p className="text-xs text-muted-foreground">Chain ID: {currentNetwork.chainId}</p>
          <a
            href={currentNetwork.blockExplorerUrls[0]}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-primary hover:underline flex items-center gap-1 mt-1"
          >
            View Explorer <ExternalLink className="h-3 w-3" />
          </a>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
