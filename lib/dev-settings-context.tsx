"use client"

import { createContext, useContext, useState, useEffect, ReactNode } from "react"

interface DevSettings {
  enabled: boolean
  cardTypeFilter: 'all' | 'plan' | 'fitb' | 'mcq' | 'order' | 'insight'
  patternFilter: string
  difficultyFilter: 'all' | 'E' | 'M' | 'H'
  sessionSize: number
  showCardDebugInfo: boolean
  autoAdvance: boolean
  skipTimers: boolean
}

const defaultSettings: DevSettings = {
  enabled: false,
  cardTypeFilter: 'all',
  patternFilter: 'two-pointers',
  difficultyFilter: 'all',
  sessionSize: 10,
  showCardDebugInfo: false,
  autoAdvance: false,
  skipTimers: false
}

interface DevSettingsContextType {
  settings: DevSettings
  updateSettings: (settings: DevSettings) => void
}

const DevSettingsContext = createContext<DevSettingsContextType | undefined>(undefined)

export function DevSettingsProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<DevSettings>(defaultSettings)

  useEffect(() => {
    // Load settings from localStorage
    const savedSettings = localStorage.getItem('dev-settings')
    if (savedSettings) {
      try {
        const parsed = JSON.parse(savedSettings)
        setSettings({ ...defaultSettings, ...parsed })
      } catch (error) {
        console.error('Failed to parse saved dev settings:', error)
      }
    }
  }, [])

  const updateSettings = (newSettings: DevSettings) => {
    setSettings(newSettings)
    localStorage.setItem('dev-settings', JSON.stringify(newSettings))
  }

  return (
    <DevSettingsContext.Provider value={{ settings, updateSettings }}>
      {children}
    </DevSettingsContext.Provider>
  )
}

export function useDevSettings() {
  const context = useContext(DevSettingsContext)
  if (context === undefined) {
    throw new Error('useDevSettings must be used within a DevSettingsProvider')
  }
  return context
}
