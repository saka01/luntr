"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { COPY } from "@/content/copy"
import { PatternIdCard } from "@/components/deck/PatternIdCard"
import { PlanCard } from "@/components/deck/PlanCard"
import { OrderCard } from "@/components/deck/OrderCard"
import { FitbCard } from "@/components/deck/FitbCard"
import { InsightCard } from "@/components/deck/InsightCard"
import { SessionHeader } from "@/components/deck/SessionHeader"
import { SessionFooter } from "@/components/deck/SessionFooter"
import { SessionCard } from "@/lib/session-engine"

export default function SessionPage() {
  const [cards, setCards] = useState<SessionCard[]>([])
  const [currentCardIndex, setCurrentCardIndex] = useState(0)
  const [isLoading, setIsLoading] = useState(true)
  const [sessionComplete, setSessionComplete] = useState(false)
  const [sessionSize, setSessionSize] = useState(10)
  const [completedCardIds, setCompletedCardIds] = useState<string[]>([])
  const [isAddingCards, setIsAddingCards] = useState(false)
  const [selectedPattern, setSelectedPattern] = useState<string>('two-pointers')
  const router = useRouter()

  useEffect(() => {
    // Get pattern from URL params
    const urlParams = new URLSearchParams(window.location.search)
    const pattern = urlParams.get('pattern') || 'two-pointers'
    setSelectedPattern(pattern)
    loadSessionCards()
  }, [])

  const loadSessionCards = async (size?: number, excludeIds?: string[]) => {
    try {
      const params = new URLSearchParams()
      if (size) params.append('size', size.toString())
      if (excludeIds && excludeIds.length > 0) params.append('excludeIds', excludeIds.join(','))
      params.append('pattern', selectedPattern)
      
      const response = await fetch(`/api/session/cards?${params.toString()}`)
      if (response.ok) {
        const sessionCards = await response.json()
        setCards(sessionCards)
        setCurrentCardIndex(0)
        setSessionComplete(false)
      } else {
        console.error('Failed to load session cards')
      }
    } catch (error) {
      console.error('Error loading session cards:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleAddMoreCards = async () => {
    setIsAddingCards(true)
    try {
      const newSize = sessionSize + 10
      setSessionSize(newSize)
      await loadSessionCards(newSize, completedCardIds)
    } finally {
      setIsAddingCards(false)
    }
  }

  const handleCardSubmit = async (answer: any, feedback: any) => {
    const currentCard = cards[currentCardIndex]
    
    try {
      const response = await fetch('/api/session/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          cardId: currentCard.id,
          answer,
          feedback,
        }),
      })

      if (response.ok) {
        // Add to completed cards
        setCompletedCardIds(prev => [...prev, currentCard.id])
        
        // Move to next card or complete session
        if (currentCardIndex < cards.length - 1) {
          setCurrentCardIndex(currentCardIndex + 1)
        } else {
          setSessionComplete(true)
        }
      } else {
        console.error('Failed to submit card')
      }
    } catch (error) {
      console.error('Error submitting card:', error)
    }
  }

  const handleBackToDashboard = () => {
    router.push('/dashboard')
  }

  if (isLoading) {
    return (
      <div className="h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="text-foreground text-lg">Loading your session...</div>
        </div>
      </div>
    )
  }

  if (sessionComplete) {
    return (
      <div className="h-screen bg-background flex items-center justify-center p-4">
        <Card className="w-full max-w-md bg-card/50 backdrop-blur-xl border-border">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl text-foreground">{COPY.session.completeTitle}</CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <p className="text-muted-foreground mb-6">
              Great job! You've completed your coding workout.
            </p>
            <div className="space-y-3">
              <Button 
                onClick={handleAddMoreCards}
                disabled={isAddingCards}
                className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-medium py-3 rounded-xl transition-colors disabled:opacity-50"
              >
                {isAddingCards ? 'Loading Cards...' : 'Add 10 more'}
              </Button>
              <Button 
                onClick={handleBackToDashboard}
                variant="outline"
                className="w-full bg-card/50 hover:bg-card/70 border-border font-medium py-3 rounded-xl transition-colors"
              >
                {COPY.session.backToDashboard}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (cards.length === 0) {
    return (
      <div className="h-screen bg-background flex items-center justify-center p-4">
        <Card className="w-full max-w-md bg-card/50 backdrop-blur-xl border-border">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl text-foreground">No Patterns Available</CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <p className="text-muted-foreground mb-6">
              No patterns are due for practice right now. You can add more cards to practice or check back later!
            </p>
            <div className="space-y-3">
              <Button 
                onClick={handleAddMoreCards}
                disabled={isAddingCards}
                className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-medium py-3 rounded-xl transition-colors disabled:opacity-50"
              >
                {isAddingCards ? 'Loading Cards...' : 'Add 10 More Cards'}
              </Button>
              <Button 
                onClick={handleBackToDashboard}
                variant="outline"
                className="w-full bg-card/50 hover:bg-card/70 border-border font-medium py-3 rounded-xl transition-colors"
              >
                {COPY.session.backToDashboard}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  const currentCard = cards[currentCardIndex]

  return (
    <div className="h-full bg-background overflow-hidden">

      <div className="relative z-10 h-full max-h-screen flex flex-col container mx-auto px-4 py-8 gap-4 overflow-hidden">
        <SessionHeader 
          currentIndex={currentCardIndex + 1}
          totalCards={cards.length}
        />

        <div className="max-w-2xl w-full h-fit">
          {currentCard.type === 'mcq' ? (
            <PatternIdCard
              key={currentCard.id}
              card={currentCard}
              onSubmit={handleCardSubmit}
            />
          ) : currentCard.type === 'plan' ? (
            <PlanCard
              key={currentCard.id}
              card={currentCard}
              onSubmit={handleCardSubmit}
            />
          ) : currentCard.type === 'order' ? (
            <OrderCard
              key={currentCard.id}
              card={currentCard}
              onSubmit={handleCardSubmit}
            />
          ) : currentCard.type === 'fitb' ? (
            <FitbCard
              key={currentCard.id}
              card={currentCard}
              onSubmit={handleCardSubmit}
            />
          ) : currentCard.type === 'insight' ? (
            <InsightCard
              key={currentCard.id}
              card={currentCard}
              onSubmit={handleCardSubmit}
            />
          ) : null}
        </div>


      </div>
    </div>
  )
}
