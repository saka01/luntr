import { IncomeTaxCalculator } from "@/components/income-tax-calculator"
import { InfoSection } from "@/components/info-section"

export default function CanadaIncomeTaxCalculator() {
  return (
    <div className="overflow-hidden">
      <main className="z-10">
        <IncomeTaxCalculator />
        <InfoSection />
      </main>
    </div>
  )
}
