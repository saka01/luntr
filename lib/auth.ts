import { supabase } from './supabase'
import { User } from '@supabase/supabase-js'

export interface AuthUser {
  id: string
  email: string
  created_at: string
}

export const auth = {

  // Sign up with OTP
  async signUp(email: string, name?: string) {
    const { data, error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        data: {
          name: name || '',
        },
        // No emailRedirectTo needed for OTP
      },
    })
    return { data, error }
  },
  
  // Sign in with OTP
  async signIn(email: string) {
    const { data, error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        // No emailRedirectTo needed for OTP
      },
    })
    return { data, error }
  },

  // Verify OTP code
  async verifyOtp(email: string, token: string) {
    console.log('Verifying OTP for email:', email, 'token:', token)
    const { data, error } = await supabase.auth.verifyOtp({
      email,
      token,
      type: 'email',
    })
    console.log('OTP verification result:', { data, error })
    return { data, error }
  },

  // Sign out
  async signOut() {
    const { error } = await supabase.auth.signOut()
    return { error }
  },

  // Get current user
  async getCurrentUser(): Promise<User | null> {
    const { data: { user } } = await supabase.auth.getUser()
    return user
  },

  // Get current session
  async getCurrentSession() {
    const { data: { session } } = await supabase.auth.getSession()
    return session
  },

  // Listen to auth state changes
  onAuthStateChange(callback: (event: string, session: any) => void) {
    return supabase.auth.onAuthStateChange(callback)
  },
}

