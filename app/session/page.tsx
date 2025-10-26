"use client"

import { useState, useEffect, useMemo } from "react"
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
import { motion } from "framer-motion"
import { SessionLoadingScreen } from "../../components/session-loading-screen"
import { useDevSettings } from "../../lib/dev-settings-context"

export default function SessionPage() {
  const [cards, setCards] = useState<SessionCard[]>([])
  const [filteredCards, setFilteredCards] = useState<SessionCard[]>([])
  const [currentCardIndex, setCurrentCardIndex] = useState(0)
  const [isLoading, setIsLoading] = useState(true)
  const [sessionComplete, setSessionComplete] = useState(false)
  const [sessionSize, setSessionSize] = useState(10)
  const [completedCardIds, setCompletedCardIds] = useState<string[]>([])
  const [isAddingCards, setIsAddingCards] = useState(false)
  const [selectedPattern, setSelectedPattern] = useState<string>('two-pointers')
  const [streak, setStreak] = useState<number>(0)
  const [timedOut, setTimedOut] = useState(false)
  const [userInteracted, setUserInteracted] = useState(false)
  const { settings: devSettings } = useDevSettings()
  const router = useRouter()

  useEffect(() => {
    // Get pattern from URL params
    const urlParams = new URLSearchParams(window.location.search)
    const pattern = urlParams.get('pattern') || 'two-pointers'
    setSelectedPattern(pattern)
  }, [])

  // Get the effective pattern to use (dev settings or URL)
  const effectivePattern = useMemo(() => {
    return process.env.NODE_ENV === 'development' && devSettings.enabled && devSettings.patternFilter 
      ? devSettings.patternFilter 
      : selectedPattern
  }, [devSettings.enabled, devSettings.patternFilter, selectedPattern])

  // Load cards when component mounts or when pattern changes
  useEffect(() => {
    loadSessionCards()
  }, [effectivePattern])

  // Filter cards based on dev settings (only in development)
  useEffect(() => {
    if (process.env.NODE_ENV === 'production' || !devSettings.enabled) {
      setFilteredCards(cards)
      return
    }

    let filtered = [...cards]

    // Filter by card type
    if (devSettings.cardTypeFilter !== 'all') {
      filtered = filtered.filter(card => card.type === devSettings.cardTypeFilter)
    }

    // Filter by pattern - only if pattern filter is not empty (this is already handled by API fetch)
    // if (devSettings.patternFilter && devSettings.patternFilter.trim() !== '') {
    //   const normalizedFilter = devSettings.patternFilter.toLowerCase().replace(/-/g, ' ')
    //   filtered = filtered.filter(card => {
    //     const normalizedPattern = card.pattern.toLowerCase().replace(/-/g, ' ')
    //     return normalizedPattern.includes(normalizedFilter) || normalizedFilter.includes(normalizedPattern)
    //   })
    // }

    // Filter by difficulty
    if (devSettings.difficultyFilter !== 'all') {
      filtered = filtered.filter(card => card.difficulty === devSettings.difficultyFilter)
    }

    // Limit session size - only if we have cards to limit
    // But don't apply this during "add more cards" flow - let the API handle the sizing
    if (devSettings.sessionSize && devSettings.sessionSize > 0 && filtered.length > devSettings.sessionSize) {
      // Only limit if we're on initial load (cards.length <= original request size)
      if (cards.length <= 20) { // Only limit on initial 10-20 card loads
        filtered = filtered.slice(0, devSettings.sessionSize)
      }
    }

    setFilteredCards(filtered)
    
    // Reset current card index if it's beyond the filtered cards length
    if (currentCardIndex >= filtered.length) {
      setCurrentCardIndex(0)
    }
  }, [cards, devSettings])

  const loadSessionCards = async (size?: number, excludeIds?: string[]) => {
    try {
      setIsLoading(true)
      const requestSize = size || 10
      const params = new URLSearchParams()
      params.append('size', requestSize.toString())
      if (excludeIds && excludeIds.length > 0) params.append('excludeIds', excludeIds.join(','))
      // Map pattern to the correct format for the API
      const apiPattern = effectivePattern === 'two-pointers' ? 'two-pointers' : effectivePattern
      params.append('pattern', apiPattern)
      
      // Add dev mode flag if enabled
      if (process.env.NODE_ENV === 'development' && devSettings.enabled) {
        params.append('devMode', 'true')
      }
      
      const response = await fetch(`/api/session/cards?${params.toString()}`)
      if (response.ok) {
        const data = await response.json()
        console.log(`Loaded ${data.cards.length} cards from API (requested ${requestSize})`)
        console.log('Card types:', data.cards.map((c: any) => c.type))
        
        if (data.cards.length < requestSize) {
          console.warn(`⚠️ API returned ${data.cards.length} cards but ${requestSize} were requested`)
        }
        
        setCards(data.cards)
        setStreak(data.streak)
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
      // Get all card IDs that have been shown (not just completed)
      const allShownCardIds = cards.map(c => c.id)
      
      const params = new URLSearchParams()
      params.append('size', '10')
      params.append('excludeIds', allShownCardIds.join(','))
      // Map pattern to the correct format for the API
      const apiPattern = effectivePattern === 'two-pointers' ? 'two-pointers' : effectivePattern
      params.append('pattern', apiPattern)
      
      // Add dev mode flag if enabled
      if (process.env.NODE_ENV === 'development' && devSettings.enabled) {
        params.append('devMode', 'true')
      }
      
      const response = await fetch(`/api/session/cards?${params.toString()}`)
      if (response.ok) {
        const data = await response.json()
        console.log(`Added ${data.cards.length} more cards (requested 10)`)
        console.log('New card types:', data.cards.map((c: any) => c.type))
        // Append new cards to existing ones instead of replacing
        setCards(prevCards => [...prevCards, ...data.cards])
        setStreak(data.streak)
        setSessionComplete(false)
      } else {
        console.error('Failed to load more cards')
      }
    } catch (error) {
      console.error('Error adding more cards:', error)
    } finally {
      setIsAddingCards(false)
    }
  }

  const handleTimeout = () => {
    setTimedOut(true)
  }

  const handleUserInteraction = () => {
    setUserInteracted(true)
  }

  const handleCardSubmit = async (answer: any, feedback: any) => {
    const currentCard = filteredCards[currentCardIndex]
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
        
        // Reset timer state for next card
        setTimedOut(false)
        setUserInteracted(false)
        
        // Move to next card or complete session
        if (currentCardIndex < filteredCards.length - 1) {
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
    return <SessionLoadingScreen />
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

  if (filteredCards.length === 0) {
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

  const currentCard = filteredCards[currentCardIndex]

  return (
    <div className="h-full bg-background overflow-hidden">

      <div className="relative z-10 h-full max-h-screen flex flex-col container mx-auto px-4 py-4 gap-4 overflow-hidden">
        <SessionHeader 
          currentIndex={currentCardIndex + 1}
          totalCards={filteredCards.length}
          streak={streak}
          cardType={currentCard.type}
          estSeconds={process.env.NODE_ENV === 'development' && devSettings.skipTimers ? 0 : currentCard.estSeconds}
          onTimeout={handleTimeout}
          onUserInteraction={handleUserInteraction}
          cardId={currentCard.id}
        />


        <motion.div 
          className="max-w-2xl w-full h-fit"
          key={currentCardIndex}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3 }}
        >
          {currentCard.type === 'mcq' ? (
            <PatternIdCard
              key={currentCard.id}
              card={currentCard}
              onSubmit={handleCardSubmit}
              timedOut={timedOut}
              userInteracted={userInteracted}
            />
          ) : currentCard.type === 'plan' ? (
            <PlanCard
              key={currentCard.id}
              card={currentCard}
              onSubmit={handleCardSubmit}
              timedOut={timedOut}
              userInteracted={userInteracted}
            />
          ) : currentCard.type === 'order' ? (
            <OrderCard
              key={currentCard.id}
              card={currentCard}
              onSubmit={handleCardSubmit}
              timedOut={timedOut}
              userInteracted={userInteracted}
            />
          ) : currentCard.type === 'fitb' ? (
            <FitbCard
              key={currentCard.id}
              card={currentCard}
              onSubmit={handleCardSubmit}
              timedOut={timedOut}
              userInteracted={userInteracted}
            />
          ) : currentCard.type === 'insight' ? (
            <InsightCard
              key={currentCard.id}
              card={currentCard}
              onSubmit={handleCardSubmit}
            />
          ) : null}
        </motion.div>

        {/* Debug Info - only in development */}
        {process.env.NODE_ENV === 'development' && devSettings.enabled && devSettings.showCardDebugInfo && (
          <div className="mt-4 p-4 bg-muted/50 rounded-lg border border-border">
            <h4 className="font-medium text-sm mb-2">Card Debug Info:</h4>
            <div className="text-xs space-y-1 text-muted-foreground">
              <div>ID: {currentCard.id}</div>
              <div>Type: {currentCard.type}</div>
              <div>Pattern: {currentCard.pattern}</div>
              <div>Difficulty: {currentCard.difficulty}</div>
              <div>Subtype: {currentCard.subtype || 'none'}</div>
              <div>Tags: {currentCard.tags || 'none'}</div>
              <div>Est. Seconds: {currentCard.estSeconds || 'none'}</div>
              <div>Current Index: {currentCardIndex + 1} / {filteredCards.length}</div>
              <div>Total Cards: {cards.length} (filtered: {filteredCards.length})</div>
            </div>
          </div>
        )}

      </div>

    </div>
  )
}
