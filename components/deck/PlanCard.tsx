"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
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

interface PlanCardProps {
  card: SessionCard
  onSubmit: (answer: any, feedback: any) => void
}

export function PlanCard({ card, onSubmit }: PlanCardProps) {
  const [userPlan, setUserPlan] = useState("")
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [feedback, setFeedback] = useState<{ score_0_5: number; brief_feedback: string } | null>(null)
  const [userGrade, setUserGrade] = useState<number | null>(null)
  const [isGrading, setIsGrading] = useState(false)

  const handleSubmit = async () => {
    if (!userPlan.trim()) return

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
          mode: 'plan',
          problemSummary: card.prompt.stem,
          userPlan: userPlan.trim(),
          checklist: card.answer.checklist,
        }),
      })

      if (response.ok) {
        const result = await response.json()
        setFeedback(result)
      } else {
        // Use fallback feedback
        setFeedback({ score_0_5: 3, brief_feedback: "Good attempt. Keep practicing!" })
      }
    } catch (error) {
      console.error('Error getting feedback:', error)
      setFeedback({ score_0_5: 3, brief_feedback: "Good attempt. Keep practicing!" })
    } finally {
      setIsGrading(false)
    }
  }

  const handleGradeSubmit = () => {
    if (userGrade === null) return

    onSubmit(userPlan, { feedback, userGrade })
  }

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
            <div className="space-y-2">
              <Label htmlFor="plan" className="text-foreground font-medium">
                Write your coding approach (2-5 steps):
              </Label>
              <Textarea
                id="plan"
                placeholder="1. Analyze the problem...&#10;2. Choose data structure...&#10;3. Implement solution..."
                value={userPlan}
                onChange={(e) => setUserPlan(e.target.value)}
                className="min-h-[120px] bg-input/50 border-border text-foreground placeholder:text-muted-foreground focus:border-primary focus:ring-primary/20"
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
            <div className="p-4 rounded-lg bg-blue-500/10 border border-blue-500/20">
              <div className="flex items-center space-x-2 mb-2">
                <span className="font-medium text-blue-400">
                  Score: {feedback?.score_0_5}/5
                </span>
              </div>
              <p className="text-sm text-muted-foreground">{feedback?.brief_feedback}</p>
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
