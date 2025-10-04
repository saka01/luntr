import type { TaxData } from "@/components/tax-calculator"

type TaxResults = {
  totalIncome: number
  totalDeductions: number
  taxableIncome: number
  federalTax: number
  provincialTax: number
  cppContributions: number
  totalTax: number
  afterTaxIncome: number
  averageTaxRate: number
  marginalTaxRate: number
  businessExpenses: number
  netBusinessIncome: number
}

// 2024 Federal Tax Brackets
const federalBrackets = [
  { limit: 55867, rate: 0.15 },
  { limit: 111733, rate: 0.205 },
  { limit: 173205, rate: 0.26 },
  { limit: 246752, rate: 0.29 },
  { limit: Number.POSITIVE_INFINITY, rate: 0.33 },
]

// 2024 Provincial Tax Rates (simplified - using Ontario as example)
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
const cppRate = 0.119 // Combined employee + employer rate for self-employed
const cppMaxEarnings = 68500
const cppExemption = 3500

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

export function calculateTax(data: TaxData): TaxResults {
  // Calculate business expenses
  const vehicleDeduction = (data.vehicleExpense * data.vehicleBusinessUse) / 100
  const homeOfficeDeduction = (data.homeOfficeExpense * data.homeOfficeBusinessUse) / 100
  const mealsDeduction = data.mealsExpense * 0.5 // CRA 50% rule

  const businessExpenses =
    vehicleDeduction +
    homeOfficeDeduction +
    mealsDeduction +
    data.advertisingExpense +
    data.softwareExpense +
    data.travelExpense +
    data.professionalFeesExpense

  const netBusinessIncome = Math.max(0, data.selfEmploymentIncome - businessExpenses)

  // Calculate total income
  const totalIncome =
    netBusinessIncome +
    data.employmentIncome +
    data.capitalGains * 0.5 + // 50% inclusion rate for capital gains
    data.eligibleDividends * 1.38 + // Gross-up for eligible dividends
    data.ineligibleDividends * 1.15 + // Gross-up for ineligible dividends
    data.otherIncome

  // Calculate total deductions
  const totalDeductions = data.rrspContribution + data.fhsaContribution

  // Calculate taxable income
  const taxableIncome = Math.max(0, totalIncome - totalDeductions - basicPersonalAmount)

  // Calculate federal tax
  const federalTax = calculateTaxForBrackets(taxableIncome, federalBrackets)

  // Calculate provincial tax
  const provincialBrackets = provincialRates[data.province] || provincialRates.ON
  const provincialTax = calculateTaxForBrackets(taxableIncome, provincialBrackets)

  // Calculate CPP contributions (self-employed pay both portions)
  const cppEarnings = Math.min(netBusinessIncome, cppMaxEarnings) - cppExemption
  const cppContributions = Math.max(0, cppEarnings * cppRate)

  // Total tax
  const totalTax = federalTax + provincialTax + cppContributions

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
    cppContributions,
    totalTax,
    afterTaxIncome,
    averageTaxRate,
    marginalTaxRate,
    businessExpenses,
    netBusinessIncome,
  }
}
