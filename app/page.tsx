"use client"
import Hero from "@/components/home/hero"
import Features from "@/components/features"
import { TestimonialsSection } from "@/components/testimonials"
import { NewReleasePromo } from "@/components/new-release-promo"
import { FAQSection } from "@/components/faq-section"
import { PricingSection } from "@/components/pricing-section"
import { StickyFooter } from "@/components/sticky-footer"
import { DeductionFinderSection } from "@/components/deduction-finder-section"

export default function Home() {
  return (
    <div className="relative min-h-screen w-full bg-transparent -mt-20 pt-20">
      {/* Theme-aware Background with Top Glow */}
      <div className="absolute inset-0 z-0 bg-background theme-glow" />

      {/* Hero Section */}
      <Hero />

      {/* Features Section */}
      {/* <div id="features">
        <Features />
      </div> */}
      {/* Deduction Finder Section */}
      <DeductionFinderSection />

      {/* Pricing Section */}
      <div id="pricing">
        <PricingSection />
      </div>


      {/* Testimonials Section */}
      <div id="testimonials">
        <TestimonialsSection />
      </div>

      <NewReleasePromo />

      {/* FAQ Section */}
      <div id="faq">
        <FAQSection />
      </div>

      {/* Sticky Footer */}
      <StickyFooter />
    </div>
  )
}
