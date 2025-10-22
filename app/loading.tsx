"use client"

import { Logo } from "@/components/logo"
import { motion } from "framer-motion"

export default function Loading() {
  return (
    <div className="h-screen bg-gradient-to-br from-background via-background to-muted/20 flex items-center justify-center">
      <div className="text-center">
        {/* Animated logo */}
        <motion.div
          className="inline-block mb-6"
          animate={{ 
            rotate: [0, 360],
            scale: [1, 1.1, 1]
          }}
          transition={{ 
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        >
         <Logo className="text-primary w-24 h-24" />
        </motion.div>

        {/* Loading text */}
        <motion.h2
          className="text-xl font-semibold text-foreground mb-4"
          animate={{ opacity: [0.7, 1, 0.7] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          Tallo
        </motion.h2>

        {/* Loading dots */}
        <div className="flex justify-center space-x-2">
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              className="w-2 h-2 bg-primary rounded-full"
              animate={{
                scale: [1, 1.5, 1],
                opacity: [0.5, 1, 0.5]
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                delay: i * 0.2
              }}
            />
          ))}
        </div>
      </div>
    </div>
  )
}
