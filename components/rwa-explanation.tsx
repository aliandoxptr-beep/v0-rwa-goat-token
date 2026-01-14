import { Cpu, Database, LinkIcon, BarChart3 } from "lucide-react"

export function RWAExplanation() {
  const steps = [
    {
      icon: Database,
      title: "Physical Goat",
      description: "Real goats owned by village enterprise with proper documentation",
    },
    {
      icon: Cpu,
      title: "RFID + Digital Scale",
      description: "Each goat is tagged and weighed weekly using IoT devices",
    },
    {
      icon: LinkIcon,
      title: "Blockchain (NFT)",
      description: "Data is recorded on-chain as an ERC-721 NFT on Mantle L2",
    },
    {
      icon: BarChart3,
      title: "Investor Dashboard",
      description: "Track your asset in real-time with full transparency",
    },
  ]

  return (
    <section id="how-it-works" className="border-b border-border bg-secondary/30 py-16 sm:py-24 lg:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="mb-4 text-2xl font-bold sm:text-3xl lg:text-4xl">How RWA Tokenization Works</h2>
          <p className="mb-12 text-muted-foreground sm:text-lg leading-relaxed">
            Each goat equals one NFT. The NFT is backed by real livestock, with data updated directly from the field.
          </p>
        </div>

        <div className="mx-auto max-w-5xl">
          <div className="grid gap-6 sm:gap-4 md:grid-cols-4">
            {steps.map((step, index) => (
              <div key={index} className="relative">
                <div className="flex flex-col items-center text-center">
                  <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-lg">
                    <step.icon className="h-7 w-7" />
                  </div>
                  <h3 className="mb-2 font-semibold">{step.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{step.description}</p>
                </div>
                {index < steps.length - 1 && (
                  <div className="absolute right-0 top-8 hidden h-0.5 w-full translate-x-1/2 bg-gradient-to-r from-border to-transparent md:block" />
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="mx-auto mt-16 grid max-w-4xl gap-4 sm:grid-cols-3">
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
            <div
              key={i}
              className="rounded-2xl border border-border bg-card p-6 transition-colors hover:border-primary/30"
            >
              <h4 className="mb-2 font-semibold">{point.title}</h4>
              <p className="text-sm text-muted-foreground leading-relaxed">{point.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
