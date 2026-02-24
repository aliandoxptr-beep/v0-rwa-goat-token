import { PublicKey, clusterApiUrl } from "@solana/web3.js"

// Solana Network Configuration
export const SOLANA_DEVNET = {
  name: "Solana Devnet",
  endpoint: clusterApiUrl("devnet"),
  cluster: "devnet" as const,
}

export const SOLANA_TESTNET = {
  name: "Solana Testnet",
  endpoint: clusterApiUrl("testnet"),
  cluster: "testnet" as const,
}

export const SOLANA_MAINNET = {
  name: "Solana Mainnet Beta",
  endpoint: clusterApiUrl("mainnet-beta"),
  cluster: "mainnet-beta" as const,
}

export type SolanaCluster = "devnet" | "testnet" | "mainnet-beta"

export type SolanaNetworkType = "devnet" | "testnet" | "mainnet"

export function getSolanaNetwork(networkType: SolanaNetworkType) {
  switch (networkType) {
    case "devnet":
      return SOLANA_DEVNET
    case "testnet":
      return SOLANA_TESTNET
    case "mainnet":
      return SOLANA_MAINNET
    default:
      return SOLANA_DEVNET
  }
}

// Supported Solana Wallets
export interface SolanaWalletInfo {
  id: string
  name: string
  icon: string
  description: string
  downloadUrl: string
  checkProvider: () => any
}

export const SUPPORTED_SOLANA_WALLETS: SolanaWalletInfo[] = [
  {
    id: "phantom",
    name: "Phantom",
    icon: "/wallets/phantom.png",
    description: "The most popular Solana wallet",
    downloadUrl: "https://phantom.app/download",
    checkProvider: () => {
      if (typeof window === "undefined") return null
      return (window as any).solana?.isPhantom ? (window as any).solana : null
    },
  },
  {
    id: "solflare",
    name: "Solflare",
    icon: "/wallets/solflare.png",
    description: "Multi-chain wallet supporting Solana",
    downloadUrl: "https://solflare.com/download",
    checkProvider: () => {
      if (typeof window === "undefined") return null
      return (window as any).solflare?.isSolflare ? (window as any).solflare : null
    },
  },
  {
    id: "backpack",
    name: "Backpack",
    icon: "/wallets/backpack.png",
    description: "NFT-focused Solana wallet",
    downloadUrl: "https://www.backpack.app/",
    checkProvider: () => {
      if (typeof window === "undefined") return null
      return (window as any).backpack?.isBackpack ? (window as any).backpack : null
    },
  },
]

// Faucet URLs for testing
export const SOLANA_FAUCET_URL = {
  devnet: "https://faucet.solana.com",
  testnet: "https://testnet.solana.com",
}

// NFT Price in SOL (0.000001 SOL = 1 Lamport)
export const NFT_PRICE_SOL = 0.000001 // 1 Lamport

// Explorer URLs
export function getSolanaExplorerUrl(cluster: SolanaCluster, path: string) {
  const baseUrl = "https://explorer.solana.com"
  const clusterParam = cluster === "mainnet-beta" ? "" : `?cluster=${cluster}`
  return `${baseUrl}/${path}${clusterParam}`
}
