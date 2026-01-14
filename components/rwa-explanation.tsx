import { Cpu, Database, LinkIcon, BarChart3 } from "lucide-react"

export function RWAExplanation() {
  const steps = [
    {
      icon: Database,
      title: "Physical Goat",
      description: "Real goats owned by village BUMDes with proper documentation",
    },
    {
      icon: Cpu,
      title: "RFID + Digital Scale",
      description: "Each goat is tagged and weighed weekly using IoT devices",
    },
    {
      icon: LinkIcon,
      title: "Blockchain (NFT)",
      description: "Data is recorded on-chain as an ERC-721 NFT",
    },
    {
      icon: BarChart3,
      title: "Investor Dashboard",
      description: "Track your asset in real-time with full transparency",
    },
  ]

  return (
    <section id="how-it-works" className="border-b border-border bg-secondary/30 py-20 md:py-28">
      <div className="container px-4 md:px-6">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="mb-4 text-3xl font-bold md:text-4xl">How RWA Tokenization Works</h2>
          <p className="mb-12 text-muted-foreground md:text-lg">
            Each goat equals one NFT. The NFT is backed by real livestock, with data updated directly from the field.
          </p>
        </div>

        {/* Flow diagram */}
        <div className="mx-auto max-w-5xl">
          <div className="grid gap-4 md:grid-cols-4">
            {steps.map((step, index) => (
              <div key={index} className="relative">
                <div className="flex flex-col items-center text-center">
                  <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary text-primary-foreground">
                    <step.icon className="h-7 w-7" />
                  </div>
                  <h3 className="mb-2 font-semibold">{step.title}</h3>
                  <p className="text-sm text-muted-foreground">{step.description}</p>
                </div>
                {index < steps.length - 1 && (
                  <div className="absolute right-0 top-8 hidden h-0.5 w-full translate-x-1/2 bg-border md:block" />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Key points */}
        <div className="mx-auto mt-16 grid max-w-4xl gap-6 md:grid-cols-3">
          {[
            {
              title: "1 Goat = 1 NFT",
              description: "Each physical goat is represented by a unique ERC-721 token",
            },
            {
              title: "Asset-Backed Value",
              description: "NFT value directly tied to the real livestock market price",
            },
            {
              title: "Real-Time Updates",
              description: "Weight and health data updated weekly from the farm",
            },
          ].map((point, i) => (
            <div key={i} className="rounded-xl border border-border bg-card p-6">
              <h4 className="mb-2 font-semibold">{point.title}</h4>
              <p className="text-sm text-muted-foreground">{point.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
