"use client"

import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from "react"
import { PublicKey, Connection, LAMPORTS_PER_SOL } from "@solana/web3.js"
import { getSolanaNetwork, SUPPORTED_SOLANA_WALLETS, type SolanaNetworkType, type SolanaWalletInfo } from "@/lib/solana-config"

interface SolanaWeb3State {
  isConnected: boolean
  publicKey: PublicKey | null
  balance: number | null
  walletName: string | null
  isCorrectNetwork: boolean
  isConnecting: boolean
  error: string | null
  networkType: SolanaNetworkType
}

interface SolanaWeb3ContextType extends SolanaWeb3State {
  connect: (wallet: SolanaWalletInfo) => Promise<void>
  disconnect: () => void
  getProvider: (wallet: SolanaWalletInfo) => any
  setNetworkType: (type: SolanaNetworkType) => void
  getCurrentNetwork: () => ReturnType<typeof getSolanaNetwork>
  getConnection: () => Connection
  getConnectedProvider: () => any
}

const SolanaWeb3Context = createContext<SolanaWeb3ContextType | null>(null)

export function SolanaWeb3Provider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<SolanaWeb3State>({
    isConnected: false,
    publicKey: null,
    balance: null,
    walletName: null,
    isCorrectNetwork: true,
    isConnecting: false,
    error: null,
    networkType: "devnet",
  })

  const [currentProvider, setCurrentProvider] = useState<any>(null)
  const [connection, setConnection] = useState<Connection>(new Connection(getSolanaNetwork("devnet").endpoint))

  const getCurrentNetwork = useCallback(() => {
    return getSolanaNetwork(state.networkType)
  }, [state.networkType])

  const getConnection = useCallback(() => {
    return connection
  }, [connection])

  const updateBalance = useCallback(async (publicKey: PublicKey) => {
    try {
      const balance = await connection.getBalance(publicKey)
      setState((prev) => ({ ...prev, balance: balance / LAMPORTS_PER_SOL }))
    } catch (err) {
      console.error("Failed to get balance:", err)
    }
  }, [connection])

  const getProvider = useCallback((wallet: SolanaWalletInfo) => {
    return wallet.checkProvider()
  }, [])

  const setNetworkType = useCallback((type: SolanaNetworkType) => {
    setState((prev) => ({ ...prev, networkType: type }))
    localStorage.setItem("garosta_solana_network", type)
    const newNetwork = getSolanaNetwork(type)
    setConnection(new Connection(newNetwork.endpoint))
  }, [])

  const connect = useCallback(
    async (wallet: SolanaWalletInfo) => {
      setState((prev) => ({ ...prev, isConnecting: true, error: null }))

      try {
        const provider = getProvider(wallet)

        if (!provider) {
          throw new Error(`${wallet.name} not detected. Please install it first.`)
        }

        const response = await provider.connect()
        const publicKey = response.publicKey

        if (!publicKey) {
          throw new Error("Failed to get public key from wallet")
        }

        setCurrentProvider(provider)
        setState((prev) => ({
          ...prev,
          isConnected: true,
          publicKey,
          walletName: wallet.name,
          isConnecting: false,
        }))

        await updateBalance(publicKey)
        localStorage.setItem("garosta_solana_wallet", wallet.id)
      } catch (err: any) {
        setState((prev) => ({
          ...prev,
          isConnecting: false,
          error: err.message || "Failed to connect wallet",
        }))
        throw err
      }
    },
    [getProvider, updateBalance],
  )

  const disconnect = useCallback(() => {
    if (currentProvider?.disconnect) {
      currentProvider.disconnect()
    }
    setState((prev) => ({
      isConnected: false,
      publicKey: null,
      balance: null,
      walletName: null,
      isCorrectNetwork: true,
      isConnecting: false,
      error: null,
      networkType: prev.networkType,
    }))
    setCurrentProvider(null)
    localStorage.removeItem("garosta_solana_wallet")
  }, [currentProvider])

  // Listen for account changes
  useEffect(() => {
    if (!currentProvider) return

    const handleDisconnect = () => {
      disconnect()
    }

    const handleAccountChange = (publicKey: PublicKey) => {
      setState((prev) => ({ ...prev, publicKey }))
      updateBalance(publicKey)
    }

    currentProvider.on("disconnect", handleDisconnect)
    currentProvider.on("accountChanged", handleAccountChange)

    return () => {
      currentProvider.removeListener("disconnect", handleDisconnect)
      currentProvider.removeListener("accountChanged", handleAccountChange)
    }
  }, [currentProvider, disconnect, updateBalance])

  // Load network type from localStorage
  useEffect(() => {
    const savedNetworkType = localStorage.getItem("garosta_solana_network") as SolanaNetworkType | null
    if (savedNetworkType) {
      setNetworkType(savedNetworkType)
    }
  }, [setNetworkType])

  // Auto-reconnect on page load
  useEffect(() => {
    const savedWalletId = localStorage.getItem("garosta_solana_wallet")
    if (savedWalletId) {
      const wallet = SUPPORTED_SOLANA_WALLETS.find((w) => w.id === savedWalletId)
      if (wallet) {
        const provider = getProvider(wallet)
        if (provider && provider.isConnected) {
          connect(wallet).catch(() => {
            localStorage.removeItem("garosta_solana_wallet")
          })
        }
      }
    }
  }, [connect, getProvider])

  const getConnectedProvider = useCallback(() => {
    return currentProvider
  }, [currentProvider])

  return (
    <SolanaWeb3Context.Provider
      value={{
        ...state,
        connect,
        disconnect,
        getProvider,
        setNetworkType,
        getCurrentNetwork,
        getConnection,
        getConnectedProvider,
      }}
    >
      {children}
    </SolanaWeb3Context.Provider>
  )
}

export function useSolanaWeb3() {
  const context = useContext(SolanaWeb3Context)
  if (!context) {
    throw new Error("useSolanaWeb3 must be used within a SolanaWeb3Provider")
  }
  return context
}
