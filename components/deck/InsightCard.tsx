"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { SessionCard } from "@/lib/session-engine"

interface InsightCardProps {
  card: SessionCard
  onSubmit: (answer: any, feedback: any) => void
}

export function InsightCard({ card, onSubmit }: InsightCardProps) {
  const [hasRead, setHasRead] = useState(false)
  const [startTime] = useState(Date.now())

  useEffect(() => {
    setHasRead(false)
  }, [card.id])

  const handleNext = () => {
    const timeMs = Date.now() - startTime
    
    onSubmit({
      type: 'insight',
      timeMs,
      grade: null // Insight cards are not graded
    }, {
      rationale: card.answer.rationale
    })
  }

  return (
    <Card className="bg-card/50 backdrop-blur-xl border-border">
      <CardHeader>
        <div className="flex justify-between items-start mb-2">
          {/* <CardTitle className="text-xl text-foreground">{card.pattern}</CardTitle> */}
        </div>
        <p className="text-muted-foreground text-base font-bold">{card.prompt.stem}</p>
      </CardHeader>
      
      <CardContent className="space-y-6">

        <div className="flex justify-center">
          <Button 
            onClick={handleNext}
            className="bg-primary hover:bg-primary/90 text-primary-foreground font-medium py-3 px-8 rounded-xl transition-colors"
          >
            Next
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
