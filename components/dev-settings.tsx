"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Switch } from "@/components/ui/switch"
import { Separator } from "@/components/ui/separator"
import { Settings, Code, TestTube, Eye, EyeOff } from "lucide-react"
import { useDevSettings } from "@/lib/dev-settings-context"

const defaultSettings = {
  enabled: false,
  cardTypeFilter: 'all' as const,
  patternFilter: 'two-pointers',
  difficultyFilter: 'all' as const,
  sessionSize: 10,
  showCardDebugInfo: false,
  autoAdvance: false,
  skipTimers: false
}

interface DevSettingsProps {
  onSettingsChange?: (settings: any) => void
  initialSettings?: any
}

export function DevSettings({ onSettingsChange, initialSettings }: DevSettingsProps) {
  const { settings, updateSettings } = useDevSettings()
  const [isOpen, setIsOpen] = useState(false)

  // Hide dev settings in production
  if (process.env.NODE_ENV === 'production') {
    return null
  }

  const updateSetting = <K extends keyof typeof settings>(key: K, value: typeof settings[K]) => {
    const newSettings = { ...settings, [key]: value }
    updateSettings(newSettings)
    if (onSettingsChange) {
      onSettingsChange(newSettings)
    }
  }

  const resetSettings = () => {
    updateSettings(defaultSettings)
    if (onSettingsChange) {
      onSettingsChange(defaultSettings)
    }
  }

  const cardTypes = [
    { value: 'all', label: 'All Types', description: 'Show all card types' },
    { value: 'plan', label: 'Plan Cards', description: 'Planning and approach questions' },
    { value: 'fitb', label: 'Fill-in-the-Blank', description: 'Complete missing parts' },
    { value: 'mcq', label: 'Multiple Choice', description: 'Pattern identification' },
    { value: 'order', label: 'Order Cards', description: 'Sequence and ordering' },
    { value: 'insight', label: 'Insight Cards', description: 'Conceptual understanding' }
  ]

  const difficulties = [
    { value: 'all', label: 'All Difficulties' },
    { value: 'E', label: 'Easy' },
    { value: 'M', label: 'Medium' },
    { value: 'H', label: 'Hard' }
  ]

  if (!isOpen) {
    return (
      <div className="fixed bottom-4 right-4 z-50">
        <Button
          onClick={() => setIsOpen(true)}
          variant="outline"
          size="sm"
          className="bg-card/80 backdrop-blur-sm border-border hover:bg-card/90 shadow-lg"
        >
          <Settings className="w-4 h-4 mr-2" />
          Dev Settings
          {settings.enabled && (
            <Badge variant="secondary" className="ml-2 text-xs">
              ON
            </Badge>
          )}
        </Button>
      </div>
    )
  }

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-card/95 backdrop-blur-xl border-border">
        <CardHeader className="flex flex-row items-center justify-between">
          <div className="flex items-center gap-2">
            <Code className="w-5 h-5 text-primary" />
            <CardTitle className="text-xl">Development Settings</CardTitle>
          </div>
          <Button
            onClick={() => setIsOpen(false)}
            variant="ghost"
            size="sm"
          >
            <EyeOff className="w-4 h-4" />
          </Button>
        </CardHeader>
        
        <CardContent className="space-y-6">
          {/* Enable/Disable Dev Mode */}
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="dev-enabled" className="text-base font-medium">
                Enable Development Mode
              </Label>
              <p className="text-sm text-muted-foreground">
                Activate development features and card filtering
              </p>
            </div>
            <Switch
              id="dev-enabled"
              checked={settings.enabled}
              onCheckedChange={(checked: boolean) => updateSetting('enabled', checked)}
            />
          </div>

          <Separator />

          {/* Card Type Filter */}
          <div className="space-y-3">
            <Label className="text-base font-medium">Card Type Filter</Label>
            <p className="text-sm text-muted-foreground">
              Choose which types of cards to show during development
            </p>
            <RadioGroup
              value={settings.cardTypeFilter}
              onValueChange={(value) => updateSetting('cardTypeFilter', value as typeof settings.cardTypeFilter)}
              className="space-y-2"
            >
              {cardTypes.map((type) => (
                <div key={type.value} className="flex items-center space-x-2">
                  <RadioGroupItem value={type.value} id={type.value} />
                  <Label htmlFor={type.value} className="flex-1 cursor-pointer">
                    <div className="flex items-center justify-between">
                      <span className="font-medium">{type.label}</span>
                      <span className="text-sm text-muted-foreground">{type.description}</span>
                    </div>
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </div>

          <Separator />

          {/* Pattern Filter */}
          <div className="space-y-3">
            <Label htmlFor="pattern-filter" className="text-base font-medium">
              Pattern Filter
            </Label>
            <p className="text-sm text-muted-foreground">
              Focus on a specific algorithm pattern
            </p>
            <Input
              id="pattern-filter"
              value={settings.patternFilter}
              onChange={(e) => updateSetting('patternFilter', e.target.value)}
              placeholder="e.g., two-pointers, sliding-window"
              className="w-full"
            />
          </div>

          {/* Difficulty Filter */}
          <div className="space-y-3">
            <Label className="text-base font-medium">Difficulty Filter</Label>
            <p className="text-sm text-muted-foreground">
              Filter cards by difficulty level
            </p>
            <RadioGroup
              value={settings.difficultyFilter}
              onValueChange={(value) => updateSetting('difficultyFilter', value as typeof settings.difficultyFilter)}
              className="flex flex-row gap-4"
            >
              {difficulties.map((diff) => (
                <div key={diff.value} className="flex items-center space-x-2">
                  <RadioGroupItem value={diff.value} id={`diff-${diff.value}`} />
                  <Label htmlFor={`diff-${diff.value}`} className="cursor-pointer">
                    {diff.label}
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </div>

          <Separator />

          {/* Session Settings */}
          <div className="space-y-4">
            <Label className="text-base font-medium">Session Settings</Label>
            
            <div className="space-y-3">
              <Label htmlFor="session-size" className="text-sm font-medium">
                Session Size
              </Label>
              <Input
                id="session-size"
                type="number"
                min="1"
                max="50"
                value={settings.sessionSize}
                onChange={(e) => updateSetting('sessionSize', parseInt(e.target.value) || 10)}
                className="w-24"
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="debug-info" className="text-sm font-medium">
                  Show Card Debug Info
                </Label>
                <p className="text-xs text-muted-foreground">
                  Display card metadata and debug information
                </p>
              </div>
              <Switch
                id="debug-info"
                checked={settings.showCardDebugInfo}
                onCheckedChange={(checked: boolean) => updateSetting('showCardDebugInfo', checked)}
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="auto-advance" className="text-sm font-medium">
                  Auto Advance Cards
                </Label>
                <p className="text-xs text-muted-foreground">
                  Automatically move to next card after submission
                </p>
              </div>
              <Switch
                id="auto-advance"
                checked={settings.autoAdvance}
                onCheckedChange={(checked: boolean) => updateSetting('autoAdvance', checked)}
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="skip-timers" className="text-sm font-medium">
                  Skip Timers
                </Label>
                <p className="text-xs text-muted-foreground">
                  Disable countdown timers for faster testing
                </p>
              </div>
              <Switch
                id="skip-timers"
                checked={settings.skipTimers}
                onCheckedChange={(checked: boolean) => updateSetting('skipTimers', checked)}
              />
            </div>
          </div>

          <Separator />

          {/* Actions */}
          <div className="flex justify-between">
            <Button
              onClick={resetSettings}
              variant="outline"
              size="sm"
            >
              Reset to Defaults
            </Button>
            <Button
              onClick={() => setIsOpen(false)}
              className="bg-primary hover:bg-primary/90"
            >
              <Eye className="w-4 h-4 mr-2" />
              Close Settings
            </Button>
          </div>

          {/* Current Settings Summary */}
          {settings.enabled && (
            <div className="mt-4 p-3 bg-primary/5 border border-primary/20 rounded-lg">
              <h4 className="font-medium text-primary mb-2">Active Filters:</h4>
              <div className="text-sm space-y-1">
                <div>Card Type: <Badge variant="secondary">{settings.cardTypeFilter}</Badge></div>
                <div>Pattern: <Badge variant="secondary">{settings.patternFilter}</Badge></div>
                <div>Difficulty: <Badge variant="secondary">{settings.difficultyFilter}</Badge></div>
                <div>Session Size: <Badge variant="secondary">{settings.sessionSize}</Badge></div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
