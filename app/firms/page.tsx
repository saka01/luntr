"use client"

import { Hero } from "./hero"
import { Footer } from "@/components/footer"

export default function Home() {
  return (
    <div className="flex flex-col screen-with-header overflow-hidden">
      <Hero />
      <Footer />
    </div>
  )
}
