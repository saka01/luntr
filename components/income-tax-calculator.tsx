"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { HelpCircle } from "lucide-react"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

export type IncomeTaxData = {
  province: string
  employmentIncome: number
  otherIncome: number
  capitalGains: number
  eligibleDividends: number
  ineligibleDividends: number
  selfEmploymentIncome: number
  rrspContribution: number
  fhsaContribution: number
  taxesPaid: number
}

type TaxResults = {
  totalIncome: number
  totalDeductions: number
  taxableIncome: number
  federalTax: number
  provincialTax: number
  totalTax: number
  afterTaxIncome: number
  averageTaxRate: number
  marginalTaxRate: number
  taxesPaid: number
  taxesOwedOrRefund: number
}

// 2024 Federal Tax Brackets
const federalBrackets = [
  { limit: 55867, rate: 0.15 },
  { limit: 111733, rate: 0.205 },
  { limit: 173205, rate: 0.26 },
  { limit: 246752, rate: 0.29 },
  { limit: Number.POSITIVE_INFINITY, rate: 0.33 },
]

// 2024 Provincial Tax Rates
const provincialRates: Record<string, Array<{ limit: number; rate: number }>> = {
  ON: [
    { limit: 51446, rate: 0.0505 },
    { limit: 102894, rate: 0.0915 },
    { limit: 150000, rate: 0.1116 },
    { limit: 220000, rate: 0.1216 },
    { limit: Number.POSITIVE_INFINITY, rate: 0.1316 },
  ],
  BC: [
    { limit: 47937, rate: 0.0506 },
    { limit: 95875, rate: 0.077 },
    { limit: 110076, rate: 0.105 },
    { limit: 133664, rate: 0.1229 },
    { limit: 181232, rate: 0.147 },
    { limit: Number.POSITIVE_INFINITY, rate: 0.168 },
  ],
  AB: [
    { limit: 148269, rate: 0.1 },
    { limit: 177922, rate: 0.12 },
    { limit: 237230, rate: 0.13 },
    { limit: 355845, rate: 0.14 },
    { limit: Number.POSITIVE_INFINITY, rate: 0.15 },
  ],
  QC: [
    { limit: 51780, rate: 0.14 },
    { limit: 103545, rate: 0.19 },
    { limit: 126000, rate: 0.24 },
    { limit: Number.POSITIVE_INFINITY, rate: 0.2575 },
  ],
  MB: [
    { limit: 47000, rate: 0.108 },
    { limit: 100000, rate: 0.1275 },
    { limit: Number.POSITIVE_INFINITY, rate: 0.174 },
  ],
  SK: [
    { limit: 52057, rate: 0.105 },
    { limit: 148734, rate: 0.125 },
    { limit: Number.POSITIVE_INFINITY, rate: 0.145 },
  ],
  NS: [
    { limit: 29590, rate: 0.0879 },
    { limit: 59180, rate: 0.1495 },
    { limit: 93000, rate: 0.1667 },
    { limit: 150000, rate: 0.175 },
    { limit: Number.POSITIVE_INFINITY, rate: 0.21 },
  ],
  NB: [
    { limit: 49958, rate: 0.094 },
    { limit: 99916, rate: 0.14 },
    { limit: 185064, rate: 0.16 },
    { limit: Number.POSITIVE_INFINITY, rate: 0.195 },
  ],
  PE: [
    { limit: 32656, rate: 0.098 },
    { limit: 64313, rate: 0.138 },
    { limit: Number.POSITIVE_INFINITY, rate: 0.167 },
  ],
  NL: [
    { limit: 43198, rate: 0.087 },
    { limit: 86395, rate: 0.145 },
    { limit: 154244, rate: 0.158 },
    { limit: 215943, rate: 0.178 },
    { limit: Number.POSITIVE_INFINITY, rate: 0.208 },
  ],
  YT: [
    { limit: 55867, rate: 0.064 },
    { limit: 111733, rate: 0.09 },
    { limit: 173205, rate: 0.109 },
    { limit: 500000, rate: 0.128 },
    { limit: Number.POSITIVE_INFINITY, rate: 0.15 },
  ],
  NT: [
    { limit: 50597, rate: 0.059 },
    { limit: 101198, rate: 0.086 },
    { limit: 164525, rate: 0.122 },
    { limit: Number.POSITIVE_INFINITY, rate: 0.1405 },
  ],
  NU: [
    { limit: 53268, rate: 0.04 },
    { limit: 106537, rate: 0.07 },
    { limit: 173205, rate: 0.09 },
    { limit: Number.POSITIVE_INFINITY, rate: 0.115 },
  ],
}

const basicPersonalAmount = 15705 // 2024 federal basic personal amount

  function calculateTaxForBrackets(income: number, brackets: Array<{ limit: number; rate: number }>): number {
  let tax = 0
  let previousLimit = 0

  for (const bracket of brackets) {
    if (income <= previousLimit) break

    const taxableInBracket = Math.min(income, bracket.limit) - previousLimit
    tax += taxableInBracket * bracket.rate
    previousLimit = bracket.limit

    if (income <= bracket.limit) break
  }

  return tax
}

function calculateIncomeTax(data: IncomeTaxData): TaxResults {
  // Calculate total income (only income sources, no self-employment or business deductions)
  const totalIncome =
    data.employmentIncome +
    data.otherIncome +
    data.capitalGains * 0.5 + // 50% inclusion rate for capital gains
    data.eligibleDividends * 1.38 + // Gross-up for eligible dividends
    data.ineligibleDividends * 1.15 // Gross-up for ineligible dividends

  // Calculate total deductions
  const totalDeductions = data.rrspContribution + data.fhsaContribution

  // Calculate taxable income
  const taxableIncome = Math.max(0, totalIncome - totalDeductions - basicPersonalAmount)

  // Calculate federal tax
  const federalTax = calculateTaxForBrackets(taxableIncome, federalBrackets)

  // Calculate provincial tax (default to Ontario)
  const provincialBrackets = provincialRates[data.province] || provincialRates.ON
  const provincialTax = calculateTaxForBrackets(taxableIncome, provincialBrackets)

  // Total tax
  const totalTax = federalTax + provincialTax

  // Taxes owed or refund
  const taxesOwedOrRefund = totalTax - data.taxesPaid

  // After-tax income
  const afterTaxIncome = totalIncome - totalTax - totalDeductions

  // Tax rates
  const averageTaxRate = totalIncome > 0 ? (totalTax / totalIncome) * 100 : 0

  // Marginal rate (simplified - top bracket rate)
  let marginalTaxRate = 0
  for (const bracket of federalBrackets) {
    if (taxableIncome <= bracket.limit) {
      marginalTaxRate = bracket.rate * 100
      break
    }
  }
  for (const bracket of provincialBrackets) {
    if (taxableIncome <= bracket.limit) {
      marginalTaxRate += bracket.rate * 100
      break
    }
  }

  return {
    totalIncome,
    totalDeductions,
    taxableIncome,
    federalTax,
    provincialTax,
    totalTax,
    afterTaxIncome,
    averageTaxRate,
    marginalTaxRate,
    taxesPaid: data.taxesPaid,
    taxesOwedOrRefund,
  }
}

function IncomeTaxForm({ taxData, setTaxData }: { taxData: IncomeTaxData; setTaxData: (data: IncomeTaxData) => void }) {
  const updateField = (field: keyof IncomeTaxData, value: string | number) => {
    setTaxData({ ...taxData, [field]: value })
  }

  return (
    <div className="space-y-4">
      {/* Province Selection */}
      <div className="flex justify-center">
        <Select value={taxData.province} onValueChange={(value) => updateField("province", value)}>
          <SelectTrigger id="province" className="h-10 bg-slate-800/50 border-slate-700 text-white w-64">
            <SelectValue placeholder="Select province" />
          </SelectTrigger>
          <SelectContent className="bg-slate-800 border-slate-700">
            <SelectItem value="ON">Ontario</SelectItem>
            <SelectItem value="BC">British Columbia</SelectItem>
            <SelectItem value="AB">Alberta</SelectItem>
            <SelectItem value="QC">Quebec</SelectItem>
            <SelectItem value="MB">Manitoba</SelectItem>
            <SelectItem value="SK">Saskatchewan</SelectItem>
            <SelectItem value="NS">Nova Scotia</SelectItem>
            <SelectItem value="NB">New Brunswick</SelectItem>
            <SelectItem value="PE">Prince Edward Island</SelectItem>
            <SelectItem value="NL">Newfoundland and Labrador</SelectItem>
            <SelectItem value="YT">Yukon</SelectItem>
            <SelectItem value="NT">Northwest Territories</SelectItem>
            <SelectItem value="NU">Nunavut</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Income Sources - Consolidated */}
      <Card className="bg-slate-900/50 border-slate-800/50 backdrop-blur-sm shadow-xl">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg font-semibold text-white">Income Sources</CardTitle>
          <CardDescription className="text-sm text-slate-300">Enter all your income for the year</CardDescription>
        </CardHeader>
        <CardContent className="pt-0 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Label htmlFor="employmentIncome" className="text-sm font-medium text-slate-200">Employment Income *</Label>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <HelpCircle className="h-3.5 w-3.5 text-slate-400 cursor-help" />
                    </TooltipTrigger>
                    <TooltipContent className="max-w-xs bg-slate-800 border-slate-700 text-white">
                      <p>Total employment income from all T4 slips</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
              <Input
                id="employmentIncome"
                type="number"
                placeholder="$0"
                value={taxData.employmentIncome || ""}
                onChange={(e) => updateField("employmentIncome", Number.parseFloat(e.target.value) || 0)}
                className="h-10 bg-slate-800/50 border-slate-700 text-white placeholder:text-slate-400"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="otherIncome" className="text-sm font-medium text-slate-200">Self-Employment  Income</Label>
              <Input
                id="selfEmploymentIncome"
                type="number"
                placeholder="$0"
                value={taxData.selfEmploymentIncome || ""}
                onChange={(e) => updateField("selfEmploymentIncome", Number.parseFloat(e.target.value) || 0)}
                className="h-10 bg-slate-800/50 border-slate-700 text-white placeholder:text-slate-400"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="otherIncome" className="text-sm font-medium text-slate-200">Other Income</Label>
              <Input
                id="otherIncome"
                type="number"
                placeholder="$0"
                value={taxData.otherIncome || ""}
                onChange={(e) => updateField("otherIncome", Number.parseFloat(e.target.value) || 0)}
                className="h-10 bg-slate-800/50 border-slate-700 text-white placeholder:text-slate-400"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="capitalGains" className="text-sm font-medium text-slate-200">Capital Gains</Label>
              <Input
                id="capitalGains"
                type="number"
                placeholder="$0"
                value={taxData.capitalGains || ""}
                onChange={(e) => updateField("capitalGains", Number.parseFloat(e.target.value) || 0)}
                className="h-10 bg-slate-800/50 border-slate-700 text-white placeholder:text-slate-400"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="eligibleDividends" className="text-sm font-medium text-slate-200">Eligible Dividends</Label>
              <Input
                id="eligibleDividends"
                type="number"
                placeholder="$0"
                value={taxData.eligibleDividends || ""}
                onChange={(e) => updateField("eligibleDividends", Number.parseFloat(e.target.value) || 0)}
                className="h-10 bg-slate-800/50 border-slate-700 text-white placeholder:text-slate-400"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="ineligibleDividends" className="text-sm font-medium text-slate-200">Ineligible Dividends</Label>
            <Input
              id="ineligibleDividends"
              type="number"
              placeholder="$0"
              value={taxData.ineligibleDividends || ""}
              onChange={(e) => updateField("ineligibleDividends", Number.parseFloat(e.target.value) || 0)}
              className="h-10 bg-slate-800/50 border-slate-700 text-white placeholder:text-slate-400"
            />
          </div>
        </CardContent>
      </Card>

      {/* Deductions & Taxes - Consolidated */}
      <Card className="bg-slate-900/50 border-slate-800/50 backdrop-blur-sm shadow-xl">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg font-semibold text-white">Deductions & Taxes Paid</CardTitle>
          <CardDescription className="text-sm text-slate-300">Registered savings and taxes already paid</CardDescription>
        </CardHeader>
        <CardContent className="pt-0 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Label htmlFor="rrspContribution" className="text-sm font-medium text-slate-200">RRSP Contribution</Label>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <HelpCircle className="h-3.5 w-3.5 text-slate-400 cursor-help" />
                    </TooltipTrigger>
                    <TooltipContent className="max-w-xs bg-slate-800 border-slate-700 text-white">
                      <p>Registered Retirement Savings Plan contributions reduce taxable income</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
              <Input
                id="rrspContribution"
                type="number"
                placeholder="$0"
                value={taxData.rrspContribution || ""}
                onChange={(e) => updateField("rrspContribution", Number.parseFloat(e.target.value) || 0)}
                className="h-10 bg-slate-800/50 border-slate-700 text-white placeholder:text-slate-400"
              />
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Label htmlFor="fhsaContribution" className="text-sm font-medium text-slate-200">FHSA Contribution</Label>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <HelpCircle className="h-3.5 w-3.5 text-slate-400 cursor-help" />
                    </TooltipTrigger>
                    <TooltipContent className="max-w-xs bg-slate-800 border-slate-700 text-white">
                      <p>First Home Savings Account contributions (up to $8,000/year)</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
              <Input
                id="fhsaContribution"
                type="number"
                placeholder="$0"
                value={taxData.fhsaContribution || ""}
                onChange={(e) => updateField("fhsaContribution", Number.parseFloat(e.target.value) || 0)}
                className="h-10 bg-slate-800/50 border-slate-700 text-white placeholder:text-slate-400"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="taxesPaid" className="text-sm font-medium text-slate-200">Income Tax Already Paid</Label>
            <Input
              id="taxesPaid"
              type="number"
              placeholder="$0"
              value={taxData.taxesPaid || ""}
              onChange={(e) => updateField("taxesPaid", Number.parseFloat(e.target.value) || 0)}
              className="h-10 bg-slate-800/50 border-slate-700 text-white placeholder:text-slate-400"
            />
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

function IncomeTaxResults({ taxData }: { taxData: IncomeTaxData }) {
  const results = calculateIncomeTax(taxData)

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("en-CA", {
      style: "currency",
      currency: "CAD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value)
  }

  return (
    <Card className="bg-slate-900/50 border-slate-800/50 backdrop-blur-sm shadow-xl">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg font-semibold text-white">Tax Calculation Results</CardTitle>
        <CardDescription className="text-sm text-slate-300">Your income tax calculation</CardDescription>
      </CardHeader>
      <CardContent className="pt-0 space-y-4">
        {/* Income Summary */}
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-sm text-slate-300">Total Income</span>
            <span className="text-sm font-medium text-white">{formatCurrency(results.totalIncome)}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-slate-300">Deductions</span>
            <span className="text-sm font-medium text-white">{formatCurrency(results.totalDeductions)}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-slate-300">Taxable Income</span>
            <span className="text-sm font-medium text-white">{formatCurrency(results.taxableIncome)}</span>
          </div>
        </div>

        {/* Tax Breakdown */}
        <div className="pt-3 border-t border-slate-700 space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-sm text-slate-300">Federal Tax</span>
            <span className="text-sm font-medium text-white">{formatCurrency(results.federalTax)}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-slate-300">Provincial Tax</span>
            <span className="text-sm font-medium text-white">{formatCurrency(results.provincialTax)}</span>
          </div>
        </div>

        {/* Refund/Owed - Highlighted */}
        <div className="pt-3 border-t border-slate-700">
          <div className="flex justify-between items-center">
            <span className="text-sm text-slate-300">Taxes Paid</span>
            <span className="text-sm font-medium text-white">{formatCurrency(results.taxesPaid)}</span>
          </div>
          <div className={`flex justify-between items-center mt-2 p-3 rounded-lg ${
            results.taxesOwedOrRefund >= 0 
              ? 'bg-red-900/20 border border-red-800/50' 
              : 'bg-green-900/20 border border-green-800/50'
          }`}>
            <span className={`font-medium ${
              results.taxesOwedOrRefund >= 0 
                ? 'text-red-300' 
                : 'text-green-300'
            }`}>
              {results.taxesOwedOrRefund >= 0 ? 'Taxes Still Owed' : 'Refund'}
            </span>
            <span className={`font-bold text-lg ${
              results.taxesOwedOrRefund >= 0 
                ? 'text-red-300' 
                : 'text-green-300'
            }`}>
              {formatCurrency(Math.abs(results.taxesOwedOrRefund))}
            </span>
          </div>
        </div>

        {/* After-Tax Income - Highlighted */}
        <div className="pt-3 border-t border-slate-700">
          <div className="flex justify-between items-center p-4 bg-slate-800/30 border border-slate-600/50 rounded-lg">
            <div>
              <div className="text-sm font-medium text-slate-200">After-Tax Income</div>
              <div className="text-xs text-slate-400">Your take-home pay</div>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-white">{formatCurrency(results.afterTaxIncome)}</div>
            </div>
          </div>
        </div>

        {/* Tax Rates */}
        <div className="pt-3 border-t border-slate-700">
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center p-3 bg-slate-800/30 rounded-lg">
              <div className="text-xs text-slate-400">Average Rate</div>
              <div className="text-sm font-semibold text-white">{results.averageTaxRate.toFixed(1)}%</div>
            </div>
            <div className="text-center p-3 bg-slate-800/30 rounded-lg">
              <div className="text-xs text-slate-400">Marginal Rate</div>
              <div className="text-sm font-semibold text-white">{results.marginalTaxRate.toFixed(1)}%</div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export function IncomeTaxCalculator() {
  const [taxData, setTaxData] = useState<IncomeTaxData>({
    province: "ON",
    employmentIncome: 0,
    otherIncome: 0,
    capitalGains: 0,
    eligibleDividends: 0,
    ineligibleDividends: 0,
    selfEmploymentIncome: 0,
    rrspContribution: 0,
    fhsaContribution: 0,
    taxesPaid: 0,
  })

  return (
    <div id="calculator" className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="text-center mb-8">
        <h1 className="text-3xl md:text-4xl font-bold text-white mb-3">
          Canada Income Tax Calculator
        </h1>
        <p className="text-lg text-slate-300 max-w-2xl mx-auto">
          Calculate your income tax instantly. Get accurate estimates for federal tax, provincial tax, and see your total tax liability or refund.
        </p>
      </div>

      <div className="grid lg:grid-cols-2 gap-8 items-start">
        <div className="order-1">
          <IncomeTaxForm taxData={taxData} setTaxData={setTaxData} />
        </div>
        <div className="order-2">
          <div className="lg:sticky lg:top-8">
            <IncomeTaxResults taxData={taxData} />
          </div>
        </div>
      </div>
    </div>
  )
}
