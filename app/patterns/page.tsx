"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Lock, CheckCircle } from "lucide-react"
import { PATTERN_CONFIGS, getActivePattern, getAvailablePatterns, getLockedPatterns } from "@/config/patterns"
import { motion } from "framer-motion"

export default function PatternsPage() {
  const [selectedPattern, setSelectedPattern] = useState<string | null>(null)
  
  const activePatternName = getActivePattern()
  const activePatternConfig = Object.values(PATTERN_CONFIGS).find(p => p.name === activePatternName)
  const availablePatterns = getAvailablePatterns()
  const lockedPatterns = getLockedPatterns()

  const handlePatternSelect = (patternId: string) => {
    if (patternId === "all") {
      // Navigate to session with all available patterns
      window.location.href = "/session?pattern=all"
    } else {
      // Navigate to session with specific pattern
      window.location.href = `/session?pattern=${patternId}`
    }
  }

  return (
    <div className="bg-background h-full relative overflow-hidden">
      {/* Background gradient */}
      <div
        className="absolute inset-0 z-0"
        style={{
          background: "radial-gradient(ellipse 50% 35% at 50% 0%, rgba(226, 232, 240, 0.08), transparent 60%), #000000",
        }}
      />

      {/* Floating motion elements */}
      <motion.div 
        className="absolute top-20 right-20 w-3 h-3 bg-primary/20 rounded-full"
        animate={{ 
          y: [0, -20, 0],
          opacity: [0.2, 0.6, 0.2]
        }}
        transition={{ 
          duration: 3,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 0.3
        }}
      />
      <motion.div 
        className="absolute top-40 left-20 w-2 h-2 bg-primary/25 rounded-full"
        animate={{ 
          y: [0, -15, 0],
          opacity: [0.25, 0.7, 0.25]
        }}
        transition={{ 
          duration: 2.5,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 1.2
        }}
      />
      <motion.div 
        className="absolute bottom-20 left-40 w-4 h-4 bg-primary/15 rounded-full"
        animate={{ 
          y: [0, -25, 0],
          opacity: [0.15, 0.5, 0.15]
        }}
        transition={{ 
          duration: 4,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 0.8
        }}
      />

      <div className="relative z-10 container mx-auto px-4 py-8 bg-background">
        {/* Header */}
        <div className="flex flex-col items-center justify-between mb-8">
          {/* <Link href="/dashboard">
            <Button variant="ghost" className="flex items-center gap-2">
              <ArrowLeft className="w-4 h-4" />
            </Button>
          </Link> */}
          <div className="text-center">
            <h1 className="text-3xl font-bold text-foreground">Choose Your Pattern</h1>
            <p className="text-muted-foreground">Select a pattern to practice or try them all</p>
          </div>
          <div className="w-32" /> {/* Spacer for centering */}
        </div>

        {/* All Patterns Option */}
        <Card className="mb-8 bg-gradient-to-r from-primary/20 to-primary/10 border-primary/30 opacity-60 cursor-not-allowed">
          <CardHeader>
            <CardTitle className="text-foreground flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-primary" />
              All Available Patterns
            </CardTitle>
            <CardDescription>
              Practice with a mix of all available patterns for comprehensive training
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button 
              disabled
              className="w-full bg-primary text-primary-foreground font-medium py-3 rounded-xl transition-colors opacity-70 cursor-not-allowed"
            >
              <Lock className="w-4 h-4" />
               Locked
            </Button>
          </CardContent>
        </Card>

        {/* Individual Patterns */}
        <motion.div 
          className="grid gap-4 md:grid-cols-2 lg:grid-cols-3"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          {Object.values(PATTERN_CONFIGS).map((pattern) => {
            const isActive = pattern.name === activePatternName
            const isAvailable = pattern.status === 'active'
            
            return (
              <Card 
                key={pattern.id}
                className={`transition-all duration-200 ${
                  isAvailable 
                    ? "bg-card/50 backdrop-blur-xl border-border hover:border-primary/50 cursor-pointer" 
                    : "bg-card/20 backdrop-blur-xl border-border/50 opacity-60"
                }`}
                onClick={() => isAvailable && handlePatternSelect(pattern.id)}
              >
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-foreground">{pattern.name}</CardTitle>
                    {isActive ? (
                      <Badge variant="default" className="bg-green-500/20 text-green-400 border-green-500/30">
                        Active
                      </Badge>
                    ) : (
                      <Badge variant="outline" className="opacity-50">
                        <Lock className="w-3 h-3 mr-1" />
                        Coming Soon
                      </Badge>
                    )}
                  </div>
                  <CardDescription>{pattern.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {/* <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Difficulty</span>
                      <span className="text-sm font-medium">{pattern.difficulty}</span>
                    </div> */}
                    
                    {isActive && (
                      <Button 
                        className="w-full mt-4 bg-primary hover:bg-primary/90 text-primary-foreground font-medium py-2 rounded-lg transition-colors"
                        onClick={(e) => {
                          e.stopPropagation()
                          handlePatternSelect(pattern.id)
                        }}
                      >
                        Start Practice
                      </Button>
                    )}
                    
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </motion.div>
      </div>
    </div>
  )
}
