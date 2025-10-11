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
  '🏠 Home Office & Workspace': [
    {
      id: 'home-office-expenses',
      name: 'Home Office Expenses',
      description: 'Rent %, utilities, internet, property taxes, and home insurance based on business use percentage',
      minValue: 2400,
      maxValue: 7200,
      icon: '🏠',
      requirements: ['dedicated-space', 'shared-space']
    },
    {
      id: 'office-supplies',
      name: 'Office Supplies & Equipment',
      description: 'Desk, chair, computer, printer, lighting, and office supplies',
      minValue: 800,
      maxValue: 2400,
      icon: '📋',
      requirements: ['dedicated-space', 'shared-space']
    }
  ],
  '🎥 Content Creation Equipment': [
    {
      id: 'camera-equipment',
      name: 'Camera & Video Equipment',
      description: 'Cameras, lenses, tripods, lighting, microphones, and video accessories',
      minValue: 1200,
      maxValue: 4800,
      icon: '📹',
      requirements: ['youtube', 'photography-video', 'instagram-tiktok', 'multi-platform']
    },
    {
      id: 'audio-equipment',
      name: 'Audio Equipment',
      description: 'Microphones, headphones, audio interfaces, and recording equipment',
      minValue: 400,
      maxValue: 1600,
      icon: '🎤',
      requirements: ['podcast', 'youtube', 'multi-platform']
    },
    {
      id: 'computer-hardware',
      name: 'Computer & Hardware',
      description: 'Laptops, desktops, monitors, graphics cards, and editing hardware',
      minValue: 1600,
      maxValue: 4800,
      icon: '💻',
      requirements: ['equipment-gear']
    }
  ],
  '💻 Software & Subscriptions': [
    {
      id: 'editing-software',
      name: 'Editing Software & Tools',
      description: 'Adobe Creative Suite, Final Cut Pro, DaVinci Resolve, and other editing software',
      minValue: 600,
      maxValue: 1800,
      icon: '🎬',
      requirements: ['software-subscriptions']
    },
    {
      id: 'cloud-storage',
      name: 'Cloud Storage & Services',
      description: 'Google Drive, Dropbox, AWS, and other cloud storage services',
      minValue: 200,
      maxValue: 800,
      icon: '☁️',
      requirements: ['software-subscriptions']
    },
    {
      id: 'social-media-tools',
      name: 'Social Media Management',
      description: 'Hootsuite, Buffer, Canva Pro, and social media scheduling tools',
      minValue: 300,
      maxValue: 1200,
      icon: '📱',
      requirements: ['software-subscriptions']
    }
  ],
  '🚗 Vehicle & Travel': [
    {
      id: 'vehicle-expenses',
      name: 'Vehicle Expenses',
      description: 'Gas, maintenance, insurance, and lease payments based on business use',
      minValue: 1800,
      maxValue: 5400,
      icon: '🚗',
      requirements: ['regularly', 'sometimes']
    },
    {
      id: 'business-travel',
      name: 'Business Travel',
      description: 'Flights, hotels, and transportation for shoots, meetings, or events',
      minValue: 600,
      maxValue: 2400,
      icon: '✈️',
      requirements: ['travel']
    }
  ],
  '🍜 Meals & Entertainment': [
    {
      id: 'business-meals',
      name: 'Business Meals (50% deductible)',
      description: 'Client meals, collaboration dinners, and business entertainment',
      minValue: 400,
      maxValue: 1200,
      icon: '🍜',
      requirements: ['meals-clients']
    }
  ],
  '📚 Education & Development': [
    {
      id: 'courses-training',
      name: 'Courses & Training',
      description: 'Online courses, workshops, conferences, and skill development',
      minValue: 400,
      maxValue: 1600,
      icon: '📚',
      requirements: ['education-courses']
    },
    {
      id: 'books-resources',
      name: 'Books & Resources',
      description: 'Industry books, magazines, and educational materials',
      minValue: 200,
      maxValue: 600,
      icon: '📖',
      requirements: ['education-courses']
    }
  ],
  '🎨 Props & Supplies': [
    {
      id: 'props-costumes',
      name: 'Props & Costumes',
      description: 'Props, costumes, set materials, and creative supplies',
      minValue: 300,
      maxValue: 1200,
      icon: '🎭',
      requirements: ['props-supplies']
    },
    {
      id: 'marketing-materials',
      name: 'Marketing Materials',
      description: 'Business cards, promotional materials, and branded items',
      minValue: 200,
      maxValue: 800,
      icon: '📢',
      requirements: ['props-supplies']
    }
  ],
  '⚖️ Professional Services': [
    {
      id: 'contract-help',
      name: 'Contract Help & Services',
      description: 'Payments to freelancers, editors, designers, and contractors',
      minValue: 800,
      maxValue: 3200,
      icon: '👥',
      requirements: ['contract-help']
    },
    {
      id: 'professional-fees',
      name: 'Professional Fees',
      description: 'Legal, accounting, tax preparation, and consulting services',
      minValue: 600,
      maxValue: 2000,
      icon: '⚖️',
      requirements: []
    },
    {
      id: 'insurance',
      name: 'Business Insurance',
      description: 'Professional liability, equipment insurance, and business coverage',
      minValue: 400,
      maxValue: 1200,
      icon: '🛡️',
      requirements: []
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
        // If no requirements, always show
        if (!deduction.requirements || deduction.requirements.length === 0) {
          return true
        }
        
        // Check if any requirement is met
        return deduction.requirements.some(requirement => {
          // Check content type
          if (formData.contentType === requirement) {
            return true
          }
          
          // Check workspace
          if (formData.workspace === requirement) {
            return true
          }
          
          // Check vehicle usage
          if (formData.vehicleUsage === requirement) {
            return true
          }
          
          // Check expense categories (array)
          if (Array.isArray(formData.expenseCategories) && formData.expenseCategories.includes(requirement)) {
            return true
          }
          
          return false
        })
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
        <Card className="p-4 sm:p-6 lg:p-8 bg-card/80 border-border/50 backdrop-blur-sm shadow-xl">
          <div className="space-y-6 sm:space-y-8">
            {/* Header */}
            <div className="text-center space-y-3 sm:space-y-4">
              <div className="flex justify-center">
                <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-r from-primary/20 to-secondary/20 rounded-full flex items-center justify-center">
                  <CheckCircle className="w-6 h-6 sm:w-8 sm:h-8 text-primary" />
                </div>
              </div>
              <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-foreground">
                Your Personalized Deduction Audit
              </h2>
              <p className="text-muted-foreground text-base sm:text-lg max-w-2xl mx-auto px-4">
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
                          className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 rounded-lg border border-border hover:bg-muted/50 transition-colors gap-4"
                        >
                          <div className="flex items-start sm:items-center space-x-3 sm:space-x-4 flex-1 min-w-0">
                            <input
                              type="checkbox"
                              id={deduction.id}
                              checked={selectedDeductions.has(deduction.id)}
                              onChange={() => handleDeductionToggle(deduction.id)}
                              className="w-5 h-5 text-primary bg-card border-border rounded focus:ring-primary focus:ring-2 flex-shrink-0 mt-0.5 sm:mt-0"
                            />
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center space-x-2 mb-1">
                                <span className="text-lg flex-shrink-0">{deduction.icon}</span>
                                <label
                                  htmlFor={deduction.id}
                                  className="text-base sm:text-lg font-medium text-foreground cursor-pointer"
                                >
                                  {deduction.name}
                                </label>
                              </div>
                              <p className="text-sm text-muted-foreground">
                                {deduction.description}
                              </p>
                            </div>
                          </div>
                          <div className="text-left sm:text-right flex-shrink-0">
                            <div className="text-base sm:text-lg font-semibold text-foreground">
                              {formatCurrency(deduction.minValue)} – {formatCurrency(deduction.maxValue)}
                            </div>
                            <div className="text-xs sm:text-sm text-muted-foreground">
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
              <div className="bg-gradient-to-r from-primary/10 to-secondary/10 border border-primary/20 rounded-xl p-4 sm:p-6 text-center">
                <div className="flex items-center justify-center space-x-2 mb-2">
                  <DollarSign className="w-5 h-5 sm:w-6 sm:h-6 text-primary" />
                  <h3 className="text-lg sm:text-xl lg:text-2xl font-bold text-foreground">
                    You could be missing {formatCurrency(totalValue.min)}+ in deductions
                  </h3>
                </div>
                <p className="text-sm sm:text-base text-muted-foreground">
                  Potential annual savings: {formatCurrency(totalValue.min)} – {formatCurrency(totalValue.max)}
                </p>
              </div>
            )}

            {/* CTA Button */}
            <div className="text-center pt-4 sm:pt-6">
              <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4">
                {onRestart && (
                  <Button
                    onClick={onRestart}
                    variant="ghost"
                    className="text-muted-foreground hover:text-foreground text-sm order-2 sm:order-1"
                  >
                    Reset
                  </Button>
                )}
                <Button
                  onClick={() => onNext(selectedDeductions, totalValue)}
                  className="px-6 sm:px-8 py-3 sm:py-4 text-base sm:text-lg bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 text-primary-foreground shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02] order-1 sm:order-2"
                >
                  See How Tallo Can Help
                  <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 ml-2" />
                </Button>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  )
}
