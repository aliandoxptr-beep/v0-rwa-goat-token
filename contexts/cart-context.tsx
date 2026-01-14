"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import type { GoatNFT } from "@/lib/mock-data"

interface CartItem extends GoatNFT {
  purchaseDate: string
  txHash: string
  purchasePrice: number
}

interface CartContextType {
  items: CartItem[]
  addItem: (goat: GoatNFT, txHash: string, price: number) => void
  removeItem: (nftId: string) => void
  clearCart: () => void
  totalItems: number
  totalValue: number
}

const CartContext = createContext<CartContextType | undefined>(undefined)

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([])

  // Load cart from localStorage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem("garosta-cart")
    if (savedCart) {
      try {
        setItems(JSON.parse(savedCart))
      } catch {
        console.error("Failed to parse cart from localStorage")
      }
    }
  }, [])

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("garosta-cart", JSON.stringify(items))
  }, [items])

  const addItem = (goat: GoatNFT, txHash: string, price: number) => {
    const newItem: CartItem = {
      ...goat,
      purchaseDate: new Date().toISOString(),
      txHash,
      purchasePrice: price,
    }
    setItems((prev) => {
      // Prevent duplicates
      if (prev.find((item) => item.nftId === goat.nftId)) {
        return prev
      }
      return [...prev, newItem]
    })
  }

  const removeItem = (nftId: string) => {
    setItems((prev) => prev.filter((item) => item.nftId !== nftId))
  }

  const clearCart = () => {
    setItems([])
  }

  const totalItems = items.length
  const totalValue = items.reduce((sum, item) => sum + item.purchasePrice, 0)

  return (
    <CartContext.Provider value={{ items, addItem, removeItem, clearCart, totalItems, totalValue }}>
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const context = useContext(CartContext)
  if (!context) {
    throw new Error("useCart must be used within a CartProvider")
  }
  return context
}
