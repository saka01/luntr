# StudySession Tracking and Adaptive Learning Implementation

This document outlines the implementation of the StudySession tracking system and adaptive learning features.

## Overview

The StudySession system provides comprehensive tracking of user study sessions with adaptive difficulty, timeout policies, and intelligent card distribution.

## Database Schema

### StudySession Table
- `id`: Unique session identifier
- `user_id`: Reference to user
- `pattern`: Learning pattern (e.g., 'two-pointers')
- `started_at`: Session start timestamp
- `ended_at`: Session end timestamp (nullable)
- `size_planned`: Number of cards planned for session
- `size_completed`: Number of cards actually completed
- `served_card_ids`: JSON array of card IDs served in session
- `accuracy`: Calculated accuracy percentage
- `avg_response_ms`: Average response time in milliseconds

### Indexes Added
- `idx_study_sessions_user_started`: (user_id, started_at)
- `idx_user_progress_user_next_due`: (user_id, next_due)
- `idx_cards_pattern_type`: (pattern, type)

## API Endpoints

### POST /api/session/start
Start a new study session
- **Body**: `{ pattern: string, size?: number }`
- **Response**: `{ sessionId: string, cards: SessionCard[] }`

### POST /api/session/add-more
Add more cards to existing session
- **Body**: `{ sessionId: string, size?: number }`
- **Response**: `{ cards: SessionCard[] }`

### POST /api/session/end
End a study session and calculate metrics
- **Body**: `{ sessionId: string }`
- **Response**: `{ session: StudySessionData }`

### POST /api/session/submit
Submit card attempt with timeout policy
- **Body**: `{ cardId: string, answer: AttemptPayload, feedback: any, lastInteractionTime?: number }`
- **Response**: `{ success: boolean, finalGrade: number, finalTimedOut: boolean, nextDue: Date }`

## Key Features

### 1. Adaptive Difficulty Weighting
- **Default weights**: Easy 40%, Medium 45%, Hard 15%
- **Mastery weights**: Easy 25%, Medium 45%, Hard 30% (when mastery > 75%)
- **New card bias**: Introduce Easy first, then Medium; delay Hard until M accuracy ≥ 65%

### 2. Card Distribution
- **Due cards**: ~60% of session
- **Recent misses**: ~20% (last 48h with grade=5 or timedOut)
- **New cards**: Up to 3 per session

### 3. Timeout Policy
- **No interaction in 10s**: Treat as grade=5 (Too Confusing)
- **With interaction**: Treat as grade=3 (Just Right) to avoid over-penalizing
- **Records**: `timedOut=true` and `timeMs`

### 4. Recent-Miss Priority
- Cards with grade=5 in last 48h are forced to `nextDue = today`
- Ensures they reappear at end of session

### 5. Insight Card Injection
- Non-graded insight cards injected every 4-5 cards
- Also injected right after a miss
- Provides learning breaks and context

### 6. SRS Mapping
- **UI Grade 1** (Too Easy) → **Quality 5** (Best)
- **UI Grade 3** (Just Right) → **Quality 3** (Medium)
- **UI Grade 5** (Too Confusing) → **Quality 1** (Worst)

### 7. Schedule Rules
- **Too Confusing (grade=5)**: Reset reps, show today, decrease ease factor
- **Just Right (grade=3)**: Standard growth with ease factor
- **Too Easy (grade=1)**: Boost ease factor and interval

## Card Metadata

### estSeconds Defaults
- `mcq`: 60 seconds
- `fitb`: 75 seconds
- `order`: 90 seconds
- `plan`: 120 seconds
- `insight`: 0 seconds (no timer)

### Card Subtypes
Preserved for interleaving: "recognition", "edge", "complexity", "impl"

## Usage Example

```typescript
// Start a session
const { sessionId, cards } = await fetch('/api/session/start', {
  method: 'POST',
  body: JSON.stringify({ pattern: 'two-pointers', size: 10 })
});

// Add more cards
const { cards: moreCards } = await fetch('/api/session/add-more', {
  method: 'POST',
  body: JSON.stringify({ sessionId, size: 10 })
});

// Submit attempt
await fetch('/api/session/submit', {
  method: 'POST',
  body: JSON.stringify({
    cardId: 'card-123',
    answer: { grade: 3, timeMs: 45000, choice: 2 },
    feedback: { correct: true },
    lastInteractionTime: Date.now() - 5000
  })
});

// End session
const { session } = await fetch('/api/session/end', {
  method: 'POST',
  body: JSON.stringify({ sessionId })
});
```

## Migration

To apply the database changes, run the SQL migration in your Supabase dashboard:

```sql
-- See supabase/migrations/001_add_study_sessions.sql
```

This creates the `study_sessions` table with proper indexes and RLS policies.