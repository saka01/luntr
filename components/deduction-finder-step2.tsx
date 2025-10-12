'use client'

import { useState, useEffect, useMemo } from 'react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import { ArrowRight, CheckCircle, DollarSign } from 'lucide-react'
import { calculateTaxDeductions, formatCurrency, getCategoryDisplayName, getCategoryExamples } from '@/lib/tax-calculations'

interface Step2Props {
  formData: Record<string, any>
  onNext: (selectedDeductions: Set<string>, totalValue: { totalDeductible: number; totalTaxSaved: number }) => void
  onRestart?: () => void
}

export function DeductionFinderStep2({ formData, onNext, onRestart }: Step2Props) {
  const [selectedDeductions, setSelectedDeductions] = useState<Set<string>>(new Set())
  
  // Calculate tax deductions based on form data
  const calculationResult = useMemo(() => {
    return calculateTaxDeductions(formData)
  }, [formData])

  // Filter deductions to only show those with spending > 0
  const relevantDeductions = useMemo(() => {
    return calculationResult.deductions.filter(deduction => deduction.deductibleAmount > 0)
  }, [calculationResult])

  // Calculate totals for selected deductions
  const selectedTotals = useMemo(() => {
    let totalDeductible = 0
    let totalTaxSaved = 0
    
    selectedDeductions.forEach(category => {
      const deduction = relevantDeductions.find(d => d.category === category)
      if (deduction) {
        totalDeductible += deduction.deductibleAmount
        totalTaxSaved += deduction.taxSaved
      }
    })
    
    return { totalDeductible, totalTaxSaved }
  }, [selectedDeductions, relevantDeductions])

  const handleDeductionToggle = (category: string) => {
    setSelectedDeductions(prev => {
      const newSet = new Set(prev)
      if (newSet.has(category)) {
        newSet.delete(category)
      } else {
        newSet.add(category)
      }
      return newSet
    })
  }

  const handleNext = () => {
    onNext(selectedDeductions, selectedTotals)
  }

  return (
    <div className="w-full">
      <div className="animate-fade-in">
        <Card className="p-3 sm:p-4 md:p-6 lg:p-8 bg-card/80 border-border/50 backdrop-blur-sm shadow-xl">
          <div className="space-y-6 sm:space-y-8">
            {/* Header */}
            <div className="text-center space-y-2 sm:space-y-3">
        
              <h2 className="text-2xl sm:text-2xl md:text-2xl lg:text-2xl xl:text-3xl font-bold text-foreground leading-tight px-2">
                You could deduct approximately <span className="text-primary">{formatCurrency(calculationResult.totalDeductible)}</span> this year
              </h2>
              <p className="text-sm sm:text-sm md:text-base lg:text-lg text-muted-foreground max-w-2xl mx-auto px-4 leading-relaxed">
                Estimated tax saved: {formatCurrency(calculationResult.totalTaxSaved)} (based on your bracket and assumed 20% business-use for mixed categories)
              </p>
            </div>

            {/* Deductions by Category */}
            <div className="space-y-6">
              <Accordion type="multiple" className="w-full">
                {relevantDeductions.map((deduction) => (
                  <AccordionItem key={deduction.category} value={deduction.category} className="border-border">
                    <AccordionTrigger className="text-sm sm:text-base md:text-lg font-semibold text-foreground hover:no-underline">
                      {getCategoryDisplayName(deduction.category)}
                    </AccordionTrigger>
                    <AccordionContent className="space-y-4 pt-4">
                      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-3 sm:p-4 rounded-lg border border-border hover:bg-muted/50 transition-colors gap-3 sm:gap-4">
                        <div className="flex items-start sm:items-center space-x-2 sm:space-x-3 md:space-x-4 flex-1 min-w-0">
                          <input
                            type="checkbox"
                            id={deduction.category}
                            checked={selectedDeductions.has(deduction.category)}
                            onChange={() => handleDeductionToggle(deduction.category)}
                            className="w-4 h-4 sm:w-5 sm:h-5 text-primary bg-card border-border rounded focus:ring-primary focus:ring-2 flex-shrink-0 mt-0.5 sm:mt-0"
                          />
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center space-x-2 mb-1">
                              <label
                                htmlFor={deduction.category}
                                className="text-sm sm:text-base md:text-lg font-medium text-foreground cursor-pointer leading-tight"
                              >
                                {getCategoryDisplayName(deduction.category)}
                              </label>
                            </div>
                            <p className="text-xs text-muted-foreground leading-relaxed">
                              Examples you can claim: {getCategoryExamples(deduction.category).join(', ')}
                            </p>
                          </div>
                          
                        </div>
                        <div className="text-left sm:text-right flex-shrink-0">
                          <div className="text-sm sm:text-base md:text-lg font-semibold text-foreground">
                            {formatCurrency(deduction.deductibleAmount)}
                          </div>
                          <div className="text-xs sm:text-sm text-muted-foreground">
                            deductible
                          </div>
                        </div>

                      </div>
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>

            {/* Running Total */}
            {selectedDeductions.size > 0 && (
              <div className="bg-gradient-to-r from-primary/10 to-secondary/10 border border-primary/20 rounded-xl p-3 sm:p-4 md:p-6 text-center">
                <div className="flex items-center justify-center space-x-2 mb-2">
                  <DollarSign className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 text-primary" />
                  <h3 className="text-sm sm:text-base md:text-lg lg:text-xl xl:text-2xl font-bold text-foreground leading-tight">
                    Selected deductions: {formatCurrency(selectedTotals.totalDeductible)}
                  </h3>
                </div>
                <p className="text-xs sm:text-sm md:text-base text-muted-foreground">
                  Potential tax savings: {formatCurrency(selectedTotals.totalTaxSaved)}
                </p>
              </div>
            )}

            {/* Microcopy */}
            <div className="text-center pt-4 border-t border-border">
              <p className="text-xs text-muted-foreground max-w-2xl mx-auto">
                This estimate uses your spending bands, province, income bracket, and a 20% business-use assumption for mixed-use (vehicle, phone, home office). 
                Meals are 50% deductible by rule. For exact results, connect an account in Tallo.
              </p>
            </div>

            {/* CTA Button */}
            <div className="text-center pt-3 sm:pt-4 md:pt-6">
              <div className="flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-3 md:gap-4">
                {onRestart && (
                  <Button
                    onClick={onRestart}
                    variant="ghost"
                    className="text-muted-foreground hover:text-foreground text-xs sm:text-sm order-2 sm:order-1"
                  >
                    Reset
                  </Button>
                )}
                {/* Next button on desktop/tablet - hidden on mobile and sm */}
                <Button
                  onClick={handleNext}
                  className="hidden md:flex px-4 sm:px-6 md:px-8 py-2 sm:py-3 md:py-4 text-xs sm:text-sm md:text-base lg:text-lg bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 text-primary-foreground shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02] order-1 sm:order-2"
                >
                  See How Tallo Can Help
                  <ArrowRight className="w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5 ml-1 sm:ml-2" />
                </Button>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  )
}
