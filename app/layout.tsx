import type React from "react"
import type { Metadata } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import { Web3Provider } from "@/contexts/web3-context"
import { CartProvider } from "@/contexts/cart-context"
import { GoatsProvider } from "@/contexts/goats-context"
import "./globals.css"

const _geist = Geist({ subsets: ["latin"] })
const _geistMono = Geist_Mono({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Garosta | Real World Asset Tokenization",
  description:
    "Tokenizing village-owned goats into transparent, yield-generating NFTs. A village enterprise initiative for rural Web3 inclusion.",
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
        <Web3Provider>
          <GoatsProvider>
            <CartProvider>{children}</CartProvider>
          </GoatsProvider>
        </Web3Provider>
        <Analytics />
      </body>
    </html>
  )
}
