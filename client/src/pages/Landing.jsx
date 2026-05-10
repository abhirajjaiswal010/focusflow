import { useEffect } from 'react'
import Navbar          from '../components/landing/Navbar'
import HeroSection     from '../components/landing/HeroSection'
import FeaturesSection from '../components/landing/FeaturesSection'
import HowItWorksSection from '../components/landing/HowItWorksSection'
import StatsSection    from '../components/landing/StatsSection'
import StackSection    from '../components/landing/StackSection'
import CTASection      from '../components/landing/CTASection'
import Footer          from '../components/landing/Footer'

export default function Landing() {
  // Set page title
  useEffect(() => {
    document.title = 'FocusFlow AI — Study Smarter. Focus Deeper. Ship Faster.'
  }, [])

  return (
    <div
      className="min-h-screen flex flex-col"
      style={{ background: 'var(--bg-primary)', color: 'var(--text-primary)' }}
    >
      {/* Meta viewport — handled by index.html */}

      {/* Sticky Navbar */}
      <Navbar />

      {/* Page sections */}
      <main>
        <HeroSection />
        <FeaturesSection />
        <HowItWorksSection />
        <StatsSection />
        <StackSection />
        <CTASection />
      </main>

      <Footer />
    </div>
  )
}
