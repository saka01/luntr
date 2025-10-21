// Admin utility for managing pattern availability
// This makes it easy to toggle patterns on/off without touching code

export interface PatternToggle {
  id: string
  name: string
  isActive: boolean
  unlockRequirement: 'coming-soon' | 'none'
}

// Easy pattern management - just change the status here
export const PATTERN_TOGGLES: Record<string, PatternToggle> = {
  'two-pointers': {
    id: 'two-pointers',
    name: 'Two Pointers',
    isActive: true, // ✅ Currently active
    unlockRequirement: 'none'
  },
  'sliding-window': {
    id: 'sliding-window',
    name: 'Sliding Window',
    isActive: false, // 🔒 Coming Soon
    unlockRequirement: 'coming-soon'
  },
  'binary-search': {
    id: 'binary-search',
    name: 'Binary Search',
    isActive: false, // 🔒 Coming Soon
    unlockRequirement: 'coming-soon'
  },
  'hashing': {
    id: 'hashing',
    name: 'Hashing',
    isActive: false, // 🔒 Coming Soon
    unlockRequirement: 'coming-soon'
  },
  'dynamic-programming': {
    id: 'dynamic-programming',
    name: 'Dynamic Programming',
    isActive: false, // 🔒 Coming Soon
    unlockRequirement: 'coming-soon'
  },
  'backtracking': {
    id: 'backtracking',
    name: 'Backtracking',
    isActive: false, // 🔒 Coming Soon
    unlockRequirement: 'coming-soon'
  },
  'greedy': {
    id: 'greedy',
    name: 'Greedy',
    isActive: false, // 🔒 Coming Soon
    unlockRequirement: 'coming-soon'
  },
  'tree-traversal': {
    id: 'tree-traversal',
    name: 'Tree Traversal',
    isActive: false, // 🔒 Coming Soon
    unlockRequirement: 'coming-soon'
  },
  'graph-algorithms': {
    id: 'graph-algorithms',
    name: 'Graph Algorithms',
    isActive: false, // 🔒 Coming Soon
    unlockRequirement: 'coming-soon'
  },
  'union-find': {
    id: 'union-find',
    name: 'Union Find',
    isActive: false, // 🔒 Coming Soon
    unlockRequirement: 'coming-soon'
  }
}

// Helper functions for easy pattern management
export function getActivePatterns(): PatternToggle[] {
  return Object.values(PATTERN_TOGGLES).filter(pattern => pattern.isActive)
}

export function getLockedPatterns(): PatternToggle[] {
  return Object.values(PATTERN_TOGGLES).filter(pattern => !pattern.isActive)
}

export function togglePattern(patternId: string, isActive: boolean): void {
  if (PATTERN_TOGGLES[patternId]) {
    PATTERN_TOGGLES[patternId].isActive = isActive
  }
}

// Quick pattern activation helpers
export function activatePattern(patternId: string): void {
  togglePattern(patternId, true)
}

export function deactivatePattern(patternId: string): void {
  togglePattern(patternId, false)
}

// Example usage:
// activatePattern('sliding-window') // Makes Sliding Window available
// deactivatePattern('two-pointers') // Locks Two Pointers
