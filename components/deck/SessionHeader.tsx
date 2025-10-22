"use client"

import { useState, useEffect, useRef } from "react"
import { Badge } from "@/components/ui/badge"
import { COPY } from "@/content/copy"
import { CardType } from "@/lib/cards/types"
import { defaultEstSeconds } from "@/lib/cards/timer"

interface SessionHeaderProps {
  currentIndex: number
  totalCards: number
  streak?: number
  cardType?: CardType
  estSeconds?: number
  onTimeout?: () => void
  onUserInteraction?: () => void
}

export function SessionHeader({ 
  currentIndex, 
  totalCards, 
  streak, 
  cardType,
  estSeconds,
  onTimeout,
  onUserInteraction
}: SessionHeaderProps) {
  const [timeLeft, setTimeLeft] = useState(0)
  const [isActive, setIsActive] = useState(false)
  const [hasInteracted, setHasInteracted] = useState(false)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)
  const timeoutRef = useRef<NodeJS.Timeout | null>(null)

  const totalTime = estSeconds ?? (cardType ? defaultEstSeconds(cardType) : 0)
  const progress = totalTime > 0 ? (timeLeft / totalTime) * 100 : 0

  // Timer effect
  useEffect(() => {
    if (!cardType || cardType === 'insight' || totalTime === 0) {
      return
    }

    setTimeLeft(totalTime)
    setIsActive(true)
    setHasInteracted(false)

    // Start countdown
    intervalRef.current = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          setIsActive(false)
          return 0
        }
        return prev - 1
      })
    }, 1000)

    // Set timeout callback
    timeoutRef.current = setTimeout(() => {
      setIsActive(false)
      onTimeout?.()
    }, totalTime * 1000)

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current)
      if (timeoutRef.current) clearTimeout(timeoutRef.current)
    }
  }, [totalTime, cardType, onTimeout])

  // Track user interaction
  useEffect(() => {
    const handleInteraction = () => {
      if (!hasInteracted) {
        setHasInteracted(true)
        onUserInteraction?.()
      }
    }

    if (isActive) {
      document.addEventListener('click', handleInteraction)
      document.addEventListener('keydown', handleInteraction)
      document.addEventListener('touchstart', handleInteraction)
    }

    return () => {
      document.removeEventListener('click', handleInteraction)
      document.removeEventListener('keydown', handleInteraction)
      document.removeEventListener('touchstart', handleInteraction)
    }
  }, [isActive, hasInteracted, onUserInteraction])

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return mins > 0 ? `${mins}:${secs.toString().padStart(2, '0')}` : `${secs}s`
  }

  const getTimerColor = () => {
    if (progress > 50) return 'stroke-blue-500'
    if (progress > 25) return 'stroke-yellow-500'
    return 'stroke-red-500'
  }

  const getTimerOpacity = () => {
    if (progress > 50) return 'opacity-60'
    if (progress > 25) return 'opacity-70'
    return 'opacity-80'
  }

  return (
    <div className="flex justify-between items-center">
      <div className="flex items-center">
        {/* Exit icon (using Heroicons "X Mark") */}
        <button
          type="button"
          aria-label="Exit session"
          className="hover:bg-accent rounded-full p-1 transition-all"
          onClick={() => window.location.href = '/dashboard'}
        >
          {/* X Mark icon */}
          <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 text-muted-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
      
      <div className="flex items-center">
        {/* Timer */}
        {cardType && cardType !== 'insight' && totalTime > 0 && (
            
              
              <div className="flex items-center justify-center">
                <span className={`text-md font-mono font-bold ${
                  progress > 50 ? 'text-blue-600 dark:text-blue-400' :
                  progress > 25 ? 'text-yellow-600 dark:text-yellow-400' :
                  'text-red-600 dark:text-red-400'
                }`}>
                  {formatTime(timeLeft)}
                </span>
              </div>
        )}
        
        {/* Progress counter */}
      </div>
        <span className="text-sm text-muted-foreground flex items-center">
          {currentIndex}/{totalCards}
        </span>
    </div>
  )
}
