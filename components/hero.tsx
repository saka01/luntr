"use client"

import { GL } from "./gl"
import { Pill } from "./pill"
import { Button } from "./ui/button"
import { useState } from "react"

export function Hero() {
  const [hovering, setHovering] = useState(false)
  return (
    <div className="flex flex-col flex-1 justify-between overflow-hidden">
      <GL hovering={hovering} />

      <div className="pb-16 mt-auto text-center relative">
        <Pill className="mb-6">INVITE-ONLY BETA RELEASE</Pill>
        <h1 className="text-5xl sm:text-6xl md:text-7xl font-sentient">
          Built for the{" "}
          <i className="font-light">
            <s>gig</s>
          </i>{" "}
          new economy
        </h1>
       
        <p className="font-mono text-sm sm:text-base text-foreground/60 text-balance max-w-[440px] mx-auto mb-0 mt-8">
          Deductly helps accountants uncover missed deductions for freelancers, sole proprietors, and creators through
          intelligent automation + client self-review workflows.{" "}
        </p>
 <p className="italic font-thin my-7 text-primary opacity-80">
      Backed by CPA  • Built in Canada for Canadians 🇨🇦
      </p>
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
