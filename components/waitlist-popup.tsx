"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Logo } from "@/components/logo"
import { X, CheckCircle, Mail, Calendar, Users, Sparkles } from "lucide-react"

interface WaitlistPopupProps {
  isOpen: boolean
  onClose: () => void
}

export function WaitlistPopup({ isOpen, onClose }: WaitlistPopupProps) {
  const [email, setEmail] = useState("")
  const [name, setName] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [position, setPosition] = useState<number | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500))
    
    // Simulate getting position in waitlist
    const mockPosition = Math.floor(Math.random() * 50) + 1
    setPosition(mockPosition)
    setIsSubmitted(true)
    setIsSubmitting(false)
  }

  const handleClose = () => {
    setEmail("")
    setName("")
    setIsSubmitted(false)
    setPosition(null)
    onClose()
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50"
            onClick={handleClose}
          />
          
          {/* Popup */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: "spring", duration: 0.5 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
          >
            <div className="relative w-full max-w-md">
              {/* Close button */}
              <button
                onClick={handleClose}
                className="absolute -top-4 -right-4 z-10 w-8 h-8 rounded-full bg-card border border-border flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors"
              >
                <X className="w-4 h-4" />
              </button>

              {/* Main content */}
              <div className="bg-card/95 backdrop-blur-xl border border-border rounded-2xl p-8 shadow-2xl">
                {!isSubmitted ? (
                  <>
                    {/* Header */}
                    <div className="text-center mb-8">
                      <div className="flex items-center justify-center mb-4">
                        <Logo className="text-primary w-24 h-6" />
                      </div>
                      <h2 className="text-2xl font-bold text-foreground mb-2">
                        Join the Waitlist
                      </h2>
                      <p className="text-muted-foreground text-sm">
                        Be among the first to unlock missed tax deductions
                      </p>
                    </div>

                    {/* Benefits */}
                    <div className="space-y-3 mb-8">
                      <div className="flex items-center gap-3 text-sm text-muted-foreground">
                        <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center">
                          <CheckCircle className="w-3 h-3 text-primary" />
                        </div>
                        <span>Early access to Tallo</span>
                      </div>
                      <div className="flex items-center gap-3 text-sm text-muted-foreground">
                        <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center">
                          <CheckCircle className="w-3 h-3 text-primary" />
                        </div>
                        <span>Exclusive pricing for early adopters</span>
                      </div>
                      <div className="flex items-center gap-3 text-sm text-muted-foreground">
                        <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center">
                          <CheckCircle className="w-3 h-3 text-primary" />
                        </div>
                        <span>50% OFF - 2027 Full Service tax filings</span>
                      </div>
                    </div>

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="name" className="text-foreground text-sm">
                          Full Name
                        </Label>
                        <Input
                          id="name"
                          type="text"
                          placeholder="Enter your full name"
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          className="bg-input/50 border-border text-foreground placeholder:text-muted-foreground focus:border-primary focus:ring-primary/20"
                          required
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="email" className="text-foreground text-sm">
                          Email Address
                        </Label>
                        <Input
                          id="email"
                          type="email"
                          placeholder="Enter your email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          className="bg-input/50 border-border text-foreground placeholder:text-muted-foreground focus:border-primary focus:ring-primary/20"
                          required
                        />
                      </div>

                      <Button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-medium py-3 rounded-xl transition-colors"
                      >
                        {isSubmitting ? (
                          <div className="flex items-center gap-2">
                            <div className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                            Joining Waitlist...
                          </div>
                        ) : (
                          <div className="flex items-center gap-2">
                            <Sparkles className="w-4 h-4" />
                            Join Waitlist
                          </div>
                        )}
                      </Button>
                    </form>

                    {/* Social proof */}
                    <div className="mt-6 text-center">
                      <div className="flex items-center justify-center gap-4 text-xs text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Users className="w-3 h-3" />
                          <span>Join 211+ early adopters</span>
                        </div>
                        {/* <div className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          <span>Launching Q2 2025</span>
                        </div> */}
                      </div>
                    </div>
                  </>
                ) : (
                  /* Success state */
                  <div className="text-center">
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: "spring", duration: 0.5 }}
                      className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-6"
                    >
                      <CheckCircle className="w-8 h-8 text-primary" />
                    </motion.div>
                    
                    <h3 className="text-xl font-bold text-foreground mb-2">
                      You're on the list! 🎉
                    </h3>
                    <p className="text-muted-foreground text-sm mb-4">
                      Thanks for joining our waitlist. We'll notify you as soon as Tallo is ready.
                    </p>
                    
                    {position && (
                      <div className="bg-primary/10 border border-primary/20 rounded-lg p-4 mb-6">
                        <div className="flex items-center justify-center gap-2 text-primary font-medium">
                          <Mail className="w-4 h-4" />
                          <span>You're #{position} on the waitlist</span>
                        </div>
                      </div>
                    )}

                    <div className="space-y-3 text-sm text-muted-foreground">
                      <p>What happens next?</p>
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 bg-primary rounded-full" />
                          <span>We'll email you with early access details</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 bg-primary rounded-full" />
                          <span>Get exclusive pricing and features</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 bg-primary rounded-full" />
                          <span>Direct line to our CPA team</span>
                        </div>
                      </div>
                    </div>

                    <Button
                      onClick={handleClose}
                      className="w-full mt-6 bg-primary hover:bg-primary/90 text-primary-foreground font-medium py-3 rounded-xl transition-colors"
                    >
                      Close
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
