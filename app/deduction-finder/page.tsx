'use client'

import { useState, useEffect } from 'react'
import { DeductionFinderStep1 } from '@/components/deduction-finder-step1'
import { DeductionFinderStep2 } from '@/components/deduction-finder-step2'
import { DeductionFinderStep3 } from '@/components/deduction-finder-step3'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Button } from "@/components/ui/button"
import { RotateCcw } from "lucide-react"

export default function DeductionFinderPage() {
  const [currentStep, setCurrentStep] = useState(0)
  const [formData, setFormData] = useState<Record<string, any>>({})
  const [selectedDeductions, setSelectedDeductions] = useState<Set<string>>(new Set())
  const [totalValue, setTotalValue] = useState({ min: 0, max: 0 })
  const [isInitialized, setIsInitialized] = useState(false)

  // Load saved data from localStorage on component mount
  useEffect(() => {
    const savedFormData = localStorage.getItem('deduction-finder-form-data')
    const savedStep = localStorage.getItem('deduction-finder-step')
    const savedDeductions = localStorage.getItem('deduction-finder-selected')
    
    if (savedFormData) {
      setFormData(JSON.parse(savedFormData))
    }
    if (savedStep) {
      setCurrentStep(parseInt(savedStep))
    }
    if (savedDeductions) {
      setSelectedDeductions(new Set(JSON.parse(savedDeductions)))
    }
    
    setIsInitialized(true)
  }, [])

  // Save form data to localStorage whenever it changes (but not on initial load)
  useEffect(() => {
    if (isInitialized && Object.keys(formData).length > 0) {
      localStorage.setItem('deduction-finder-form-data', JSON.stringify(formData))
    }
  }, [formData, isInitialized])

  // Save current step to localStorage whenever it changes (but not on initial load)
  useEffect(() => {
    if (isInitialized) {
      localStorage.setItem('deduction-finder-step', currentStep.toString())
    }
  }, [currentStep, isInitialized])

  // Save selected deductions to localStorage whenever they change (but not on initial load)
  useEffect(() => {
    if (isInitialized && selectedDeductions.size > 0) {
      localStorage.setItem('deduction-finder-selected', JSON.stringify(Array.from(selectedDeductions)))
    }
  }, [selectedDeductions, isInitialized])

  const handleStep1Next = (stepData: Record<string, any>) => {
    const newFormData = { ...formData, ...stepData }
    setFormData(newFormData)
    setCurrentStep(1)
  }

  const handleStep2Next = (selectedDeductions: Set<string>, totalValue: { min: number; max: number }) => {
    setSelectedDeductions(selectedDeductions)
    setTotalValue(totalValue)
    setCurrentStep(2)
  }

  const handleRestart = () => {
    setCurrentStep(0)
    setFormData({})
    setSelectedDeductions(new Set())
    setTotalValue({ min: 0, max: 0 })
    setIsInitialized(false)
    localStorage.removeItem('deduction-finder-form-data')
    localStorage.removeItem('deduction-finder-step')
    localStorage.removeItem('deduction-finder-selected')
    // Re-initialize after clearing
    setTimeout(() => setIsInitialized(true), 100)
  }

  return (
    <div className="relative overflow-hidden">
      
      <main className="relative z-10">
        {/* Main Calculator Section */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="text-center my-6">
            <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-3">
              Canadian Tax Deduction Finder
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Discover all the tax deductions you're eligible for as a Canadian freelancer or self-employed individual. 
              Our smart questionnaire helps you identify potential savings.
            </p>
          </div>

          {/* Main Content */}
          <div className="flex items-center justify-center p-3 max-w-4xl mx-auto">
            <div className="w-full">
              {currentStep === 0 && (
                <DeductionFinderStep1
                  onNext={handleStep1Next}
                  formData={formData}
                />
              )}
              {currentStep === 1 && (
                <DeductionFinderStep2
                  formData={formData}
                  onNext={handleStep2Next}
                />
              )}
              {currentStep === 2 && (
                <DeductionFinderStep3
                  formData={formData}
                  selectedDeductions={selectedDeductions}
                  totalValue={totalValue}
                  onRestart={handleRestart}
                />
              )}
            </div>
          </div>
        </div>

        {/* SEO Blog Section */}
        <div className="relative py-20 overflow-hidden">
          <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-20">
            {/* What are Tax Deductions */}
            <section id="what-are-deductions" className="animate-fade-in">
              <div className="text-center mb-8">
                <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-3 py-1 rounded-full text-sm  mb-4">
                  <span className="w-1.5 h-1.5 bg-primary rounded-full" />
                  Tax Education
                </div>
                <h2 className="text-4xl font-bold mb-6 text-balance bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text">
                  What are Tax Deductions for Canadian Freelancers?
                </h2>
              </div>
              <div className="bg-card/50 backdrop-blur-sm border border-border/50 rounded-2xl p-8 shadow-lg">
                <p className="text-lg text-muted-foreground leading-relaxed text-pretty">
                  Tax deductions are legitimate business expenses that reduce your taxable income, ultimately lowering the amount of tax you owe. 
                  As a Canadian freelancer or self-employed individual, you can deduct reasonable expenses incurred to earn business income. 
                  These deductions are claimed on your T2125 Statement of Business or Professional Activities form.
                </p>
              </div>
            </section>

            {/* Common Deduction Categories */}
            <section className="animate-fade-in">
              <div className="text-center mb-12">
                <div className="inline-flex items-center gap-2 bg-secondary/10 text-secondary px-3 py-1 rounded-full text-sm  mb-4">
                  <span className="w-1.5 h-1.5 bg-secondary rounded-full" />
                  Deduction Categories
                </div>
                <h2 className="text-4xl font-bold mb-6 text-balance bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text">
                  Top Tax Deductions for Canadian Freelancers
                </h2>
              </div>
              <div className="grid md:grid-cols-2 gap-6">
                <Card className="group hover:shadow-lg transition-all duration-300 hover:scale-105 bg-card/50 backdrop-blur-sm border border-border/50">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg flex items-center gap-2">
                      <div className="w-2 h-2 bg-primary rounded-full" />
                      Home Office Expenses
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="text-sm text-muted-foreground">
                    Deduct rent, utilities, internet, property taxes, and home insurance based on the percentage of your home used exclusively for business.
                  </CardContent>
                </Card>
                <Card className="group hover:shadow-lg transition-all duration-300 hover:scale-105 bg-card/50 backdrop-blur-sm border border-border/50">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg flex items-center gap-2">
                      <div className="w-2 h-2 bg-secondary rounded-full" />
                      Vehicle Expenses
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="text-sm text-muted-foreground">
                    Gas, insurance, maintenance, repairs, and lease payments can be deducted based on business use percentage. Keep detailed mileage logs.
                  </CardContent>
                </Card>
                <Card className="group hover:shadow-lg transition-all duration-300 hover:scale-105 bg-card/50 backdrop-blur-sm border border-border/50">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg flex items-center gap-2">
                      <div className="w-2 h-2 bg-accent rounded-full" />
                      Software & Subscriptions
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="text-sm text-muted-foreground">
                    Business software, cloud services, professional memberships, and online tools used for your business are fully deductible.
                  </CardContent>
                </Card>
                <Card className="group hover:shadow-lg transition-all duration-300 hover:scale-105 bg-card/50 backdrop-blur-sm border border-border/50">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg flex items-center gap-2">
                      <div className="w-2 h-2 bg-primary rounded-full" />
                      Professional Development
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="text-sm text-muted-foreground">
                    Courses, conferences, books, training, and certifications directly related to your business are deductible expenses.
                  </CardContent>
                </Card>
                <Card className="group hover:shadow-lg transition-all duration-300 hover:scale-105 bg-card/50 backdrop-blur-sm border border-border/50">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg flex items-center gap-2">
                      <div className="w-2 h-2 bg-secondary rounded-full" />
                      Marketing & Advertising
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="text-sm text-muted-foreground">
                    Website costs, social media ads, business cards, promotional materials, and marketing campaigns are deductible.
                  </CardContent>
                </Card>
                <Card className="group hover:shadow-lg transition-all duration-300 hover:scale-105 bg-card/50 backdrop-blur-sm border border-border/50">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg flex items-center gap-2">
                      <div className="w-2 h-2 bg-accent rounded-full" />
                      Professional Fees
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="text-sm text-muted-foreground">
                    Legal fees, accounting services, bookkeeping, and professional consultations related to your business are deductible.
                  </CardContent>
                </Card>
              </div>
            </section>

            {/* How to Claim Deductions */}
            <section id="how-to-claim" className="animate-fade-in">
              <div className="text-center mb-12">
                <div className="inline-flex items-center gap-2 bg-accent/10 text-accent px-3 py-1 rounded-full text-sm  mb-4">
                  <span className="w-1.5 h-1.5 bg-accent rounded-full" />
                  How It Works
                </div>
                <h2 className="text-4xl font-bold mb-6 text-balance bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text">
                  How to Claim Your Tax Deductions
                </h2>
              </div>
              <div className="bg-card/50 backdrop-blur-sm border border-border/50 rounded-2xl p-8 shadow-lg">
                <div className="space-y-6 text-muted-foreground leading-relaxed">
                  <p className="text-pretty text-lg">
                    To claim tax deductions, you must maintain detailed records of all business expenses including receipts, invoices, and bank statements. 
                    The expense must be reasonable and directly related to earning business income. You'll report these deductions on your T2125 form 
                    when filing your personal tax return.
                  </p>
                  <p className="text-pretty text-lg">
                    Keep in mind that some expenses have specific rules - meals and entertainment are only 50% deductible, vehicle expenses require 
                    detailed mileage logs, and home office deductions must be calculated based on the percentage of your home used exclusively for business.
                  </p>
                </div>
              </div>
            </section>

            {/* FAQ */}
            <section id="faq" className="animate-fade-in">
              <div className="text-center mb-12">
                <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-3 py-1 rounded-full text-sm  mb-4">
                  <span className="w-1.5 h-1.5 bg-primary rounded-full" />
                  FAQ
                </div>
                <h2 className="text-4xl font-bold mb-6 text-balance bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text">
                  Frequently Asked Questions
                </h2>
              </div>
              <div className="bg-card/50 backdrop-blur-sm border border-border/50 rounded-2xl p-8 shadow-lg">
                <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="item-1">
                  <AccordionTrigger className="text-left">What expenses can I deduct as a freelancer?</AccordionTrigger>
                  <AccordionContent className="text-muted-foreground leading-relaxed">
                    You can deduct any reasonable expense incurred to earn business income, including home office costs, vehicle expenses, 
                    software subscriptions, professional development, marketing, equipment, supplies, and professional fees. The expense 
                    must be directly related to your business and you must keep receipts.
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-2">
                  <AccordionTrigger className="text-left">How do I calculate home office deductions?</AccordionTrigger>
                  <AccordionContent className="text-muted-foreground leading-relaxed">
                    Calculate the percentage of your home used exclusively for business (e.g., 10% of total square footage). 
                    Apply this percentage to rent, utilities, internet, property taxes, and home insurance. The space must be used 
                    regularly and exclusively for business purposes.
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-3">
                  <AccordionTrigger className="text-left">Do I need receipts for all deductions?</AccordionTrigger>
                  <AccordionContent className="text-muted-foreground leading-relaxed">
                    Yes, you must keep receipts, invoices, and bank statements for all business expenses. The CRA can audit your 
                    deductions and request supporting documentation. Digital receipts are acceptable, but ensure they're legible 
                    and contain all required information.
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-4">
                  <AccordionTrigger className="text-left">Can I deduct meals and entertainment?</AccordionTrigger>
                  <AccordionContent className="text-muted-foreground leading-relaxed">
                    Business meals and entertainment are only 50% deductible in Canada. This includes client meals, business lunches, 
                    and entertainment expenses. Keep detailed records of who you met with and the business purpose of the expense.
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-5">
                  <AccordionTrigger className="text-left">What if I'm audited by the CRA?</AccordionTrigger>
                  <AccordionContent className="text-muted-foreground leading-relaxed">
                    If audited, you'll need to provide supporting documentation for all claimed deductions. This is why it's crucial 
                    to maintain detailed records. Consider working with a tax professional who can help ensure your deductions are 
                    properly documented and compliant with CRA requirements.
                  </AccordionContent>
                </AccordionItem>
                </Accordion>
              </div>
            </section>
          </div>
        </div>
      </main>
    </div>
  )
}

