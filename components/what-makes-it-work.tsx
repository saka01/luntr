"use client"

import { motion } from "framer-motion"

export default function WhatMakesItWork() {
  const features = [
    {
      title: "Spaced Repetition",
      description: "Forget slower. Remember longer."
    },
    {
      title: "Retrieval Practice", 
      description: "Stop rereading. Start recalling."
    },
    {
      title: "Feedback Loop",
      description: "Our AI critiques your plan, not just your code."
    },
    {
      title: "Interleaving",
      description: "Similar patterns. Different challenges. Sharper instincts."
    }
  ]

  return (
    <section className="py-24 sm:py-32 bg-background relative z-10">
      <div className="container mx-auto px-4">
        <div className="mx-auto max-w-4xl text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="mb-16"
          >
            <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl lg:text-5xl mb-4">
              What Makes It Work
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Science-backed learning loop built for coders
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="group"
              >
                <div className="border border-border bg-card rounded-2xl p-8 h-full hover:border-primary/50 transition-colors duration-300">
                  <h3 className="text-xl font-semibold text-foreground mb-3 group-hover:text-primary transition-colors duration-300">
                    {feature.title}
                  </h3>
                  <p className="text-muted-foreground leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            viewport={{ once: true }}
            className="border border-primary/20 bg-primary/5 rounded-2xl p-8"
          >
            <p className="text-lg font-medium text-foreground">
              You'll literally feel your recall speed up within 7 days.
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
