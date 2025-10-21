"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Timer } from "@/components/ui/timer"
import { SessionCard } from "@/lib/session-engine"

interface OrderCardProps {
  card: SessionCard
  onSubmit: (answer: any, feedback: any) => void
}

export function OrderCard({ card, onSubmit }: OrderCardProps) {
  const [order, setOrder] = useState<number[]>([])
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [feedback, setFeedback] = useState<any>(null)
  const [userGrade, setUserGrade] = useState<number | null>(null)
  const [timeMs, setTimeMs] = useState(0)
  const [timedOut, setTimedOut] = useState(false)
  const [startTime] = useState(Date.now())

  // Initialize order with shuffled indices
  useEffect(() => {
    const indices = Array.from({ length: card.prompt.steps.length }, (_, i) => i)
    setOrder([...indices].sort(() => Math.random() - 0.5))
    setIsSubmitted(false)
    setFeedback(null)
    setUserGrade(null)
    setTimeMs(0)
    setTimedOut(false)
  }, [card.id])

  const moveStep = (fromIndex: number, toIndex: number) => {
    const newOrder = [...order]
    const [movedItem] = newOrder.splice(fromIndex, 1)
    newOrder.splice(toIndex, 0, movedItem)
    setOrder(newOrder)
  }

  const handleSubmit = async () => {
    const elapsed = Date.now() - startTime
    setTimeMs(elapsed)
    setIsSubmitted(true)

    // Evaluate locally
    const isCorrect = JSON.stringify(order) === JSON.stringify(card.answer.order)
    let firstMismatch: number | null = null
    
    if (!isCorrect) {
      for (let i = 0; i < order.length; i++) {
        if (order[i] !== card.answer.order[i]) {
          firstMismatch = i
          break
        }
      }
    }

    setFeedback({
      correct: isCorrect,
      firstMismatch,
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
      type: 'order',
      order: order,
      timeMs,
      timedOut,
      grade: finalGrade
    }, feedback)
  }

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
              cardType="order"
              estSeconds={card.estSeconds}
              onTimeout={handleTimeout}
              onUserInteraction={handleUserInteraction}
            />
          </div>
        </div>
        <p className="text-muted-foreground">{card.prompt.stem}</p>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {!isSubmitted ? (
          <>
            <div className="space-y-2">
              <Label className="text-foreground font-medium">
                Drag to reorder the steps:
              </Label>
              <div className="space-y-2">
                {order.map((stepIndex, index) => (
                  <div
                    key={`${stepIndex}-${index}`}
                    className="flex items-center gap-3 p-3 bg-input/30 border border-border rounded-lg cursor-move hover:bg-input/50 transition-colors"
                    draggable
                    onDragStart={(e) => e.dataTransfer.setData('text/plain', index.toString())}
                    onDragOver={(e) => e.preventDefault()}
                    onDrop={(e) => {
                      e.preventDefault()
                      const fromIndex = parseInt(e.dataTransfer.getData('text/plain'))
                      moveStep(fromIndex, index)
                    }}
                  >
                    <div className="w-6 h-6 bg-primary/20 text-primary rounded-full flex items-center justify-center text-sm font-medium">
                      {index + 1}
                    </div>
                    <span className="text-foreground">{card.prompt.steps[stepIndex]}</span>
                  </div>
                ))}
              </div>
            </div>

            <Button 
              onClick={handleSubmit}
              className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-medium py-3 rounded-xl transition-colors"
            >
              Submit Order
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
                  {feedback.correct ? 'Correct!' : feedback.timedOut ? 'Time\'s up!' : 'Not quite right'}
                </span>
              </div>
              
              {feedback.firstMismatch !== null && (
                <div className="mb-3">
                  <p className="text-sm text-muted-foreground mb-2">
                    First mismatch at step {feedback.firstMismatch + 1}:
                  </p>
                  <div className="p-2 bg-red-500/5 border border-red-500/10 rounded text-sm">
                    Your order: {order[feedback.firstMismatch] + 1}
                  </div>
                  <div className="p-2 bg-green-500/5 border border-green-500/10 rounded text-sm mt-1">
                    Correct order: {card.answer.order[feedback.firstMismatch] + 1}
                  </div>
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
