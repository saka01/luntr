'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { ArrowRight, Home, Car, Briefcase, Laptop } from 'lucide-react'

interface Step1Props {
  onNext: (data: Record<string, any>) => void
  formData: Record<string, any>
  onRestart?: () => void
}

const questions = [
  {
    id: 'workType',
    question: 'What type of self-employed work do you do?',
    options: [
      { value: 'freelancer', label: 'Freelancer', icon: Laptop },
      { value: 'consultant', label: 'Consultant', icon: Briefcase },
      { value: 'contractor', label: 'Contractor', icon: Briefcase },
      { value: 'small-business', label: 'Small-Business Owner', icon: Briefcase },
      { value: 'other', label: 'Other', icon: Briefcase }
    ]
  },
  {
    id: 'workFromHome',
    question: 'Do you work from home?',
    options: [
      { value: 'yes', label: 'Yes', icon: Home },
      { value: 'no', label: 'No', icon: Home }
    ]
  },
  {
    id: 'vehicleForBusiness',
    question: 'Do you use your vehicle for business?',
    options: [
      { value: 'yes', label: 'Yes', icon: Car },
      { value: 'no', label: 'No', icon: Car },
      { value: 'sometimes', label: 'Sometimes', icon: Car }
    ]
  },
  {
    id: 'businessSubscriptions',
    question: 'Do you have business-related subscriptions or software?',
    options: [
      { value: 'yes', label: 'Yes', icon: Laptop },
      { value: 'no', label: 'No', icon: Laptop }
    ]
  }
]

export function DeductionFinderStep1({ onNext, formData, onRestart }: Step1Props) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [selectedOption, setSelectedOption] = useState<string>('')
  const [isAnimating, setIsAnimating] = useState(false)
  const [answers, setAnswers] = useState<Record<string, string>>({})

  const currentQuestion = questions[currentQuestionIndex]
  const currentValue = formData[currentQuestion?.id] || ''

  useEffect(() => {
    setSelectedOption(currentValue)
  }, [currentValue])

  // Initialize answers with existing formData
  useEffect(() => {
    setAnswers(formData)
  }, [formData])

  const handleOptionSelect = (value: string) => {
    setSelectedOption(value)
  }

  const handleNext = () => {
    if (selectedOption) {
      setIsAnimating(true)
      setTimeout(() => {
        // Store the current answer
        const newAnswers = { ...answers, [currentQuestion.id]: selectedOption }
        setAnswers(newAnswers)
        
        if (currentQuestionIndex < questions.length - 1) {
          // Move to next question
          setCurrentQuestionIndex(currentQuestionIndex + 1)
          setSelectedOption('')
        } else {
          // All questions completed, send all answers to parent
          onNext(newAnswers)
        }
        setIsAnimating(false)
      }, 300)
    }
  }

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setIsAnimating(true)
      setTimeout(() => {
        setCurrentQuestionIndex(currentQuestionIndex - 1)
        // Load the previous answer if it exists
        const prevQuestion = questions[currentQuestionIndex - 1]
        const prevAnswer = answers[prevQuestion.id] || ''
        setSelectedOption(prevAnswer)
        setIsAnimating(false)
      }, 300)
    }
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
        <Card className="p-8 bg-card/80 border-border/50 backdrop-blur-sm shadow-xl">
          <div className="space-y-6">
            {/* Progress Bar */}
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-muted-foreground">
                Step 1 of 2 - Question {currentQuestionIndex + 1} of {questions.length}
              </span>
              <span className="text-sm text-muted-foreground">
                {Math.round(((currentQuestionIndex + 1) / questions.length) * 100)}% Complete
              </span>
            </div>
            <div className="w-full bg-muted rounded-full h-2">
              <div 
                className="bg-gradient-to-r from-primary to-secondary h-2 rounded-full transition-all duration-500 ease-out shadow-lg"
                style={{ width: `${((currentQuestionIndex + 1) / questions.length) * 100}%` }}
              />
            </div>

            {/* Question Header */}
            <div className="text-center space-y-4">
              <h2 className="text-2xl font-semibold text-foreground">
                {currentQuestion.question}
              </h2>
            </div>

            {/* Options */}
            <div className="space-y-4">
              {currentQuestion.options.map((option) => {
                const IconComponent = option.icon
                return (
                  <button
                    key={option.value}
                    onClick={() => handleOptionSelect(option.value)}
                    className={`w-full p-6 text-left rounded-xl border-2 transition-all duration-300 transform hover:scale-[1.02] cursor-pointer ${
                      selectedOption === option.value
                        ? 'border-primary bg-gradient-to-r from-primary/10 to-secondary/10 text-foreground shadow-lg shadow-primary/20'
                        : 'border-border hover:border-primary/50 hover:bg-muted/50 hover:shadow-md bg-card'
                    }`}
                  >
                    <div className="flex items-center space-x-4">
                      <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                        selectedOption === option.value
                          ? 'border-primary bg-primary'
                          : 'border-muted-foreground'
                      }`}>
                        {selectedOption === option.value && (
                          <div className="w-2 h-2 rounded-full bg-primary-foreground" />
                        )}
                      </div>
                      <IconComponent className="w-5 h-5 text-muted-foreground" />
                      <span className="text-lg font-medium text-foreground">{option.label}</span>
                    </div>
                  </button>
                )
              })}
            </div>

            {/* Navigation */}
            <div className="flex justify-between items-center pt-6">
              <div className="flex gap-2">
                <Button
                  onClick={handlePrevious}
                  disabled={currentQuestionIndex === 0}
                  variant="outline"
                  className="px-8"
                >
                  Previous
                </Button>
                {onRestart && (
                  <Button
                    onClick={onRestart}
                    variant="ghost"
                    size="sm"
                    className="text-muted-foreground hover:text-foreground"
                  >
                    Reset
                  </Button>
                )}
              </div>
              
              <Button
                onClick={handleNext}
                disabled={!selectedOption}
                className="px-8 bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 text-primary-foreground shadow-lg hover:shadow-xl transition-all duration-300"
              >
                {currentQuestionIndex === questions.length - 1 ? 'See My Deductions' : 'Next'}
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </div>
        </Card>
      </div>
    </div>
  )
}
