"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Timer } from "@/components/ui/timer"
import { SessionCard } from "@/lib/session-engine"

interface FitbCardProps {
  card: SessionCard
  onSubmit: (answer: any, feedback: any) => void
}

export function FitbCard({ card, onSubmit }: FitbCardProps) {
  const [blanks, setBlanks] = useState<string[]>([])
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [feedback, setFeedback] = useState<any>(null)
  const [userGrade, setUserGrade] = useState<number | null>(null)
  const [timeMs, setTimeMs] = useState(0)
  const [timedOut, setTimedOut] = useState(false)
  const [startTime] = useState(Date.now())

  // Initialize blanks array
  useEffect(() => {
    setBlanks(new Array(card.prompt.blanks).fill(''))
    setIsSubmitted(false)
    setFeedback(null)
    setUserGrade(null)
    setTimeMs(0)
    setTimedOut(false)
  }, [card.id, card.prompt.blanks])

  const updateBlank = (index: number, value: string) => {
    const newBlanks = [...blanks]
    newBlanks[index] = value
    setBlanks(newBlanks)
  }

  const handleSubmit = async () => {
    const elapsed = Date.now() - startTime
    setTimeMs(elapsed)
    setIsSubmitted(true)

    // Evaluate locally
    const norm = (s: string) => s.trim().toLowerCase()
    const ok = blanks.map((b, i) => 
      (card.answer.solutions[i] || []).map(norm).includes(norm(b))
    )
    const correct = ok.every(Boolean)

    setFeedback({
      correct,
      ok,
      accepted: card.answer.solutions,
      rationale: card.answer.rationale
    })
  }

  const handleTimeout = () => {
    const elapsed = Date.now() - startTime
    setTimeMs(elapsed)
    setTimedOut(true)
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
    const finalGrade = timedOut && !userGrade ? 3 : grade // Downgrade timeout to 3 if user interacted
    setUserGrade(finalGrade)
    
    onSubmit({
      type: 'fitb',
      blanks: blanks,
      timeMs,
      timedOut,
      grade: finalGrade
    }, feedback)
  }

  // Split the stem by blanks markers (assuming format like "The ___ is ___")
  const stemParts = card.prompt.stem.split('___')

  return (
    <Card className="bg-card/50 backdrop-blur-xl border-border">
      <CardHeader>
        <div className="flex justify-between items-start mb-2">
          {/* <CardTitle className="text-xl text-foreground">{card.pattern}</CardTitle> */}
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
              <Label className="text-foreground font-medium">
                Fill in the blanks:
              </Label>
              
              {/* Render the stem with input fields */}
              <div className="space-y-3">
                {stemParts.map((part: string, index: number) => (
                  <div key={index} className="flex items-center gap-2 flex-wrap">
                    <span className="text-foreground">{part}</span>
                    {index < stemParts.length - 1 && (
                      <Input
                        value={blanks[index] || ''}
                        onChange={(e) => updateBlank(index, e.target.value)}
                        placeholder={`Blank ${index + 1}`}
                        className="w-32 inline-block"
                        autoFocus={index === 0}
                      />
                    )}
                  </div>
                ))}
              </div>
            </div>

            <Button 
              onClick={handleSubmit}
              disabled={blanks.some(b => !b.trim())}
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
                {blanks.map((blank, index) => (
                  <div key={index} className={`p-2 rounded border ${
                    feedback.ok[index] 
                      ? 'bg-green-500/5 border-green-500/10' 
                      : 'bg-red-500/5 border-red-500/10'
                  }`}>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium">
                        Blank {index + 1}:
                      </span>
                      <span className={`text-sm ${
                        feedback.ok[index] ? 'text-green-300' : 'text-red-300'
                      }`}>
                        "{blank}"
                      </span>
                      {!feedback.ok[index] && (
                        <span className="text-xs text-muted-foreground">
                          (Accepted: {feedback.accepted[index]?.join(', ') || 'none'})
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
