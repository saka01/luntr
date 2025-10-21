'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'

export default function AuthCallbackClient() {
  const router = useRouter()
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading')

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        console.log('Client auth callback started')
        console.log('Current URL:', window.location.href)
        console.log('Hash:', window.location.hash)
        
        // Handle magic link flow (tokens in URL fragment)
        const hash = window.location.hash.substring(1)
        console.log('Hash content:', hash)
        
        if (!hash) {
          console.log('No hash found, redirecting to login')
          setStatus('error')
          setTimeout(() => router.push('/login?error=auth_callback_error'), 2000)
          return
        }
        
        const hashParams = new URLSearchParams(hash)
        const accessToken = hashParams.get('access_token')
        const refreshToken = hashParams.get('refresh_token')
        const error = hashParams.get('error')
        
        console.log('Access token:', accessToken ? 'present' : 'missing')
        console.log('Refresh token:', refreshToken ? 'present' : 'missing')
        console.log('Error:', error)
        
        if (error) {
          console.error('Magic link auth error:', error)
          setStatus('error')
          setTimeout(() => router.push('/login?error=auth_callback_error'), 2000)
          return
        }
        
        if (accessToken && refreshToken) {
          console.log('Setting session with tokens')
          
          // Set the session
          const { error: sessionError } = await supabase.auth.setSession({
            access_token: accessToken,
            refresh_token: refreshToken,
          })
          
          if (sessionError) {
            console.error('Session error:', sessionError)
            setStatus('error')
            setTimeout(() => router.push('/login?error=auth_callback_error'), 2000)
            return
          }
          
          console.log('Session set successfully')
          
          // Wait for session to be established
          await new Promise(resolve => setTimeout(resolve, 1000))
          
          // Verify the session is working
          const { data: { user } } = await supabase.auth.getUser()
          console.log('User after session set:', user ? 'authenticated' : 'not authenticated')
          
          if (user) {
            setStatus('success')
            // Clear the hash from URL
            window.history.replaceState({}, document.title, window.location.pathname)
            // Success! Redirect to onboarding for new users
            setTimeout(() => router.push('/onboarding'), 1000)
          } else {
            console.error('User not authenticated after setting session')
            setStatus('error')
            setTimeout(() => router.push('/login?error=auth_callback_error'), 2000)
          }
        } else {
          console.log('No tokens found in hash')
          setStatus('error')
          setTimeout(() => router.push('/login?error=auth_callback_error'), 2000)
        }
      } catch (error) {
        console.error('Auth callback error:', error)
        setStatus('error')
        setTimeout(() => router.push('/login?error=auth_callback_error'), 2000)
      }
    }

    handleAuthCallback()
  }, [router])

  return (
    <div className="flex items-center justify-center min-h-screen bg-background">
      <div className="text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
        <p className="mt-4 text-muted-foreground">
          {status === 'loading' && 'Completing authentication...'}
          {status === 'success' && 'Authentication successful! Redirecting...'}
          {status === 'error' && 'Authentication failed. Redirecting to login...'}
        </p>
      </div>
    </div>
  )
}
