import type React from "react"
import type { Metadata } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import { SolanaWeb3Provider } from "@/contexts/solana-context"
import { CartProvider } from "@/contexts/cart-context"
import { GoatsProvider } from "@/contexts/goats-context"
import "./globals.css"

const _geist = Geist({ subsets: ["latin"] })
const _geistMono = Geist_Mono({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Garosta | Real World Asset Tokenization on Solana",
  description:
    "Tokenizing village-owned goats into transparent, yield-generating NFTs on Solana Chain. Connecting farmers to global investors with blockchain transparency.",
  generator: "v0.app",
  icons: {
    icon: [
      {
        url: "/icon-light-32x32.png",
        media: "(prefers-color-scheme: light)",
      },
      {
        url: "/icon-dark-32x32.png",
        media: "(prefers-color-scheme: dark)",
      },
      {
        url: "/icon.svg",
        type: "image/svg+xml",
      },
    ],
    apple: "/apple-icon.png",
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`font-sans antialiased`}>
        <SolanaWeb3Provider>
          <GoatsProvider>
            <CartProvider>{children}</CartProvider>
          </GoatsProvider>
        </SolanaWeb3Provider>
        <Analytics />
      </body>
    </html>
  )
}
