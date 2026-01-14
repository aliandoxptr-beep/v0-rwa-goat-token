// Mantle Network Configuration
export const MANTLE_MAINNET = {
  chainId: 5000,
  chainIdHex: "0x1388",
  chainName: "Mantle",
  nativeCurrency: {
    name: "Mantle",
    symbol: "MNT",
    decimals: 18,
  },
  rpcUrls: ["https://rpc.mantle.xyz"],
  blockExplorerUrls: ["https://explorer.mantle.xyz"],
}

export const MANTLE_TESTNET = {
  chainId: 5003,
  chainIdHex: "0x138B",
  chainName: "Mantle Sepolia Testnet",
  nativeCurrency: {
    name: "Mantle",
    symbol: "MNT",
    decimals: 18,
  },
  rpcUrls: ["https://rpc.sepolia.mantle.xyz"],
  blockExplorerUrls: ["https://explorer.sepolia.mantle.xyz"],
}

export const MANTLE_NETWORK = MANTLE_MAINNET

export interface WalletInfo {
  id: string
  name: string
  icon: string
  description: string
  downloadUrl: string
  checkProvider: () => any
  deepLink?: string
}

export const SUPPORTED_WALLETS: WalletInfo[] = [
  {
    id: "metamask",
    name: "MetaMask",
    icon: "https://upload.wikimedia.org/wikipedia/commons/3/36/MetaMask_Fox.svg",
    description: "Popular browser extension wallet",
    downloadUrl: "https://metamask.io/download/",
    checkProvider: () => {
      if (typeof window === "undefined") return null
      const ethereum = (window as any).ethereum
      if (ethereum?.providers) {
        return ethereum.providers.find((p: any) => p.isMetaMask)
      }
      return ethereum?.isMetaMask ? ethereum : null
    },
  },
  {
    id: "okx",
    name: "OKX Wallet",
    icon: "/wallets/okx.png",
    description: "Multi-chain Web3 wallet by OKX",
    downloadUrl: "https://www.okx.com/web3",
    deepLink: "okx://wallet/dapp",
    checkProvider: () => {
      if (typeof window === "undefined") return null
      return (window as any).okxwallet
    },
  },
  {
    id: "trust",
    name: "Trust Wallet",
    icon: "/wallets/trust.png",
    description: "Secure multi-coin wallet",
    downloadUrl: "https://trustwallet.com/download",
    deepLink: "trust://browser_enable",
    checkProvider: () => {
      if (typeof window === "undefined") return null
      return (
        (window as any).trustwallet?.ethereum || ((window as any).ethereum?.isTrust ? (window as any).ethereum : null)
      )
    },
  },
  {
    id: "coinbase",
    name: "Coinbase Wallet",
    icon: "/wallets/coinbase.png",
    description: "Self-custody crypto wallet",
    downloadUrl: "https://www.coinbase.com/wallet/downloads",
    checkProvider: () => {
      if (typeof window === "undefined") return null
      const ethereum = (window as any).ethereum
      if (ethereum?.providers) {
        return ethereum.providers.find((p: any) => p.isCoinbaseWallet)
      }
      return (window as any).coinbaseWalletExtension || (ethereum?.isCoinbaseWallet ? ethereum : null)
    },
  },
  {
    id: "rabby",
    name: "Rabby Wallet",
    icon: "/wallets/rabby.png",
    description: "Better UX for DeFi users",
    downloadUrl: "https://rabby.io/",
    checkProvider: () => {
      if (typeof window === "undefined") return null
      return (window as any).rabby || ((window as any).ethereum?.isRabby ? (window as any).ethereum : null)
    },
  },
]
