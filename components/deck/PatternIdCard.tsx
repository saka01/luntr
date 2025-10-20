"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { COPY } from "@/content/copy"

interface SessionCard {
  id: string
  slug: string
  pattern: string
  type: 'mcq' | 'plan'
  difficulty: 'E' | 'M' | 'H'
  prompt: any
  answer: any
}

interface PatternIdCardProps {
  card: SessionCard
  onSubmit: (answer: any, feedback: any) => void
}

export function PatternIdCard({ card, onSubmit }: PatternIdCardProps) {
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [feedback, setFeedback] = useState<string>("")
  const [userGrade, setUserGrade] = useState<number | null>(null)
  const [isGrading, setIsGrading] = useState(false)

  // Reset state when card changes
  useEffect(() => {
    setSelectedAnswer(null)
    setIsSubmitted(false)
    setFeedback("")
    setUserGrade(null)
    setIsGrading(false)
  }, [card.id])

  const handleSubmit = async () => {
    if (selectedAnswer === null) return

    setIsSubmitted(true)
    setIsGrading(true)

    try {
      // Get AI feedback
      const response = await fetch('/api/ai/grade', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          mode: 'mcq',
          pattern: card.pattern,
          problemSummary: card.prompt.stem,
        }),
      })

      if (response.ok) {
        const result = await response.json()
        setFeedback(result.rationale)
      } else {
        // Use stored rationale as fallback
        setFeedback(card.answer.rationale)
      }
    } catch (error) {
      console.error('Error getting feedback:', error)
      setFeedback(card.answer.rationale)
    } finally {
      setIsGrading(false)
    }
  }

  const handleGradeSubmit = () => {
    if (userGrade === null) return

    const isCorrect = selectedAnswer === card.answer.correctIndex
    onSubmit(selectedAnswer, { feedback, isCorrect, userGrade })
  }

  const handleGradeClick = (grade: number) => {
    const isCorrect = selectedAnswer === card.answer.correctIndex
    setUserGrade(grade)
    onSubmit(selectedAnswer, { feedback, isCorrect, userGrade: grade })
  }

  const isCorrect = selectedAnswer === card.answer.correctIndex

  return (
    <Card className="bg-card/50 backdrop-blur-xl border-border">
      <CardHeader>
        <div className="flex justify-between items-start mb-2">
          <CardTitle className="text-xl text-foreground">{card.pattern}</CardTitle>
          <Badge variant="outline" className="text-xs">
            {card.difficulty}
          </Badge>
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
            <div className={`p-4 rounded-lg ${isCorrect ? 'bg-green-500/10 border border-green-500/20' : 'bg-red-500/10 border border-red-500/20'}`}>
              <div className="flex items-center space-x-2 mb-2">
                <span className={`font-medium ${isCorrect ? 'text-green-400' : 'text-red-400'}`}>
                  {isCorrect ? COPY.feedback.correct : COPY.feedback.incorrect}
                </span>
              </div>
              {!isCorrect && selectedAnswer !== null && (
                <div className="mb-3 p-3 bg-red-500/5 border border-red-500/10 rounded-md">
                  <p className="text-sm text-red-300 font-medium mb-1">Your answer:</p>
                  <p className="text-sm text-red-200">{card.prompt.options[selectedAnswer]}</p>
                </div>
              )}
              {isGrading ? (
                <div className="flex items-center justify-center space-x-2 py-2">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">{feedback}</p>
              )}
            </div>

            <div className="space-y-4">
              <div>
                  <Label className="text-foreground font-medium text-base mb-3 text-center italic">How ya feelin'?</Label>
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { value: 1, label: "Litework" },
                    { value: 3, label: "6' 7\"" },
                    { value: 5, label: "Tuff" }
                  ].map((grade) => (
                    <button
                      key={grade.value}
                      onClick={() => handleGradeClick(grade.value)}
                      disabled={isGrading}
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