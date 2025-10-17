import { redirect } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { COPY } from '@/content/copy'
import { checkAuthAndRedirect } from '@/lib/auth-guard'
import { getDueCount, getWeakestPatterns } from '@/lib/session-engine'

export default async function DashboardPage() {
  const { user, profile } = await checkAuthAndRedirect()
  
  const dueCount = await getDueCount(user.id)
  const weakestPatterns = await getWeakestPatterns(user.id)

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
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-foreground">{COPY.dashboard.greeting}</h1>
            <p className="text-muted-foreground">Ready to practice your coding patterns?</p>
          </div>
          <Badge variant="outline" className="text-lg px-4 py-2">
            {COPY.dashboard.streak(profile.streak)}
          </Badge>
        </div>

        {/* Main Content */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {/* Due Cards Card */}
          <Card className="bg-card/50 backdrop-blur-xl border-border">
            <CardHeader>
              <CardTitle className="text-foreground">{COPY.dashboard.dueToday(dueCount)}</CardTitle>
              <CardDescription>
                {dueCount > 0 ? 'Time to practice your coding patterns' : 'All caught up! Great job!'}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Link href="/session">
                <Button 
                  className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-medium py-3 rounded-xl transition-colors"
                  disabled={dueCount === 0}
                >
                  {COPY.dashboard.startSession}
                </Button>
              </Link>
            </CardContent>
          </Card>

          {/* Weakest Patterns */}
          <Card className="bg-card/50 backdrop-blur-xl border-border md:col-span-2 lg:col-span-1">
            <CardHeader>
              <CardTitle className="text-foreground">{COPY.dashboard.weakestPatterns}</CardTitle>
              <CardDescription>Patterns to focus on</CardDescription>
            </CardHeader>
            <CardContent>
              {weakestPatterns.length > 0 ? (
                <div className="space-y-3">
                  {weakestPatterns.map((pattern, index) => (
                    <div key={index} className="flex justify-between items-center">
                      <span className="text-foreground font-medium">{pattern.pattern}</span>
                      <Badge variant="secondary" className="text-xs">
                        {pattern.mastery}%
                      </Badge>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-muted-foreground text-sm">Complete some training sessions to see your patterns!</p>
              )}
            </CardContent>
          </Card>

          {/* Stats Card */}
          <Card className="bg-card/50 backdrop-blur-xl border-border md:col-span-2">
            <CardHeader>
              <CardTitle className="text-foreground">Your Progress</CardTitle>
              <CardDescription>Your coding fitness journey</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary">{profile.streak}</div>
                  <div className="text-sm text-muted-foreground">Day Streak</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary">{profile.level}</div>
                  <div className="text-sm text-muted-foreground">Level</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
