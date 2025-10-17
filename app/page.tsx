"use client"
import Hero from "@/components/home/hero"
import WhatMakesItWork from "@/components/what-makes-it-work"
import StartSmallMasterDeep from "@/components/start-small-master-deep"
import HowItWorks from "@/components/how-it-works"
import Features from "@/components/features"
import { TestimonialsSection } from "@/components/testimonials"
import { NewReleasePromo } from "@/components/new-release-promo"
import { FAQSection } from "@/components/faq-section"
import { PricingSection } from "@/components/pricing-section"
import { StickyFooter } from "@/components/sticky-footer"

export default function Home() {
  return (
    <div className="relative min-h-screen w-full bg-transparent -mt-20 pt-20">
      {/* Theme-aware Background with Top Glow */}
      <div className="absolute inset-0 z-0 bg-background theme-glow" />

      {/* Hero Section */}
      <Hero />

      {/* What Makes It Work Section */}yeah 
      <WhatMakesItWork />

      {/* Start Small Master Deep Section */}
      <StartSmallMasterDeep />

      {/* How It Works Section */}
      <HowItWorks />

      {/* Features Section */}
      {/* <div id="features">
        <Features />
      </div> */}

      {/* Testimonials Section */}
      {/* <div id="testimonials">
        <TestimonialsSection />
      </div> */}
      
      <NewReleasePromo />
      {/* Pricing Section */}
      <div id="pricing">
        <PricingSection />
      </div>

  

      {/* FAQ Section */}
      {/* <div id="faq">
        <FAQSection />
      </div> */}

      {/* Sticky Footer */}
      <StickyFooter />
    </div>
  )
}
