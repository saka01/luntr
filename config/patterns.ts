// Pattern configuration system
export interface PatternConfig {
  id: string
  name: string
  description: string
  difficulty: string
  examples: string[]
  status: 'active' | 'locked' | 'coming-soon'
  unlockRequirement?: 'coming-soon' | 'none'
}

// Import the toggle system
import { PATTERN_TOGGLES } from './pattern-toggles'

// Generate pattern configs dynamically from toggle system
export const PATTERN_CONFIGS: Record<string, PatternConfig> = Object.fromEntries(
  Object.entries(PATTERN_TOGGLES).map(([id, toggle]) => [
    id,
    {
      id,
      name: toggle.name,
      description: getPatternDescription(id),
      difficulty: getPatternDifficulty(id),
      examples: getPatternExamples(id),
      status: toggle.isActive ? 'active' : 'coming-soon',
      unlockRequirement: toggle.unlockRequirement
    }
  ])
)

// Pattern metadata
function getPatternDescription(id: string): string {
  const descriptions: Record<string, string> = {
    'two-pointers': "Train your eyes to move together. Learn to scan from both ends and meet in the middle with precision.",
    'sliding-window': 'Sharpen your instinct for moving ranges and shifting patterns. Every rep builds clarity and control.',
    'binary-search': 'Cut problems in half until the answer appears. Precision beats panic when you think in steps.',
    'hashing': 'Think in maps. Build quick recall for lookups, counts, and patterns that make your code faster.',
    'dynamic-programming': 'Teach your brain to remember what it already solved. Stack logic, save effort, and see patterns form naturally.',
    'backtracking': 'Practice exploring and retracting with focus. Each branch trains your patience and pattern awareness.',
    'greedy': 'Trust your logic. Learn how small, smart choices create momentum toward the best outcome.',
    'tree-traversal': 'Find calm in structure. Move through layers of data with rhythm and purpose until the pattern feels natural.',
    'graph-algorithms': 'Understand how things connect. Build intuition for paths, cycles, and relationships across networks.',
    'union-find': 'Stay organized under pressure. Track sets, merge efficiently, and build clarity around relationships.'
  }  
  return descriptions[id] || 'Advanced algorithmic pattern'
}

function getPatternDifficulty(id: string): string {
  const difficulties: Record<string, string> = {
    'two-pointers': 'Easy to Medium',
    'sliding-window': 'Easy to Medium',
    'binary-search': 'Medium to Hard',
    'hashing': 'Easy to Medium',
    'dynamic-programming': 'Medium to Hard',
    'backtracking': 'Medium to Hard',
    'greedy': 'Easy to Medium',
    'tree-traversal': 'Easy to Medium',
    'graph-algorithms': 'Medium to Hard',
    'union-find': 'Medium to Hard'
  }
  return difficulties[id] || 'Medium'
}

function getPatternExamples(id: string): string[] {
  const examples: Record<string, string[]> = {
    'two-pointers': ['Valid Palindrome', 'Container With Most Water'],
    'sliding-window': ['Maximum Sum Subarray', 'Longest Substring Without Repeating Characters'],
    'binary-search': ['Search in Rotated Array', 'Find Peak Element'],
    'hashing': ['Two Sum', 'Group Anagrams'],
    'dynamic-programming': ['Climbing Stairs', 'Longest Common Subsequence'],
    'backtracking': ['N-Queens', 'Generate Parentheses'],
    'greedy': ['Activity Selection', 'Fractional Knapsack'],
    'tree-traversal': ['Binary Tree Inorder', 'Level Order Traversal'],
    'graph-algorithms': ['Course Schedule', 'Word Ladder'],
    'union-find': ['Redundant Connection', 'Number of Islands']
  }
  return examples[id] || ['Example Problem 1', 'Example Problem 2']
}

// Get the currently active pattern
export function getActivePattern(): string {
  return "Two Pointers" // This matches the current activePattern.ts
}

// Get pattern config by name (handles the mapping from "Two Pointers" to "two-pointers")
export function getPatternConfig(patternName: string): PatternConfig | undefined {
  const normalizedName = patternName.toLowerCase().replace(/\s+/g, '-')
  return PATTERN_CONFIGS[normalizedName]
}

// Get all available patterns (active + unlocked)
export function getAvailablePatterns(): PatternConfig[] {
  return Object.values(PATTERN_CONFIGS).filter(pattern => 
    pattern.status === 'active' || pattern.unlockRequirement === 'none'
  )
}

// Get all locked patterns
export function getLockedPatterns(): PatternConfig[] {
  return Object.values(PATTERN_CONFIGS).filter(pattern => 
    pattern.status === 'locked'
  )
}

// Check if a pattern is available for the user
export function isPatternAvailable(patternId: string, userLevel?: string, userStreak?: number): boolean {
  const config = PATTERN_CONFIGS[patternId]
  if (!config) return false
  
  if (config.status === 'active') return true
  if (config.unlockRequirement === 'none') return true
  
  return false
}
