'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { CheckCircle, Mail, User, ArrowRight, Star, Shield, Clock } from 'lucide-react'

interface LeadCaptureFormProps {
  deductions: string[]
  onRestart: () => void
}

export function LeadCaptureForm({ deductions, onRestart }: LeadCaptureFormProps) {
  const [formData, setFormData] = useState({
    firstName: '',
    email: ''
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }))
    }
  }

  const validateForm = () => {
    const newErrors: Record<string, string> = {}
    
    if (!formData.firstName.trim()) {
      newErrors.firstName = 'First name is required'
    }
    
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
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

  if (isSubmitted) {
    return (
      <div className="w-full">
        <div className="animate-fade-in">
          <Card className="p-8 bg-white/80 dark:bg-slate-800/80 border-slate-200/50 dark:border-slate-700/50 backdrop-blur-sm shadow-xl">
            <div className="text-center space-y-6">
              <div className="flex justify-center">
                <div className="w-20 h-20 bg-gradient-to-r from-blue-500/20 to-emerald-500/20 rounded-full flex items-center justify-center animate-pulse-glow">
                  <CheckCircle className="w-10 h-10 text-blue-500" />
                </div>
              </div>
              
              <div className="space-y-4">
                <h2 className="text-3xl font-bold text-slate-900 dark:text-white">
                  Check Your Email!
                </h2>
                <p className="text-xl text-slate-600 dark:text-slate-300">
                  We've sent your personalized tax deduction report to <strong className="text-blue-500">{formData.email}</strong>
                </p>
                <p className="text-slate-600 dark:text-slate-300">
                  Look for an email from Tallo with your detailed deduction analysis and next steps.
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
        <Card className="p-8 bg-white/80 dark:bg-slate-800/80 border-slate-200/50 dark:border-slate-700/50 backdrop-blur-sm shadow-xl">
          <div className="space-y-8">
            {/* Header */}
            <div className="text-center space-y-4">
              <div className="flex justify-center">
                <div className="w-16 h-16 bg-gradient-to-r from-blue-500/20 to-emerald-500/20 rounded-full flex items-center justify-center">
                  <CheckCircle className="w-8 h-8 text-blue-500" />
                </div>
              </div>
              <h2 className="text-3xl font-bold text-slate-900 dark:text-white">
                Get Your Personalized Tax Report
              </h2>
              <p className="text-slate-600 dark:text-slate-300 text-lg max-w-2xl mx-auto">
                Based on your answers, we've identified <strong className="text-blue-500">{deductions.length} potential deduction categories</strong> you may qualify for. 
                Get your detailed report with exact amounts and filing instructions.
              </p>
              
              {deductions.length > 0 && (
                <div className="bg-gradient-to-r from-blue-50 to-emerald-50 dark:from-blue-900/20 dark:to-emerald-900/20 border border-blue-200 dark:border-blue-700/50 rounded-lg p-4 max-w-2xl mx-auto">
                  <p className="text-sm text-blue-600 dark:text-blue-300 font-medium">
                    💡 <strong>Tax Season Tip:</strong> The average Canadian freelancer saves $2,400+ annually with proper deductions. 
                    Don't miss out on your potential savings!
                  </p>
                </div>
              )}
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="firstName" className="text-base font-medium text-slate-900 dark:text-white">
                    First Name *
                  </Label>
                  <div className="relative group">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
                    <Input
                      id="firstName"
                      type="text"
                      placeholder="Enter your first name"
                      value={formData.firstName}
                      onChange={(e) => handleInputChange('firstName', e.target.value)}
                      className={`pl-10 h-14 text-base transition-all duration-300 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 ${
                        errors.firstName ? 'border-red-500 focus:border-red-500' : 'hover:border-blue-300 dark:hover:border-blue-600'
                      }`}
                    />
                  </div>
                  {errors.firstName && (
                    <p className="text-sm text-red-500 animate-fade-in">{errors.firstName}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email" className="text-base font-medium text-slate-900 dark:text-white">
                    Email Address *
                  </Label>
                  <div className="relative group">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="Enter your email address"
                      value={formData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      className={`pl-10 h-14 text-base transition-all duration-300 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 ${
                        errors.email ? 'border-red-500 focus:border-red-500' : 'hover:border-blue-300 dark:hover:border-blue-600'
                      }`}
                    />
                  </div>
                  {errors.email && (
                    <p className="text-sm text-red-500 animate-fade-in">{errors.email}</p>
                  )}
                </div>
              </div>

              {/* Submit Button */}
              <div className="pt-4">
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full h-16 text-lg font-semibold bg-gradient-to-r from-blue-500 to-emerald-500 hover:from-blue-600 hover:to-emerald-600 text-white transition-all duration-300 hover:scale-[1.02] hover:shadow-lg disabled:hover:scale-100 disabled:hover:shadow-none"
                >
                  {isSubmitting ? (
                    <div className="flex items-center space-x-2">
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>Generating Your Report...</span>
                    </div>
                  ) : (
                    <div className="flex items-center space-x-2">
                      <span>Get My Free Tax Report</span>
                      <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
                    </div>
                  )}
                </Button>
              </div>
            </form>

            {/* Trust Indicators */}
            <div className="text-center space-y-4 pt-6 border-t border-slate-200 dark:border-slate-700">
              <div className="flex items-center justify-center space-x-6 text-sm text-slate-600 dark:text-slate-300">
                <div className="flex items-center space-x-2">
                  <Shield className="w-4 h-4" />
                  <span>100% Free</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Mail className="w-4 h-4" />
                  <span>No Spam</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4" />
                  <span>Instant Access</span>
                </div>
              </div>
              
              <p className="text-xs text-slate-600 dark:text-slate-300 max-w-2xl mx-auto">
                By submitting this form, you agree to receive your personalized tax report and occasional 
                tax tips from Tallo. You can unsubscribe at any time. We respect your privacy.
              </p>
            </div>

            {/* Restart Option */}
            <div className="text-center">
              <Button
                onClick={onRestart}
                variant="default"
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
