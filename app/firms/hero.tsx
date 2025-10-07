"use client"

import { Pill } from "@/components/pill"
import { Button } from "@/components/ui/button"
import { useState } from "react"

export function Hero() {
  const [hovering, setHovering] = useState(false)
  return (
    <div className="flex flex-col flex-1 justify-between overflow-hidden">
      <div className="pb-1 mt-auto text-center relative">
        <Pill className="mb-6">INVITE-ONLY RELEASE</Pill>
        <h1 className="text-5xl sm:text-6xl md:text-7xl">
          Built for the{" "}
          <i>
            <s>gig</s>
          </i>{" "}
          new economy
        </h1>
       
        <p className="text-sm sm:text-base text-foreground/60 text-balance max-w-[540px] mx-auto mb-0 mt-8">
        Tallo finds missed deductions for Canadian freelancers, sole proprietors, and creators—using intelligent automation and simple self-review workflows.
        </p>
        <p className="italic my-7 text-primary opacity-80">
          Backed by CPA  • Built in Canada for Canadians 🇨🇦
        </p>

        {/* Original CTA buttons */}
        <a className="contents max-sm:hidden" href="mailto:alex@taxdeductly.ca">
          <Button className="mt-14" onMouseEnter={() => setHovering(true)} onMouseLeave={() => setHovering(false)}>
            [Contact Us]
          </Button>
        </a>
        <a className="contents sm:hidden" href="mailto:alex@taxdeductly.ca">
          <Button
            size="sm"
            className="mt-14"
            onMouseEnter={() => setHovering(true)}
            onMouseLeave={() => setHovering(false)}
          >
            [Contact Us]
          </Button>
        </a>
      </div>
    </div>
  )
}
