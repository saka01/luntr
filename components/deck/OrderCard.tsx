"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { SessionCard } from "@/lib/session-engine"
import { DragDropContext, Droppable, Draggable, DropResult } from '@hello-pangea/dnd'

interface OrderCardProps {
  card: SessionCard
  onSubmit: (answer: any, feedback: any) => void
  timedOut?: boolean
  userInteracted?: boolean
}

interface StepItem {
  id: string
  content: string
  index: number
}

export function OrderCard({ card, onSubmit, timedOut = false, userInteracted = false }: OrderCardProps) {
  const [steps, setSteps] = useState<StepItem[]>([])
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [feedback, setFeedback] = useState<any>(null)
  const [userGrade, setUserGrade] = useState<number | null>(null)
  const [timeMs, setTimeMs] = useState(0)
  const [startTime] = useState(Date.now())

  // Initialize steps with shuffled order
  useEffect(() => {
    const stepItems: StepItem[] = card.prompt.steps.map((step: string, index: number) => ({
      id: `step-${index}`,
      content: step,
      index: index
    }))
    
    // Shuffle the steps
    const shuffled = [...stepItems].sort(() => Math.random() - 0.5)
    setSteps(shuffled)
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

  const handleDragEnd = (result: DropResult) => {
    if (!result.destination) return

    const newSteps = Array.from(steps)
    const [reorderedItem] = newSteps.splice(result.source.index, 1)
    newSteps.splice(result.destination.index, 0, reorderedItem)

    setSteps(newSteps)
    
    // Success haptic feedback
    if ('vibrate' in navigator) {
      navigator.vibrate([50, 50, 50])
    }
  }

  const moveStep = (fromIndex: number, toIndex: number) => {
    if (toIndex < 0 || toIndex >= steps.length) return
    
    const newSteps = Array.from(steps)
    const [movedItem] = newSteps.splice(fromIndex, 1)
    newSteps.splice(toIndex, 0, movedItem)
    setSteps(newSteps)
  }

  const handleSubmit = async () => {
    const elapsed = Date.now() - startTime
    setTimeMs(elapsed)
    setIsSubmitted(true)

    // Convert current order to indices
    const currentOrder = steps.map(step => step.index)
    
    // Evaluate locally
    const isCorrect = JSON.stringify(currentOrder) === JSON.stringify(card.answer.order)
    let firstMismatch: number | null = null
    
    if (!isCorrect) {
      for (let i = 0; i < currentOrder.length; i++) {
        if (currentOrder[i] !== card.answer.order[i]) {
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

  const handleGradeClick = (grade: number) => {
    setUserGrade(grade)
    
    const currentOrder = steps.map(step => step.index)
    
    onSubmit({
      type: 'order',
      order: currentOrder,
      timeMs,
      timedOut,
      grade: grade
    }, feedback)
  }

  const handleNext = () => {
    // Automatically set grade to "Too confusing" (5) for timeouts
    const finalGrade = timedOut ? 5 : 3 // Default to "Just right" if somehow called without timeout
    setUserGrade(finalGrade)
    
    const currentOrder = steps.map(step => step.index)
    
    onSubmit({
      type: 'order',
      order: currentOrder,
      timeMs,
      timedOut,
      grade: finalGrade
    }, feedback)
  }

  return (
    <Card className="bg-card/50 backdrop-blur-xl border-border">
      <CardHeader>
        <div className="flex justify-between items-start mb-2">
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
              <DragDropContext onDragEnd={handleDragEnd}>
                <Droppable droppableId="steps">
                  {(provided, snapshot) => (
                    <div
                      {...provided.droppableProps}
                      ref={provided.innerRef}
                      className={`space-y-2 p-2 rounded-lg transition-colors ${
                        snapshot.isDraggingOver ? 'bg-primary/5' : ''
                      }`}
                    >
                      {steps.map((step, index) => (
                        <Draggable key={step.id} draggableId={step.id} index={index}>
                          {(provided, snapshot) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              className={`
                                flex items-center gap-3 p-4 bg-input/30 border border-border rounded-lg transition-all duration-200 h-fit
                                ${snapshot.isDragging ? 'opacity-20 rotate-2 shadow-2xl bg-primary/10 border-primary/50 z-10' : 'hover:bg-input/50'}
                                select-none cursor-grab active:cursor-grabbing
                              `}
                            >
                              {/* Arrow controls */}
                              <div className="flex flex-col gap-1 flex-shrink-0">
                                <Button 
                                  size="sm" 
                                  variant="ghost"
                                  onClick={(e) => {
                                    e.stopPropagation()
                                    moveStep(index, index - 1)
                                  }}
                                  disabled={index === 0}
                                  className="h-6 w-6 p-0 text-xs hover:bg-primary/20"
                                >
                                  ↑
                                </Button>
                                <Button 
                                  size="sm" 
                                  variant="ghost"
                                  onClick={(e) => {
                                    e.stopPropagation()
                                    moveStep(index, index + 1)
                                  }}
                                  disabled={index === steps.length - 1}
                                  className="h-6 w-6 p-0 text-xs hover:bg-primary/20"
                                >
                                  ↓
                                </Button>
                              </div>
                              
                              <div className="w-8 h-8 bg-primary/20 text-primary rounded-full flex items-center justify-center text-sm font-medium flex-shrink-0">
                                {index + 1}
                              </div>
                              <span className="text-foreground text-sm leading-relaxed flex-1">
                                {step.content}
                              </span>
                              <div 
                                {...provided.dragHandleProps}
                                className="flex-shrink-0 text-muted-foreground/50 cursor-grab active:cursor-grabbing"
                              >
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                  <path d="M8 6h8M8 12h8M8 18h8"/>
                                </svg>
                              </div>
                            </div>
                          )}
                        </Draggable>
                      ))}
                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>
              </DragDropContext>
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
                    Your order: {steps[feedback.firstMismatch]?.index + 1}
                  </div>
                  <div className="p-2 bg-green-500/5 border border-green-500/10 rounded text-sm mt-1">
                    Correct order: {card.answer.order[feedback.firstMismatch] + 1}
                  </div>
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
            )}
          </>
        )}
      </CardContent>
    </Card>
  )
}