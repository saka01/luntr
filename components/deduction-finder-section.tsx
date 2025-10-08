"use client"

import { motion } from "framer-motion"
import { useRef } from "react"
import { useInView } from "framer-motion"

export function DeductionFinderSection() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, amount: 0.3 })

  return (
    <section className="relative py-16 sm:py-24">
      <div className="container mx-auto px-4">
        <div className="border border-secondary rounded-2xl mx-auto max-w-4xl px-6 py-12 sm:px-12 sm:py-16">
          <motion.div
            ref={ref}
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
          {/* Main content */}
          <div className="relative">

            {/* Content */}
            <div className="relative z-10">
              <h2 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl lg:text-4xl mb-4 sm:mb-6">
                Not sure what you're missing?
              </h2>
              
              <p className="text-base sm:text-lg text-muted-foreground mb-6 sm:mb-8 max-w-2xl mx-auto px-4 sm:px-0">
                Try our free <strong className="text-primary">Deduction Finder</strong>. Just answer a few questions and discover which CRA deductions apply to your business.
              </p>

              {/* CTA Button */}
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="flex justify-center"
              >
                <a href="/deduction-finder">
                  <div className="group cursor-pointer border border-border bg-card gap-2 h-[56px] sm:h-[64px] flex items-center p-[8px] sm:p-[11px] rounded-full hover:bg-card/80 transition-all duration-300">
                    <div className="border border-border bg-secondary h-[40px] sm:h-[43px] rounded-full flex items-center justify-center text-secondary-foreground px-4 sm:px-6">
                      <p className="font-medium tracking-tight flex items-center gap-2 sm:gap-3 justify-center text-sm sm:text-base">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="18"
                          height="18"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="lucide lucide-search sm:w-5 sm:h-5"
                        >
                          <circle cx="11" cy="11" r="8"></circle>
                          <path d="m21 21-4.35-4.35"></path>
                        </svg>
                        <span className="hidden sm:inline">Try Deduction Finder</span>
                        <span className="sm:hidden">Try Finder</span>
                      </p>
                    </div>
                     <div className="text-muted-foreground group-hover:ml-2 sm:group-hover:ml-4 ease-in-out transition-all size-[20px] sm:size-[24px] flex items-center justify-center rounded-full border-2 border-border">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="12"
                        height="12"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="lucide lucide-arrow-right group-hover:rotate-180 ease-in-out transition-all sm:w-3.5 sm:h-3.5"
                       >
                        <path d="M5 12h14"></path>
                        <path d="m12 5 7 7-7 7"></path>
                      </svg>
                    </div>
                  </div>
                </a>
              </motion.div>

              {/* Trust indicators */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                transition={{ duration: 0.5, delay: 0.4 }}
                className="mt-6 sm:mt-8 flex items-center justify-center gap-2 text-xs sm:text-sm text-muted-foreground"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="text-foreground sm:w-4 sm:h-4"
                >
                  <path d="M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2zm0 18a8 8 0 1 1 8-8 8 8 0 0 1-8 8z"></path>
                  <path d="M12 6v6l4 2"></path>
                </svg>
                <span>Takes <i className="italic">less than</i> 2 minutes</span>
              </motion.div>
            </div>
          </div>
        </motion.div>
        </div>
      </div>
    </section>
  )
}
