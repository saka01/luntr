"use client"
import { useState, useEffect } from "react"
import { Logo } from "./logo"

export const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isFreeToolsOpen, setIsFreeToolsOpen] = useState(false)
  const [freeToolsTimeout, setFreeToolsTimeout] = useState<NodeJS.Timeout | null>(null)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 100)
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (freeToolsTimeout) {
        clearTimeout(freeToolsTimeout)
      }
    }
  }, [freeToolsTimeout])

  const handleMobileNavClick = (elementId: string) => {
    setIsMobileMenuOpen(false)
    setTimeout(() => {
      const element = document.getElementById(elementId)
      if (element) {
        const headerOffset = 120 // Account for sticky header height + margin
        const elementPosition = element.getBoundingClientRect().top + window.pageYOffset
        const offsetPosition = elementPosition - headerOffset

        window.scrollTo({
          top: offsetPosition,
          behavior: "smooth",
        })
      }
    }, 100)
  }

  const handleFreeToolsMouseEnter = () => {
    if (freeToolsTimeout) {
      clearTimeout(freeToolsTimeout)
      setFreeToolsTimeout(null)
    }
    setIsFreeToolsOpen(true)
  }

  const handleFreeToolsMouseLeave = () => {
    const timeout = setTimeout(() => {
      setIsFreeToolsOpen(false)
    }, 150) // 150ms delay before closing
    setFreeToolsTimeout(timeout)
  }

  return (
    <>
      {/* Desktop Header */}
      <header
        className={`sticky top-4 z-[9999] mx-auto hidden w-full flex-row items-center justify-between self-start rounded-full bg-background/80 md:flex backdrop-blur-sm border border-border/50 shadow-lg transition-all duration-300 ${
          isScrolled ? "max-w-3xl px-2" : "max-w-5xl px-4"
        } py-2`}
        style={{
          willChange: "transform",
          transform: "translateZ(0)",
          backfaceVisibility: "hidden",
          perspective: "1000px",
        }}
      >
        <a
          className={`z-50 flex items-center justify-center gap-2 transition-all duration-300 w-32 ${
            isScrolled ? "ml-4" : ""
          }`}
          href="/"
        >
          <Logo className="text-foreground" />
        </a>

        <div className="absolute inset-0 hidden flex-1 flex-row items-center justify-center space-x-2 text-sm font-medium text-muted-foreground transition duration-200 hover:text-foreground md:flex md:space-x-2">
          <a
            className="relative px-4 py-2 text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
            onClick={(e) => {
              e.preventDefault()
              const element = document.getElementById("features")
              if (element) {
                const headerOffset = 120 // Account for sticky header height + margin
                const elementPosition = element.getBoundingClientRect().top + window.pageYOffset
                const offsetPosition = elementPosition - headerOffset

                window.scrollTo({
                  top: offsetPosition,
                  behavior: "smooth",
                })
              }
            }}
          >
            <span className="relative z-20">Features</span>
          </a>
          
          {/* Free Tools Dropdown */}
          <div className="relative">
            <button
              className="relative px-4 py-2 text-muted-foreground hover:text-foreground transition-colors cursor-pointer flex items-center gap-1"
              onMouseEnter={handleFreeToolsMouseEnter}
              onMouseLeave={handleFreeToolsMouseLeave}
            >
              <span className="relative z-20">Free Tools</span>
              <svg
                className={`w-3 h-3 transition-transform duration-200 ${isFreeToolsOpen ? 'rotate-180' : ''}`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            
            {isFreeToolsOpen && (
              <div
                className="absolute top-full left-0 mt-4 w-80 bg-background/95 backdrop-blur-md border border-border/50 rounded-xl shadow-2xl p-4 z-50"
                onMouseEnter={handleFreeToolsMouseEnter}
                onMouseLeave={handleFreeToolsMouseLeave}
              >
                <div className="space-y-4">
                  {/* Tax Calculator */}
                  <div className="group">
                    <a
                      href="/canada-income-tax-calculator"
                      className="flex items-center gap-3 p-3 rounded-lg hover:bg-secondary/10 transition-colors cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary/60"
                      style={{ cursor: "pointer" }}
                      tabIndex={0}
                    >
                      <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center group-hover:ring-2 group-hover:ring-blue-400 group-focus:ring-2 group-focus:ring-blue-400 transition">
                        <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                        </svg>
                      </div>
                      <div>
                        <h3 className="font-semibold text-foreground group-hover:text-primary group-focus:text-primary transition-colors">Tax Calculator</h3>
                        <p className="text-sm text-muted-foreground">Calculate your income tax</p>
                      </div>
                    </a>
                  </div>
                  
                  {/* T2125 Calculator */}
                  <div className="group">
                    <a
                      href="/canada-t2125-tax-calculator"
                      className="flex items-center gap-3 p-3 rounded-lg hover:bg-primary/10 transition-colors cursor-pointer focus:outline-none"
                      style={{ cursor: "pointer" }}
                      tabIndex={0}
                    >
                      <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-green-500 to-teal-600 flex items-center justify-center group-hover:ring-2 group-hover:ring-green-400 group-focus:ring-2 group-focus:ring-green-400 transition">
                        <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                      </div>
                      <div>
                        <h3 className="font-semibold text-foreground group-hover:text-green-500 group-focus:text-green-500 transition-colors">T2125 Calculator</h3>
                        <p className="text-sm text-muted-foreground">Self-employment tax form</p>
                      </div>
                    </a>
                  </div>
                  
                  {/* Deduction Finder */}
                  <div className="group">
                    <a
                      href="/deduction-finder"
                      className="flex items-center gap-3 p-3 rounded-lg hover:bg-primary/10 transition-colors cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary/60"
                      style={{ cursor: "pointer" }}
                      tabIndex={0}
                    >
                      <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-orange-500 to-red-600 flex items-center justify-center group-hover:ring-2 group-hover:ring-orange-400 group-focus:ring-2 group-focus:ring-orange-400 transition">
                        <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                      </div>
                      <div>
                        <h3 className="font-semibold text-foreground group-hover:text-orange-500 group-focus:text-orange-500 transition-colors">Deduction Finder</h3>
                        <p className="text-sm text-muted-foreground">Find tax deductions</p>
                      </div>
                    </a>
                  </div>
                </div>
              </div>
            )}
          </div>
          
          <a
            className="relative px-4 py-2 text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
            onClick={(e) => {
              e.preventDefault()
              const element = document.getElementById("pricing")
              if (element) {
                const headerOffset = 120 // Account for sticky header height + margin
                const elementPosition = element.getBoundingClientRect().top + window.pageYOffset
                const offsetPosition = elementPosition - headerOffset

                window.scrollTo({
                  top: offsetPosition,
                  behavior: "smooth",
                })
              }
            }}
          >
            <span className="relative z-20">Pricing</span>
          </a>
          <a
            className="relative px-4 py-2 text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
            onClick={(e) => {
              e.preventDefault()
              const element = document.getElementById("testimonials")
              if (element) {
                const headerOffset = 120 // Account for sticky header height + margin
                const elementPosition = element.getBoundingClientRect().top + window.pageYOffset
                const offsetPosition = elementPosition - headerOffset

                window.scrollTo({
                  top: offsetPosition,
                  behavior: "smooth",
                })
              }
            }}
          >
            <span className="relative z-20">Testimonials</span>
          </a>
          <a
            className="relative px-4 py-2 text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
            onClick={(e) => {
              e.preventDefault()
              const element = document.getElementById("faq")
              if (element) {
                const headerOffset = 120 // Account for sticky header height + margin
                const elementPosition = element.getBoundingClientRect().top + window.pageYOffset
                const offsetPosition = elementPosition - headerOffset

                window.scrollTo({
                  top: offsetPosition,
                  behavior: "smooth",
                })
              }
            }}
          >
            <span className="relative z-20">FAQ</span>
          </a>
        </div>

        {/* <div className="flex items-center gap-4">
          <a
            href="/login"
            className="font-medium transition-colors hover:text-foreground text-muted-foreground text-sm cursor-pointer"
          >
            Log In
          </a>

          <a
            href="/signup"
            className="rounded-md font-bold relative cursor-pointer hover:-translate-y-0.5 transition duration-200 inline-block text-center bg-gradient-to-b from-primary to-primary/80 text-primary-foreground shadow-[0px_2px_0px_0px_rgba(255,255,255,0.3)_inset] px-4 py-2 text-sm"
          >
            Sign Up
          </a>
        </div> */}
      </header>

      {/* Mobile Header */}
      <header className="sticky top-4 z-[9999] mx-4 flex w-auto flex-row items-center justify-between rounded-full bg-background/80 backdrop-blur-sm border border-border/50 shadow-lg md:hidden px-4 py-3">
        <a
          className="flex items-center justify-center gap-2 w-24"
          href="/"
        >
          <Logo className="text-foreground" />
        </a>

        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="flex items-center justify-center w-10 h-10 rounded-full bg-background/50 border border-border/50 transition-colors hover:bg-background/80"
          aria-label="Toggle menu"
        >
          <div className="flex flex-col items-center justify-center w-5 h-5 space-y-1">
            <span
              className={`block w-4 h-0.5 bg-foreground transition-all duration-300 ${isMobileMenuOpen ? "rotate-45 translate-y-1.5" : ""}`}
            ></span>
            <span
              className={`block w-4 h-0.5 bg-foreground transition-all duration-300 ${isMobileMenuOpen ? "opacity-0" : ""}`}
            ></span>
            <span
              className={`block w-4 h-0.5 bg-foreground transition-all duration-300 ${isMobileMenuOpen ? "-rotate-45 -translate-y-1.5" : ""}`}
            ></span>
          </div>
        </button>
      </header>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-[9998] bg-black/50 backdrop-blur-sm md:hidden">
          <div className="absolute top-20 left-4 right-4 bg-background/95 backdrop-blur-md border border-border/50 rounded-2xl shadow-2xl p-6">
            <nav className="flex flex-col space-y-4">
              <button
                onClick={() => handleMobileNavClick("features")}
                className="text-left px-4 py-3 text-lg font-medium text-muted-foreground hover:text-foreground transition-colors rounded-lg hover:bg-background/50"
              >
                Features
              </button>
              
              {/* Free Tools Mobile Dropdown */}
              <div className="space-y-2">
                <div className="px-4 py-2 text-lg font-medium text-muted-foreground">
                  Free Tools
                </div>
                <div className="ml-4 space-y-2">
                  <a
                    href="/canada-income-tax-calculator"
                    className="flex items-center gap-3 px-4 py-3 text-base text-muted-foreground hover:text-foreground transition-colors rounded-lg hover:bg-background/50"
                  >
                    <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                      <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <div>
                      <div className="font-medium">Tax Calculator</div>
                      <div className="text-sm text-muted-foreground/70">Calculate your income tax</div>
                    </div>
                  </a>
                  
                  <a
                    href="/canada-t2125-tax-calculator"
                    className="flex items-center gap-3 px-4 py-3 text-base text-muted-foreground hover:text-foreground transition-colors rounded-lg hover:bg-background/50"
                  >
                    <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-green-500 to-teal-600 flex items-center justify-center">
                      <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                    </div>
                    <div>
                      <div className="font-medium">T2125 Calculator</div>
                      <div className="text-sm text-muted-foreground/70">Self-employment tax form</div>
                    </div>
                  </a>
                  
                  <a
                    href="/deduction-finder"
                    className="flex items-center gap-3 px-4 py-3 text-base text-muted-foreground hover:text-foreground transition-colors rounded-lg hover:bg-background/50"
                  >
                    <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-orange-500 to-red-600 flex items-center justify-center">
                      <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                      </svg>
                    </div>
                    <div>
                      <div className="font-medium">Deduction Finder</div>
                      <div className="text-sm text-muted-foreground/70">Find tax deductions</div>
                    </div>
                  </a>
                </div>
              </div>
              
              <button
                onClick={() => handleMobileNavClick("pricing")}
                className="text-left px-4 py-3 text-lg font-medium text-muted-foreground hover:text-foreground transition-colors rounded-lg hover:bg-background/50"
              >
                Pricing
              </button>
              <button
                onClick={() => handleMobileNavClick("testimonials")}
                className="text-left px-4 py-3 text-lg font-medium text-muted-foreground hover:text-foreground transition-colors rounded-lg hover:bg-background/50"
              >
                Testimonials
              </button>
              <button
                onClick={() => handleMobileNavClick("faq")}
                className="text-left px-4 py-3 text-lg font-medium text-muted-foreground hover:text-foreground transition-colors rounded-lg hover:bg-background/50"
              >
                FAQ
              </button>
              {/* <div className="border-t border-border/50 pt-4 mt-4 flex flex-col space-y-3">
                <a
                  href="/login"
                  className="px-4 py-3 text-lg font-bold text-center bg-gradient-to-b from-primary to-primary/80 text-primary-foreground rounded-lg shadow-lg hover:-translate-y-0.5 transition-all duration-200"
                >
                  Log In
                </a>
                <a
                  href="/signup"
                  className="px-4 py-3 text-lg font-bold text-center bg-gradient-to-b from-primary to-primary/80 text-primary-foreground rounded-lg shadow-lg hover:-translate-y-0.5 transition-all duration-200"
                >
                  Sign Up
                </a>
              </div> */}
            </nav>
          </div>
        </div>
      )}
    </>
  )
}
