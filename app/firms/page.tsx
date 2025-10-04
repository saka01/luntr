"use client"

import { Hero } from "@/components/hero"
import { Footer } from "@/components/footer"

export default function Home() {
  return (
    <div className="flex flex-col h-screen overflow-hidden">
      <Hero />
      <Footer />
    </div>
  )
}
