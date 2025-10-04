import { TaxCalculator } from "@/components/tax-calculator"
import { InfoSection } from "@/components/info-section"

export default function T2125TaxCalculator() {
  return (
    <div className="relative overflow-hidden">
      
      <main className="relative z-10">
        <TaxCalculator />
        <InfoSection />
      </main>
    </div>
  )
}
