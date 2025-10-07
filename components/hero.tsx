"use client"

import { Pill } from "./pill"
import { Button } from "./ui/button"
import { useState } from "react"
import { WordRotate } from "@/registry/magicui/word-rotate"

export function Hero() {
  const [hovering, setHovering] = useState(false)
  return (
    <div className="flex flex-col flex-1 justify-between overflow-hidden">
      <div className="pb-1 mt-24 text-center relative mx-8">
        <Pill className="mb-6">INVITE-ONLY RELEASE</Pill>

        <h1 className="text-4xl sm:text-5xl md:text-6xl md:text-nowrap font-bold md:mt-4">
        Stop losing
        {" "}
          <i className="italic font-thin">
            thousand$
          </i>{" "}
          in taxes.
        </h1>

       
        <p className="text-base sm:text-lg text-foreground/60 text-balance max-w-[540px] mx-auto mb-0 mt-8">
        Tallo automatically finds CRA-eligible write-offs + files your taxes every year. <br/> No spreadsheets, no guesswork.        </p>
        <p className="my-7 text-primary opacity-80">
          Backed by CPA | Built in Canada for Canadians 🇨🇦
        </p>

       
        {/* CTA buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mt-14 w-fit mx-auto">
          <a className="contents" href="/deduction-finder">
            <Button 
              size="lg"
              className="w-full sm:w-auto bg-gradient-to-r from-[#0AAFD0] to-[#0AAFD0]/80 hover:from-[#0AAFD0]/90 hover:to-[#0AAFD0]/70 shadow-lg hover:shadow-xl transition-all duration-300 group" 
              onMouseEnter={() => setHovering(true)} 
              onMouseLeave={() => setHovering(false)}
            >
              <span className="flex items-center gap-2">
                Discover Your Hidden Deductions
                <span className="group-hover:translate-x-1 transition-transform duration-200">→</span>
              </span>
            </Button>
          </a>
          <a className="contents" href="mailto:alex@taxdeductly.ca">
              <Button 
                variant="outline" 
                size="lg"
                className="w-full sm:w-auto border-2 border-[#0AAFD0]/30 hover:border-[#0AAFD0] hover:bg-[#0AAFD0]/5 transition-all duration-300 group" 
                onMouseEnter={() => setHovering(true)} 
                onMouseLeave={() => setHovering(false)}
              >
              <span className="flex items-center gap-2">
                Get Early Access
                <span className="group-hover:translate-x-1 transition-transform duration-200">→</span>
              </span>
            </Button>
          </a>
        </div>
      </div>
    </div>
  )
}
