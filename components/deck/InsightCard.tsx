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
        <p className="text-muted-foreground text-lg font-medium">{card.prompt.stem}</p>
      </CardHeader>
      
      <CardContent className="space-y-6">
        <div className="space-y-4">
          {/* Insight content */}
          <div className="p-4 rounded-lg bg-blue-500/10 border border-blue-500/20">
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                {/* <div className="w-6 h-6 text-blue-500 rounded-full flex items-center justify-center text-sm font-medium flex-shrink-0 mt-0.5">
                  💡
                </div> */}
                <div>
                  {/* <h4 className="font-medium text-blue-400 mb-2">Key Insight</h4> */}
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {card.answer.rationale}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Example if provided */}
          {card.prompt.example && (
            <div className="p-4 rounded-lg bg-green-500/10 border border-green-500/20">
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-green-500/20 text-green-500 rounded-full flex items-center justify-center text-sm font-medium flex-shrink-0 mt-0.5">
                  📝
                </div>
                <div>
                  <h4 className="font-medium text-green-400 mb-2">Example</h4>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {card.prompt.example}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Tags if provided */}
          {card.tags && (
            <div className="flex flex-wrap gap-2">
              {JSON.parse(card.tags).map((tag: string, index: number) => (
                <Badge key={index} variant="secondary" className="text-xs">
                  {tag}
                </Badge>
              ))}
            </div>
          )}
        </div>

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
