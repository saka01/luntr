'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { ArrowRight, ArrowLeft, DollarSign } from 'lucide-react'

interface Step1BProps {
  onNext: (data: Record<string, any>) => void
  onPrevious: () => void
  formData: Record<string, any>
  onRestart?: () => void
}

const spendingBands = [
  { value: 'none', label: 'None', min: 0, max: 0 },
  { value: 'under-500', label: 'Under $500', min: 0, max: 500 },
  { value: '500-1k', label: '$500 - $1,000', min: 500, max: 1000 },
  { value: '1k-3k', label: '$1,000 - $3,000', min: 1000, max: 3000 },
  { value: '3k-5k', label: '$3,000 - $5,000', min: 3000, max: 5000 },
  { value: '5k-10k', label: '$5,000 - $10,000', min: 5000, max: 10000 },
  { value: 'over-10k', label: '$10,000+', min: 10000, max: 12000 }
]

const categoryLabels: Record<string, string> = {
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

export function DeductionFinderStep1B({ onNext, onPrevious, formData, onRestart }: Step1BProps) {
  const [currentCategoryIndex, setCurrentCategoryIndex] = useState(0)
  const [spendingData, setSpendingData] = useState<Record<string, string>>({})
  const [isAnimating, setIsAnimating] = useState(false)

  const selectedCategories = formData.expenseCategories || []
  const currentCategory = selectedCategories[currentCategoryIndex]
  const currentSpending = spendingData[currentCategory] || ''

  useEffect(() => {
    // Initialize spending data from formData
    const initialData: Record<string, string> = {}
    selectedCategories.forEach((category: string) => {
      if (formData[`spending_${category}`]) {
        initialData[category] = formData[`spending_${category}`]
      }
    })
    setSpendingData(initialData)
  }, [formData, selectedCategories])

  const handleSpendingSelect = (value: string) => {
    setSpendingData(prev => ({
      ...prev,
      [currentCategory]: value
    }))
  }

  const handleNext = () => {
    if (currentSpending) {
      setIsAnimating(true)
      setTimeout(() => {
        if (currentCategoryIndex < selectedCategories.length - 1) {
          // Move to next category
          setCurrentCategoryIndex(currentCategoryIndex + 1)
        } else {
          // All categories completed, send all data to parent
          const finalData: Record<string, any> = {}
          selectedCategories.forEach((category: string) => {
            finalData[`spending_${category}`] = spendingData[category] || 'none'
          })
          onNext(finalData)
        }
        setIsAnimating(false)
      }, 300)
    }
  }

  const handlePrevious = () => {
    if (currentCategoryIndex > 0) {
      setIsAnimating(true)
      setTimeout(() => {
        setCurrentCategoryIndex(currentCategoryIndex - 1)
        setIsAnimating(false)
      }, 300)
    } else {
      onPrevious()
    }
  }

  if (!currentCategory) return null

  return (
    <div className="w-full">
        <Card className="p-3 sm:p-4 md:p-6 lg:p-8 bg-card/80 border-border/50 backdrop-blur-sm shadow-xl">
          <div className="space-y-4 sm:space-y-6">
            {/* Progress Bar */}
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs sm:text-sm text-muted-foreground">
                Step 1 of 2 - Category {currentCategoryIndex + 1} of {selectedCategories.length}
              </span>
              <span className="text-xs sm:text-sm text-muted-foreground">
                {Math.round(((currentCategoryIndex + 1) / selectedCategories.length) * 100)}% Complete
              </span>
            </div>
            <div className="w-full bg-muted rounded-full h-2">
              <div 
                className="bg-gradient-to-r from-primary to-secondary h-2 rounded-full transition-all duration-500 ease-out shadow-lg"
                style={{ width: `${((currentCategoryIndex + 1) / selectedCategories.length) * 100}%` }}
              />
            </div>
            
            {/* Mobile Navigation */}
            <div className="md:hidden flex flex-row sm:flex-row justify-between items-center gap-3 sm:gap-4">
              <Button
                onClick={onPrevious}
                disabled={currentCategoryIndex === 0}
                variant="outline"
                className="md:hidden px-2 py-1 text-xs"
              >
                Previous
              </Button>

              <Button
                onClick={handleNext}
                disabled={!currentSpending}
                className="md:hidden px-3 py-1.5 text-xs bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 text-primary-foreground shadow-lg hover:shadow-xl transition-all duration-300"
              >
                {currentCategoryIndex === selectedCategories.length - 1 ? 'Next' : 'Next'}
                <ArrowRight className="w-3 h-3 ml-1" />
              </Button>
            </div>

            {/* Question Header */}
            <div 
              className={`transition-all duration-300 ease-out ${
                isAnimating 
                  ? 'opacity-0 transform translate-y-4' 
                  : 'opacity-100 transform translate-y-0'
              }`}
            >
              <div className="text-center space-y-2 sm:space-y-3">
                <h2 className="text-base sm:text-lg md:text-xl lg:text-2xl font-semibold text-foreground leading-tight">
                  How much do you spend annually on {categoryLabels[currentCategory]}?
                </h2>
                <p className="text-xs sm:text-sm text-muted-foreground">
                  Select the spending range that best matches your annual expenses
                </p>
              </div>
            </div>

            {/* Spending Bands */}
            <div 
              className={`space-y-3 sm:space-y-4 transition-all duration-300 ease-out delay-75 ${
                isAnimating 
                  ? 'opacity-0 transform translate-y-4' 
                  : 'opacity-100 transform translate-y-0'
              }`}
            >
              {spendingBands.map((band) => (
                <button
                  key={band.value}
                  onClick={() => handleSpendingSelect(band.value)}
                  className={`w-full p-3 sm:p-4 md:p-6 text-left rounded-lg sm:rounded-xl border-2 transition-all duration-300 transform hover:scale-[1.01] sm:hover:scale-[1.02] cursor-pointer ${
                    currentSpending === band.value
                      ? 'border-primary bg-gradient-to-r from-primary/10 to-secondary/10 text-foreground shadow-lg shadow-primary/20'
                      : 'border-border hover:border-primary/50 hover:bg-muted/50 hover:shadow-md bg-card'
                  }`}
                >
                  <div className="flex items-center space-x-3 sm:space-x-4">
                    <div className={`w-5 h-5 sm:w-6 sm:h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${
                      currentSpending === band.value
                        ? 'border-primary bg-primary'
                        : 'border-muted-foreground'
                    }`}>
                      {currentSpending === band.value && (
                        <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-primary-foreground" />
                      )}
                    </div>
                    <DollarSign className="w-4 h-4 sm:w-5 sm:h-5 text-muted-foreground flex-shrink-0" />
                    <span className="text-sm sm:text-base md:text-lg font-medium text-foreground leading-tight">{band.label}</span>
                  </div>
                </button>
              ))}
            </div>

            {/* Navigation */}
            <div className="flex flex-col sm:flex-row justify-between items-center gap-3 sm:gap-4 pt-3 sm:pt-4 md:pt-6">
              <div className="flex gap-2 order-2 sm:order-1">
                {/* Previous button on desktop/tablet - hidden on mobile and sm */}
                <Button
                  onClick={onPrevious}
                  variant="outline"
                  className="hidden md:flex px-3 sm:px-4 md:px-8 text-xs sm:text-sm md:text-base"
                >
                  <ArrowLeft className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                  Previous
                </Button>
                {onRestart && (
                  <Button
                    onClick={onRestart}
                    variant="ghost"
                    size="sm"
                    className="text-muted-foreground hover:text-foreground text-xs sm:text-sm"
                  >
                    Reset
                  </Button>
                )}
              </div>
              
              {/* Next button on desktop/tablet - hidden on mobile and sm */}
              <Button
                onClick={handleNext}
                disabled={!currentSpending}
                className="hidden md:flex px-4 sm:px-6 md:px-8 py-2 sm:py-3 md:py-4 text-xs sm:text-sm md:text-base bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 text-primary-foreground shadow-lg hover:shadow-xl transition-all duration-300 order-1 sm:order-2"
              >
                {currentCategoryIndex === selectedCategories.length - 1 ? 'Next' : 'Next'}
                <ArrowRight className="w-3 h-3 sm:w-4 sm:h-4 ml-1 sm:ml-2" />
              </Button>
            </div>
          </div>
        </Card>
    </div>
  )
}
