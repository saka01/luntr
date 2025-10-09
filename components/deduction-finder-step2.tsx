'use client'

import { useState, useEffect, useMemo } from 'react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import { ArrowRight, CheckCircle, DollarSign } from 'lucide-react'

interface Deduction {
  id: string
  name: string
  description: string
  category: string
  minValue: number
  maxValue: number
  icon: string
}

interface Step2Props {
  formData: Record<string, any>
  onNext: (selectedDeductions: Set<string>, totalValue: { min: number; max: number }) => void
  onRestart?: () => void
}

const deductionCategories = {
  '💻 Software & Subscriptions': [
    {
      id: 'software-subscriptions',
      name: 'Software & Subscriptions',
      description: 'Business software, cloud services, and online tools',
      minValue: 1200,
      maxValue: 3600,
      icon: '💻'
    },
    {
      id: 'professional-memberships',
      name: 'Professional Memberships',
      description: 'Industry associations, certifications, and licenses',
      minValue: 400,
      maxValue: 1200,
      icon: '🎓'
    }
  ],
  '🚗 Vehicle & Travel': [
    {
      id: 'vehicle-expenses',
      name: 'Vehicle Expenses',
      description: 'Gas, maintenance, insurance, and lease payments',
      minValue: 2400,
      maxValue: 7200,
      icon: '🚗'
    },
    {
      id: 'business-travel',
      name: 'Business Travel',
      description: 'Flights, hotels, and transportation for work',
      minValue: 800,
      maxValue: 2400,
      icon: '✈️'
    }
  ],
  '🏠 Home Office': [
    {
      id: 'home-office-expenses',
      name: 'Home Office Expenses',
      description: 'Rent %, utilities, internet, and property taxes',
      minValue: 2400,
      maxValue: 4800,
      icon: '🏠'
    },
    {
      id: 'office-supplies',
      name: 'Office Supplies & Equipment',
      description: 'Desk, chair, computer, printer, and supplies',
      minValue: 600,
      maxValue: 1800,
      icon: '📋'
    }
  ],
  '🍜 Meals & Entertainment': [
    {
      id: 'business-meals',
      name: 'Business Meals (50% deductible)',
      description: 'Client meals, business lunches, and entertainment',
      minValue: 400,
      maxValue: 1200,
      icon: '🍜'
    }
  ],
  '💡 Utilities & Supplies': [
    {
      id: 'internet-phone',
      name: 'Internet & Phone',
      description: 'Business portion of internet and phone bills',
      minValue: 600,
      maxValue: 1800,
      icon: '📱'
    },
    {
      id: 'marketing-advertising',
      name: 'Marketing & Advertising',
      description: 'Website costs, ads, business cards, and promotions',
      minValue: 400,
      maxValue: 1600,
      icon: '📢'
    },
    {
      id: 'professional-fees',
      name: 'Professional Fees',
      description: 'Legal, accounting, and consulting services',
      minValue: 800,
      maxValue: 2400,
      icon: '⚖️'
    },
    {
      id: 'insurance',
      name: 'Business Insurance',
      description: 'Professional liability and business insurance',
      minValue: 400,
      maxValue: 1200,
      icon: '🛡️'
    },
    {
      id: 'professional-development',
      name: 'Professional Development',
      description: 'Courses, conferences, books, and training',
      minValue: 600,
      maxValue: 2000,
      icon: '📚'
    }
  ]
}

export function DeductionFinderStep2({ formData, onNext, onRestart }: Step2Props) {
  const [selectedDeductions, setSelectedDeductions] = useState<Set<string>>(new Set())
  const [totalValue, setTotalValue] = useState({ min: 0, max: 0 })

  // Filter deductions based on form data
  const getRelevantDeductions = () => {
    const relevant: Record<string, typeof deductionCategories[keyof typeof deductionCategories]> = {}
    
    Object.entries(deductionCategories).forEach(([category, deductions]) => {
      const filteredDeductions = deductions.filter(deduction => {
        switch (deduction.id) {
          case 'home-office-expenses':
          case 'office-supplies':
            return formData.workFromHome === 'yes'
          case 'vehicle-expenses':
          case 'business-travel':
            return formData.vehicleForBusiness === 'yes' || formData.vehicleForBusiness === 'sometimes'
          case 'software-subscriptions':
          case 'professional-memberships':
            return formData.businessSubscriptions === 'yes'
          default:
            return true // Show all other deductions
        }
      })
      
      if (filteredDeductions.length > 0) {
        relevant[category] = filteredDeductions
      }
    })
    
    return relevant
  }

  const relevantDeductions = useMemo(() => getRelevantDeductions(), [formData])

  useEffect(() => {
    let minTotal = 0
    let maxTotal = 0
    
    selectedDeductions.forEach(deductionId => {
      Object.values(relevantDeductions).forEach(deductions => {
        const deduction = deductions.find(d => d.id === deductionId)
        if (deduction) {
          minTotal += deduction.minValue
          maxTotal += deduction.maxValue
        }
      })
    })
    
    setTotalValue({ min: minTotal, max: maxTotal })
  }, [selectedDeductions, relevantDeductions])

  const handleDeductionToggle = (deductionId: string) => {
    setSelectedDeductions(prev => {
      const newSet = new Set(prev)
      if (newSet.has(deductionId)) {
        newSet.delete(deductionId)
      } else {
        newSet.add(deductionId)
      }
      return newSet
    })
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-CA', {
      style: 'currency',
      currency: 'CAD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount)
  }

  return (
    <div className="w-full">
      <div className="animate-fade-in">
        <Card className="p-8 bg-card/80 border-border/50 backdrop-blur-sm shadow-xl">
          <div className="space-y-8">
            {/* Header */}
            <div className="text-center space-y-4">
              <div className="flex justify-center">
                <div className="w-16 h-16 bg-gradient-to-r from-primary/20 to-secondary/20 rounded-full flex items-center justify-center">
                  <CheckCircle className="w-8 h-8 text-primary" />
                </div>
              </div>
              <h2 className="text-3xl font-bold text-foreground">
                Your Personalized Deduction Audit
              </h2>
              <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                Based on your answers, here are the deductions you may qualify for. 
                Check the boxes for deductions that apply to you.
              </p>
            </div>

            {/* Deductions by Category */}
            <div className="space-y-6">
              <Accordion type="multiple" className="w-full">
                {Object.entries(relevantDeductions).map(([category, deductions]) => (
                  <AccordionItem key={category} value={category} className="border-border">
                    <AccordionTrigger className="text-lg font-semibold text-foreground hover:no-underline">
                      {category}
                    </AccordionTrigger>
                    <AccordionContent className="space-y-4 pt-4">
                      {deductions.map((deduction) => (
                        <div
                          key={deduction.id}
                          className="flex items-center justify-between p-4 rounded-lg border border-border hover:bg-muted/50 transition-colors"
                        >
                          <div className="flex items-center space-x-4 flex-1">
                            <input
                              type="checkbox"
                              id={deduction.id}
                              checked={selectedDeductions.has(deduction.id)}
                              onChange={() => handleDeductionToggle(deduction.id)}
                              className="w-5 h-5 text-primary bg-card border-border rounded focus:ring-primary focus:ring-2"
                            />
                            <div className="flex-1">
                              <div className="flex items-center space-x-2 mb-1">
                                <span className="text-lg">{deduction.icon}</span>
                                <label
                                  htmlFor={deduction.id}
                                  className="text-lg font-medium text-foreground cursor-pointer"
                                >
                                  {deduction.name}
                                </label>
                              </div>
                              <p className="text-sm text-muted-foreground">
                                {deduction.description}
                              </p>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="text-lg font-semibold text-foreground">
                              {formatCurrency(deduction.minValue)} – {formatCurrency(deduction.maxValue)}
                            </div>
                            <div className="text-sm text-muted-foreground">
                              per year
                            </div>
                          </div>
                        </div>
                      ))}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>

            {/* Running Total */}
            {selectedDeductions.size > 0 && (
              <div className="bg-gradient-to-r from-primary/10 to-secondary/10 border border-primary/20 rounded-xl p-6 text-center">
                <div className="flex items-center justify-center space-x-2 mb-2">
                  <DollarSign className="w-6 h-6 text-primary" />
                  <h3 className="text-2xl font-bold text-foreground">
                    You could be missing {formatCurrency(totalValue.min)}+ in deductions
                  </h3>
                </div>
                <p className="text-muted-foreground">
                  Potential annual savings: {formatCurrency(totalValue.min)} – {formatCurrency(totalValue.max)}
                </p>
              </div>
            )}

            {/* CTA Button */}
            <div className="text-center pt-6">
              <div className="flex items-center justify-center gap-4">
                {onRestart && (
                  <Button
                    onClick={onRestart}
                    variant="ghost"
                    className="text-muted-foreground hover:text-foreground"
                  >
                    Reset
                  </Button>
                )}
                <Button
                  onClick={() => onNext(selectedDeductions, totalValue)}
                  className="px-8 py-4 text-lg bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 text-primary-foreground shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02]"
                >
                  See How Tallo Can Help
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  )
}
