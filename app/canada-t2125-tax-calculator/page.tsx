import { TaxCalculator } from "@/components/tax-calculator"
import { InfoSection } from "@/components/info-section"

export default function T2125TaxCalculator() {
  return (
    <div className="relative overflow-hidden">
      {/* Background gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-secondary/5 pointer-events-none" />
      
      {/* Animated background elements */}
      <div className="absolute top-20 left-10 w-32 h-32 bg-primary/10 rounded-full blur-xl animate-pulse" />
      <div className="absolute top-40 right-20 w-24 h-24 bg-secondary/10 rounded-full blur-xl animate-pulse delay-1000" />
      <div className="absolute bottom-40 left-1/4 w-20 h-20 bg-accent/10 rounded-full blur-xl animate-pulse delay-2000" />
      
      <main className="relative z-10">
        <TaxCalculator />
        <InfoSection />
      </main>
    </div>
  )
}
