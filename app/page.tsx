import { Navbar } from "@/components/Navbar"
import { HeroSection } from "@/components/HeroSection"
import { CredibilityBar } from "@/components/CredibilityBar"
import { HowItWorks } from "@/components/HowItWorks"
import { StatsBar } from "@/components/StatsBar"
import { ExampleResults } from "@/components/ExampleResults"
import { Footer } from "@/components/Footer"

export default function Home() {
  return (
    <>
      <Navbar />

      {/* pt-16 offsets the fixed nav so hero content centers in the visible viewport */}
      <div id="hero" className="pt-16">
        <HeroSection />
      </div>

      <CredibilityBar />
      <HowItWorks />
      <StatsBar />
      <ExampleResults />
      <Footer />
    </>
  )
}
