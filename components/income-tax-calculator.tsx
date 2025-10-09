"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { HelpCircle } from "lucide-react"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { motion } from "framer-motion"

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
  cppPremiums: number
  eiPremiums: number
  totalTax: number
  afterTaxIncome: number
  averageTaxRate: number
  marginalTaxRate: number
  taxesPaid: number
  taxesOwedOrRefund: number
}

// 2025 Federal Tax Brackets
const federalBrackets = [
  { limit: 55867, rate: 0.15 },
  { limit: 111733, rate: 0.205 },
  { limit: 173205, rate: 0.26 },
  { limit: 246752, rate: 0.29 },
  { limit: Number.POSITIVE_INFINITY, rate: 0.33 },
]

// 2025 Provincial Tax Rates
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

const federalBPA = 16129 // 2025 federal basic personal amount
const federalCreditRate = 0.145 // 2025 effective credit rate

// 2025 CPP and EI rates and maximums
const cppRate = 0.0595 // 5.95% for 2025
const cppMaxEarnings = 68500 // Maximum pensionable earnings for 2025
const cppBasicExemption = 3500 // Basic exemption amount

const eiRate = 0.0166 // 1.66% for 2025
const eiMaxEarnings = 63100 // Maximum insurable earnings for 2025

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

function calculateCPPAndEI(employmentIncome: number, selfEmploymentIncome: number) {
  // Calculate total employment income for CPP/EI purposes
  const totalEmploymentIncome = employmentIncome + selfEmploymentIncome
  
  // CPP calculation
  const cppEarnings = Math.max(0, Math.min(totalEmploymentIncome, cppMaxEarnings) - cppBasicExemption)
  const cppPremiums = Math.max(0, cppEarnings * cppRate)
  
  // EI calculation (only on employment income, not self-employment)
  const eiEarnings = Math.min(employmentIncome, eiMaxEarnings)
  const eiPremiums = eiEarnings * eiRate
  
  return { cppPremiums, eiPremiums }
}

function calculateIncomeTax(data: IncomeTaxData): TaxResults {
  // Calculate capital gains with 2024/2025 rules
  const capitalGainsIncluded = data.capitalGains <= 250000 
    ? data.capitalGains * 0.5  // 50% inclusion rate up to $250k
    : 250000 * 0.5 + (data.capitalGains - 250000) * (2/3)  // 2/3 inclusion rate over $250k

  // Calculate total income (only income sources, no self-employment or business deductions)
  const totalIncome =
    data.employmentIncome +
    data.selfEmploymentIncome +
    data.otherIncome +
    capitalGainsIncluded +
    data.eligibleDividends * 1.38 + // Gross-up for eligible dividends
    data.ineligibleDividends * 1.15 // Gross-up for ineligible dividends

  // Calculate total deductions
  const totalDeductions = data.rrspContribution + data.fhsaContribution

  // Calculate net income (before BPA credit)
  const netIncome = totalIncome - totalDeductions

  // Calculate CPP and EI premiums
  const { cppPremiums, eiPremiums } = calculateCPPAndEI(data.employmentIncome, data.selfEmploymentIncome)

  // Calculate federal tax before credits
  const federalTaxBeforeCredits = calculateTaxForBrackets(netIncome, federalBrackets)

  // Apply federal BPA credit
  const federalTax = Math.max(0, federalTaxBeforeCredits - federalBPA * federalCreditRate)

  // Calculate provincial tax
  const provincialBrackets = provincialRates[data.province] || provincialRates.ON
  const provincialTaxBeforeCredits = calculateTaxForBrackets(netIncome, provincialBrackets)
  
  // Apply provincial BPA credit (Ontario: $12,747 at 5.05%)
  const provincialBPA = 12747
  const provincialCreditRate = 0.0505
  const provincialTax = Math.max(0, provincialTaxBeforeCredits - provincialBPA * provincialCreditRate)

  // Total tax including CPP and EI premiums
  const totalTax = federalTax + provincialTax + cppPremiums + eiPremiums

  // Taxes owed or refund
  const taxesOwedOrRefund = totalTax - data.taxesPaid

  // Apply dividend tax credits
  const eligibleDividendCredit = data.eligibleDividends * 0.15 // Federal dividend tax credit
  const ineligibleDividendCredit = data.ineligibleDividends * 0.10 // Federal dividend tax credit
  
  const federalTaxWithCredits = Math.max(0, federalTax - eligibleDividendCredit - ineligibleDividendCredit)

  // After-tax income
  const afterTaxIncome = totalIncome - (federalTaxWithCredits + provincialTax + cppPremiums + eiPremiums) - totalDeductions

  // Tax rates
  const totalTaxWithCredits = federalTaxWithCredits + provincialTax + cppPremiums + eiPremiums
  const averageTaxRate = totalIncome > 0 ? (totalTaxWithCredits / totalIncome) * 100 : 0

  // Marginal rate (simplified - top bracket rate)
  let marginalTaxRate = 0
  for (const bracket of federalBrackets) {
    if (netIncome <= bracket.limit) {
      marginalTaxRate = bracket.rate * 100
      break
    }
  }
  for (const bracket of provincialBrackets) {
    if (netIncome <= bracket.limit) {
      marginalTaxRate += bracket.rate * 100
      break
    }
  }

  return {
    totalIncome,
    totalDeductions,
    taxableIncome: netIncome,
    federalTax: federalTaxWithCredits,
    provincialTax,
    cppPremiums,
    eiPremiums,
    totalTax: totalTaxWithCredits,
    afterTaxIncome,
    averageTaxRate,
    marginalTaxRate,
    taxesPaid: data.taxesPaid,
    taxesOwedOrRefund: totalTaxWithCredits - data.taxesPaid,
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
      <Card className="bg-card/50 border-border/50 backdrop-blur-sm shadow-xl py-6">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg font-semibold text-card-foreground">Income Sources</CardTitle>
          <CardDescription className="text-sm text-muted-foreground">Enter all your income for the year</CardDescription>
        </CardHeader>
        <CardContent className="pt-0 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Label htmlFor="employmentIncome" className="text-sm font-medium text-card-foreground">Employment Income *</Label>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <HelpCircle className="h-3.5 w-3.5 text-muted-foreground cursor-help" />
                    </TooltipTrigger>
                    <TooltipContent className="max-w-xs bg-popover border-border text-popover-foreground">
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
                className="h-10 bg-input/50 border-border text-foreground placeholder:text-muted-foreground [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none [-moz-appearance:textfield]"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="selfEmploymentIncome" className="text-sm font-medium text-card-foreground">Self-Employment Income</Label>
              <Input
                id="selfEmploymentIncome"
                type="number"
                placeholder="$0"
                value={taxData.selfEmploymentIncome || ""}
                onChange={(e) => updateField("selfEmploymentIncome", Number.parseFloat(e.target.value) || 0)}
                className="h-10 bg-input/50 border-border text-foreground placeholder:text-muted-foreground [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none [-moz-appearance:textfield]"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="otherIncome" className="text-sm font-medium text-card-foreground">Other Income</Label>
              <Input
                id="otherIncome"
                type="number"
                placeholder="$0"
                value={taxData.otherIncome || ""}
                onChange={(e) => updateField("otherIncome", Number.parseFloat(e.target.value) || 0)}
                className="h-10 bg-input/50 border-border text-foreground placeholder:text-muted-foreground [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none [-moz-appearance:textfield]"
              />
            </div>
          </div>
            <hr className="border-border" />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="capitalGains" className="text-sm font-medium text-card-foreground">Capital Gains</Label>
              <Input
                id="capitalGains"
                type="number"
                placeholder="$0"
                value={taxData.capitalGains || ""}
                onChange={(e) => updateField("capitalGains", Number.parseFloat(e.target.value) || 0)}
                className="h-10 bg-input/50 border-border text-foreground placeholder:text-muted-foreground [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none [-moz-appearance:textfield]"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="eligibleDividends" className="text-sm font-medium text-card-foreground">Eligible Dividends</Label>
              <Input
                id="eligibleDividends"
                type="number"
                placeholder="$0"
                value={taxData.eligibleDividends || ""}
                onChange={(e) => updateField("eligibleDividends", Number.parseFloat(e.target.value) || 0)}
                className="h-10 bg-input/50 border-border text-foreground placeholder:text-muted-foreground [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none [-moz-appearance:textfield]"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="ineligibleDividends" className="text-sm font-medium text-card-foreground">Ineligible Dividends</Label>
            <Input
              id="ineligibleDividends"
              type="number"
              placeholder="$0"
              value={taxData.ineligibleDividends || ""}
              onChange={(e) => updateField("ineligibleDividends", Number.parseFloat(e.target.value) || 0)}
              className="h-10 bg-input/50 border-border text-foreground placeholder:text-muted-foreground [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none [-moz-appearance:textfield]"
            />
          </div>
        </CardContent>
      </Card>

      {/* Deductions & Taxes - Consolidated */}
      <Card className="bg-card/50 border-border/50 backdrop-blur-sm shadow-xl py-6">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg font-semibold text-card-foreground">Deductions & Taxes Paid</CardTitle>
          <CardDescription className="text-sm text-muted-foreground">Registered savings and taxes already paid</CardDescription>
        </CardHeader>
        <CardContent className="pt-0 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Label htmlFor="rrspContribution" className="text-sm font-medium text-card-foreground">RRSP Contribution</Label>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <HelpCircle className="h-3.5 w-3.5 text-muted-foreground cursor-help" />
                    </TooltipTrigger>
                    <TooltipContent className="max-w-xs bg-popover border-border text-popover-foreground">
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
                className="h-10 bg-input/50 border-border text-foreground placeholder:text-muted-foreground [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none [-moz-appearance:textfield]"
              />
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Label htmlFor="fhsaContribution" className="text-sm font-medium text-card-foreground">FHSA Contribution</Label>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <HelpCircle className="h-3.5 w-3.5 text-muted-foreground cursor-help" />
                    </TooltipTrigger>
                    <TooltipContent className="max-w-xs bg-popover border-border text-popover-foreground">
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
                className="h-10 bg-input/50 border-border text-foreground placeholder:text-muted-foreground [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none [-moz-appearance:textfield]"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="taxesPaid" className="text-sm font-medium text-card-foreground">Income Tax Already Paid</Label>
            <Input
              id="taxesPaid"
              type="number"
              placeholder="$0"
              value={taxData.taxesPaid || ""}
              onChange={(e) => updateField("taxesPaid", Number.parseFloat(e.target.value) || 0)}
              className="h-10 bg-input/50 border-border text-foreground placeholder:text-muted-foreground [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none [-moz-appearance:textfield]"
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
    // Use simple string formatting to avoid hydration issues
    return `$${Math.round(value).toLocaleString()}`
  }

  return (
    <Card className="bg-card/50 border-border/50 backdrop-blur-sm shadow-xl">
      <CardContent className="p-6 space-y-4">
        {/* After-Tax Income - Highlighted at top - Only show if employment income is filled */}
        {taxData.employmentIncome > 0 && (
          <div className="flex justify-between items-center p-4 bg-green-300/20 border border-green-300/30 rounded-lg animate-in fade-in-0 slide-in-from-top-2 duration-300">
            <div>
              <div className="text-sm font-medium text-green-700 dark:text-green-300">After-Tax Income</div>
              <div className="text-xs text-muted-foreground">Your take-home pay</div>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-green-700 dark:text-green-300">{formatCurrency(results.afterTaxIncome)}</div>
            </div>
          </div>
        )}

        {/* Income Summary */}
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">Total Income</span>
            <span className="text-sm font-medium text-card-foreground">{formatCurrency(results.totalIncome)}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">Deductions</span>
            <span className="text-sm font-medium text-card-foreground">{formatCurrency(results.totalDeductions)}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">Taxable Income</span>
            <span className="text-sm font-medium text-card-foreground">{formatCurrency(results.taxableIncome)}</span>
          </div>
        </div>

        {/* Tax Breakdown */}
        <div className="pt-3 border-t border-border space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">Federal Tax</span>
            <span className="text-sm font-medium text-card-foreground">{formatCurrency(results.federalTax)}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">Provincial Tax</span>
            <span className="text-sm font-medium text-card-foreground">{formatCurrency(results.provincialTax)}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">CPP/EI Premiums</span>
            <span className="text-sm font-medium text-card-foreground">{formatCurrency(results.cppPremiums + results.eiPremiums)}</span>
          </div>
        </div>

        {/* Tax Rates */}
        <div className="pt-3 border-t border-border space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">Average Tax Rate</span>
            <span className="text-sm font-medium text-card-foreground">{results.averageTaxRate.toFixed(1)}%</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">Marginal Tax Rate</span>
            <span className="text-sm font-medium text-card-foreground">{results.marginalTaxRate.toFixed(1)}%</span>
          </div>
        </div>

        {/* Refund/Owed - Highlighted - Only show if employment income is filled */}
        {taxData.employmentIncome > 0 && (
          <div className="pt-3 border-t border-border animate-in fade-in-0 slide-in-from-bottom-2 duration-300">
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Taxes Paid</span>
              <span className="text-sm font-medium text-card-foreground">{formatCurrency(results.taxesPaid)}</span>
            </div>
            <div className={`flex justify-between items-center mt-2 p-3 rounded-lg ${
              results.taxesOwedOrRefund >= 0 
                ? 'bg-red-500/10 border border-red-500/20' 
                : 'bg-green-300/20 border border-green-300/30'
            }`}>
              <span className={`font-medium ${
                results.taxesOwedOrRefund >= 0 
                  ? 'text-red-600 dark:text-red-400' 
                  : 'text-green-700 dark:text-green-300'
              }`}>
                {results.taxesOwedOrRefund >= 0 ? 'Taxes owed to CRA' : 'Refund from CRA'}
              </span>
              <span className={`font-bold text-lg ${
                results.taxesOwedOrRefund >= 0 
                  ? 'text-red-600 dark:text-red-400' 
                  : 'text-green-700 dark:text-green-300'
              }`}>
                {formatCurrency(Math.abs(results.taxesOwedOrRefund))}
              </span>
            </div>
          </div>
        )}


        {/* Promotional CTA Section */}
        <div className="pt-4 p-6 bg-primary/10 border border-primary/20 rounded-lg">
          <h3 className="text-xl text-primary leading-tight mb-3 font-extrabold">
            You might be over paying $450 - $2,670* in taxes.           
          </h3>
          <p className="text-sm text-muted-foreground leading-relaxed mb-4">
          Find the CRA deductions most people miss in 2 minutes.          </p>
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="flex justify-start"
          >
            <a href="/deduction-finder">
              <div className="group cursor-pointer border border-border bg-card gap-2 h-[56px] sm:h-[64px] flex items-center p-[8px] sm:p-[11px] rounded-full hover:bg-card/80 transition-all duration-300">
                <div className="border border-border bg-primary h-[40px] sm:h-[43px] rounded-full flex items-center justify-center text-secondary-foreground px-4 sm:px-6">
                  <p className="font-medium tracking-tight flex items-center gap-2 sm:gap-3 justify-center text-sm sm:text-base">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="18"
                      height="18"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="lucide lucide-search sm:w-5 sm:h-5"
                    >
                      <circle cx="11" cy="11" r="8"></circle>
                      <path d="m21 21-4.35-4.35"></path>
                    </svg>
                    <span className="hidden sm:inline">Find My Deductions</span>
                    <span className="sm:hidden">Find Deductions</span>
                  </p>
                </div>
                <div className="text-muted-foreground group-hover:ml-2 sm:group-hover:ml-4 ease-in-out transition-all size-[20px] sm:size-[24px] flex items-center justify-center rounded-full border-2 border-border">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="12"
                    height="12"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="lucide lucide-arrow-right group-hover:rotate-180 ease-in-out transition-all sm:w-3.5 sm:h-3.5"
                  >
                    <path d="M5 12h14"></path>
                    <path d="m12 5 7 7-7 7"></path>
                  </svg>
                </div>
              </div>
            </a>
          </motion.div>
          <p className="text-xs text-muted-foreground leading-relaxed mt-3 italic">
            *Based on average savings for similar income profiles.
          </p>
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
        <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-3">
          Canada Income Tax Calculator
        </h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
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
