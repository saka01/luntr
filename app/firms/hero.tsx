"use client"

import { Pill } from "@/components/pill"
import { Button } from "@/components/ui/button"
import { useState } from "react"

export function Hero() {
  const [hovering, setHovering] = useState(false)
  return (
    <div className="flex flex-col flex-1 justify-center items-center min-h-screen px-4 py-24">
      <div className="text-center max-w-4xl mx-auto">
        <Pill className="mb-6">INVITE-ONLY RELEASE</Pill>
        <h1 className="text-5xl sm:text-6xl md:text-7xl font-bold tracking-tight">
          Built for the{" "}
          <i>
            <s>gig</s>
          </i>{" "}
          new economy
        </h1>
       
        <p className="text-lg text-foreground/60 text-balance max-w-[540px] mx-auto mb-8 mt-8">
          Tallo finds missed deductions for Canadian freelancers, sole proprietors, and creators—using intelligent automation and simple self-review workflows.
        </p>
        <p className="italic text-primary opacity-80 mb-12">
          Backed by CPA  • Built in Canada for Canadians 🇨🇦
        </p>
        
        {/* CTA buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <a href="mailto:alex@taxdeductly.ca">
            <Button 
              size="lg"
              onMouseEnter={() => setHovering(true)} 
              onMouseLeave={() => setHovering(false)}
            >
              [Contact Us]
            </Button>
          </a>
        </div>
      </div>
    </div>
  )
}
