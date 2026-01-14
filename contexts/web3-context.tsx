"use client"

import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from "react"
import { MANTLE_MAINNET, MANTLE_TESTNET, SUPPORTED_WALLETS, type WalletInfo, type NetworkType } from "@/lib/web3-config"

interface Web3State {
  isConnected: boolean
  address: string | null
  chainId: number | null
  balance: string | null
  walletName: string | null
  isCorrectNetwork: boolean
  isConnecting: boolean
  error: string | null
  networkType: NetworkType
}

interface Web3ContextType extends Web3State {
  connect: (wallet: WalletInfo) => Promise<void>
  disconnect: () => void
  switchToMantle: () => Promise<void>
  getProvider: (wallet: WalletInfo) => any
  setNetworkType: (type: NetworkType) => void
  getCurrentNetwork: () => typeof MANTLE_MAINNET
}

const Web3Context = createContext<Web3ContextType | null>(null)

export function Web3Provider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<Web3State>({
    isConnected: false,
    address: null,
    chainId: null,
    balance: null,
    walletName: null,
    isCorrectNetwork: false,
    isConnecting: false,
    error: null,
    networkType: "testnet",
  })

  const [currentProvider, setCurrentProvider] = useState<any>(null)

  const getCurrentNetwork = useCallback(() => {
    return state.networkType === "mainnet" ? MANTLE_MAINNET : MANTLE_TESTNET
  }, [state.networkType])

  const updateBalance = useCallback(async (provider: any, address: string) => {
    try {
      const balance = await provider.request({
        method: "eth_getBalance",
        params: [address, "latest"],
      })
      const balanceInMNT = (Number.parseInt(balance, 16) / 1e18).toFixed(4)
      setState((prev) => ({ ...prev, balance: balanceInMNT }))
    } catch (err) {
      console.error("Failed to get balance:", err)
    }
  }, [])

  const getProvider = useCallback((wallet: WalletInfo) => {
    return wallet.checkProvider()
  }, [])

  const switchToMantle = useCallback(async () => {
    if (!currentProvider) return
    const network = state.networkType === "mainnet" ? MANTLE_MAINNET : MANTLE_TESTNET

    try {
      await currentProvider.request({
        method: "wallet_switchEthereumChain",
        params: [{ chainId: network.chainIdHex }],
      })
    } catch (switchError: any) {
      if (switchError.code === 4902) {
        try {
          await currentProvider.request({
            method: "wallet_addEthereumChain",
            params: [
              {
                chainId: network.chainIdHex,
                chainName: network.chainName,
                nativeCurrency: network.nativeCurrency,
                rpcUrls: network.rpcUrls,
                blockExplorerUrls: network.blockExplorerUrls,
              },
            ],
          })
        } catch (addError) {
          throw new Error("Failed to add Mantle network")
        }
      } else {
        throw switchError
      }
    }
  }, [currentProvider, state.networkType])

  const setNetworkType = useCallback(
    async (type: NetworkType) => {
      setState((prev) => ({ ...prev, networkType: type }))
      localStorage.setItem("garosta_network_type", type)

      // If connected, switch to the new network
      if (currentProvider && state.isConnected) {
        const network = type === "mainnet" ? MANTLE_MAINNET : MANTLE_TESTNET
        try {
          await currentProvider.request({
            method: "wallet_switchEthereumChain",
            params: [{ chainId: network.chainIdHex }],
          })
        } catch (switchError: any) {
          if (switchError.code === 4902) {
            await currentProvider.request({
              method: "wallet_addEthereumChain",
              params: [
                {
                  chainId: network.chainIdHex,
                  chainName: network.chainName,
                  nativeCurrency: network.nativeCurrency,
                  rpcUrls: network.rpcUrls,
                  blockExplorerUrls: network.blockExplorerUrls,
                },
              ],
            })
          }
        }
      }
    },
    [currentProvider, state.isConnected],
  )

  const connect = useCallback(
    async (wallet: WalletInfo) => {
      setState((prev) => ({ ...prev, isConnecting: true, error: null }))
      const network = state.networkType === "mainnet" ? MANTLE_MAINNET : MANTLE_TESTNET

      try {
        const provider = getProvider(wallet)

        if (!provider) {
          if (wallet.deepLink && /Android|iPhone|iPad|iPod/i.test(navigator.userAgent)) {
            window.location.href = wallet.deepLink
            setState((prev) => ({ ...prev, isConnecting: false }))
            return
          }
          throw new Error(`${wallet.name} not detected. Please install it first.`)
        }

        const accounts = await provider.request({
          method: "eth_requestAccounts",
        })

        if (!accounts || accounts.length === 0) {
          throw new Error("No accounts available")
        }

        const address = accounts[0]
        setCurrentProvider(provider)

        const chainIdHex = await provider.request({ method: "eth_chainId" })
        const chainId = Number.parseInt(chainIdHex, 16)
        const isCorrectNetwork = chainId === network.chainId

        setState((prev) => ({
          ...prev,
          isConnected: true,
          address,
          chainId,
          walletName: wallet.name,
          isCorrectNetwork,
          isConnecting: false,
        }))

        if (!isCorrectNetwork) {
          try {
            await provider.request({
              method: "wallet_switchEthereumChain",
              params: [{ chainId: network.chainIdHex }],
            })
          } catch (switchError: any) {
            if (switchError.code === 4902) {
              await provider.request({
                method: "wallet_addEthereumChain",
                params: [
                  {
                    chainId: network.chainIdHex,
                    chainName: network.chainName,
                    nativeCurrency: network.nativeCurrency,
                    rpcUrls: network.rpcUrls,
                    blockExplorerUrls: network.blockExplorerUrls,
                  },
                ],
              })
            }
          }
        }

        await updateBalance(provider, address)
        localStorage.setItem("garosta_wallet", wallet.id)
      } catch (err: any) {
        setState((prev) => ({
          ...prev,
          isConnecting: false,
          error: err.message || "Failed to connect wallet",
        }))
        throw err
      }
    },
    [getProvider, updateBalance, state.networkType],
  )

  const disconnect = useCallback(() => {
    setState((prev) => ({
      isConnected: false,
      address: null,
      chainId: null,
      balance: null,
      walletName: null,
      isCorrectNetwork: false,
      isConnecting: false,
      error: null,
      networkType: prev.networkType, // Keep network type
    }))
    setCurrentProvider(null)
    localStorage.removeItem("garosta_wallet")
  }, [])

  // Listen for account and chain changes
  useEffect(() => {
    if (!currentProvider) return
    const network = state.networkType === "mainnet" ? MANTLE_MAINNET : MANTLE_TESTNET

    const handleAccountsChanged = (accounts: string[]) => {
      if (accounts.length === 0) {
        disconnect()
      } else {
        setState((prev) => ({ ...prev, address: accounts[0] }))
        updateBalance(currentProvider, accounts[0])
      }
    }

    const handleChainChanged = (chainIdHex: string) => {
      const chainId = Number.parseInt(chainIdHex, 16)
      setState((prev) => ({
        ...prev,
        chainId,
        isCorrectNetwork: chainId === network.chainId,
      }))
      if (state.address) {
        updateBalance(currentProvider, state.address)
      }
    }

    currentProvider.on("accountsChanged", handleAccountsChanged)
    currentProvider.on("chainChanged", handleChainChanged)

    return () => {
      currentProvider.removeListener("accountsChanged", handleAccountsChanged)
      currentProvider.removeListener("chainChanged", handleChainChanged)
    }
  }, [currentProvider, disconnect, state.address, state.networkType, updateBalance])

  useEffect(() => {
    const savedNetworkType = localStorage.getItem("garosta_network_type") as NetworkType | null
    if (savedNetworkType) {
      setState((prev) => ({ ...prev, networkType: savedNetworkType }))
    }
  }, [])

  // Auto-reconnect on page load
  useEffect(() => {
    const savedWalletId = localStorage.getItem("garosta_wallet")
    if (savedWalletId) {
      const wallet = SUPPORTED_WALLETS.find((w) => w.id === savedWalletId)
      if (wallet) {
        const provider = getProvider(wallet)
        if (provider) {
          provider
            .request({ method: "eth_accounts" })
            .then((accounts: string[]) => {
              if (accounts.length > 0) {
                connect(wallet)
              }
            })
            .catch(() => {
              localStorage.removeItem("garosta_wallet")
            })
        }
      }
    }
  }, [connect, getProvider])

  return (
    <Web3Context.Provider
      value={{
        ...state,
        connect,
        disconnect,
        switchToMantle,
        getProvider,
        setNetworkType,
        getCurrentNetwork,
      }}
    >
      {children}
    </Web3Context.Provider>
  )
}

export function useWeb3() {
  const context = useContext(Web3Context)
  if (!context) {
    throw new Error("useWeb3 must be used within a Web3Provider")
  }
  return context
}
