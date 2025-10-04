"use client"

import { useState } from "react"
import { CalculatorForm } from "./calculator-form"
import { ResultsPanel } from "./results-panel"
import { MobileResultsBar } from "./mobile-results-bar"

export type TaxData = {
  province: string
  selfEmploymentIncome: number
  employmentIncome: number
  capitalGains: number
  eligibleDividends: number
  ineligibleDividends: number
  otherIncome: number
  vehicleExpense: number
  vehicleBusinessUse: number
  homeOfficeExpense: number
  homeOfficeBusinessUse: number
  mealsExpense: number
  advertisingExpense: number
  softwareExpense: number
  travelExpense: number
  professionalFeesExpense: number
  rrspContribution: number
  fhsaContribution: number
  taxesPaid: number
}

export function TaxCalculator() {
  const [taxData, setTaxData] = useState<TaxData>({
    province: "",
    selfEmploymentIncome: 0,
    employmentIncome: 0,
    capitalGains: 0,
    eligibleDividends: 0,
    ineligibleDividends: 0,
    otherIncome: 0,
    vehicleExpense: 0,
    vehicleBusinessUse: 100,
    homeOfficeExpense: 0,
    homeOfficeBusinessUse: 100,
    mealsExpense: 0,
    advertisingExpense: 0,
    softwareExpense: 0,
    travelExpense: 0,
    professionalFeesExpense: 0,
    rrspContribution: 0,
    fhsaContribution: 0,
    taxesPaid: 0,
  })

  const [showMobileResults, setShowMobileResults] = useState(false)

  return (
    <div id="calculator" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4 text-balance">
          T2125 Tax Calculator for Canadian Freelancers
        </h1>
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto text-pretty leading-relaxed">
          Calculate your self-employment taxes instantly. Get accurate estimates for federal tax, provincial tax, and
          CPP contributions with our comprehensive calculator.
        </p>
      </div>

      <div className="grid lg:grid-cols-2 gap-12 items-start">
        <div className="order-2 lg:order-1">
          <div className="animate-slide-in-left">
            <CalculatorForm taxData={taxData} setTaxData={setTaxData} />
          </div>
        </div>
        <div className="order-1 lg:order-2">
          <div className="lg:sticky lg:top-24 animate-slide-in-right">
            <ResultsPanel taxData={taxData} />
          </div>
        </div>
      </div>

      <MobileResultsBar
        taxData={taxData}
        onViewResults={() => setShowMobileResults(true)}
        show={showMobileResults}
        onClose={() => setShowMobileResults(false)}
      />
    </div>
  )
}
