'use client'

import { useState, useRef, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { auth } from '@/lib/auth'

interface OtpVerificationProps {
  email: string
  onSuccess: () => void
  onError: (error: string) => void
  onResend: () => void
  isSignUp?: boolean
}

export function OtpVerification({ 
  email, 
  onSuccess, 
  onError, 
  onResend, 
  isSignUp = false 
}: OtpVerificationProps) {
  const [otp, setOtp] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isResending, setIsResending] = useState(false)
  const [timeLeft, setTimeLeft] = useState(60) // 60 seconds cooldown
  const inputRefs = useRef<(HTMLInputElement | null)[]>([])

  // Timer for resend cooldown
  useEffect(() => {
    if (timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000)
      return () => clearTimeout(timer)
    }
  }, [timeLeft])

  const handleOtpChange = (value: string, index: number) => {
    // Only allow digits
    if (!/^\d*$/.test(value)) return

    const newOtp = otp.split('')
    newOtp[index] = value
    const updatedOtp = newOtp.join('')
    setOtp(updatedOtp)

    // Auto-focus next input
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus()
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent, index: number) => {
    // Handle backspace
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus()
    }
  }

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault()
    const pastedData = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6)
    setOtp(pastedData)
    
    // Focus the last filled input
    const lastIndex = Math.min(pastedData.length - 1, 5)
    inputRefs.current[lastIndex]?.focus()
  }

  const handleVerify = async () => {
    if (otp.length !== 6) {
      onError('Please enter the complete 6-digit code')
      return
    }

    setIsLoading(true)
    try {
      const { data, error } = await auth.verifyOtp(email, otp)
      
      if (error) {
        console.error('OTP verification error:', error)
        onError(error.message)
      } else if (data.session) {
        onSuccess()
      } else {
        console.error('No session returned:', data)
        onError('Verification failed. Please try again.')
      }
    } catch (err) {
      console.error('OTP verification exception:', err)
      onError('An unexpected error occurred')
    } finally {
      setIsLoading(false)
    }
  }

  const handleResend = async () => {
    setIsResending(true)
    try {
      if (isSignUp) {
        await auth.signUp(email)
      } else {
        await auth.signIn(email)
      }
      setTimeLeft(60) // Reset timer
      setOtp('') // Clear current OTP
      inputRefs.current[0]?.focus() // Focus first input
    } catch (err) {
      onError('Failed to resend code. Please try again.')
    } finally {
      setIsResending(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="text-lg font-semibold text-foreground mb-2">
          Enter verification code
        </h3>
        <p className="text-muted-foreground">
          We sent a 6-digit code to <strong>{email}</strong>
        </p>
      </div>

      <div className="flex justify-center space-x-2">
        {Array.from({ length: 6 }, (_, index) => (
          <Input
            key={index}
            ref={(el: HTMLInputElement | null) => {
              if (el) {
                inputRefs.current[index] = el
              }
            }}
            type="text"
            inputMode="numeric"
            maxLength={1}
            value={otp[index] || ''}
            onChange={(e) => handleOtpChange(e.target.value, index)}
            onKeyDown={(e) => handleKeyDown(e, index)}
            onPaste={index === 0 ? handlePaste : undefined}
            className="w-12 h-12 text-center text-lg font-mono border-border focus:border-primary focus:ring-primary/20"
            disabled={isLoading}
          />
        ))}
      </div>

      <Button
        onClick={handleVerify}
        disabled={isLoading || otp.length !== 6}
        className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-medium py-3 rounded-xl transition-colors"
      >
        {isLoading ? 'Verifying...' : 'Verify Code'}
      </Button>

      <div className="text-center">
        <p className="text-sm text-muted-foreground mb-2">
          Didn't receive the code?
        </p>
        <Button
          variant="outline"
          onClick={handleResend}
          disabled={isResending || timeLeft > 0}
          className="text-sm"
        >
          {isResending 
            ? 'Sending...' 
            : timeLeft > 0 
              ? `Resend in ${timeLeft}s` 
              : 'Resend Code'
          }
        </Button>
      </div>

      <div className="text-center">
        <p className="text-xs text-muted-foreground">
          Check your spam folder if you don't see the email
        </p>
      </div>
    </div>
  )
}
