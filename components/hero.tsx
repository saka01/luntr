"use client"

import { GL } from "./gl"
import { Pill } from "./pill"
import { Button } from "./ui/button"
import { useState } from "react"

export function Hero() {
  const [hovering, setHovering] = useState(false)
  return (
    <div className="flex flex-col flex-1 justify-between overflow-hidden">
      <GL hovering={true} />

      <div className="pb-1 mt-24 text-center relative">
        <Pill className="mb-6">INVITE-ONLY RELEASE</Pill>
        <h1 className="text-5xl sm:text-6xl md:text-7xl font-sentient">
        Stop losing
        {" "}
          <i className="font-light">
            thousands
          </i>{" "}
          in taxes every year.
        </h1>
       
        <p className="font-mono text-sm sm:text-base text-foreground/60 text-balance max-w-[540px] mx-auto mb-0 mt-8">
        Tallo finds missed deductions for Canadian freelancers, sole proprietors, and creators—using intelligent automation and simple self-review workflows.
        </p>
        <p className="italic font-thin my-7 text-primary opacity-80">
          Backed by CPA  • Built in Canada for Canadians 🇨🇦
        </p>

       
        {/* CTA buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mt-14 w-fit mx-auto">
          <a className="contents" href="/deduction-finder">
            <Button 
              className="w-full sm:w-auto" 
              onMouseEnter={() => setHovering(true)} 
              onMouseLeave={() => setHovering(false)}
            >
              Find Missed Deductions
            </Button>
          </a>
          <a className="contents" href="mailto:alex@taxdeductly.ca">
              <Button 
                variant="outline" 
                className="w-full sm:w-auto" 
                onMouseEnter={() => setHovering(true)} 
                onMouseLeave={() => setHovering(false)}
              >
              Join Waitlist
            </Button>
          </a>
        </div>
      </div>
    </div>
  )
}
