import { redirect } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { COPY } from '@/content/copy'
import { checkAuthAndRedirect } from '@/lib/auth-guard'
import { getDueCount, getWeakestPatterns } from '@/lib/session-engine'
import { ACTIVE_PATTERN } from '@/config/activePattern'

export default async function AppPage() {
  const { user, profile } = await checkAuthAndRedirect()
  
  const dueCount = await getDueCount(user.id)
  const weakestPatterns = await getWeakestPatterns(user.id)
  
  // Calculate mastery percentage for the active pattern
  const mastery = weakestPatterns.length > 0 ? weakestPatterns[0].mastery : 0

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
        {/* Header */}
        <div className="flex flex-col justify-center items-center mb-8">
          <Badge variant="outline" className="text-lg px-4 py-2">
            {COPY.dashboard.streak(profile.streak)}
          </Badge>
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
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {/* Due Cards Card */}
          <Card className="bg-card/50 backdrop-blur-xl border-border">
            <CardHeader>
              <CardTitle className="text-foreground">{COPY.dashboard.dueToday(dueCount)}</CardTitle>
              <CardDescription>
                {dueCount > 0 ? 'Time to practice your Sliding Window skills' : 'All caught up! Great job!'}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Link href="/patterns">
                <Button 
                  className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-medium py-3 rounded-xl transition-colors"
                >
                  {dueCount > 0 ? COPY.dashboard.startSession : 'Start Practice Session'}
                </Button>
              </Link>
            </CardContent>
          </Card>

          {/* Mastery Card */}
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
          </Card>

          {/* Coming Soon Card */}
          <Card className="bg-card/50 backdrop-blur-xl border-border md:col-span-2 lg:col-span-1">
            <CardHeader>
              <CardTitle className="text-foreground">{COPY.badges.comingSoon}</CardTitle>
              <CardDescription>More patterns in development</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground font-medium">Two Pointers</span>
                  <Badge variant="outline" className="text-xs opacity-50">
                    Soon
                  </Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground font-medium">Binary Search</span>
                  <Badge variant="outline" className="text-xs opacity-50">
                    Soon
                  </Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground font-medium">Hashing</span>
                  <Badge variant="outline" className="text-xs opacity-50">
                    Soon
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
