"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
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
      setFeedback({
        correct: false,
        timedOut: true,
        rationale: "Time's up! Don't worry, you can try again."
      })
    }
  }, [timedOut, isSubmitted, startTime])

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
    const finalGrade = timedOut && !userInteracted ? 5 : (timedOut && userInteracted ? 3 : grade)
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
      <CardHeader>
        <div className="flex justify-between items-start mb-2">
          {/* <CardTitle className="text-xl text-foreground">{card.pattern}</CardTitle> */}
        </div>
        <p className="text-muted-foreground text-base">{card.prompt.stem}</p>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {!isSubmitted ? (
          <>
            <RadioGroup value={selectedAnswer?.toString()} onValueChange={(value) => setSelectedAnswer(parseInt(value))}>
              {card.prompt.options.map((option: string, index: number) => (
                <div key={index} className="flex items-center space-x-3">
                  <RadioGroupItem value={index.toString()} id={`option-${index}`} className="w-5 h-5" />
                  <Label htmlFor={`option-${index}`} className="text-foreground cursor-pointer text-base min-h-[44px] flex items-center">
                    {option}
                  </Label>
                </div>
              ))}
            </RadioGroup>

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
            <div className={`p-4 rounded-lg ${
              feedback.correct ? 'bg-green-500/10 border border-green-500/20' : 'bg-red-500/10 border border-red-500/20'
            }`}>
              <div className="flex items-center space-x-2 mb-2">
                <span className={`font-medium ${
                  feedback.correct ? 'text-green-400' : 'text-red-400'
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
                      feedback.correct ? 'text-green-300' : 'text-red-300'
                    }`}>
                      Your answer:
                    </p>
                    <p className={`text-sm ${
                      feedback.correct ? 'text-green-200' : 'text-red-200'
                    }`}>
                      {card.prompt.options[selectedAnswer]}
                    </p>
                  </div>

                  {/* Correct answer - only show when wrong */}
                  {!feedback.correct && (
                    <div className="p-3 bg-green-500/5 border border-green-500/10 rounded-md mb-3">
                      <p className="text-sm text-green-300 font-medium mb-1">Correct answer:</p>
                      <p className="text-sm text-green-200">{card.prompt.options[feedback.correctIndex]}</p>
                    </div>
                  )}
                </div>
              )}
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