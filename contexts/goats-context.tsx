"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { goatsData as initialGoatsData, type GoatNFT } from "@/lib/mock-data"

interface GoatsContextType {
  goats: GoatNFT[]
  addGoat: (goat: GoatNFT) => void
  removeGoat: (nftId: string) => void
  updateGoat: (nftId: string, updates: Partial<GoatNFT>) => void
}

const GoatsContext = createContext<GoatsContextType | undefined>(undefined)

export function GoatsProvider({ children }: { children: ReactNode }) {
  const [goats, setGoats] = useState<GoatNFT[]>([])
  const [isInitialized, setIsInitialized] = useState(false)

  // Load goats from localStorage on mount
  useEffect(() => {
    const savedGoats = localStorage.getItem("garosta-goats")
    if (savedGoats) {
      try {
        const parsed = JSON.parse(savedGoats)
        // Merge with initial data, avoiding duplicates
        const existingIds = new Set(parsed.map((g: GoatNFT) => g.nftId))
        const newInitialGoats = initialGoatsData.filter((g) => !existingIds.has(g.nftId))
        setGoats([...parsed, ...newInitialGoats])
      } catch {
        setGoats(initialGoatsData)
      }
    } else {
      setGoats(initialGoatsData)
    }
    setIsInitialized(true)
  }, [])

  // Save to localStorage when goats change
  useEffect(() => {
    if (isInitialized && goats.length > 0) {
      localStorage.setItem("garosta-goats", JSON.stringify(goats))
    }
  }, [goats, isInitialized])

  const addGoat = (goat: GoatNFT) => {
    setGoats((prev) => [goat, ...prev])
  }

  const removeGoat = (nftId: string) => {
    setGoats((prev) => prev.filter((g) => g.nftId !== nftId))
  }

  const updateGoat = (nftId: string, updates: Partial<GoatNFT>) => {
    setGoats((prev) => prev.map((g) => (g.nftId === nftId ? { ...g, ...updates } : g)))
  }

  return <GoatsContext.Provider value={{ goats, addGoat, removeGoat, updateGoat }}>{children}</GoatsContext.Provider>
}

export function useGoats() {
  const context = useContext(GoatsContext)
  if (!context) {
    throw new Error("useGoats must be used within GoatsProvider")
  }
  return context
}
