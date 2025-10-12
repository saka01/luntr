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