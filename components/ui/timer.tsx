"use client"

import { useState, useEffect, useRef } from "react"
import { CardType } from "@/lib/cards/types"
import { defaultEstSeconds } from "@/lib/cards/timer"

interface TimerProps {
  cardType: CardType
  estSeconds?: number
  onTimeout: () => void
  onUserInteraction?: () => void
  className?: string
}

export function Timer({ 
  cardType, 
  estSeconds, 
  onTimeout, 
  onUserInteraction,
  className = "" 
}: TimerProps) {
  const [timeLeft, setTimeLeft] = useState(0)
  const [isActive, setIsActive] = useState(false)
  const [hasInteracted, setHasInteracted] = useState(false)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)
  const timeoutRef = useRef<NodeJS.Timeout | null>(null)

  const totalTime = estSeconds ?? defaultEstSeconds(cardType)
  const progress = totalTime > 0 ? (timeLeft / totalTime) * 100 : 0

  // Don't show timer for insight cards
  if (cardType === 'insight' || totalTime === 0) {
    return null
  }

  useEffect(() => {
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
      onTimeout()
    }, totalTime * 1000)

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current)
      if (timeoutRef.current) clearTimeout(timeoutRef.current)
    }
  }, [totalTime, onTimeout])

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
    <div className={`relative ${className}`}>
      <div className="relative w-16 h-16">
        {/* Background circle */}
        <svg className="w-16 h-16 transform -rotate-90" viewBox="0 0 36 36">
          <path
            className="stroke-gray-200 dark:stroke-gray-700"
            strokeWidth="2"
            fill="none"
            d="M18 2.0845
              a 15.9155 15.9155 0 0 1 0 31.831
              a 15.9155 15.9155 0 0 1 0 -31.831"
          />
          {/* Progress circle */}
          <path
            className={`${getTimerColor()} ${getTimerOpacity()} transition-all duration-1000`}
            strokeWidth="2"
            fill="none"
            strokeDasharray={`${progress}, 100`}
            d="M18 2.0845
              a 15.9155 15.9155 0 0 1 0 31.831
              a 15.9155 15.9155 0 0 1 0 -31.831"
          />
        </svg>
        
        {/* Time text */}
        <div className="absolute inset-0 flex items-center justify-center">
          <span className={`text-xs font-mono font-medium ${
            progress > 50 ? 'text-blue-600 dark:text-blue-400' :
            progress > 25 ? 'text-yellow-600 dark:text-yellow-400' :
            'text-red-600 dark:text-red-400'
          }`}>
            {formatTime(timeLeft)}
          </span>
        </div>
      </div>
    </div>
  )
}
