"use client"

import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from "react"
import { MANTLE_NETWORK, SUPPORTED_WALLETS, type WalletInfo } from "@/lib/web3-config"

interface Web3State {
  isConnected: boolean
  address: string | null
  chainId: number | null
  balance: string | null
  walletName: string | null
  isCorrectNetwork: boolean
  isConnecting: boolean
  error: string | null
}

interface Web3ContextType extends Web3State {
  connect: (wallet: WalletInfo) => Promise<void>
  disconnect: () => void
  switchToMantle: () => Promise<void>
  getProvider: (wallet: WalletInfo) => any
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
  })

  const [currentProvider, setCurrentProvider] = useState<any>(null)

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

    try {
      await currentProvider.request({
        method: "wallet_switchEthereumChain",
        params: [{ chainId: MANTLE_NETWORK.chainIdHex }],
      })
    } catch (switchError: any) {
      // Chain not added, try to add it
      if (switchError.code === 4902) {
        try {
          await currentProvider.request({
            method: "wallet_addEthereumChain",
            params: [
              {
                chainId: MANTLE_NETWORK.chainIdHex,
                chainName: MANTLE_NETWORK.chainName,
                nativeCurrency: MANTLE_NETWORK.nativeCurrency,
                rpcUrls: MANTLE_NETWORK.rpcUrls,
                blockExplorerUrls: MANTLE_NETWORK.blockExplorerUrls,
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
  }, [currentProvider])

  const connect = useCallback(
    async (wallet: WalletInfo) => {
      setState((prev) => ({ ...prev, isConnecting: true, error: null }))

      try {
        const provider = getProvider(wallet)

        if (!provider) {
          // Mobile deep link
          if (wallet.deepLink && /Android|iPhone|iPad|iPod/i.test(navigator.userAgent)) {
            window.location.href = wallet.deepLink
            setState((prev) => ({ ...prev, isConnecting: false }))
            return
          }
          throw new Error(`${wallet.name} tidak terdeteksi. Silakan install terlebih dahulu.`)
        }

        // Request accounts
        const accounts = await provider.request({
          method: "eth_requestAccounts",
        })

        if (!accounts || accounts.length === 0) {
          throw new Error("Tidak ada akun yang tersedia")
        }

        const address = accounts[0]
        setCurrentProvider(provider)

        // Get chain ID
        const chainIdHex = await provider.request({ method: "eth_chainId" })
        const chainId = Number.parseInt(chainIdHex, 16)
        const isCorrectNetwork = chainId === MANTLE_NETWORK.chainId

        setState((prev) => ({
          ...prev,
          isConnected: true,
          address,
          chainId,
          walletName: wallet.name,
          isCorrectNetwork,
          isConnecting: false,
        }))

        // Switch to Mantle if not on correct network
        if (!isCorrectNetwork) {
          try {
            await provider.request({
              method: "wallet_switchEthereumChain",
              params: [{ chainId: MANTLE_NETWORK.chainIdHex }],
            })
          } catch (switchError: any) {
            if (switchError.code === 4902) {
              await provider.request({
                method: "wallet_addEthereumChain",
                params: [
                  {
                    chainId: MANTLE_NETWORK.chainIdHex,
                    chainName: MANTLE_NETWORK.chainName,
                    nativeCurrency: MANTLE_NETWORK.nativeCurrency,
                    rpcUrls: MANTLE_NETWORK.rpcUrls,
                    blockExplorerUrls: MANTLE_NETWORK.blockExplorerUrls,
                  },
                ],
              })
            }
          }
        }

        // Get balance
        await updateBalance(provider, address)

        // Save to localStorage
        localStorage.setItem("rwa_goat_wallet", wallet.id)
      } catch (err: any) {
        setState((prev) => ({
          ...prev,
          isConnecting: false,
          error: err.message || "Gagal terhubung ke wallet",
        }))
        throw err
      }
    },
    [getProvider, updateBalance],
  )

  const disconnect = useCallback(() => {
    setState({
      isConnected: false,
      address: null,
      chainId: null,
      balance: null,
      walletName: null,
      isCorrectNetwork: false,
      isConnecting: false,
      error: null,
    })
    setCurrentProvider(null)
    localStorage.removeItem("rwa_goat_wallet")
  }, [])

  // Listen for account and chain changes
  useEffect(() => {
    if (!currentProvider) return

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
        isCorrectNetwork: chainId === MANTLE_NETWORK.chainId,
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
  }, [currentProvider, disconnect, state.address, updateBalance])

  // Auto-reconnect on page load
  useEffect(() => {
    const savedWalletId = localStorage.getItem("rwa_goat_wallet")
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
              localStorage.removeItem("rwa_goat_wallet")
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
