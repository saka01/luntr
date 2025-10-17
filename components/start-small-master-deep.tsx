"use client"

import { motion } from "framer-motion"

export default function StartSmallMasterDeep() {
  const learningPoints = [
    "Spot when two-ends or fast/slow scanning apply",
    "Sketch plans that pass edge cases", 
    "Recognize look-alike traps (Sliding Window vs Two Pointers)"
  ]

  return (
    <section className="py-24 sm:py-32 bg-muted/30 relative z-10">
      <div className="container mx-auto px-4">
        <div className="mx-auto max-w-4xl">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl lg:text-5xl mb-6">
                Start Small. Master Deep.
              </h2>
              <div className="space-y-4">
                <p className="text-lg text-muted-foreground">
                  Your free pattern: <span className="font-semibold text-primary">Two Pointers</span>.
                </p>
             
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              viewport={{ once: true }}
              className="space-y-4"
            >
              {learningPoints.map((point, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 0.3 + index * 0.1 }}
                  viewport={{ once: true }}
                  className="flex items-start gap-3"
                >
                  <div className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center mt-0.5">
                    <div className="w-2 h-2 rounded-full bg-primary"></div>
                  </div>
                  <p className="text-foreground leading-relaxed">{point}</p>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  )
}
