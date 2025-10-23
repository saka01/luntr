"use client"

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { COPY } from '@/content/copy'
import { createBrowserClient } from '@supabase/ssr'
import { motion } from 'framer-motion'
import { Logo } from '@/components/logo'

export default function AppPage() {
  const [user, setUser] = useState<any>(null)
  const [profile, setProfile] = useState<any>(null)
  const [dueCount, setDueCount] = useState(0)
  const [weakestPatterns, setWeakestPatterns] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  useEffect(() => {
    const loadData = async () => {
      try {
        // Check auth
        const { data: { user }, error } = await supabase.auth.getUser()
        if (error || !user) {
          router.push('/login')
          return
        }

        // Get profile
        const { data: profile } = await supabase
          .from('profiles')
          .select('*')
          .eq('user_id', user.id)
          .single()
        
        if (!profile) {
          router.push('/onboarding')
          return
        }

        // Get session data
        const dueResponse = await fetch(`/api/session/due-count?userId=${user.id}`)
        const weakestResponse = await fetch(`/api/session/weakest-patterns?userId=${user.id}`)
        
        const dueCount = dueResponse.ok ? await dueResponse.json() : 0
        const weakestPatterns = weakestResponse.ok ? await weakestResponse.json() : []
        
        setUser(user)
        setProfile(profile)
        setDueCount(dueCount)
        setWeakestPatterns(weakestPatterns)
      } catch (error) {
        console.error('Error loading dashboard data:', error)
        router.push('/login')
      } finally {
        setIsLoading(false)
      }
    }
    
    loadData()
  }, [router, supabase])

  if (isLoading) {
    return (
      <div className="h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <motion.div
            className="inline-block mb-6"
            animate={{ 
              rotate: [0, 360],
              scale: [1, 1.1, 1]
            }}
            transition={{ 
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          >
            <Logo className="text-primary w-24 h-24" />
          </motion.div>
          
          <motion.h2
            className="text-xl font-semibold text-foreground mb-4"
            animate={{ opacity: [0.7, 1, 0.7] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            Loading your dashboard...
          </motion.h2>

        </div>
      </div>
    )
  }
  
  // Calculate mastery percentage for the active pattern
  const mastery = weakestPatterns.length > 0 ? weakestPatterns[0].mastery : 0

  return (
    <div className="min-h-screen bg-background">
      {/* Background gradient */}
      <div className="absolute inset-0 z-0 theme-glow" />

      {/* Floating motion elements */}
      <motion.div 
        className="absolute top-20 left-20 w-72 h-72 bg-primary/10 rounded-full blur-3xl"
        animate={{ 
          y: [0, -20, 0],
          x: [0, 10, 0],
          scale: [1, 1.05, 1]
        }}
        transition={{ 
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />
      <motion.div 
        className="absolute bottom-20 right-20 w-96 h-96 bg-primary/5 rounded-full blur-3xl"
        animate={{ 
          y: [0, 15, 0],
          x: [0, -8, 0],
          scale: [1, 0.98, 1]
        }}
        transition={{ 
          duration: 10,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 1
        }}
      />
      
      {/* Small floating dots */}
      <motion.div 
        className="absolute top-32 right-32 w-4 h-4 bg-primary/20 rounded-full"
        animate={{ 
          y: [0, -30, 0],
          opacity: [0.2, 0.6, 0.2]
        }}
        transition={{ 
          duration: 4,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 0.5
        }}
      />
      <motion.div 
        className="absolute top-48 left-48 w-2 h-2 bg-primary/30 rounded-full"
        animate={{ 
          y: [0, -25, 0],
          opacity: [0.3, 0.7, 0.3]
        }}
        transition={{ 
          duration: 3.5,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 1.2
        }}
      />

      <div className="relative z-10 container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex flex-col justify-center items-center mb-8">
          <span className="text-lg px-4 py-2">
            {COPY.dashboard.streak(profile.streak)}
          </span>
          <div>
            <h1 className="text-3xl font-bold text-foreground">{COPY.dashboard.greeting}</h1>
            <p className="text-muted-foreground">Ready to practice your patterns?</p>
          </div>
        </div>

        {/* Pattern Badge */}
        {/* <div className="mb-8">
          <Badge variant="secondary" className="text-lg px-6 py-3 bg-primary/20 text-primary border-primary/30">
            {COPY.badges.pattern(ACTIVE_PATTERN)}
          </Badge>
        </div> */}

        {/* Main Content */}
        <motion.div 
          className="grid gap-6 md:grid-cols-2 lg:grid-cols-3"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          {/* Due Cards Card */}
          <Card className="bg-card/50 backdrop-blur-xl border-border">
            <CardHeader>
              <CardTitle className="text-foreground text-md font-bold">Two Pointers <span className="text-secondary" style={{ fontSize: '12px' }}>(1000+ Questions)</span></CardTitle>
              <CardDescription className="text-muted-foreground italic" style={{ fontSize: '12px' }}>Trained on Blind 75 Neetcode Problems for interview prep</CardDescription>
            </CardHeader>
            <CardContent>
              <Link href="/patterns">
                <Button 
                  className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-medium py-3 rounded-xl transition-colors"
                >
                  Start Practice Session
                </Button>
              </Link>
            </CardContent>
          </Card>

          {/* Mastery Card
          <Card className="bg-card/50 backdrop-blur-xl border-border">
            <CardHeader>
              <CardTitle className="text-foreground">{COPY.dashboard.mastery(mastery)}</CardTitle>
              <CardDescription>Your Two Pointers mastery</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center">
                <div className="text-3xl font-bold text-primary mb-2">{mastery}%</div>
                <div className="text-sm text-muted-foreground">Based on your recent attempts</div>
              </div>
            </CardContent>
          </Card> */}

          {/* Coming Soon Card */}
          <Card className="bg-card/50 backdrop-blur-xl border-border md:col-span-2 lg:col-span-1">
            <CardHeader>
              <CardTitle className="text-foreground">{COPY.badges.comingSoon}</CardTitle>
              <CardDescription>Neetcode 150, Google, Apple, etc.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="">
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground font-medium">Sliding Window</span>
                  <Badge variant="outline" className="text-xs opacity-50">
                    Soon
                  </Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground font-medium">Apple Interview Questions</span>
                  <Badge variant="outline" className="text-xs opacity-50">
                    Soon
                  </Badge>
                </div>
              </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground font-medium">Binary Search</span>
                  <Badge variant="outline" className="text-xs opacity-50">
                    Soon
                  </Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground font-medium">Google Interview Questions</span>
                  <Badge variant="outline" className="text-xs opacity-50">
                    Soon
                  </Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground font-medium">Arrays & Hashing</span>
                  <Badge variant="outline" className="text-xs opacity-50">
                    Soon
                  </Badge>
                </div>
              <div className="">
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground font-medium">Microsoft Interview Questions</span>
                  <Badge variant="outline" className="text-xs opacity-50">
                    Soon
                  </Badge>
                </div>
                </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  )
}
