import { Shield, Users, Eye, Sprout } from "lucide-react"

export function TrustSection() {
  const features = [
    {
      icon: Users,
      title: "Managed by BUMDes",
      description: "Village-owned enterprise ensuring community benefit and accountability",
    },
    {
      icon: Sprout,
      title: "Real Farmers",
      description: "Local farmers with expertise in livestock care and management",
    },
    {
      icon: Eye,
      title: "Full Transparency",
      description: "Blockchain records ensure immutable and auditable asset data",
    },
    {
      icon: Shield,
      title: "Web3 for Rural",
      description: "Bringing financial inclusion to rural communities through technology",
    },
  ]

  return (
    <section className="border-b border-border py-20 md:py-28">
      <div className="container px-4 md:px-6">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="mb-4 text-3xl font-bold md:text-4xl">Built on Trust & Impact</h2>
          <p className="mb-12 text-muted-foreground md:text-lg">
            Our project combines traditional livestock farming with modern blockchain technology to create transparent,
            community-driven investments.
          </p>
        </div>

        <div className="mx-auto grid max-w-5xl gap-6 md:grid-cols-2 lg:grid-cols-4">
          {features.map((feature, i) => (
            <div
              key={i}
              className="group rounded-xl border border-border bg-card p-6 transition-colors hover:border-primary/50"
            >
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                <feature.icon className="h-6 w-6" />
              </div>
              <h3 className="mb-2 font-semibold">{feature.title}</h3>
              <p className="text-sm text-muted-foreground">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
