'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { ArrowRight, Home, Car, Video, Camera, Mic, PenTool, Users, Monitor } from 'lucide-react'

interface Step1Props {
  onNext: (data: Record<string, any>) => void
  formData: Record<string, any>
  onRestart?: () => void
}

const questions = [
  {
    id: 'contentType',
    question: 'What type of content do you create?',
    options: [
      { value: 'youtube', label: 'YouTube', icon: Video },
      { value: 'instagram-tiktok', label: 'Instagram/TikTok', icon: Camera },
      { value: 'podcast', label: 'Podcast', icon: Mic },
      { value: 'photography-video', label: 'Photography/Video Production', icon: Camera },
      { value: 'blogging-writing', label: 'Blogging/Writing', icon: PenTool },
      { value: 'multi-platform', label: 'Multi-platform', icon: Users }
    ]
  },
  {
    id: 'workspace',
    question: 'Do you work from a home office or studio space?',
    options: [
      { value: 'dedicated-space', label: 'Yes - dedicated space', icon: Home },
      { value: 'shared-space', label: 'Yes - shared space', icon: Home },
      { value: 'no', label: 'No', icon: Monitor }
    ]
  },
  {
    id: 'vehicleUsage',
    question: 'Do you use your vehicle for content creation or business?',
    options: [
      { value: 'regularly', label: 'Regularly', icon: Car },
      { value: 'sometimes', label: 'Sometimes', icon: Car },
      { value: 'rarely', label: 'Rarely', icon: Car },
      { value: 'never', label: 'Never', icon: Car }
    ]
  },
  {
    id: 'expenseCategories',
    question: 'Which of these do you spend money on for your content?',
    options: [
      { value: 'equipment-gear', label: 'Equipment/gear', icon: Camera },
      { value: 'software-subscriptions', label: 'Software/subscriptions', icon: Monitor },
      { value: 'props-supplies', label: 'Props/supplies', icon: PenTool },
      { value: 'travel', label: 'Travel', icon: Car },
      { value: 'meals-clients', label: 'Meals with clients/collaborators', icon: Users },
      { value: 'education-courses', label: 'Education/courses', icon: PenTool },
      { value: 'contract-help', label: 'Contract help', icon: Users }
    ],
    multiple: true
  }
]

export function DeductionFinderStep1({ onNext, formData, onRestart }: Step1Props) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [selectedOption, setSelectedOption] = useState<string>('')
  const [selectedOptions, setSelectedOptions] = useState<string[]>([])
  const [isAnimating, setIsAnimating] = useState(false)
  const [answers, setAnswers] = useState<Record<string, any>>({})

  const currentQuestion = questions[currentQuestionIndex]
  const currentValue = formData[currentQuestion?.id] || ''

  useEffect(() => {
    if (currentQuestion?.multiple) {
      setSelectedOptions(Array.isArray(currentValue) ? currentValue : [])
    } else {
      setSelectedOption(currentValue)
    }
  }, [currentValue, currentQuestion])

  // Initialize answers with existing formData
  useEffect(() => {
    setAnswers(formData)
  }, [formData])

  const handleOptionSelect = (value: string) => {
    if (currentQuestion?.multiple) {
      setSelectedOptions(prev => {
        if (prev.includes(value)) {
          return prev.filter(option => option !== value)
        } else {
          return [...prev, value]
        }
      })
    } else {
      setSelectedOption(value)
    }
  }

  const handleNext = () => {
    const hasSelection = currentQuestion?.multiple ? selectedOptions.length > 0 : selectedOption
    
    if (hasSelection) {
      setIsAnimating(true)
      setTimeout(() => {
        // Store the current answer
        const answerValue = currentQuestion?.multiple ? selectedOptions : selectedOption
        const newAnswers = { ...answers, [currentQuestion.id]: answerValue }
        setAnswers(newAnswers)
        
        if (currentQuestionIndex < questions.length - 1) {
          // Move to next question
          setCurrentQuestionIndex(currentQuestionIndex + 1)
          setSelectedOption('')
          setSelectedOptions([])
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
        
        if (prevQuestion?.multiple) {
          setSelectedOptions(Array.isArray(prevAnswer) ? prevAnswer : [])
        } else {
          setSelectedOption(prevAnswer)
        }
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
        <Card className="p-4 sm:p-6 lg:p-8 bg-card/80 border-border/50 backdrop-blur-sm shadow-xl">
          <div className="space-y-4 sm:space-y-6">
            {/* Progress Bar */}
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs sm:text-sm text-muted-foreground">
                Step 1 of 2 - Question {currentQuestionIndex + 1} of {questions.length}
              </span>
              <span className="text-xs sm:text-sm text-muted-foreground">
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
            <div className="text-center space-y-3 sm:space-y-4">
              <h2 className="text-lg sm:text-xl lg:text-2xl font-semibold text-foreground">
                {currentQuestion.question}
              </h2>
              {currentQuestion.multiple && (
                <p className="text-sm sm:text-base text-muted-foreground">
                  Select all that apply
                </p>
              )}
            </div>

            {/* Options */}
            <div className="space-y-3 sm:space-y-4">
              {currentQuestion.options.map((option) => {
                const IconComponent = option.icon
                const isSelected = currentQuestion.multiple 
                  ? selectedOptions.includes(option.value)
                  : selectedOption === option.value
                
                return (
                  <button
                    key={option.value}
                    onClick={() => handleOptionSelect(option.value)}
                    className={`w-full p-4 sm:p-6 text-left rounded-xl border-2 transition-all duration-300 transform hover:scale-[1.01] sm:hover:scale-[1.02] cursor-pointer ${
                      isSelected
                        ? 'border-primary bg-gradient-to-r from-primary/10 to-secondary/10 text-foreground shadow-lg shadow-primary/20'
                        : 'border-border hover:border-primary/50 hover:bg-muted/50 hover:shadow-md bg-card'
                    }`}
                  >
                    <div className="flex items-center space-x-3 sm:space-x-4">
                      <div className={`w-5 h-5 sm:w-6 sm:h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${
                        isSelected
                          ? 'border-primary bg-primary'
                          : 'border-muted-foreground'
                      }`}>
                        {isSelected && (
                          <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-primary-foreground" />
                        )}
                      </div>
                      <IconComponent className="w-4 h-4 sm:w-5 sm:h-5 text-muted-foreground flex-shrink-0" />
                      <span className="text-base sm:text-lg font-medium text-foreground">{option.label}</span>
                    </div>
                  </button>
                )
              })}
            </div>

            {/* Navigation */}
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4 pt-4 sm:pt-6">
              <div className="flex gap-2 order-2 sm:order-1">
                <Button
                  onClick={handlePrevious}
                  disabled={currentQuestionIndex === 0}
                  variant="outline"
                  className="px-4 sm:px-8 text-sm sm:text-base"
                >
                  Previous
                </Button>
                {onRestart && (
                  <Button
                    onClick={onRestart}
                    variant="ghost"
                    size="sm"
                    className="text-muted-foreground hover:text-foreground text-sm"
                  >
                    Reset
                  </Button>
                )}
              </div>
              
              <Button
                onClick={handleNext}
                disabled={currentQuestion?.multiple ? selectedOptions.length === 0 : !selectedOption}
                className="px-6 sm:px-8 py-3 sm:py-4 text-sm sm:text-base bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 text-primary-foreground shadow-lg hover:shadow-xl transition-all duration-300 order-1 sm:order-2"
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
