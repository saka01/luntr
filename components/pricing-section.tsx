"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Check, Sparkles } from "lucide-react"
import { WaitlistPopup } from "@/components/waitlist-popup"

const pricingPlans = [
  {
    name: "Free",
    price: "$0",
    description: "Perfect for getting started with expense tracking",
    features: [
      "50 AI-identified business transactions per month",
      "Connect 1 bank account or credit card",
      "AI categorization and review",
      "Basic expense reports",
    ],
    popular: false,
    cta: "Join waitlist",
  },
  {
    name: "Pro",
    price: "$149",
    period: "/year",
    description: "For self-employed professionals who want to maximize deductions",
    features: [
      "Unlimited AI-identified business transactions",
      "Connect multiple accounts (banks + credit cards)",
      "Receipt management and CRA-compliant documentation",
      "T2125-organized reports",
      "TurboTax export",
      "GST/HST and Input Tax Credit tracking",
      "Educational deduction explanations",
    ],
    popular: true,
    cta: "Join waitlist",
  },
  {
    name: "Full Service",
    price: "$250",
    period: "/year",
    description: "Complete tax filing service with audit protection",
    features: [
      "Everything in Pro",
      "Full tax filing to CRA",
      "Audit security and protection",
      "Dedicated tax professional",
      "Priority support",
      "Tax optimization consultation",
    ],
    popular: false,
    cta: "Join waitlist",
  },
]

export function PricingSection() {
  const [isWaitlistOpen, setIsWaitlistOpen] = useState(false)

  const handleJoinWaitlist = () => {
    setIsWaitlistOpen(true)
  }

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
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-sm mb-6"
          >
            <Sparkles className="w-4 h-4 text-[#e78a53]" />
            <span className="text-sm font-medium text-white/80">Pricing</span>
          </motion.div>

          <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-white via-white to-white/60 bg-clip-text text-transparent mb-4">
            Choose your plan
          </h2>

          <p className="text-lg text-white/60 max-w-2xl mx-auto mb-8">
            Choose the plan that fits your business needs. Start free and upgrade as you grow.
          </p>

          {/* Pricing Note */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="flex items-center justify-center gap-2 p-3 bg-white/5 rounded-full border border-white/10 backdrop-blur-sm w-fit mx-auto px-6 py-2"
          >
            <span className="text-sm text-white/80">All paid plans billed annually</span>
          </motion.div>
        </motion.div>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {pricingPlans.map((plan, index) => (
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
                  : "bg-white/5 border-white/10 hover:border-white/20"
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
                <h3 className="text-xl font-bold text-white mb-2">{plan.name}</h3>
                <div className="flex items-baseline justify-center gap-1 mb-2">
                  <span className="text-4xl font-bold text-white">{plan.price}</span>
                  {plan.period && (
                    <span className="text-white/60 text-lg">{plan.period}</span>
                  )}
                </div>
                <p className="text-white/60 text-sm">{plan.description}</p>
              </div>

              <ul className="space-y-4 mb-8">
                {plan.features.map((feature, featureIndex) => (
                  <li key={featureIndex} className="flex items-center gap-3">
                    <Check className="w-5 h-5 text-[#e78a53] flex-shrink-0" />
                    <span className="text-white/80 text-sm">{feature}</span>
                  </li>
                ))}
              </ul>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleJoinWaitlist}
                className={`w-full py-3 px-6 rounded-lg font-medium transition-all duration-200 cursor-pointer ${
                  plan.popular
                    ? "bg-gradient-to-r from-[#e78a53] to-[#e78a53]/80 text-white shadow-lg shadow-[#e78a53]/25 hover:shadow-[#e78a53]/40"
                    : "bg-white/10 text-white border border-white/20 hover:bg-white/20"
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
          <p className="text-white/60 mb-4">Need a custom solution? We're here to help.</p>
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
