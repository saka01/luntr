"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Timer } from "@/components/ui/timer"
import { Input } from "@/components/ui/input"
import { SessionCard } from "@/lib/session-engine"

interface FitbCardProps {
  card: SessionCard
  onSubmit: (answer: any, feedback: any) => void
  timedOut?: boolean
  userInteracted?: boolean
}

export function FitbCard({ card, onSubmit, userInteracted = false, timedOut = false }: FitbCardProps) {
  const [userAnswers, setUserAnswers] = useState<string[]>([])
  const [choiceIndexes, setChoiceIndexes] = useState<number[]>([])
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [feedback, setFeedback] = useState<any>(null)
  const [userGrade, setUserGrade] = useState<number | null>(null)
  const [timeMs, setTimeMs] = useState(0)
  const [isTimedOut, setIsTimedOut] = useState(false)
  const [startTime] = useState(Date.now())

  // Initialize userAnswers array
  useEffect(() => {
    setUserAnswers(new Array(card.prompt.blanks).fill(''))
    setChoiceIndexes(new Array(card.prompt.blanks).fill(-1))
    setIsSubmitted(false)
    setFeedback(null)
    setUserGrade(null)
    setTimeMs(0)
    setIsTimedOut(false)
  }, [card.id, card.prompt.blanks])

  const handleAnswerChange = (blankIndex: number, value: string) => {
    if (isSubmitted) return
    
    const newAnswers = [...userAnswers]
    newAnswers[blankIndex] = value
    setUserAnswers(newAnswers)
  }

  const handleOptionSelect = (blankIndex: number, optionIndex: number) => {
    if (isSubmitted) return
    
    const newAnswers = [...userAnswers]
    const newChoiceIndexes = [...choiceIndexes]
    
    if (card.prompt.options) {
      newAnswers[blankIndex] = card.prompt.options[optionIndex]
      newChoiceIndexes[blankIndex] = optionIndex
      setUserAnswers(newAnswers)
      setChoiceIndexes(newChoiceIndexes)
    }
  }

  const handleReset = () => {
    if (isSubmitted) return
    setUserAnswers(new Array(card.prompt.blanks).fill(''))
    setChoiceIndexes(new Array(card.prompt.blanks).fill(-1))
  }

  const handleSubmit = async () => {
    const elapsed = Date.now() - startTime
    setTimeMs(elapsed)
    setIsSubmitted(true)

    // Evaluate locally using solutions
    const perBlank = userAnswers.map((answer, blankIndex) => {
      if (!answer.trim()) return false
      
      const acceptedSolutions = card.answer.solutions[blankIndex] || []
      return acceptedSolutions.some((solution: string) => 
        solution.toLowerCase().trim() === answer.toLowerCase().trim()
      )
    })
    const correct = perBlank.every(Boolean)

    setFeedback({
      correct,
      perBlank,
      userAnswers,
      rationale: card.answer.rationale
    })
  }

  const handleTimeout = () => {
    const elapsed = Date.now() - startTime
    setTimeMs(elapsed)
    setIsTimedOut(true)
    setIsSubmitted(true)
    setFeedback({
      correct: false,
      timedOut: true,
      rationale: "Time's up! Don't worry, you can try again."
    })
  }

  const handleUserInteraction = () => {
    // User interacted, so timeout will be treated as grade 3 instead of 5
  }

  const handleGradeClick = (grade: number) => {
    const finalGrade = isTimedOut && !userGrade ? 3 : grade // Downgrade timeout to 3 if user interacted
    setUserGrade(finalGrade)
    
    onSubmit({
      type: 'fitb',
      blanks: userAnswers,
      choiceIndexes: card.prompt.options ? choiceIndexes : undefined,
      timeMs,
      timedOut: isTimedOut,
      grade: finalGrade
    }, feedback)
  }

  // Split the stem by blanks markers (assuming format like "The ___ is ___")
  const stemParts = card.prompt.stem.split('___')

  return (
    <Card className="bg-card/50 backdrop-blur-xl border-border">
      <CardHeader>
        <div className="flex justify-between items-start mb-2">
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="text-xs">
              {card.difficulty}
            </Badge>
            <Timer
              cardType="fitb"
              estSeconds={card.estSeconds}
              onTimeout={handleTimeout}
              onUserInteraction={handleUserInteraction}
            />
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {!isSubmitted ? (
          <>
            <div className="space-y-4">
              <div className="text-foreground font-medium">
                Fill in the blanks with your answers:
              </div>
              
              {/* Render the stem with input fields or option chips */}
              <div className="space-y-3">
                {stemParts.map((part: string, index: number) => (
                  <div key={index} className="flex items-center gap-2 flex-wrap">
                    <span className="text-foreground">{part}</span>
                    {index < stemParts.length - 1 && (
                      <div className="flex items-center gap-2">
                        {card.prompt.options ? (
                          // Show selected option or placeholder
                          <div className="min-w-[120px] h-10 px-3 py-2 border border-border rounded-md bg-card flex items-center justify-center">
                            <span className={`text-sm font-medium ${
                              userAnswers[index] ? 'text-foreground' : 'text-muted-foreground'
                            }`}>
                              {userAnswers[index] || `Blank ${index + 1}`}
                            </span>
                          </div>
                        ) : (
                          <Input
                            value={userAnswers[index] || ''}
                            onChange={(e) => handleAnswerChange(index, e.target.value)}
                            placeholder={`Blank ${index + 1}`}
                            className="min-w-[120px] h-10 text-sm font-medium"
                            disabled={isSubmitted}
                          />
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {/* Show option chips if options are available */}
              {card.prompt.options && (
                <div className="space-y-3">
                  <div className="text-sm text-muted-foreground">
                    Click on an option to fill the blanks:
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {card.prompt.options.map((option: string, optionIndex: number) => (
                      <button
                        key={optionIndex}
                        onClick={() => {
                          // Find the first empty blank or allow cycling through blanks
                          const emptyBlankIndex = userAnswers.findIndex(answer => !answer.trim())
                          if (emptyBlankIndex !== -1) {
                            handleOptionSelect(emptyBlankIndex, optionIndex)
                          }
                        }}
                        className={`
                          px-3 py-2 rounded-lg border transition-all duration-200 text-sm font-medium
                          ${userAnswers.includes(option)
                            ? 'bg-primary/10 border-primary text-primary cursor-not-allowed opacity-50'
                            : 'bg-card border-border hover:border-primary/50 hover:bg-primary/5 text-foreground cursor-pointer'
                          }
                        `}
                        disabled={isSubmitted || userAnswers.includes(option)}
                      >
                        {option}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Reset button */}
              <div className="flex justify-center">
                <Button
                  onClick={handleReset}
                  variant="outline"
                  size="sm"
                  className="text-muted-foreground hover:text-foreground"
                >
                  Reset
                </Button>
              </div>
            </div>

            <Button 
              onClick={handleSubmit}
              disabled={userAnswers.some(answer => !answer.trim())}
              className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-medium py-3 rounded-xl transition-colors"
            >
              Submit Answers
            </Button>
          </>
        ) : (
          <>
            <div className={`p-4 rounded-lg ${
              feedback.correct ? 'bg-green-500/10 border border-green-500/20' : 'bg-red-500/10 border border-red-500/20'
            }`}>
              <div className="flex items-center space-x-2 mb-2">
                <span className={`font-medium ${
                  feedback.correct ? 'text-green-400' : 'text-red-400'
                }`}>
                  {feedback.correct ? 'All correct!' : feedback.timedOut ? 'Time\'s up!' : 'Some answers need work'}
                </span>
              </div>
              
              {/* Show which blanks were correct/incorrect */}
              <div className="space-y-2 mb-3">
                {userAnswers.map((answer, index) => (
                  <div key={index} className={`p-2 rounded border ${
                    feedback.perBlank[index] 
                      ? 'bg-green-500/5 border-green-500/10' 
                      : 'bg-red-500/5 border-red-500/10'
                  }`}>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium">
                        Blank {index + 1}:
                      </span>
                      <span className={`text-sm ${
                        feedback.perBlank[index] ? 'text-green-300' : 'text-red-300'
                      }`}>
                        "{answer || 'empty'}"
                      </span>
                      {!feedback.perBlank[index] && answer && (
                        <span className="text-xs text-muted-foreground">
                          (Accepted: {card.answer.solutions[index]?.join(', ') || 'none'})
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
              
              <p className="text-sm text-muted-foreground">{feedback.rationale}</p>
            </div>

            <div className="space-y-4">
              <div>
                <p className="text-sm text-muted-foreground mb-3 text-center">How did that feel?</p>
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { value: 1, label: "Too easy" },
                    { value: 3, label: "Just right" },
                    { value: 5, label: "Too confusing" }
                  ].map((grade) => (
                    <button
                      key={grade.value}
                      onClick={() => handleGradeClick(grade.value)}
                      className={`
                        relative p-4 rounded-xl border-2 transition-all duration-200 min-h-[80px] flex items-center justify-center text-center
                        ${userGrade === grade.value 
                          ? 'border-primary bg-primary/10 text-primary shadow-md scale-105' 
                          : 'border-border bg-card hover:border-primary/50 hover:bg-primary/5 text-foreground hover:shadow-sm'
                        }
                      `}
                    >
                      <span className="font-medium text-sm leading-tight">
                        {grade.label}
                      </span>
                      {userGrade === grade.value && (
                        <div className="absolute top-2 right-2 w-2 h-2 bg-primary rounded-full"></div>
                      )}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  )
}