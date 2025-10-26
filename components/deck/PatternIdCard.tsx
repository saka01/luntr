"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { COPY } from "@/content/copy"
import { SessionCard } from "@/lib/session-engine"

interface PatternIdCardProps {
  card: SessionCard
  onSubmit: (answer: any, feedback: any) => void
  timedOut?: boolean
  userInteracted?: boolean
}

export function PatternIdCard({ card, onSubmit, timedOut = false, userInteracted = false }: PatternIdCardProps) {
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [feedback, setFeedback] = useState<any>(null)
  const [userGrade, setUserGrade] = useState<number | null>(null)
  const [timeMs, setTimeMs] = useState(0)
  const [startTime] = useState(Date.now())

  // Reset state when card changes
  useEffect(() => {
    setSelectedAnswer(null)
    setIsSubmitted(false)
    setFeedback(null)
    setUserGrade(null)
    setTimeMs(0)
  }, [card.id])

  // Handle timeout from parent
  useEffect(() => {
    if (timedOut && !isSubmitted) {
      const elapsed = Date.now() - startTime
      setTimeMs(elapsed)
      setIsSubmitted(true)
      
      // Check if user had selected an answer before timing out
      const wasCorrect = selectedAnswer !== null && selectedAnswer === card.answer.correctIndex
      
      setFeedback({
        correct: wasCorrect,
        timedOut: true,
        rationale: wasCorrect 
          ? "You had the right answer though."
          : "Don't worry, you can try again."
      })
    }
  }, [timedOut, isSubmitted, startTime, selectedAnswer, card.answer.correctIndex])

  const handleSubmit = async () => {
    if (selectedAnswer === null) return

    const elapsed = Date.now() - startTime
    setTimeMs(elapsed)
    setIsSubmitted(true)

    // Evaluate locally
    const isCorrect = selectedAnswer === card.answer.correctIndex
    setFeedback({
      correct: isCorrect,
      correctIndex: card.answer.correctIndex,
      rationale: card.answer.rationale
    })
  }

  const handleGradeClick = (grade: number) => {
    setUserGrade(grade)
    
    onSubmit({
      type: 'mcq',
      choice: selectedAnswer,
      timeMs,
      timedOut,
      grade: grade
    }, feedback)
  }

  const handleNext = () => {
    // Set grade based on whether they got it right before timing out
    let finalGrade: number
    if (timedOut) {
      // If they timed out but got the answer right, grade it as "Just right" (3)
      // If they timed out and got it wrong or no selection, grade as "Too confusing" (5)
      const wasCorrect = feedback?.correct || false
      finalGrade = wasCorrect ? 3 : 5
    } else {
      finalGrade = 3 // Default to "Just right" if somehow called without timeout
    }
    setUserGrade(finalGrade)
    
    onSubmit({
      type: 'mcq',
      choice: selectedAnswer,
      timeMs,
      timedOut,
      grade: finalGrade
    }, feedback)
  }

  const isCorrect = selectedAnswer === card.answer.correctIndex

  return (
    <Card className="bg-card/50 backdrop-blur-xl border-border">
      <CardHeader className="w-full">
        <p className="text-muted-foreground text-base font-bold text-center">{card.prompt.stem}</p>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {!isSubmitted ? (
          <>
            <div className="space-y-2">
              {card.prompt.options.map((option: string, index: number) => (
                <button
                  key={index}
                  onClick={() => setSelectedAnswer(index)}
                  className={`
                    w-full p-3 rounded-xl border-1 transition-all duration-200 text-left
                    ${selectedAnswer === index
                      ? 'border-primary bg-primary/10 text-primary shadow-md scale-[1.02]'
                      : 'border-border bg-card hover:border-primary/50 hover:bg-primary/5 text-foreground hover:shadow-sm'
                    }
                  `}
                >
                  <span className="text-sm font-medium leading-relaxed">
                    {option}
                  </span>
                </button>
              ))}
            </div>

            <Button 
              onClick={handleSubmit}
              disabled={selectedAnswer === null}
              className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-medium py-3 rounded-xl transition-colors min-h-[44px] text-base"
            >
              {COPY.session.submit}
            </Button>
          </>
        ) : (
          <>
            <div className={`rounded-lg`}>
              <div className="flex items-center space-x-2 mb-2">
                <span className={`font-medium ${
                  feedback.correct ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
                }`}>
                  {feedback.correct ? COPY.feedback.correct : feedback.timedOut ? 'Time\'s up!' : COPY.feedback.incorrect}
                </span>
              </div>
              {selectedAnswer !== null && (
                <div className="space-y-3">
                  {/* User's answer */}
                  <div className={`p-3 mb-3 rounded-md border ${
                    feedback.correct 
                      ? 'bg-green-500/5 border-green-500/10' 
                      : 'bg-red-500/5 border-red-500/10'
                  }`}>
                    <p className={`text-sm font-medium mb-1 ${
                      feedback.correct ? 'text-green-700 dark:text-green-300' : 'text-red-700 dark:text-red-300'
                    }`}>
                      Your answer:
                    </p>
                    <p className={`text-sm ${
                      feedback.correct ? 'text-green-800 dark:text-green-200' : 'text-red-800 dark:text-red-200'
                    }`}>
                      {card.prompt.options[selectedAnswer]}
                    </p>
                  </div>

                  {/* Correct answer - only show when wrong */}
                  {!feedback.correct && (
                    <div className="p-3 bg-green-500/5 border border-green-500/10 rounded-md mb-3">
                      <p className="text-sm text-green-700 dark:text-green-300 font-medium mb-1">Correct answer:</p>
                      <p className="text-sm text-green-800 dark:text-green-200">{card.prompt.options[feedback.correctIndex]}</p>
                    </div>
                  )}
                </div>
              )}
              <p className="text-sm text-muted-foreground">{feedback.rationale}</p>
            </div>

            {timedOut ? (
              <div className="space-y-4">
                <Button 
                  onClick={handleNext}
                  className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-medium py-3 rounded-xl transition-colors"
                >
                  Next
                </Button>
              </div>
            ) : (
              <div className="space-y-4 pt-4">
                <div>
                  <p className="text-sm text-muted-foreground mb-3 text-center italic">How did that feel?</p>
                  <div className="grid grid-cols-3 gap-3">
                    {[
                      { value: 1, label: "Too easy" },
                      { value: 3, label: "Just right" },
                      { value: 5, label: "Too hard" }
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
            )}
          </>
        )}
      </CardContent>
    </Card>
  )
}