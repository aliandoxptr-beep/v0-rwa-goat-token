import Link from "next/link"

export function Footer() {
  return (
    <footer className="border-t border-border bg-secondary/30">
      <div className="container px-4 py-12 md:px-6">
        <div className="grid gap-8 md:grid-cols-4">
          <div className="md:col-span-2">
            <Link href="/" className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
                <span className="text-lg font-bold text-primary-foreground">G</span>
              </div>
              <span className="text-lg font-semibold">RWA Goat</span>
            </Link>
            <p className="mt-4 max-w-sm text-sm text-muted-foreground">
              Tokenizing village-owned goats into transparent, yield-generating NFTs. A Web3 initiative for rural
              financial inclusion.
            </p>
          </div>

          <div>
            <h4 className="mb-4 font-semibold">Quick Links</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/" className="text-muted-foreground hover:text-foreground">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/dashboard" className="text-muted-foreground hover:text-foreground">
                  Dashboard
                </Link>
              </li>
              <li>
                <Link href="/financials" className="text-muted-foreground hover:text-foreground">
                  Financials
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="mb-4 font-semibold">Resources</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <span className="text-muted-foreground">Whitepaper (Coming Soon)</span>
              </li>
              <li>
                <span className="text-muted-foreground">Smart Contract</span>
              </li>
              <li>
                <span className="text-muted-foreground">FAQ</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 border-t border-border pt-8 text-center text-sm text-muted-foreground">
          <p>© 2025 RWA Goat Token. A BUMDes Initiative. Built for Web3 Hackathon.</p>
        </div>
      </div>
    </footer>
  )
}
