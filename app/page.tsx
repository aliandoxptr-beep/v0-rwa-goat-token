import { Header } from "@/components/header"
import { HeroSection } from "@/components/hero-section"
import { RWAExplanation } from "@/components/rwa-explanation"
import { TrustSection } from "@/components/trust-section"
import { Footer } from "@/components/footer"

export default function HomePage() {
  return (
    <div className="min-h-screen">
      <Header />
      <main>
        <HeroSection />
        <RWAExplanation />
        <TrustSection />
      </main>
      <Footer />
    </div>
  )
}
