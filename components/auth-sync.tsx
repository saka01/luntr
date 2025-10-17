'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'

export function AuthSync() {
  const router = useRouter()
  const [isChecking, setIsChecking] = useState(true)

  useEffect(() => {
    const checkAuth = async () => {
      try {
        // Get the current session
        const { data: { session } } = await supabase.auth.getSession()
        
        if (session) {
          console.log('Session found, user:', session.user.email)
          
          // If we're on login/signup pages and have a session, redirect to dashboard
          const currentPath = window.location.pathname
          if (currentPath === '/login' || currentPath === '/signup') {
            router.push('/dashboard')
            return
          }
        } else {
          console.log('No session found')
          
          // If we're on protected routes and no session, redirect to login
          const currentPath = window.location.pathname
          if (currentPath.startsWith('/dashboard') || currentPath.startsWith('/session')) {
            router.push('/login')
            return
          }
        }
      } catch (error) {
        console.error('Auth check error:', error)
      } finally {
        setIsChecking(false)
      }
    }

    checkAuth()
  }, [router])

  // Show loading state while checking auth
  if (isChecking) {
    return (
      <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Checking authentication...</p>
        </div>
      </div>
    )
  }

  return null
}
