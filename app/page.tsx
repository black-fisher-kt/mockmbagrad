import Navbar from "@/components/navbar"
import Hero from "@/components/hero"
import Stats from "@/components/stats"
import Features from "@/components/features"
import HowItWorks from "@/components/how-it-works"
import Testimonials from "@/components/testimonials"
import FAQ from "@/components/faq"
import About from "@/components/about"
import Footer from "@/components/footer"
import AIChatButton from "@/components/ai-chat-button"

export default function Home() {
  return (
    <main className="min-h-screen bg-background">
      <Navbar />
      <Hero />
      <Stats />
      <Features />
      <HowItWorks />
      <Testimonials />
      <FAQ />
      <About />
      <Footer />
      <AIChatButton />
    </main>
  )
}