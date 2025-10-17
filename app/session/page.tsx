"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { COPY } from "@/content/copy"
import { PatternIdCard } from "@/components/deck/PatternIdCard"
import { PlanCard } from "@/components/deck/PlanCard"
import { SessionHeader } from "@/components/deck/SessionHeader"
import { SessionFooter } from "@/components/deck/SessionFooter"

interface SessionCard {
  id: string
  slug: string
  pattern: string
  type: 'mcq' | 'plan'
  difficulty: 'E' | 'M' | 'H'
  prompt: any
  answer: any
}

export default function SessionPage() {
  const [cards, setCards] = useState<SessionCard[]>([])
  const [currentCardIndex, setCurrentCardIndex] = useState(0)
  const [isLoading, setIsLoading] = useState(true)
  const [sessionComplete, setSessionComplete] = useState(false)
  const router = useRouter()

  useEffect(() => {
    loadSessionCards()
  }, [])

  const loadSessionCards = async () => {
    try {
      const response = await fetch('/api/session/cards')
      if (response.ok) {
        const sessionCards = await response.json()
        setCards(sessionCards)
      } else {
        console.error('Failed to load session cards')
      }
    } catch (error) {
      console.error('Error loading session cards:', error)
    } finally {
      setIsLoading(false)
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
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="text-foreground text-lg">Loading your session...</div>
        </div>
      </div>
    )
  }

  if (sessionComplete) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="w-full max-w-md bg-card/50 backdrop-blur-xl border-border">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl text-foreground">{COPY.session.completeTitle}</CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <p className="text-muted-foreground mb-6">
              Great job! You've completed your coding workout.
            </p>
            <Button 
              onClick={handleBackToDashboard}
              className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-medium py-3 rounded-xl transition-colors"
            >
              {COPY.session.backToDashboard}
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (cards.length === 0) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="w-full max-w-md bg-card/50 backdrop-blur-xl border-border">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl text-foreground">No Patterns Available</CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <p className="text-muted-foreground mb-6">
              No patterns are due for practice right now. Check back later!
            </p>
            <Button 
              onClick={handleBackToDashboard}
              className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-medium py-3 rounded-xl transition-colors"
            >
              {COPY.session.backToDashboard}
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  const currentCard = cards[currentCardIndex]

  return (
    <div className="min-h-screen bg-background">
      {/* Background gradient */}
      <div
        className="absolute inset-0 z-0"
        style={{
          background: "radial-gradient(ellipse 50% 35% at 50% 0%, rgba(226, 232, 240, 0.12), transparent 60%), #000000",
        }}
      />

      {/* Decorative elements */}
      <div className="absolute top-20 left-20 w-72 h-72 bg-primary/10 rounded-full blur-3xl" />
      <div className="absolute bottom-20 right-20 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />

      <div className="relative z-10 container mx-auto px-4 py-8">
        <SessionHeader 
          currentIndex={currentCardIndex + 1}
          totalCards={cards.length}
        />

        <div className="max-w-2xl mx-auto mt-8">
          {currentCard.type === 'mcq' ? (
            <PatternIdCard
              card={currentCard}
              onSubmit={handleCardSubmit}
            />
          ) : (
            <PlanCard
              card={currentCard}
              onSubmit={handleCardSubmit}
            />
          )}
        </div>

        <SessionFooter 
          currentIndex={currentCardIndex + 1}
          totalCards={cards.length}
        />
      </div>
    </div>
  )
}
