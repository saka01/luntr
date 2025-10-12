'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { CheckCircle, Mail, User, ArrowRight, Shield, Clock, Star, Calendar, Users } from 'lucide-react'
import { formatCurrency } from '@/lib/tax-calculations'
import { motion } from 'framer-motion'

interface Step3Props {
  formData: Record<string, any>
  selectedDeductions: Set<string>
  totalValue: { totalDeductible: number; totalTaxSaved: number }
  onRestart: () => void
}

export function DeductionFinderStep3({ formData, selectedDeductions, totalValue, onRestart }: Step3Props) {
  const [leadFormData, setLeadFormData] = useState({
    firstName: '',
    email: ''
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [waitlistPosition, setWaitlistPosition] = useState<number | null>(null)

  const handleInputChange = (field: string, value: string) => {
    setLeadFormData(prev => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }))
    }
  }

  const validateForm = () => {
    const newErrors: Record<string, string> = {}
    
    if (!leadFormData.firstName.trim()) {
      newErrors.firstName = 'First name is required'
    }
    
    if (!leadFormData.email.trim()) {
      newErrors.email = 'Email is required'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(leadFormData.email)) {
      newErrors.email = 'Please enter a valid email address'
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) return
    
    setIsSubmitting(true)
    
    try {
      const response = await fetch('/api/waitlist', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: leadFormData.email,
          firstName: leadFormData.firstName,
          source: 'deduction-finder',
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        if (response.status === 409) {
          setErrors({ email: 'This email is already on our waitlist' })
        } else {
          setErrors({ general: 'Something went wrong. Please try again.' })
        }
        return
      }

      setWaitlistPosition(data.data.position)
      setIsSubmitted(true)
    } catch (error) {
      console.error('Waitlist submission error:', error)
      setErrors({ general: 'Something went wrong. Please try again.' })
    } finally {
      setIsSubmitting(false)
    }
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-CA', {
      style: 'currency',
      currency: 'CAD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount)
  }

  if (isSubmitted) {
    return (
      <div className="text-center px-4">
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", duration: 0.5 }}
        className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-6"
      >
        <CheckCircle className="w-8 h-8 text-primary" />
      </motion.div>
      
      <h3 className="text-xl font-bold text-foreground mb-2">
        You're on the list! 🎉
      </h3>
      <p className="text-muted-foreground text-sm mb-4">
        Thanks for joining our waitlist. We'll notify you as soon as Tallo is ready.
      </p>
      
      {waitlistPosition && (
        <div className="bg-primary/10 border border-primary/20 rounded-lg p-4 mb-6 mx-auto">
          <div className="flex items-center justify-center gap-2 text-primary font-medium">
            <Mail className="w-4 h-4" />
            <span>You're #{waitlistPosition} on the waitlist</span>
          </div>
        </div>
      )}
    
      <div className="space-y-3 text-sm text-muted-foreground text-center">
        <p className="text-foreground font-medium text-center">What happens <span className="text-primary font-bold italic">next?</span></p>
        <div className="space-y-2">
          <div className="flex items-center gap-2 justify-center">
            <div className="w-2 h-2 bg-primary rounded-full" />
            <span>We'll email you with early access details</span>
          </div>
          <div className="flex items-center gap-2 justify-center">
            <div className="w-2 h-2 bg-primary rounded-full" />
            <span>Get exclusive pricing and features</span>
          </div>
          <div className="flex items-center gap-2 justify-center">
            <div className="w-2 h-2 bg-primary rounded-full" />
            <span>50% off full service tax filings for 2027</span>
          </div>
        </div>
      </div>
    
      <Button
        onClick={onRestart}
        className="w-fit mx-auto mt-12 bg-primary hover:bg-primary/90 text-primary-foreground font-medium py-3 rounded-xl transition-colors"
      >
        Start Over
      </Button>
    </div>
    )
  }



  return (
    <div className="w-full">
      <div className="animate-fade-in">
        <Card className="p-4 sm:p-6 md:p-8 bg-card/80 border-border/50 backdrop-blur-sm shadow-xl">
          <div className="space-y-8">

            {/* Header */}
            <div className="text-center space-y-2 sm:space-y-3">
              <h2 className="text-2xl sm:text-lg md:text-xl lg:text-2xl xl:text-3xl font-bold text-foreground leading-tight px-2">
                Tracking all of this manually is overwhelming
              </h2>
              <p className="text-xs sm:text-sm md:text-base lg:text-lg xl:text-xl text-muted-foreground max-w-3xl mx-auto px-4 leading-relaxed">
                <strong className="text-primary">Tallo automatically tracks your expenses as a creator</strong> and finds every tax deduction you're missing better than you or your accountant.
              </p>
              
              {selectedDeductions.size > 0 && (
                <div className="bg-gradient-to-r from-primary/10 to-secondary/10 border border-primary/20 rounded-xl p-3 sm:p-4 md:p-6 max-w-2xl mx-auto">
                  <div className="flex items-center justify-center space-x-2 mb-2">
                    <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 text-primary" />
                    <h3 className="text-sm sm:text-base md:text-lg lg:text-xl font-bold text-foreground leading-tight">
                      You selected {selectedDeductions.size} deduction{selectedDeductions.size !== 1 ? 's' : ''}
                    </h3>
                  </div>
                  <p className="text-xs sm:text-sm md:text-base text-muted-foreground">
                    Potential savings: {formatCurrency(totalValue.totalTaxSaved)} per year
                  </p>
                </div>
              )}
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
              <div className="grid md:grid-cols-2 gap-4 sm:gap-6">
                <div className="space-y-1 sm:space-y-2">
                  <Label htmlFor="firstName" className="text-sm sm:text-base font-medium text-foreground">
                    First Name *
                  </Label>
                  <div className="relative group">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
                    <Input
                      id="firstName"
                      type="text"
                      placeholder="Enter your first name"
                      value={leadFormData.firstName}
                      onChange={(e) => handleInputChange('firstName', e.target.value)}
                      className={`pl-8 sm:pl-10 h-10 sm:h-12 md:h-14 text-sm sm:text-base transition-all duration-300 focus:ring-2 focus:ring-primary/20 focus:border-primary bg-card border-border ${
                        errors.firstName ? 'border-destructive focus:border-destructive' : 'hover:border-primary/50'
                      }`}
                    />
                  </div>
                  {errors.firstName && (
                    <p className="text-xs sm:text-sm text-destructive animate-fade-in">{errors.firstName}</p>
                  )}
                </div>

                <div className="space-y-1 sm:space-y-2">
                  <Label htmlFor="email" className="text-sm sm:text-base font-medium text-foreground">
                    Email Address *
                  </Label>
                  <div className="relative group">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="Enter your email address"
                      value={leadFormData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      className={`pl-8 sm:pl-10 h-10 sm:h-12 md:h-14 text-sm sm:text-base transition-all duration-300 focus:ring-2 focus:ring-primary/20 focus:border-primary bg-card border-border ${
                        errors.email ? 'border-destructive focus:border-destructive' : 'hover:border-primary/50'
                      }`}
                    />
                  </div>
                  {errors.email && (
                    <p className="text-xs sm:text-sm text-destructive animate-fade-in">{errors.email}</p>
                  )}
                </div>
              </div>

              {/* General Error Display */}
              {errors.general && (
                <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-3">
                  <p className="text-sm text-destructive text-center">{errors.general}</p>
                </div>
              )}

              {/* Submit Button */}
              <div className="pt-2 sm:pt-4">
                {/* Submit button on desktop/tablet - hidden on mobile and sm */}
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="hidden md:flex w-full h-12 sm:h-14 md:h-16 text-sm sm:text-base md:text-lg font-semibold bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 text-primary-foreground transition-all duration-300 hover:scale-[1.02] hover:shadow-lg disabled:hover:scale-100 disabled:hover:shadow-none"
                >
                  {isSubmitting ? (
                    <div className="flex items-center space-x-2">
                      <div className="w-4 h-4 sm:w-5 sm:h-5 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin" />
                      <span>Getting Early Access...</span>
                    </div>
                  ) : (
                    <div className="flex items-center space-x-2">
                      <span>Get Early Access</span>
                      <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 transition-transform group-hover:translate-x-1" />
                    </div>
                  )}
                </Button>
                 {/* Social proof */}
                 <div className="mt-6 text-center">
                      <div className="flex items-center justify-center gap-4 text-xs text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Users className="w-3 h-3" />
                          <span>Join 211+ early adopters</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          <span>Closes November 30, 2025</span>
                        </div>
                      </div>
                    </div>
              </div>
            </form>

            {/* Social Proof */}
            <div className="text-center space-y-3 sm:space-y-4 pt-4 sm:pt-6 border-t border-border">
              <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-6 text-xs sm:text-sm text-muted-foreground">
                <div className="flex items-center space-x-1 sm:space-x-2">
                  <Shield className="w-3 h-3 sm:w-4 sm:h-4" />
                  <span>Built in Canada 🇨🇦</span>
                </div>
                <div className="flex items-center space-x-1 sm:space-x-2">
                  <Star className="w-3 h-3 sm:w-4 sm:h-4" />
                  <span>Backed by CPA</span>
                </div>
                <div className="flex items-center space-x-1 sm:space-x-2">
                  <Clock className="w-3 h-3 sm:w-4 sm:h-4" />
                  <span>Built for creators</span>
                </div>
              </div>
              
              <p className="text-xs text-muted-foreground max-w-2xl mx-auto px-4 leading-relaxed">
                Join hundreds of Canadian creators who are getting early access to Tallo. 
                We'll notify you when we launch and you can start maximizing your tax savings automatically.
              </p>
            </div>

            {/* Restart Option */}
            <div className="text-center">
              {/* Restart button on desktop/tablet - hidden on mobile and sm */}
              <Button
                onClick={onRestart}
                variant="outline"
                className="hidden md:flex px-4 sm:px-6 text-xs sm:text-sm"
              >
                Start Over
              </Button>
            </div>
          </div>
        </Card>
      </div>
    </div>
  )
}
