"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { COPY } from "@/content/copy"
import { SessionCard } from "@/lib/session-engine"

interface PlanCardProps {
  card: SessionCard
  onSubmit: (answer: any, feedback: any) => void
  timedOut?: boolean
  userInteracted?: boolean
}

export function PlanCard({ card, onSubmit, timedOut = false, userInteracted = false }: PlanCardProps) {
  const [userPlan, setUserPlan] = useState("")
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [feedback, setFeedback] = useState<any>(null)
  const [userGrade, setUserGrade] = useState<number | null>(null)
  const [timeMs, setTimeMs] = useState(0)
  const [startTime] = useState(Date.now())

  // Reset state when card changes
  useEffect(() => {
    setUserPlan("")
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
    if (!userPlan.trim()) return

    const elapsed = Date.now() - startTime
    setTimeMs(elapsed)
    setIsSubmitted(true)

    // Evaluate locally using the plan evaluation logic
    const norm = (s: string) => s.trim().toLowerCase()
    const lines = userPlan.split('\n').map(norm).filter(Boolean)
    const covered = card.answer.checklist.map((item: string) => {
      const terms = norm(item).split(/\s+/).slice(0, 3).join(' ')
      return lines.some(l => l.includes(terms))
    })
    const coverage = covered.filter(Boolean).length / card.answer.checklist.length
    const missing = card.answer.checklist.filter((_: any, i: number) => !covered[i])
    const correct = coverage >= 0.7

    setFeedback({
      correct,
      coverage,
      missing,
      rationale: card.answer.rationale
    })
  }

  const handleGradeClick = (grade: number) => {
    const finalGrade = timedOut && !userInteracted ? 5 : (timedOut && userInteracted ? 3 : grade)
    setUserGrade(finalGrade)
    
    onSubmit({
      type: 'plan',
      text: userPlan,
      timeMs,
      timedOut,
      grade: finalGrade
    }, feedback)
  }

  return (
    <Card className="bg-card/50 backdrop-blur-xl border-border">
      <CardHeader>
        <div className="flex justify-between items-end mb-2">
          {/* <CardTitle className="text-xl text-foreground">{card.pattern}</CardTitle> */}
        </div>
        <p className="text-muted-foreground">{card.prompt.stem}</p>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {!isSubmitted ? (
          <>
            <div className="space-y-2">
              <Label htmlFor="plan" className="text-foreground font-medium">
                Write your coding approach (2-5 steps):
              </Label>
              <Textarea
                id="plan"
                placeholder="1. Analyze the problem...&#10;2. Choose data structure...&#10;3. Implement solution..."
                value={userPlan}
                onChange={(e) => setUserPlan(e.target.value)}
                className="min-h-[120px] bg-input/50 border-border text-foreground placeholder:text-muted-foreground focus:border-primary focus:ring-primary/20 text-base"
                maxLength={400}
              />
              <p className="text-xs text-muted-foreground">
                {userPlan.length}/400 characters
              </p>
            </div>

            <Button 
              onClick={handleSubmit}
              disabled={!userPlan.trim()}
              className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-medium py-3 rounded-xl transition-colors"
            >
              Submit Plan
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
                  {feedback.correct ? 'Great plan!' : feedback.timedOut ? 'Time\'s up!' : 'Good attempt, but missing some steps'}
                </span>
              </div>
              
              {feedback.coverage !== undefined && (
                <div className="mb-3">
                  <p className="text-sm text-muted-foreground mb-2">
                    Coverage: {Math.round(feedback.coverage * 100)}% ({Math.round(feedback.coverage * card.answer.checklist.length)}/{card.answer.checklist.length} steps covered)
                  </p>
                  
                  {feedback.missing && feedback.missing.length > 0 && (
                    <div className="p-3 bg-yellow-500/5 border border-yellow-500/10 rounded-md">
                      <p className="text-sm text-yellow-300 font-medium mb-1">Missing steps:</p>
                      <ul className="text-sm text-yellow-200 space-y-1">
                        {feedback.missing.map((step: string, index: number) => (
                          <li key={index}>• {step}</li>
                        ))}
                      </ul>
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
