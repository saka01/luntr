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

// 2025 Federal Tax Brackets (effective rate 14.5% for lowest bracket due to mid-year change)
const federalBrackets = [
  { limit: 57375, rate: 0.145 }, // 14.5% effective rate for 2025
  { limit: 114750, rate: 0.205 },
  { limit: 177882, rate: 0.26 },
  { limit: 253414, rate: 0.29 },
  { limit: Number.POSITIVE_INFINITY, rate: 0.33 },
]

// 2025 Provincial Tax Rates
const provincialRates: Record<string, Array<{ limit: number; rate: number }>> = {
  ON: [
    { limit: 52886, rate: 0.0505 },
    { limit: 105775, rate: 0.0915 },
    { limit: 150000, rate: 0.1116 },
    { limit: 220000, rate: 0.1216 },
    { limit: Number.POSITIVE_INFINITY, rate: 0.1316 },
  ],
  BC: [
    { limit: 49279, rate: 0.0506 },
    { limit: 98560, rate: 0.077 },
    { limit: 113158, rate: 0.105 },
    { limit: 137407, rate: 0.1229 },
    { limit: 186306, rate: 0.147 },
    { limit: 259829, rate: 0.168 },
    { limit: Number.POSITIVE_INFINITY, rate: 0.205 },
  ],
  AB: [
    { limit: 60000, rate: 0.08 }, // New 8% rate for first $60k
    { limit: 151234, rate: 0.10 },
    { limit: 181481, rate: 0.12 },
    { limit: 241974, rate: 0.13 },
    { limit: 362961, rate: 0.14 },
    { limit: Number.POSITIVE_INFINITY, rate: 0.15 },
  ],
  QC: [
    { limit: 53255, rate: 0.14 },
    { limit: 106495, rate: 0.19 },
    { limit: 129590, rate: 0.24 },
    { limit: Number.POSITIVE_INFINITY, rate: 0.2575 },
  ],
  MB: [
    { limit: 47000, rate: 0.108 },
    { limit: 100000, rate: 0.1275 },
    { limit: Number.POSITIVE_INFINITY, rate: 0.174 },
  ],
  SK: [
    { limit: 45677, rate: 0.105 },
    { limit: 130506, rate: 0.125 },
    { limit: Number.POSITIVE_INFINITY, rate: 0.145 },
  ],
  NS: [
    { limit: 30507, rate: 0.0879 },
    { limit: 61015, rate: 0.1495 },
    { limit: 93000, rate: 0.1667 },
    { limit: 150000, rate: 0.175 },
    { limit: Number.POSITIVE_INFINITY, rate: 0.21 },
  ],
  NB: [
    { limit: 51306, rate: 0.094 },
    { limit: 102614, rate: 0.14 },
    { limit: 190060, rate: 0.16 },
    { limit: Number.POSITIVE_INFINITY, rate: 0.195 },
  ],
  PE: [
    { limit: 33328, rate: 0.095 },
    { limit: 64656, rate: 0.1347 },
    { limit: 105000, rate: 0.166 },
    { limit: 140000, rate: 0.1762 },
    { limit: Number.POSITIVE_INFINITY, rate: 0.19 },
  ],
  NL: [
    { limit: 44192, rate: 0.087 },
    { limit: 88382, rate: 0.145 },
    { limit: 157792, rate: 0.158 },
    { limit: 220910, rate: 0.178 },
    { limit: 282214, rate: 0.198 },
    { limit: 564429, rate: 0.208 },
    { limit: 1128858, rate: 0.213 },
    { limit: Number.POSITIVE_INFINITY, rate: 0.218 },
  ],
  YT: [
    { limit: 50197, rate: 0.064 },
    { limit: 100392, rate: 0.09 },
    { limit: 155625, rate: 0.109 },
    { limit: 500000, rate: 0.128 },
    { limit: Number.POSITIVE_INFINITY, rate: 0.15 },
  ],
  NT: [
    { limit: 44396, rate: 0.059 },
    { limit: 88796, rate: 0.086 },
    { limit: 144362, rate: 0.122 },
    { limit: Number.POSITIVE_INFINITY, rate: 0.1405 },
  ],
  NU: [
    { limit: 46740, rate: 0.04 },
    { limit: 93480, rate: 0.07 },
    { limit: 151978, rate: 0.09 },
    { limit: Number.POSITIVE_INFINITY, rate: 0.115 },
  ],
}

const basicPersonalAmount = 16129 // 2025 federal basic personal amount (max)
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
