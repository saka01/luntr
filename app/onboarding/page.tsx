"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { COPY } from "@/content/copy"

export default function OnboardingPage() {
  const [level, setLevel] = useState<"Beginner" | "Intermediate" | "Advanced">("Beginner")
  const [dailyMinutes, setDailyMinutes] = useState<5 | 10 | 20>(10)
  const [primaryLanguage, setPrimaryLanguage] = useState("JavaScript")
  const [learningGoal, setLearningGoal] = useState("Interview Preparation")
  const [timezone] = useState(Intl.DateTimeFormat().resolvedOptions().timeZone)
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    
    try {
      const response = await fetch('/api/onboarding', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          level,
          dailyMinutes,
          primaryLanguage,
          learningGoal,
          timezone,
        }),
      })
      
      if (response.ok) {
        router.push('/dashboard')
      } else {
        console.error('Failed to save profile')
      }
    } catch (error) {
      console.error('Error saving profile:', error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      {/* Background gradient matching app design */}
      <div className="absolute inset-0 z-0 theme-glow" />

      {/* Decorative elements */}
      <div className="absolute top-20 left-20 w-72 h-72 bg-primary/10 rounded-full blur-3xl" />
      <div className="absolute bottom-20 right-20 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />

      <div className="relative z-10 w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">{COPY.onboarding.title}</h1>
          <p className="text-muted-foreground">Help us customize your coding workout</p>
        </div>

        {/* Onboarding Form */}
        <div className="bg-card/50 backdrop-blur-xl border border-border rounded-2xl p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="level" className="text-foreground">
                {COPY.onboarding.levelLabel}
              </Label>
              <Select value={level} onValueChange={(value: "Beginner" | "Intermediate" | "Advanced") => setLevel(value)}>
                <SelectTrigger className="bg-input/50 border-border text-foreground focus:border-primary focus:ring-primary/20">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Beginner">Beginner</SelectItem>
                  <SelectItem value="Intermediate">Intermediate</SelectItem>
                  <SelectItem value="Advanced">Advanced</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="time" className="text-foreground">
                {COPY.onboarding.timeLabel}
              </Label>
              <Select value={dailyMinutes.toString()} onValueChange={(value) => setDailyMinutes(parseInt(value) as 5 | 10 | 20)}>
                <SelectTrigger className="bg-input/50 border-border text-foreground focus:border-primary focus:ring-primary/20">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="5">5 minutes</SelectItem>
                  <SelectItem value="10">10 minutes</SelectItem>
                  <SelectItem value="20">20 minutes</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="primaryLanguage" className="text-foreground">
                Primary Programming Language
              </Label>
              <Select value={primaryLanguage} onValueChange={setPrimaryLanguage}>
                <SelectTrigger className="bg-input/50 border-border text-foreground focus:border-primary focus:ring-primary/20">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="JavaScript">JavaScript</SelectItem>
                  <SelectItem value="Python">Python</SelectItem>
                  <SelectItem value="Java">Java</SelectItem>
                  <SelectItem value="C++">C++</SelectItem>
                  <SelectItem value="TypeScript">TypeScript</SelectItem>
                  <SelectItem value="Go">Go</SelectItem>
                  <SelectItem value="Rust">Rust</SelectItem>
                  <SelectItem value="Other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="learningGoal" className="text-foreground">
                Learning Goal
              </Label>
              <Select value={learningGoal} onValueChange={setLearningGoal}>
                <SelectTrigger className="bg-input/50 border-border text-foreground focus:border-primary focus:ring-primary/20">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Interview Preparation">Interview Preparation</SelectItem>
                  <SelectItem value="Skill Improvement">Skill Improvement</SelectItem>
                  <SelectItem value="Career Advancement">Career Advancement</SelectItem>
                  <SelectItem value="Personal Interest">Personal Interest</SelectItem>
                  <SelectItem value="Academic Study">Academic Study</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-medium py-3 rounded-xl transition-colors"
            >
              {isLoading ? "Saving..." : COPY.onboarding.start}
            </Button>
          </form>
        </div>
      </div>
    </div>
  )
}
