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

      <div className="pb-1 mt-auto text-center relative">
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

        {/* Additional AcMem-style content */}
        <div  onMouseEnter={() => setHovering(true)} onMouseLeave={() => setHovering(false)} className="max-w-4xl mx-auto bg-card/80 backdrop-blur-sm rounded-2xl p-8 md:p-12 border border-border/50 mt-12">
          
          <p className="text-base text-muted-foreground mb-6 max-w-2xl mx-auto">
            Every year, Canadian creators miss out on thousands in write-offs because nobody taught them what's deductible. We do the heavy lifting: connect your accounts, and we'll surface it for you.
          </p>

          {/* Deductible Expenses Section */}
          <div className="text-left max-w-2xl mx-auto mb-6 space-y-3">
            <div className="flex items-start gap-3">
              <span className="text-xl">🎥</span>
              <div>
                <span className="font-medium text-sm">(NEW & USED) Cameras, mics, and studio gear</span>
                <span className="text-muted-foreground text-sm"> → Capital Cost Allowance (CCA Class 8)</span>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <span className="text-xl">💻</span>
              <div>
                <span className="font-medium text-sm">Laptops, editing software, and subscriptions</span>
                <span className="text-muted-foreground text-sm"> → CCA Class 50 (computers), Line 9270 (Other expenses)</span>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <span className="text-xl">📱</span>
              <div>
                <span className="font-medium text-sm">Phone & internet bills</span>
                <span className="text-muted-foreground text-sm"> → Line 9225 (Telephone & utilities)</span>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <span className="text-xl">🚗</span>
              <div>
                <span className="font-medium text-sm">Rides, travel, and work trips</span>
                <span className="text-muted-foreground text-sm"> → Line 9200 (Travel expenses)</span>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <span className="text-xl">🍜</span>
              <div>
                <span className="font-medium text-sm">Client dinners & coffee meetings</span>
                <span className="text-muted-foreground text-sm"> → Line 8523 (Meals & entertainment — 50% deductible)</span>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <span className="text-xl">🔔</span>
              <div>
                <span className="font-medium text-sm">Ad spend on Meta, TikTok, Google, YouTube</span>
                <span className="text-muted-foreground text-sm"> → Line 8521 (Advertising & promotion)</span>
              </div>
            </div>
          </div>

          {/* ROI Section */}
          <div className="mb-6">
            <p className="font-bold text-base mb-2">
              ROI is simple: spend a few minutes connecting your accounts → save hundreds or thousands at tax time.
            </p>
            <p className="text-xs italic text-muted-foreground">
              And yes, this tool is tax deductible too → Line 9273 Professional fees (legal and accounting)
            </p>
          </div>

          {/* CTA Section */}
          <div className="mb-4">
            <p className="font-bold text-base mb-3">Drop your work email and lock in early access.</p>
            <div className="flex gap-3 max-w-md mx-auto">
              <input 
                type="email" 
                placeholder="Your work email" 
                className="flex-1 px-3 py-2 rounded-lg border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 text-sm"
              />
              <Button 
                className="px-4 py-2 text-sm"
                onMouseEnter={() => setHovering(true)} 
                onMouseLeave={() => setHovering(false)}
              >
                Join waitlist
              </Button>
            </div>
          </div>

          {/* Footer */}
          <div className="flex justify-between items-center text-xs text-muted-foreground bg-card/80 backdrop-blur-sm rounded-2xl p-8 md:p-12 border border-border/50 mt-12">
            <span>Built in Canada 🇨🇦 | Backed by Real CPAs</span>
          </div>
        </div>

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
