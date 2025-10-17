"use client"

import * as React from "react"
import { Moon, Sun, Monitor } from "lucide-react"
import { useTheme } from "next-themes"

export function ThemeToggle() {
  const { theme, setTheme, resolvedTheme } = useTheme()
  const [mounted, setMounted] = React.useState(false)

  // Only render after hydration to avoid mismatch
  React.useEffect(() => {
    setMounted(true)
  }, [])

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    console.log("Theme toggle clicked! Current theme:", theme)
    
    // Toggle between light and dark only
    if (theme === "light") {
      console.log("Switching to dark")
      setTheme("dark")
    } else {
      console.log("Switching to light")
      setTheme("light")
    }
  }

  const getIcon = () => {
    const currentTheme = resolvedTheme || theme
    switch (currentTheme) {
      case "light":
        return <Sun className="h-4 w-4 text-yellow-600" />
      case "dark":
        return <Moon className="h-4 w-4 text-blue-400" />
      case "system":
        return <Monitor className="h-4 w-4 text-gray-600" />
      default:
        return <Monitor className="h-4 w-4 text-gray-600" />
    }
  }

  // Show a placeholder during SSR to prevent hydration mismatch
  if (!mounted) {
    return (
      <button
        className="flex items-center justify-center w-10 h-10 rounded-full bg-background border-2 border-border hover:border-primary hover:bg-accent transition-all duration-200 cursor-pointer shadow-md hover:shadow-lg"
        aria-label="Loading theme toggle"
        title="Loading theme toggle"
        type="button"
        disabled
      >
        <Monitor className="h-4 w-4 text-gray-600" />
      </button>
    )
  }

  return (
    <button
      onClick={handleClick}
      onMouseDown={(e) => e.preventDefault()}
      className="flex items-center justify-center w-10 h-10 rounded-full bg-background border-2 border-border hover:border-primary hover:bg-accent transition-all duration-200 cursor-pointer shadow-md hover:shadow-lg"
      aria-label={`Current theme: ${theme || 'system'}. Click to cycle themes.`}
      title={`Current theme: ${theme || 'system'}. Click to cycle themes.`}
      type="button"
    >
      {getIcon()}
    </button>
  )
}