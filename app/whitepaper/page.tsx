import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { FileText, Download, ExternalLink } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function WhitepaperPage() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main className="flex-1">
        {/* Hero Section */}
        <section className="border-b border-border bg-card">
          <div className="container px-4 py-16 md:px-6 md:py-24">
            <div className="mx-auto max-w-4xl">
              <div className="flex items-center gap-3 mb-6">
                <Badge variant="outline" className="gap-1.5">
                  <FileText className="h-3 w-3" />
                  Whitepaper v1.0
                </Badge>
                <Badge variant="secondary">January 2026</Badge>
              </div>
              <h1 className="text-4xl font-bold tracking-tight md:text-5xl lg:text-6xl mb-6">Garosta Whitepaper</h1>
              <p className="text-xl text-muted-foreground mb-8 max-w-3xl">
                A comprehensive technical and economic overview of tokenizing real-world livestock assets on Mantle
                Layer 2, enabling transparent, yield-generating investments in village enterprise initiatives.
              </p>
              <div className="flex flex-wrap gap-4">
                <Button size="lg" className="gap-2">
                  <Download className="h-4 w-4" />
                  Download PDF
                </Button>
                <Button size="lg" variant="outline" asChild>
                  <Link href="/dashboard" className="gap-2">
                    <ExternalLink className="h-4 w-4" />
                    View Live Dashboard
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Table of Contents */}
        <section className="border-b border-border">
          <div className="container px-4 py-12 md:px-6">
            <div className="mx-auto max-w-4xl">
              <h2 className="text-2xl font-bold mb-6">Table of Contents</h2>
              <div className="grid gap-3 md:grid-cols-2">
                {[
                  { num: "1", title: "Executive Summary" },
                  { num: "2", title: "Problem Statement" },
                  { num: "3", title: "Solution Overview" },
                  { num: "4", title: "Technical Architecture" },
                  { num: "5", title: "Tokenomics" },
                  { num: "6", title: "Asset Lifecycle" },
                  { num: "7", title: "Governance Model" },
                  { num: "8", title: "Roadmap" },
                ].map((item) => (
                  <a
                    key={item.num}
                    href={`#section-${item.num}`}
                    className="flex items-center gap-3 p-3 rounded-lg hover:bg-secondary transition-colors"
                  >
                    <span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-sm font-medium text-primary">
                      {item.num}
                    </span>
                    <span className="font-medium">{item.title}</span>
                  </a>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Content Sections */}
        <div className="container px-4 py-16 md:px-6">
          <div className="mx-auto max-w-4xl space-y-16">
            {/* Section 1: Executive Summary */}
            <section id="section-1" className="scroll-mt-24">
              <div className="flex items-center gap-3 mb-6">
                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-primary-foreground font-bold">
                  1
                </span>
                <h2 className="text-3xl font-bold">Executive Summary</h2>
              </div>
              <div className="prose prose-neutral dark:prose-invert max-w-none space-y-4">
                <p className="text-lg text-muted-foreground leading-relaxed">
                  Garosta is a pioneering Real World Asset (RWA) protocol that bridges the gap between traditional
                  village livestock farming and decentralized finance (DeFi). By tokenizing individual goats as NFTs on
                  the Mantle Layer 2 network, we create a transparent, traceable, and yield-generating investment
                  vehicle that benefits both investors and rural communities.
                </p>
                <Card className="bg-primary/5 border-primary/20">
                  <CardContent className="p-6">
                    <h4 className="font-semibold mb-3">Key Value Propositions</h4>
                    <ul className="space-y-2 text-muted-foreground">
                      <li className="flex items-start gap-2">
                        <span className="h-1.5 w-1.5 rounded-full bg-primary mt-2" />
                        <span>
                          <strong>Real Asset Backing:</strong> Each NFT represents ownership of a physical goat with
                          verifiable health and growth data
                        </span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="h-1.5 w-1.5 rounded-full bg-primary mt-2" />
                        <span>
                          <strong>Transparent Yield:</strong> Bi-monthly dividend distributions from livestock revenue
                          in USDC stablecoin
                        </span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="h-1.5 w-1.5 rounded-full bg-primary mt-2" />
                        <span>
                          <strong>Rural Empowerment:</strong> Direct funding flow to village enterprises without
                          intermediaries
                        </span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="h-1.5 w-1.5 rounded-full bg-primary mt-2" />
                        <span>
                          <strong>Low Fees:</strong> Built on Mantle L2 for minimal gas costs and fast transactions
                        </span>
                      </li>
                    </ul>
                  </CardContent>
                </Card>
              </div>
            </section>

            {/* Section 2: Problem Statement */}
            <section id="section-2" className="scroll-mt-24">
              <div className="flex items-center gap-3 mb-6">
                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-primary-foreground font-bold">
                  2
                </span>
                <h2 className="text-3xl font-bold">Problem Statement</h2>
              </div>
              <div className="space-y-6">
                <p className="text-lg text-muted-foreground leading-relaxed">
                  Rural livestock farming faces significant challenges that limit growth and prevent small communities
                  from accessing modern financial systems:
                </p>
                <div className="grid gap-4 md:grid-cols-2">
                  {[
                    {
                      title: "Limited Access to Capital",
                      desc: "Village enterprises struggle to obtain funding from traditional financial institutions due to lack of collateral and credit history.",
                    },
                    {
                      title: "Opaque Operations",
                      desc: "Investors have no visibility into how their funds are used, leading to trust issues and reduced investment.",
                    },
                    {
                      title: "High Intermediary Costs",
                      desc: "Multiple middlemen between farmers and markets significantly reduce profit margins for rural communities.",
                    },
                    {
                      title: "No Exit Liquidity",
                      desc: "Traditional livestock investments are illiquid with no secondary market for partial ownership transfer.",
                    },
                  ].map((problem, i) => (
                    <Card key={i}>
                      <CardContent className="p-5">
                        <h4 className="font-semibold mb-2">{problem.title}</h4>
                        <p className="text-sm text-muted-foreground">{problem.desc}</p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            </section>

            {/* Section 3: Solution Overview */}
            <section id="section-3" className="scroll-mt-24">
              <div className="flex items-center gap-3 mb-6">
                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-primary-foreground font-bold">
                  3
                </span>
                <h2 className="text-3xl font-bold">Solution Overview</h2>
              </div>
              <div className="space-y-6">
                <p className="text-lg text-muted-foreground leading-relaxed">
                  Garosta introduces a comprehensive RWA tokenization framework that addresses each challenge through
                  blockchain technology and smart contract automation:
                </p>

                <div className="relative">
                  <div className="absolute left-5 top-0 bottom-0 w-0.5 bg-border" />
                  <div className="space-y-8">
                    {[
                      {
                        step: "1",
                        title: "Asset Registration",
                        desc: "Each goat is registered with a unique RFID tag, linking physical identity to on-chain data. Health records, weight measurements, and ownership history are stored immutably.",
                      },
                      {
                        step: "2",
                        title: "NFT Minting",
                        desc: "Upon registration, an ERC-721 NFT is minted on Mantle L2, representing fractional ownership rights and yield claims for the specific animal.",
                      },
                      {
                        step: "3",
                        title: "Transparent Operations",
                        desc: "All operational costs (feed, medicine, labor) are recorded on-chain. Real-time dashboards display asset performance, health status, and financial metrics.",
                      },
                      {
                        step: "4",
                        title: "Yield Distribution",
                        desc: "Smart contracts automatically calculate and distribute bi-monthly dividends to NFT holders based on livestock revenue minus operational costs.",
                      },
                      {
                        step: "5",
                        title: "Secondary Market",
                        desc: "NFT holders can trade their assets on the integrated marketplace, providing liquidity and price discovery for tokenized livestock.",
                      },
                    ].map((item) => (
                      <div key={item.step} className="relative pl-12">
                        <div className="absolute left-0 flex h-10 w-10 items-center justify-center rounded-full bg-primary text-primary-foreground font-bold">
                          {item.step}
                        </div>
                        <h4 className="font-semibold mb-2">{item.title}</h4>
                        <p className="text-muted-foreground">{item.desc}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </section>

            {/* Section 4: Technical Architecture */}
            <section id="section-4" className="scroll-mt-24">
              <div className="flex items-center gap-3 mb-6">
                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-primary-foreground font-bold">
                  4
                </span>
                <h2 className="text-3xl font-bold">Technical Architecture</h2>
              </div>
              <div className="space-y-6">
                <p className="text-lg text-muted-foreground leading-relaxed">
                  Garosta is built on a robust technical foundation leveraging Mantle Layer 2 for scalability and cost
                  efficiency:
                </p>

                <Card>
                  <CardContent className="p-6">
                    <h4 className="font-semibold mb-4">Smart Contract Stack</h4>
                    <div className="space-y-4">
                      <div className="flex items-start gap-4 p-4 rounded-lg bg-secondary/50">
                        <code className="px-2 py-1 rounded bg-primary/10 text-primary text-sm font-mono">
                          GoatNFT.sol
                        </code>
                        <div>
                          <p className="font-medium">ERC-721 Asset Contract</p>
                          <p className="text-sm text-muted-foreground">
                            Handles NFT minting, metadata storage, and ownership transfers. Implements on-chain storage
                            for RFID links, health records, and weight history.
                          </p>
                        </div>
                      </div>
                      <div className="flex items-start gap-4 p-4 rounded-lg bg-secondary/50">
                        <code className="px-2 py-1 rounded bg-primary/10 text-primary text-sm font-mono">
                          Marketplace.sol
                        </code>
                        <div>
                          <p className="font-medium">Trading Contract</p>
                          <p className="text-sm text-muted-foreground">
                            Facilitates peer-to-peer trading with escrow functionality. Supports listing, buying, and
                            auction mechanisms with 2.5% protocol fee.
                          </p>
                        </div>
                      </div>
                      <div className="flex items-start gap-4 p-4 rounded-lg bg-secondary/50">
                        <code className="px-2 py-1 rounded bg-primary/10 text-primary text-sm font-mono">
                          Dividend.sol
                        </code>
                        <div>
                          <p className="font-medium">Yield Distribution Contract</p>
                          <p className="text-sm text-muted-foreground">
                            Automates bi-monthly USDC distributions based on NFT ownership snapshots. Implements claim
                            mechanisms and historical tracking.
                          </p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6">
                    <h4 className="font-semibold mb-4">Network Specifications</h4>
                    <div className="grid gap-4 sm:grid-cols-2">
                      <div className="p-4 rounded-lg bg-secondary/50">
                        <p className="text-sm text-muted-foreground">Network</p>
                        <p className="font-semibold">Mantle Mainnet (L2)</p>
                      </div>
                      <div className="p-4 rounded-lg bg-secondary/50">
                        <p className="text-sm text-muted-foreground">Chain ID</p>
                        <p className="font-semibold">5000</p>
                      </div>
                      <div className="p-4 rounded-lg bg-secondary/50">
                        <p className="text-sm text-muted-foreground">Native Token</p>
                        <p className="font-semibold">MNT</p>
                      </div>
                      <div className="p-4 rounded-lg bg-secondary/50">
                        <p className="text-sm text-muted-foreground">Avg. Gas Cost</p>
                        <p className="font-semibold">~$0.001 per tx</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </section>

            {/* Section 5: Tokenomics */}
            <section id="section-5" className="scroll-mt-24">
              <div className="flex items-center gap-3 mb-6">
                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-primary-foreground font-bold">
                  5
                </span>
                <h2 className="text-3xl font-bold">Tokenomics</h2>
              </div>
              <div className="space-y-6">
                <p className="text-lg text-muted-foreground leading-relaxed">
                  The Garosta economic model is designed for sustainable growth and fair value distribution:
                </p>

                <div className="grid gap-4 md:grid-cols-3">
                  <Card className="bg-primary/5 border-primary/20">
                    <CardContent className="p-6 text-center">
                      <p className="text-4xl font-bold text-primary mb-2">$200</p>
                      <p className="text-sm text-muted-foreground">Average NFT Value</p>
                    </CardContent>
                  </Card>
                  <Card className="bg-primary/5 border-primary/20">
                    <CardContent className="p-6 text-center">
                      <p className="text-4xl font-bold text-primary mb-2">12%</p>
                      <p className="text-sm text-muted-foreground">Target Annual Yield</p>
                    </CardContent>
                  </Card>
                  <Card className="bg-primary/5 border-primary/20">
                    <CardContent className="p-6 text-center">
                      <p className="text-4xl font-bold text-primary mb-2">2.5%</p>
                      <p className="text-sm text-muted-foreground">Marketplace Fee</p>
                    </CardContent>
                  </Card>
                </div>

                <Card>
                  <CardContent className="p-6">
                    <h4 className="font-semibold mb-4">Revenue Distribution Model</h4>
                    <div className="space-y-3">
                      {[
                        { label: "NFT Holders (Dividends)", percent: 70 },
                        { label: "Village Operations", percent: 20 },
                        { label: "Protocol Treasury", percent: 7 },
                        { label: "Development Fund", percent: 3 },
                      ].map((item) => (
                        <div key={item.label} className="space-y-1">
                          <div className="flex justify-between text-sm">
                            <span>{item.label}</span>
                            <span className="font-medium">{item.percent}%</span>
                          </div>
                          <div className="h-2 rounded-full bg-secondary overflow-hidden">
                            <div className="h-full bg-primary rounded-full" style={{ width: `${item.percent}%` }} />
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </section>

            {/* Section 6: Asset Lifecycle */}
            <section id="section-6" className="scroll-mt-24">
              <div className="flex items-center gap-3 mb-6">
                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-primary-foreground font-bold">
                  6
                </span>
                <h2 className="text-3xl font-bold">Asset Lifecycle</h2>
              </div>
              <div className="space-y-6">
                <p className="text-lg text-muted-foreground leading-relaxed">
                  Each tokenized goat follows a defined lifecycle from registration to maturity:
                </p>

                <div className="grid gap-4 md:grid-cols-2">
                  {[
                    {
                      phase: "Acquisition",
                      duration: "Day 0",
                      desc: "Young goat is purchased, registered with RFID, and NFT is minted. Initial health check and documentation completed.",
                    },
                    {
                      phase: "Growth",
                      duration: "Month 1-12",
                      desc: "Regular weight measurements, health monitoring, and feeding schedule. Data uploaded to blockchain weekly.",
                    },
                    {
                      phase: "Maturity",
                      duration: "Month 12-18",
                      desc: "Goat reaches optimal weight. NFT value appreciates based on growth metrics. Ready for breeding or sale.",
                    },
                    {
                      phase: "Exit",
                      duration: "Month 18+",
                      desc: "Asset is sold in traditional market. Proceeds distributed to NFT holder. NFT is burned or transferred to new physical asset.",
                    },
                  ].map((phase, i) => (
                    <Card key={i}>
                      <CardContent className="p-5">
                        <div className="flex items-center gap-3 mb-3">
                          <Badge variant="outline">{phase.duration}</Badge>
                          <h4 className="font-semibold">{phase.phase}</h4>
                        </div>
                        <p className="text-sm text-muted-foreground">{phase.desc}</p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            </section>

            {/* Section 7: Governance Model */}
            <section id="section-7" className="scroll-mt-24">
              <div className="flex items-center gap-3 mb-6">
                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-primary-foreground font-bold">
                  7
                </span>
                <h2 className="text-3xl font-bold">Governance Model</h2>
              </div>
              <div className="space-y-6">
                <p className="text-lg text-muted-foreground leading-relaxed">
                  Garosta implements a hybrid governance model combining on-chain voting with village enterprise
                  oversight:
                </p>

                <Card>
                  <CardContent className="p-6 space-y-4">
                    <div>
                      <h4 className="font-semibold mb-2">NFT Holder Rights</h4>
                      <ul className="space-y-2 text-muted-foreground">
                        <li className="flex items-start gap-2">
                          <span className="h-1.5 w-1.5 rounded-full bg-primary mt-2" />
                          <span>Vote on protocol upgrades and fee adjustments</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="h-1.5 w-1.5 rounded-full bg-primary mt-2" />
                          <span>Propose new village enterprise partnerships</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="h-1.5 w-1.5 rounded-full bg-primary mt-2" />
                          <span>Access detailed operational reports and audits</span>
                        </li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-2">Village Enterprise Responsibilities</h4>
                      <ul className="space-y-2 text-muted-foreground">
                        <li className="flex items-start gap-2">
                          <span className="h-1.5 w-1.5 rounded-full bg-primary mt-2" />
                          <span>Daily animal care and health monitoring</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="h-1.5 w-1.5 rounded-full bg-primary mt-2" />
                          <span>Weekly data uploads (weight, health status, expenses)</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="h-1.5 w-1.5 rounded-full bg-primary mt-2" />
                          <span>Quarterly financial reporting and third-party audits</span>
                        </li>
                      </ul>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </section>

            {/* Section 8: Roadmap */}
            <section id="section-8" className="scroll-mt-24">
              <div className="flex items-center gap-3 mb-6">
                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-primary-foreground font-bold">
                  8
                </span>
                <h2 className="text-3xl font-bold">Roadmap</h2>
              </div>
              <div className="space-y-6">
                <div className="space-y-4">
                  {[
                    {
                      quarter: "Q1 2026",
                      title: "Foundation",
                      items: [
                        "Smart contract development & audit",
                        "Initial village partnership",
                        "Beta dashboard launch",
                      ],
                      status: "current",
                    },
                    {
                      quarter: "Q2 2026",
                      title: "Launch",
                      items: ["Mainnet deployment on Mantle", "First NFT minting event", "Marketplace beta"],
                      status: "upcoming",
                    },
                    {
                      quarter: "Q3 2026",
                      title: "Scale",
                      items: ["Expand to 5 village partners", "Mobile app release", "Cross-chain bridge integration"],
                      status: "upcoming",
                    },
                    {
                      quarter: "Q4 2026",
                      title: "Growth",
                      items: ["100+ tokenized assets", "DAO governance launch", "Institutional partnership program"],
                      status: "upcoming",
                    },
                  ].map((phase) => (
                    <Card key={phase.quarter} className={phase.status === "current" ? "border-primary" : ""}>
                      <CardContent className="p-5">
                        <div className="flex items-center gap-3 mb-3">
                          <Badge variant={phase.status === "current" ? "default" : "outline"}>{phase.quarter}</Badge>
                          <h4 className="font-semibold">{phase.title}</h4>
                          {phase.status === "current" && (
                            <span className="text-xs text-primary font-medium">Current Phase</span>
                          )}
                        </div>
                        <ul className="space-y-1">
                          {phase.items.map((item, i) => (
                            <li key={i} className="flex items-center gap-2 text-sm text-muted-foreground">
                              <span className="h-1 w-1 rounded-full bg-muted-foreground" />
                              {item}
                            </li>
                          ))}
                        </ul>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            </section>

            {/* Conclusion */}
            <section className="border-t border-border pt-12">
              <Card className="bg-primary/5 border-primary/20">
                <CardContent className="p-8 text-center">
                  <h3 className="text-2xl font-bold mb-4">Join the Garosta Revolution</h3>
                  <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
                    Garosta represents a new paradigm in real-world asset tokenization, combining blockchain
                    transparency with meaningful social impact. Be part of the future of rural finance.
                  </p>
                  <div className="flex flex-wrap justify-center gap-4">
                    <Button asChild size="lg">
                      <Link href="/dashboard">Explore Dashboard</Link>
                    </Button>
                    <Button variant="outline" size="lg" asChild>
                      <Link href="/">Learn More</Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </section>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
