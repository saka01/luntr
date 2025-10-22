"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"
import { Logo } from "./logo"

const motivationalMessages = [
  "Preparing your coding workout...",
  "Loading algorithmic challenges...",
  "Building your learning session...",
  "Crafting personalized problems...",
  "Optimizing your practice routine...",
  "Assembling your skill-building deck...",
  "Ready to level up your coding skills!",
]

const codingTips = [
  "💡 Tip: Read the problem statement carefully before coding",
  "🚀 Tip: Start with a brute force solution, then optimize",
  "🎯 Tip: Test your solution with edge cases",
  "⚡ Tip: Practice makes perfect but consistency is key",
  "🧠 Tip: Break complex problems into smaller parts",
  "✨ Tip: Don't be afraid to make mistakes, they're learning opportunities",
]

export function SessionLoadingScreen() {
  const [currentMessage, setCurrentMessage] = useState(0)
  const [currentTip, setCurrentTip] = useState(0)
  const [progress, setProgress] = useState(0)
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    // Set client-side flag
    setIsClient(true)
    
    // Cycle through motivational messages
    const messageInterval = setInterval(() => {
      setCurrentMessage((prev) => (prev + 1) % motivationalMessages.length)
    }, 2000)

    // Cycle through coding tips
    const tipInterval = setInterval(() => {
      setCurrentTip((prev) => (prev + 1) % codingTips.length)
    }, 3000)

    // Simulate progress
    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 90) return prev // Stop at 90% to keep loading
        return prev + Math.random() * 15
      })
    }, 500)

    return () => {
      clearInterval(messageInterval)
      clearInterval(tipInterval)
      clearInterval(progressInterval)
    }
  }, [])

  return (
    <div className="h-screen bg-gradient-to-br from-background via-background to-muted/20 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        {/* Main loading card */}
        <Card className="bg-card/80 backdrop-blur-xl border-border/50 shadow-2xl">
          <CardContent className="p-8">
            {/* Header with animated logo/icon */}
            <div className="text-center mb-8">
              <motion.div
                className="inline-block"
                animate={{ 
                  rotate: [0, 360],
                  scale: [1, 1.1, 1]
                }}
                transition={{ 
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              >
          <Logo className="text-foreground w-24 h-24" />
   
              </motion.div>
              
              <h1 className="text-3xl font-bold bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent mb-2">
                Tallo
              </h1>
              <p className="text-muted-foreground text-lg">
                Your coding practice session
              </p>
            </div>

            {/* Progress section */}
            <div className="mb-8">
              <div className="flex justify-between items-center mb-3">
                <span className="text-sm font-medium text-muted-foreground">Loading Progress</span>
                <span className="text-sm font-mono text-primary">{Math.round(progress)}%</span>
              </div>
              
              {/* Progress bar */}
              <div className="w-full bg-muted/30 rounded-full h-3 overflow-hidden">
                <motion.div
                  className="h-full bg-gradient-to-r from-primary to-primary/80 rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 0.5, ease: "easeOut" }}
                />
              </div>
            </div>

            {/* Animated loading dots */}
            <div className="flex justify-center mb-6">
              {[0, 1, 2].map((i) => (
                <motion.div
                  key={i}
                  className="w-2 h-2 bg-primary rounded-full mx-1"
                  animate={{
                    scale: [1, 1.5, 1],
                    opacity: [0.5, 1, 0.5]
                  }}
                  transition={{
                    duration: 1.5,
                    repeat: Infinity,
                    delay: i * 0.2
                  }}
                />
              ))}
            </div>

            {/* Motivational message */}
            <AnimatePresence mode="wait">
              <motion.div
                key={currentMessage}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5 }}
                className="text-center mb-6"
              >
                <p className="text-lg font-medium text-foreground">
                  {motivationalMessages[currentMessage]}
                </p>
              </motion.div>
            </AnimatePresence>

            {/* Coding tip */}
            <AnimatePresence mode="wait">
              <motion.div
                key={currentTip}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.5 }}
                className="text-center"
              >
                <div className="bg-muted/30 rounded-lg p-4 border border-border/50">
                  <p className="text-sm text-muted-foreground">
                    {codingTips[currentTip]}
                  </p>
                </div>
              </motion.div>
            </AnimatePresence>
          </CardContent>
        </Card>

        {/* Floating elements for visual interest - only render on client */}
        {isClient && (
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            {[...Array(6)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-2 h-2 bg-primary/20 rounded-full"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                }}
                animate={{
                  y: [0, -20, 0],
                  opacity: [0.2, 0.8, 0.2],
                  scale: [1, 1.5, 1]
                }}
                transition={{
                  duration: 3 + Math.random() * 2,
                  repeat: Infinity,
                  delay: Math.random() * 2
                }}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
