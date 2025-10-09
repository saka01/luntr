'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { CheckCircle, Mail, User, ArrowRight, Shield, Clock, Star } from 'lucide-react'

interface Step3Props {
  formData: Record<string, any>
  selectedDeductions: Set<string>
  totalValue: { min: number; max: number }
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
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    setIsSubmitting(false)
    setIsSubmitted(true)
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
      <div className="w-full">
        <div className="animate-fade-in">
          <Card className="p-8 bg-card/80 border-border/50 backdrop-blur-sm shadow-xl">
            <div className="text-center space-y-6">
              <div className="flex justify-center">
                <div className="w-20 h-20 bg-gradient-to-r from-primary/20 to-secondary/20 rounded-full flex items-center justify-center animate-pulse-glow">
                  <CheckCircle className="w-10 h-10 text-primary" />
                </div>
              </div>
              
              <div className="space-y-4">
                <h2 className="text-3xl font-bold text-foreground">
                  You're on the list!
                </h2>
                <p className="text-xl text-muted-foreground">
                  We'll notify you when Tallo launches and you can start saving on taxes automatically.
                </p>
                <p className="text-muted-foreground">
                  Look for an email from Tallo with early access details.
                </p>
              </div>

              <div className="pt-6">
                <Button
                  onClick={onRestart}
                  variant="default"
                  className="px-8"
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

  return (
    <div className="w-full">
      <div className="animate-fade-in">
        <Card className="p-8 bg-card/80 border-border/50 backdrop-blur-sm shadow-xl">
          <div className="space-y-8">
            {/* Header */}
            <div className="text-center space-y-4">
              <h2 className="text-3xl font-bold text-foreground">
                Tracking all of this manually is overwhelming
              </h2>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                <strong className="text-primary">Tallo automatically finds these deductions</strong> straight from your bank transactions and receipts — CRA-ready.
              </p>
              
              {selectedDeductions.size > 0 && (
                <div className="bg-gradient-to-r from-primary/10 to-secondary/10 border border-primary/20 rounded-xl p-6 max-w-2xl mx-auto">
                  <div className="flex items-center justify-center space-x-2 mb-2">
                    <CheckCircle className="w-6 h-6 text-primary" />
                    <h3 className="text-xl font-bold text-foreground">
                      You selected {selectedDeductions.size} deduction{selectedDeductions.size !== 1 ? 's' : ''}
                    </h3>
                  </div>
                  <p className="text-muted-foreground">
                    Potential savings: {formatCurrency(totalValue.min)} – {formatCurrency(totalValue.max)} per year
                  </p>
                </div>
              )}
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="firstName" className="text-base font-medium text-foreground">
                    First Name *
                  </Label>
                  <div className="relative group">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
                    <Input
                      id="firstName"
                      type="text"
                      placeholder="Enter your first name"
                      value={leadFormData.firstName}
                      onChange={(e) => handleInputChange('firstName', e.target.value)}
                      className={`pl-10 h-14 text-base transition-all duration-300 focus:ring-2 focus:ring-primary/20 focus:border-primary bg-card border-border ${
                        errors.firstName ? 'border-destructive focus:border-destructive' : 'hover:border-primary/50'
                      }`}
                    />
                  </div>
                  {errors.firstName && (
                    <p className="text-sm text-destructive animate-fade-in">{errors.firstName}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email" className="text-base font-medium text-foreground">
                    Email Address *
                  </Label>
                  <div className="relative group">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="Enter your email address"
                      value={leadFormData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      className={`pl-10 h-14 text-base transition-all duration-300 focus:ring-2 focus:ring-primary/20 focus:border-primary bg-card border-border ${
                        errors.email ? 'border-destructive focus:border-destructive' : 'hover:border-primary/50'
                      }`}
                    />
                  </div>
                  {errors.email && (
                    <p className="text-sm text-destructive animate-fade-in">{errors.email}</p>
                  )}
                </div>
              </div>

              {/* Submit Button */}
              <div className="pt-4">
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full h-16 text-lg font-semibold bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 text-primary-foreground transition-all duration-300 hover:scale-[1.02] hover:shadow-lg disabled:hover:scale-100 disabled:hover:shadow-none"
                >
                  {isSubmitting ? (
                    <div className="flex items-center space-x-2">
                      <div className="w-5 h-5 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin" />
                      <span>Getting Early Access...</span>
                    </div>
                  ) : (
                    <div className="flex items-center space-x-2">
                      <span>Get Early Access</span>
                      <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
                    </div>
                  )}
                </Button>
              </div>
            </form>

            {/* Social Proof */}
            <div className="text-center space-y-4 pt-6 border-t border-border">
              <div className="flex items-center justify-center space-x-6 text-sm text-muted-foreground">
                <div className="flex items-center space-x-2">
                  <Shield className="w-4 h-4" />
                  <span>Built in Canada 🇨🇦</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Star className="w-4 h-4" />
                  <span>Backed by CPA</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Clock className="w-4 h-4" />
                  <span>Designed for freelancers</span>
                </div>
              </div>
              
              <p className="text-xs text-muted-foreground max-w-2xl mx-auto">
                Join thousands of Canadian freelancers who are getting early access to Tallo. 
                We'll notify you when we launch and you can start saving on taxes automatically.
              </p>
            </div>

            {/* Restart Option */}
            <div className="text-center">
              <Button
                onClick={onRestart}
                variant="outline"
                className="px-6 text-sm"
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
