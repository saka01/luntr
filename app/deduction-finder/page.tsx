'use client'

import { useState } from 'react'
import { DeductionForm } from '@/components/deduction-form'
import { LeadCaptureForm } from '@/components/deduction-results'

export default function DeductionFinderPage() {
  const [currentStep, setCurrentStep] = useState(0)
  const [formData, setFormData] = useState<Record<string, any>>({})
  const [isComplete, setIsComplete] = useState(false)
  const [qualifyingDeductions, setQualifyingDeductions] = useState<string[]>([])

  const handleNext = (stepData: Record<string, any>) => {
    const newFormData = { ...formData, ...stepData }
    setFormData(newFormData)
    
    if (currentStep < 4) {
      setCurrentStep(currentStep + 1)
    } else {
      // Calculate qualifying deductions
      const deductions = calculateDeductions(newFormData)
      setQualifyingDeductions(deductions)
      setIsComplete(true)
    }
  }

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleRestart = () => {
    setCurrentStep(0)
    setFormData({})
    setIsComplete(false)
    setQualifyingDeductions([])
  }

  const calculateDeductions = (data: Record<string, any>): string[] => {
    const deductions: string[] = []
    
    // Home office deduction
    if (data.workFromHome === 'yes' && data.dedicatedSpace === 'yes') {
      deductions.push('Home Office Deduction')
    }
    
    // Vehicle expenses
    if (data.vehicleForWork === 'yes') {
      deductions.push('Vehicle Expenses')
    }
    
    // Business meals
    if (data.businessMeals === 'yes') {
      deductions.push('Business Meals (50% deductible)')
    }
    
    // Professional development
    if (data.professionalDevelopment === 'yes') {
      deductions.push('Professional Development & Training')
    }
    
    // Equipment and supplies
    if (data.businessEquipment === 'yes') {
      deductions.push('Business Equipment & Supplies')
    }
    
    // Marketing and advertising
    if (data.marketingExpenses === 'yes') {
      deductions.push('Marketing & Advertising')
    }
    
    // Professional fees
    if (data.professionalFees === 'yes') {
      deductions.push('Professional Fees (Legal, Accounting)')
    }
    
    // Insurance
    if (data.businessInsurance === 'yes') {
      deductions.push('Business Insurance')
    }
    
    // Internet and phone
    if (data.internetPhone === 'yes') {
      deductions.push('Internet & Phone (Business Portion)')
    }
    
    // Travel expenses
    if (data.businessTravel === 'yes') {
      deductions.push('Business Travel Expenses')
    }
    
    return deductions
  }

  return (
    <div className="min-h-screen bg-background text-foreground overflow-hidden">
      <div className="h-screen flex flex-col">
        {/* Header */}
        <div className="flex-shrink-0 p-6 border-b border-border">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-3xl font-bold font-sentient mb-2">
              Tax Deduction Finder
            </h1>
            <p className="text-muted-foreground">
              Answer a few questions to discover which tax deductions you qualify for
            </p>
          </div>
        </div>

        {/* Progress Bar */}
        {!isComplete && (
          <div className="flex-shrink-0 px-6 py-4">
            <div className="max-w-4xl mx-auto">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-muted-foreground">
                  Step {currentStep + 1} of 5
                </span>
                <span className="text-sm text-muted-foreground">
                  {Math.round(((currentStep + 1) / 5) * 100)}% Complete
                </span>
              </div>
              <div className="w-full bg-muted rounded-full h-2">
                <div 
                  className="bg-primary h-2 rounded-full transition-all duration-500 ease-out animate-pulse-glow"
                  style={{ width: `${((currentStep + 1) / 5) * 100}%` }}
                />
              </div>
            </div>
          </div>
        )}

        {/* Main Content */}
        <div className="flex-1 flex items-center justify-center p-6">
          <div className="max-w-4xl w-full">
            {!isComplete ? (
              <DeductionForm
                currentStep={currentStep}
                onNext={handleNext}
                onPrevious={handlePrevious}
                formData={formData}
              />
            ) : (
              <LeadCaptureForm
                deductions={qualifyingDeductions}
                onRestart={handleRestart}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
