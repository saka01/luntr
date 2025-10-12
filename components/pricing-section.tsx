"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Check, X, Sparkles } from "lucide-react"
import { WaitlistPopup } from "@/components/waitlist-popup"

const pricingPlans = {
  monthly: [
    {
      name: "Start Free",
      price: "$0",
      description: "Perfect for getting started with expense tracking",
      features: [
        { text: "50 AI-identified business transactions per month", available: true },
        { text: "Connect 1 bank account or credit card", available: true },
        { text: "AI categorization and review", available: true },
        { text: "Basic expense reports", available: true },
        { text: "Unlimited AI-identified business transactions", available: false },
        { text: "Connect multiple accounts (banks + credit cards)", available: false },
        { text: "Receipt management and CRA-compliant documentation", available: false },
        { text: "T2125-organized reports", available: false },
        { text: "TurboTax export", available: false },
        { text: "GST/HST and Input Tax Credit tracking", available: false },
        { text: "Educational deduction explanations", available: false },
      ],
      popular: false,
      cta: "Get Early Access",
    },
    {
      name: "Creator Pro",
      price: "$9",
      period: "/month",
      description: "For content creators who want to maximize deductions",
      features: [
        { text: "50 AI-identified business transactions per month", available: true },
        { text: "Connect 1 bank account or credit card", available: true },
        { text: "AI categorization and review", available: true },
        { text: "Basic expense reports", available: true },
        { text: "Unlimited AI-identified business transactions", available: true },
        { text: "Connect multiple accounts (banks + credit cards)", available: true },
        { text: "Receipt management and CRA-compliant documentation", available: true },
        { text: "T2125-organized reports", available: true },
        { text: "TurboTax export", available: true },
        { text: "GST/HST and Input Tax Credit tracking", available: true },
        { text: "Educational deduction explanations", available: true },
      ],
      popular: true,
      cta: "Get Early Access",
    },
  ],
  yearly: [
    {
      name: "Start Free",
      price: "$0",
      description: "Perfect for getting started with expense tracking",
      features: [
        { text: "50 AI-identified business transactions per month", available: true },
        { text: "Connect 1 bank account or credit card", available: true },
        { text: "AI categorization and review", available: true },
        { text: "Basic expense reports", available: true },
        { text: "Unlimited AI-identified business transactions", available: false },
        { text: "Connect multiple accounts (banks + credit cards)", available: false },
        { text: "Receipt management and CRA-compliant documentation", available: false },
        { text: "T2125-organized reports", available: false },
        { text: "TurboTax export", available: false },
        { text: "GST/HST and Input Tax Credit tracking", available: false },
        { text: "Educational deduction explanations", available: false },
      ],
      popular: false,
      cta: "Get Early Access",
    },
    {
      name: "Creator Pro",
      price: "$97",
      period: "/year",
      description: "For content creators who want to maximize deductions",
      features: [
        { text: "50 AI-identified business transactions per month", available: true },
        { text: "Connect 1 bank account or credit card", available: true },
        { text: "AI categorization and review", available: true },
        { text: "Basic expense reports", available: true },
        { text: "Unlimited AI-identified business transactions", available: true },
        { text: "Connect multiple accounts (banks + credit cards)", available: true },
        { text: "Receipt management and CRA-compliant documentation", available: true },
        { text: "T2125-organized reports", available: true },
        { text: "TurboTax export", available: true },
        { text: "GST/HST and Input Tax Credit tracking", available: true },
        { text: "Educational deduction explanations", available: true },
      ],
      popular: true,
      cta: "Get Early Access",
    },
  ],
}

export function PricingSection() {
  const [isWaitlistOpen, setIsWaitlistOpen] = useState(false)
  const [billingPeriod, setBillingPeriod] = useState<'monthly' | 'yearly'>('yearly')

  return (
    <section className="relative py-24 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-background/5 border border-border backdrop-blur-sm mb-6"
          >
            <Sparkles className="w-4 h-4 text-[#e78a53]" />
            <span className="text-sm font-medium text-foreground/80">Pricing</span>
          </motion.div>

          <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-foreground via-foreground to-foreground/60 bg-clip-text text-transparent mb-4">
            Start Free
          </h2>

          <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8">
            Choose a plan that fits your needs. Upgrade as you grow.
          </p>

          {/* Billing Period Toggle */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="flex items-center justify-center gap-4 mb-8"
          >
            <span className={`text-sm font-medium transition-colors ${billingPeriod === 'monthly' ? 'text-foreground' : 'text-muted-foreground'}`}>
              Monthly
            </span>
            <button
              onClick={() => setBillingPeriod(billingPeriod === 'monthly' ? 'yearly' : 'monthly')}
              className="relative w-12 h-6 bg-background/10 border border-border rounded-full transition-colors hover:bg-background/20"
            >
              <motion.div
                animate={{ x: billingPeriod === 'yearly' ? 24 : 0 }}
                transition={{ type: "spring", stiffness: 500, damping: 30 }}
                className="absolute top-0.5 left-0.5 w-5 h-5 bg-[#e78a53] rounded-full"
              />
            </button>
            <span className={`text-sm font-medium transition-colors ${billingPeriod === 'yearly' ? 'text-foreground' : 'text-muted-foreground'}`}>
              Yearly
            </span>
          </motion.div>
        </motion.div>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {pricingPlans[billingPeriod].map((plan, index) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              whileHover={{ y: -5 }}
              className={`relative rounded-2xl p-8 backdrop-blur-sm border transition-all duration-300 ${
                plan.popular
                  ? "bg-gradient-to-b from-[#e78a53]/10 to-transparent border-[#e78a53]/30 shadow-lg shadow-[#e78a53]/10"
                  : "bg-background/5 border-border"
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <div className="bg-gradient-to-r from-[#e78a53] to-[#e78a53]/80 text-white text-sm font-medium px-4 py-2 rounded-full">
                    Most Popular
                  </div>
                </div>
              )}

              <div className="text-center mb-8">
                <h3 className="text-xl font-bold text-foreground mb-2">{plan.name}</h3>
                <div className="flex items-baseline justify-center gap-1 mb-2">
                  <span className="text-4xl font-bold text-foreground">{plan.price}</span>
                  {plan.period && (
                    <span className="text-muted-foreground text-lg">{plan.period}</span>
                  )}
                  {billingPeriod === 'yearly' && plan.name === 'Creator Pro' && (
                    <span className="text-xs bg-green-500/10 text-green-500 px-2 py-1 rounded-full font-medium ml-2 border border-green-500">
                      Save 20%
                    </span>
                  )}
                </div>
                <p className="text-muted-foreground text-sm">{plan.description}</p>
              </div>

              <ul className="space-y-4 mb-8">
                {plan.features.map((feature, featureIndex) => (
                  <li key={featureIndex} className="flex items-center gap-3">
                    {feature.available ? (
                      <Check className="w-5 h-5 text-[#e78a53] flex-shrink-0" />
                    ) : (
                      <X className="w-5 h-5 text-muted-foreground/50 flex-shrink-0" />
                    )}
                    <span className={`text-sm ${feature.available ? 'text-foreground/80' : 'text-muted-foreground/50'}`}>
                      {feature.text}
                    </span>
                  </li>
                ))}
              </ul>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setIsWaitlistOpen(true)}
                className={`w-full py-3 px-6 rounded-lg font-medium transition-all duration-200 cursor-pointer ${
                  plan.popular
                    ? "bg-gradient-to-r from-[#e78a53] to-[#e78a53]/80 text-white shadow-lg shadow-[#e78a53]/25 hover:shadow-[#e78a53]/40"
                    : "bg-background/10 text-foreground border border-border hover:bg-background/20"
                }`}
              >
                {plan.cta}
              </motion.button>
            </motion.div>
          ))}
        </div>

        {/* Bottom CTA */}
        {/* <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="text-center mt-16"
        >
          <p className="text-muted-foreground mb-4">Need a custom solution? We're here to help.</p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="text-[#e78a53] hover:text-[#e78a53]/80 font-medium transition-colors"
          >
            Contact our sales team →
          </motion.button>
        </motion.div> */}
      </div>
      
      {/* Waitlist Popup */}
      <WaitlistPopup 
        isOpen={isWaitlistOpen} 
        onClose={() => setIsWaitlistOpen(false)} 
      />
    </section>
  )
}
