// Tax calculation utilities for Canadian creators

// Band midpoints for spending calculations
export const BAND_MIDPOINTS: Record<string, number> = {
  'none': 0,
  'under-500': 250,
  '500-1k': 750,
  '1k-3k': 2000,
  '3k-5k': 4000,
  '5k-10k': 7500,
  'over-10k': 12000
}

// Provincial tax rates (Ontario defaults for MVP)
export const PROVINCIAL_TAX_RATES: Record<string, Record<string, number>> = {
  'ontario': {
    'under-30k': 20,
    '30-60k': 24,
    '60-100k': 29,
    '100-150k': 33,
    'over-150k': 38
  },
  // For now, use Ontario rates for all provinces
  'british-columbia': {
    'under-30k': 20,
    '30-60k': 24,
    '60-100k': 29,
    '100-150k': 33,
    'over-150k': 38
  },
  'alberta': {
    'under-30k': 20,
    '30-60k': 24,
    '60-100k': 29,
    '100-150k': 33,
    'over-150k': 38
  },
  'quebec': {
    'under-30k': 20,
    '30-60k': 24,
    '60-100k': 29,
    '100-150k': 33,
    'over-150k': 38
  },
  'manitoba': {
    'under-30k': 20,
    '30-60k': 24,
    '60-100k': 29,
    '100-150k': 33,
    'over-150k': 38
  },
  'saskatchewan': {
    'under-30k': 20,
    '30-60k': 24,
    '60-100k': 29,
    '100-150k': 33,
    'over-150k': 38
  },
  'nova-scotia': {
    'under-30k': 20,
    '30-60k': 24,
    '60-100k': 29,
    '100-150k': 33,
    'over-150k': 38
  },
  'new-brunswick': {
    'under-30k': 20,
    '30-60k': 24,
    '60-100k': 29,
    '100-150k': 33,
    'over-150k': 38
  },
  'newfoundland': {
    'under-30k': 20,
    '30-60k': 24,
    '60-100k': 29,
    '100-150k': 33,
    'over-150k': 38
  },
  'prince-edward-island': {
    'under-30k': 20,
    '30-60k': 24,
    '60-100k': 29,
    '100-150k': 33,
    'over-150k': 38
  },
  'northwest-territories': {
    'under-30k': 20,
    '30-60k': 24,
    '60-100k': 29,
    '100-150k': 33,
    'over-150k': 38
  },
  'nunavut': {
    'under-30k': 20,
    '30-60k': 24,
    '60-100k': 29,
    '100-150k': 33,
    'over-150k': 38
  },
  'yukon': {
    'under-30k': 20,
    '30-60k': 24,
    '60-100k': 29,
    '100-150k': 33,
    'over-150k': 38
  }
}

// Category rules for deductible basis and business use
export const CATEGORY_RULES: Record<string, { deductiblePercent: number; businessUsePercent: number }> = {
  'equipment-gear': { deductiblePercent: 100, businessUsePercent: 100 },
  'software-subscriptions': { deductiblePercent: 100, businessUsePercent: 100 },
  'travel': { deductiblePercent: 100, businessUsePercent: 100 },
  'vehicle': { deductiblePercent: 100, businessUsePercent: 20 },
  'phone-internet': { deductiblePercent: 100, businessUsePercent: 20 },
  'home-office': { deductiblePercent: 100, businessUsePercent: 20 },
  'meals-clients': { deductiblePercent: 50, businessUsePercent: 100 }, // 50% statutory limit
  'professional-services': { deductiblePercent: 100, businessUsePercent: 100 },
  'advertising-marketing': { deductiblePercent: 100, businessUsePercent: 100 },
  'education-courses': { deductiblePercent: 100, businessUsePercent: 100 },
  'contractors-editors': { deductiblePercent: 100, businessUsePercent: 100 }
}

export interface DeductionCalculation {
  category: string
  spendingBand: string
  bandMidpoint: number
  deductibleAmount: number
  taxSaved: number
  businessUsePercent: number
  deductiblePercent: number
}

export interface TaxCalculationResult {
  deductions: DeductionCalculation[]
  totalDeductible: number
  totalTaxSaved: number
  marginalTaxRate: number
}

export function calculateTaxDeductions(formData: Record<string, any>): TaxCalculationResult {
  const province = formData.province || 'ontario'
  const incomeBracket = formData.incomeBracket || 'under-30k'
  const expenseCategories = formData.expenseCategories || []
  
  // Get marginal tax rate
  const marginalTaxRate = PROVINCIAL_TAX_RATES[province]?.[incomeBracket] || 26
  
  const deductions: DeductionCalculation[] = []
  let totalDeductible = 0
  let totalTaxSaved = 0
  
  expenseCategories.forEach((category: string) => {
    const spendingBand = formData[`spending_${category}`] || 'none'
    const bandMidpoint = BAND_MIDPOINTS[spendingBand] || 0
    const categoryRule = CATEGORY_RULES[category] || { deductiblePercent: 100, businessUsePercent: 100 }
    
    // Calculate deductible amount
    const deductibleAmount = bandMidpoint * (categoryRule.deductiblePercent / 100) * (categoryRule.businessUsePercent / 100)
    
    // Calculate tax saved
    const taxSaved = deductibleAmount * (marginalTaxRate / 100)
    
    deductions.push({
      category,
      spendingBand,
      bandMidpoint,
      deductibleAmount,
      taxSaved,
      businessUsePercent: categoryRule.businessUsePercent,
      deductiblePercent: categoryRule.deductiblePercent
    })
    
    totalDeductible += deductibleAmount
    totalTaxSaved += taxSaved
  })

  return {
    deductions,
    totalDeductible,
    totalTaxSaved,
    marginalTaxRate
  }
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-CA', {
    style: 'currency',
    currency: 'CAD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(amount)
}

export function getCategoryDisplayName(category: string): string {
  const displayNames: Record<string, string> = {
    'equipment-gear': 'Equipment/Gear',
    'software-subscriptions': 'Software & Subscriptions',
    'travel': 'Travel',
    'vehicle': 'Vehicle',
    'phone-internet': 'Phone/Internet',
    'home-office': 'Home Office',
    'meals-clients': 'Meals with clients/collaborators',
    'professional-services': 'Professional Services',
    'advertising-marketing': 'Advertising/Marketing',
    'education-courses': 'Education/Courses',
    'contractors-editors': 'Contractors/Editors'
  }
  return displayNames[category] || category
}

export function getCategoryExamples(category: string): string[] {
  const examples: Record<string, string[]> = {
    'equipment-gear': ['Cameras', 'Lenses', 'Tripods', 'Lighting', 'Microphones', 'Computer hardware'],
    'software-subscriptions': ['Adobe Creative Suite', 'Notion', 'Canva Pro', 'Cloud storage', 'Social media tools'],
    'travel': ['Flights to shoots', 'Hotel stays', 'Business trips', 'Conference travel'],
    'vehicle': ['Gas', 'Insurance', 'Lease payments', 'Maintenance', 'Business mileage'],
    'phone-internet': ['Phone bills', 'Internet service', 'Mobile plans', 'Data plans'],
    'home-office': ['Rent percentage', 'Utilities', 'Office supplies', 'Property taxes'],
    'meals-clients': ['Client dinners', 'Collaboration meals', 'Business lunches', 'Entertainment'],
    'professional-services': ['Accounting fees', 'Legal services', 'Tax preparation', 'Consulting'],
    'advertising-marketing': ['Online ads', 'Business cards', 'Website costs', 'Promotional materials'],
    'education-courses': ['Online courses', 'Workshops', 'Conferences', 'Training programs'],
    'contractors-editors': ['Video editors', 'Graphic designers', 'Writers', 'Contractors']
  }
  return examples[category] || []
}

// T2125 Tax calculation for self-employed individuals
export interface TaxData {
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

export interface TaxResults {
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

// 2025 Federal Tax Brackets
const federalBrackets = [
  { limit: 57375, rate: 0.145 },
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
    { limit: 60000, rate: 0.08 },
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

const federalBPA = 16129 // 2025 federal basic personal amount
const federalCreditRate = 0.145 // 2025 effective credit rate

// 2025 CPP rates and maximums
const cppRate = 0.0595 // 5.95% for 2025
const cppMaxEarnings = 68500 // Maximum pensionable earnings for 2025
const cppBasicExemption = 3500 // Basic exemption amount

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

function calculateCPP(selfEmploymentIncome: number): number {
  // CPP calculation for self-employed individuals
  const cppEarnings = Math.max(0, Math.min(selfEmploymentIncome, cppMaxEarnings) - cppBasicExemption)
  return Math.max(0, cppEarnings * cppRate)
}

export function calculateTax(data: TaxData): TaxResults {
  // Calculate capital gains with 2025 rules
  const capitalGainsIncluded = data.capitalGains <= 250000 
    ? data.capitalGains * 0.5  // 50% inclusion rate up to $250k
    : 250000 * 0.5 + (data.capitalGains - 250000) * (2/3)  // 2/3 inclusion rate over $250k

  // Calculate business expenses
  const vehicleDeduction = (data.vehicleExpense * data.vehicleBusinessUse) / 100
  const homeOfficeDeduction = (data.homeOfficeExpense * data.homeOfficeBusinessUse) / 100
  const mealsDeduction = data.mealsExpense * 0.5 // 50% statutory limit
  
  const businessExpenses = vehicleDeduction + homeOfficeDeduction + mealsDeduction + 
    data.advertisingExpense + data.softwareExpense + data.travelExpense + data.professionalFeesExpense

  // Calculate net business income
  const netBusinessIncome = Math.max(0, data.selfEmploymentIncome - businessExpenses)

  // Calculate total income
  const totalIncome = data.employmentIncome + netBusinessIncome + data.otherIncome +
    capitalGainsIncluded + data.eligibleDividends * 1.38 + data.ineligibleDividends * 1.15

  // Calculate total deductions
  const totalDeductions = data.rrspContribution + data.fhsaContribution

  // Calculate net income (before BPA credit)
  const netIncome = totalIncome - totalDeductions

  // Calculate CPP contributions
  const cppContributions = calculateCPP(netBusinessIncome)

  // Calculate federal tax before credits
  const federalTaxBeforeCredits = calculateTaxForBrackets(netIncome, federalBrackets)

  // Apply federal BPA credit
  const federalTax = Math.max(0, federalTaxBeforeCredits - federalBPA * federalCreditRate)

  // Calculate provincial tax
  const provincialBrackets = provincialRates[data.province] || provincialRates.ON
  const provincialTaxBeforeCredits = calculateTaxForBrackets(netIncome, provincialBrackets)
  
  // Apply provincial BPA credit (varies by province)
  const provincialBPAs: Record<string, { amount: number; rate: number }> = {
    ON: { amount: 12747, rate: 0.0505 },
    BC: { amount: 12747, rate: 0.0506 },
    AB: { amount: 12747, rate: 0.08 },
    QC: { amount: 12747, rate: 0.14 },
    MB: { amount: 15780, rate: 0.108 },
    SK: { amount: 12747, rate: 0.105 },
    NS: { amount: 11744, rate: 0.0879 },
    NB: { amount: 12747, rate: 0.094 },
    PE: { amount: 14250, rate: 0.095 },
    NL: { amount: 12747, rate: 0.087 },
    YT: { amount: 12747, rate: 0.064 },
    NT: { amount: 12747, rate: 0.059 },
    NU: { amount: 12747, rate: 0.04 },
  }
  
  const provincialBPA = provincialBPAs[data.province] || provincialBPAs.ON
  const provincialTax = Math.max(0, provincialTaxBeforeCredits - provincialBPA.amount * provincialBPA.rate)

  // Apply dividend tax credits
  const eligibleDividendCredit = data.eligibleDividends * 0.15 // Federal dividend tax credit
  const ineligibleDividendCredit = data.ineligibleDividends * 0.10 // Federal dividend tax credit
  
  const federalTaxWithCredits = Math.max(0, federalTax - eligibleDividendCredit - ineligibleDividendCredit)

  // Total tax including CPP contributions
  const totalTax = federalTaxWithCredits + provincialTax + cppContributions

  // After-tax income
  const afterTaxIncome = totalIncome - totalTax - totalDeductions

  // Tax rates
  const averageTaxRate = totalIncome > 0 ? (totalTax / totalIncome) * 100 : 0

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
    cppContributions,
    totalTax,
    afterTaxIncome,
    averageTaxRate,
    marginalTaxRate,
    businessExpenses,
    netBusinessIncome
  }
}