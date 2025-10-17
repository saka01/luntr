"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"

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
    onSubmit(selectedAnswer, { feedback, isCorrect })
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
        <p className="text-muted-foreground">{card.prompt.stem}</p>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {!isSubmitted ? (
          <>
            <RadioGroup value={selectedAnswer?.toString()} onValueChange={(value) => setSelectedAnswer(parseInt(value))}>
              {card.prompt.options.map((option: string, index: number) => (
                <div key={index} className="flex items-center space-x-2">
                  <RadioGroupItem value={index.toString()} id={`option-${index}`} />
                  <Label htmlFor={`option-${index}`} className="text-foreground cursor-pointer">
                    {option}
                  </Label>
                </div>
              ))}
            </RadioGroup>

            <Button 
              onClick={handleSubmit}
              disabled={selectedAnswer === null}
              className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-medium py-3 rounded-xl transition-colors"
            >
              Submit Answer
            </Button>
          </>
        ) : (
          <>
            <div className={`p-4 rounded-lg ${isCorrect ? 'bg-green-500/10 border border-green-500/20' : 'bg-red-500/10 border border-red-500/20'}`}>
              <div className="flex items-center space-x-2 mb-2">
                <span className={`font-medium ${isCorrect ? 'text-green-400' : 'text-red-400'}`}>
                  {isCorrect ? 'Correct!' : 'Not quite'}
                </span>
              </div>
              <p className="text-sm text-muted-foreground">{feedback}</p>
            </div>

            <div className="space-y-4">
              <div>
                <Label className="text-foreground font-medium">How confident did that feel?</Label>
                <p className="text-sm text-muted-foreground mb-3">Rate your confidence from 1 (very difficult) to 5 (very easy)</p>
                <RadioGroup value={userGrade?.toString()} onValueChange={(value) => setUserGrade(parseInt(value))}>
                  <div className="grid grid-cols-5 gap-2">
                    {[1, 2, 3, 4, 5].map((grade) => (
                      <div key={grade} className="flex items-center space-x-2">
                        <RadioGroupItem value={grade.toString()} id={`grade-${grade}`} />
                        <Label htmlFor={`grade-${grade}`} className="text-sm cursor-pointer">
                          {grade}
                        </Label>
                      </div>
                    ))}
                  </div>
                </RadioGroup>
              </div>

              <Button 
                onClick={handleGradeSubmit}
                disabled={userGrade === null}
                className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-medium py-3 rounded-xl transition-colors"
              >
                Continue
              </Button>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  )
}
