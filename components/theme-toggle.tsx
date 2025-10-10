"use client"

import * as React from "react"
import { Moon, Sun, Monitor } from "lucide-react"
import { useTheme } from "next-themes"

export function ThemeToggle() {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = React.useState(false)

  React.useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <div className="flex items-center justify-center w-10 h-10 rounded-full bg-red-500 border border-gray-300">
        <Sun className="h-4 w-4 text-white" />
      </div>
    )
  }

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    console.log("Theme toggle clicked! Current theme:", theme)
    
    if (theme === "light") {
      console.log("Switching to dark")
      setTheme("dark")
    } else if (theme === "dark") {
      console.log("Switching to system")
      setTheme("system")
    } else {
      console.log("Switching to light")
      setTheme("light")
    }
  }

  const getIcon = () => {
    switch (theme) {
      case "light":
        return <Sun className="h-4 w-4 text-yellow-600" />
      case "dark":
        return <Moon className="h-4 w-4 text-blue-400" />
      case "system":
        return <Monitor className="h-4 w-4 text-gray-600" />
      default:
        return <Sun className="h-4 w-4 text-yellow-600" />
    }
  }

  return (
    <button
      onClick={handleClick}
      onMouseDown={(e) => e.preventDefault()}
      className="flex items-center justify-center w-10 h-10 rounded-full bg-white border-2 border-gray-300 hover:border-blue-500 hover:bg-blue-50 transition-all duration-200 cursor-pointer shadow-md hover:shadow-lg"
      aria-label={`Current theme: ${theme}. Click to cycle themes.`}
      title={`Current theme: ${theme}. Click to cycle themes.`}
      type="button"
    >
      {getIcon()}
    </button>
  )
}