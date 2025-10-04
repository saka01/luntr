'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'

interface DeductionFormProps {
  currentStep: number
  onNext: (data: Record<string, any>) => void
  onPrevious: () => void
  formData: Record<string, any>
}

const questions = [
  {
    id: 'workFromHome',
    question: 'Do you work from home?',
    description: 'This includes remote work, freelancing, or running a business from home',
    options: [
      { value: 'yes', label: 'Yes, I work from home' },
      { value: 'no', label: 'No, I work at an office' }
    ]
  },
  {
    id: 'dedicatedSpace',
    question: 'Do you have a dedicated workspace at home?',
    description: 'A space used exclusively for work purposes',
    options: [
      { value: 'yes', label: 'Yes, I have a dedicated home office' },
      { value: 'no', label: 'No, I work from various locations' }
    ]
  },
  {
    id: 'vehicleForWork',
    question: 'Do you use a vehicle for business purposes?',
    description: 'This includes driving to client meetings, picking up supplies, or business travel',
    options: [
      { value: 'yes', label: 'Yes, I use my vehicle for business' },
      { value: 'no', label: 'No, I don\'t use a vehicle for work' }
    ]
  },
  {
    id: 'businessMeals',
    question: 'Do you have business meals or entertainment expenses?',
    description: 'Meals with clients, business entertainment, or work-related dining',
    options: [
      { value: 'yes', label: 'Yes, I have business meal expenses' },
      { value: 'no', label: 'No, I don\'t have business meal expenses' }
    ]
  },
  {
    id: 'professionalDevelopment',
    question: 'Do you invest in professional development?',
    description: 'Courses, certifications, conferences, or training related to your work',
    options: [
      { value: 'yes', label: 'Yes, I invest in professional development' },
      { value: 'no', label: 'No, I don\'t have professional development expenses' }
    ]
  },
  {
    id: 'businessEquipment',
    question: 'Do you purchase equipment or supplies for work?',
    description: 'Computers, software, office supplies, tools, or other business equipment',
    options: [
      { value: 'yes', label: 'Yes, I buy equipment and supplies for work' },
      { value: 'no', label: 'No, I don\'t purchase work equipment' }
    ]
  },
  {
    id: 'marketingExpenses',
    question: 'Do you have marketing or advertising expenses?',
    description: 'Website costs, business cards, online ads, or other marketing materials',
    options: [
      { value: 'yes', label: 'Yes, I have marketing expenses' },
      { value: 'no', label: 'No, I don\'t have marketing expenses' }
    ]
  },
  {
    id: 'professionalFees',
    question: 'Do you pay for professional services?',
    description: 'Legal fees, accounting services, consulting, or other professional help',
    options: [
      { value: 'yes', label: 'Yes, I pay for professional services' },
      { value: 'no', label: 'No, I don\'t have professional service expenses' }
    ]
  },
  {
    id: 'businessInsurance',
    question: 'Do you have business insurance?',
    description: 'Professional liability, business insurance, or other work-related coverage',
    options: [
      { value: 'yes', label: 'Yes, I have business insurance' },
      { value: 'no', label: 'No, I don\'t have business insurance' }
    ]
  },
  {
    id: 'internetPhone',
    question: 'Do you use internet or phone for business?',
    description: 'Internet service, phone bills, or mobile plans used for work',
    options: [
      { value: 'yes', label: 'Yes, I use internet/phone for business' },
      { value: 'no', label: 'No, I don\'t use internet/phone for work' }
    ]
  },
  {
    id: 'businessTravel',
    question: 'Do you travel for business?',
    description: 'Client meetings, conferences, business trips, or work-related travel',
    options: [
      { value: 'yes', label: 'Yes, I travel for business' },
      { value: 'no', label: 'No, I don\'t travel for work' }
    ]
  }
]

export function DeductionForm({ currentStep, onNext, onPrevious, formData }: DeductionFormProps) {
  const [selectedOption, setSelectedOption] = useState<string>('')
  const [isAnimating, setIsAnimating] = useState(false)

  const currentQuestion = questions[currentStep]
  const currentValue = formData[currentQuestion?.id] || ''

  useEffect(() => {
    setSelectedOption(currentValue)
  }, [currentValue, currentStep])

  const handleOptionSelect = (value: string) => {
    setSelectedOption(value)
  }

  const handleNext = () => {
    if (selectedOption) {
      setIsAnimating(true)
      setTimeout(() => {
        onNext({ [currentQuestion.id]: selectedOption })
        setIsAnimating(false)
      }, 300)
    }
  }

  const handlePrevious = () => {
    setIsAnimating(true)
    setTimeout(() => {
      onPrevious()
      setIsAnimating(false)
    }, 300)
  }

  if (!currentQuestion) return null

  return (
    <div className="w-full">
      <div 
        className={`transition-all duration-500 ease-in-out ${
          isAnimating 
            ? 'opacity-0 transform translate-x-8 scale-95' 
            : 'opacity-100 transform translate-x-0 scale-100'
        }`}
      >
        <Card className="p-8 bg-white/80 dark:bg-slate-800/80 border-slate-200/50 dark:border-slate-700/50 backdrop-blur-sm shadow-xl">
          <div className="space-y-6">
            {/* Question Header */}
            <div className="text-center space-y-4">
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
                {currentQuestion.question}
              </h2>
              <p className="text-slate-600 dark:text-slate-300 text-lg">
                {currentQuestion.description}
              </p>
            </div>

            {/* Options */}
            <div className="space-y-4">
              {currentQuestion.options.map((option, index) => (
                <button
                  key={option.value}
                  onClick={() => handleOptionSelect(option.value)}
                  className={`w-full p-6 text-left rounded-xl border-2 transition-all duration-300 transform hover:scale-[1.02] ${
                    selectedOption === option.value
                      ? 'border-blue-500 bg-gradient-to-r from-blue-50 to-emerald-50 dark:from-blue-900/20 dark:to-emerald-900/20 text-slate-900 dark:text-white shadow-lg shadow-blue-500/20'
                      : 'border-slate-200 dark:border-slate-700 hover:border-blue-300 dark:hover:border-blue-600 hover:bg-slate-50 dark:hover:bg-slate-700/50 hover:shadow-md bg-white dark:bg-slate-800'
                  }`}
                >
                  <div className="flex items-center space-x-4">
                    <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                      selectedOption === option.value
                        ? 'border-blue-500 bg-blue-500'
                        : 'border-slate-300 dark:border-slate-600'
                    }`}>
                      {selectedOption === option.value && (
                        <div className="w-2 h-2 rounded-full bg-white" />
                      )}
                    </div>
                    <span className="text-lg font-medium text-slate-900 dark:text-white">{option.label}</span>
                  </div>
                </button>
              ))}
            </div>

            {/* Navigation */}
            <div className="flex justify-between pt-6">
              <Button
                onClick={handlePrevious}
                disabled={currentStep === 0}
                className="px-8 border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 bg-white dark:bg-slate-800"
              >
                Previous
              </Button>
              
              <Button
                onClick={handleNext}
                disabled={!selectedOption}
                className="px-8 bg-gradient-to-r from-blue-500 to-emerald-500 hover:from-blue-600 hover:to-emerald-600 text-white shadow-lg hover:shadow-xl transition-all duration-300"
              >
                {currentStep === questions.length - 1 ? 'Find My Deductions' : 'Next'}
              </Button>
            </div>
          </div>
        </Card>
      </div>
    </div>
  )
}
