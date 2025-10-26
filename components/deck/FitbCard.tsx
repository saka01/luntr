"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
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
  const [selectedBlankIndex, setSelectedBlankIndex] = useState<number | null>(null)

  // Initialize userAnswers array
  useEffect(() => {
    setUserAnswers(new Array(card.prompt.blanks).fill(''))
    setChoiceIndexes(new Array(card.prompt.blanks).fill(-1))
    setIsSubmitted(false)
    setFeedback(null)
    setUserGrade(null)
    setTimeMs(0)
    setIsTimedOut(false)
    setSelectedBlankIndex(null)
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
      setSelectedBlankIndex(null) // Clear selection after filling
    }
  }

  const handleBlankClick = (blankIndex: number) => {
    if (isSubmitted || !card.prompt.options) return
    setSelectedBlankIndex(blankIndex)
  }

  const handleReset = () => {
    if (isSubmitted) return
    setUserAnswers(new Array(card.prompt.blanks).fill(''))
    setChoiceIndexes(new Array(card.prompt.blanks).fill(-1))
    setSelectedBlankIndex(null)
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
      <CardContent className="space-y-6">
        {!isSubmitted ? (
          <>
            <div className="space-y-4">
              {/* <div className="text-foreground font-medium">
                Fill in the blanks with your answers:
              </div> */}
              
              {/* Render the stem with truly inline blanks */}
              <div className="text-foreground leading-relaxed">
                {stemParts.map((part: string, index: number) => (
                  <span key={index}>
                    <span>{part}</span>
                    {index < stemParts.length - 1 && (
                      <>
                        {card.prompt.options ? (
                          // Custom inline blank that looks like text
                          <span
                            onClick={() => handleBlankClick(index)}
                            className={`inline-block cursor-pointer border-b-2 border-dashed transition-all duration-200 ${
                              selectedBlankIndex === index
                                ? 'border-primary bg-primary/5'
                                : userAnswers[index]
                                ? 'border-primary bg-primary/5'
                                : 'border-muted-foreground hover:border-primary/50'
                            }`}
                            style={{
                              minWidth: userAnswers[index] ? 'auto' : '40px',
                              padding: '0 2px',
                              margin: '0 2px',
                              height: '1.2em',
                              display: 'inline-block',
                              verticalAlign: 'baseline'
                            }}
                          >
                            {userAnswers[index] || ''}
                          </span>
                        ) : (
                          // Custom inline input that behaves like text
                          <span
                            className="inline-block border-b-2 border-dashed border-muted-foreground hover:border-primary/50 transition-colors"
                            style={{
                              minWidth: '40px',
                              padding: '0 2px',
                              margin: '0 2px',
                              height: '1.2em',
                              display: 'inline-block',
                              verticalAlign: 'baseline'
                            }}
                          >
                            <input
                              type="text"
                              value={userAnswers[index] || ''}
                              onChange={(e) => handleAnswerChange(index, e.target.value)}
                              placeholder="___"
                              className="w-full bg-transparent border-none outline-none text-foreground text-inherit font-inherit"
                              style={{
                                padding: 0,
                                margin: 0,
                                height: '100%',
                                fontSize: 'inherit',
                                fontFamily: 'inherit'
                              }}
                              disabled={isSubmitted}
                            />
                          </span>
                        )}
                      </>
                    )}
                  </span>
                ))}
              </div>


            </div>

            <Button 
              onClick={handleSubmit}
              disabled={userAnswers.some(answer => !answer.trim())}
              className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-medium py-3 rounded-xl transition-colors"
              >
              Submit Answers
            </Button>
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
              {/* Show clickable options if available */}
              {card.prompt.options && (
                <div className="space-y-3">
                  <div className="text-sm text-muted-foreground text-center">
                    {selectedBlankIndex !== null 
                      ? `Click an option to fill blank ${selectedBlankIndex + 1}:`
                      : "Click on a blank first, then click an option to fill it:"
                    }
                  </div>
                  <div className="flex flex-wrap gap-3 justify-center">
                    {card.prompt.options.map((option: string, optionIndex: number) => {
                      const isUsed = userAnswers.includes(option)
                      const rotation = Math.random() * 6 - 3 // Random rotation between -3 and 3 degrees
                      
                      return (
                        <button
                          key={optionIndex}
                          onClick={() => {
                            // Use selected blank or find first empty blank
                            const targetBlankIndex = selectedBlankIndex !== null 
                              ? selectedBlankIndex 
                              : userAnswers.findIndex(answer => !answer.trim())
                            
                            if (targetBlankIndex !== -1) {
                              handleOptionSelect(targetBlankIndex, optionIndex)
                            }
                          }}
                          style={{ transform: `rotate(${rotation}deg)` }}
                          className={`
                            px-4 py-2 rounded-lg border transition-all duration-200 text-sm font-medium
                            hover:scale-105 active:scale-95
                            ${isUsed
                              ? 'bg-primary/10 border-primary text-primary cursor-not-allowed opacity-50'
                              : 'bg-card border-border hover:border-primary/50 hover:bg-primary/5 text-foreground cursor-pointer hover:shadow-sm'
                            }
                          `}
                          disabled={isSubmitted || isUsed}
                        >
                          {option}
                        </button>
                      )
                    })}
                  </div>
                </div>
              )}
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