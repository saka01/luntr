# Enhanced Session System

This document describes the enhanced study session tracking and adaptive learning system.

## Features

### StudySession Model
- **id**: Unique session identifier
- **userId**: User who created the session
- **pattern**: Algorithm pattern being studied
- **startedAt**: Session start time
- **endedAt**: Session end time (null if ongoing)
- **sizePlanned**: Number of cards planned for the session
- **sizeCompleted**: Number of cards actually completed
- **servedCardIds**: JSON array of card IDs served in this session
- **accuracy**: Overall accuracy for the session (0-1)
- **avgResponseMs**: Average response time in milliseconds

### Database Indexes
- `UserProgress @@index([userId, nextDue])` - Fast due card queries
- `Card @@index([pattern, type])` - Fast card filtering
- `Attempt @@index([userId, createdAt])` - Fast attempt history queries
- `StudySession @@index([userId, startedAt])` - Fast session history queries

### Card Metadata
- **estSeconds**: Estimated time per card type
  - MCQ: 60 seconds
  - Fill-in-the-blank: 75 seconds
  - Order: 90 seconds
  - Plan: 120 seconds
  - Insight: 0 seconds (non-graded)
- **subtype**: Card subtype for interleaving (recognition, edge, complexity, impl)

### SRS Mapping
- Maps UI grade (1/3/5) to Anki-like quality: `q = 6 - uiGrade`
  - Grade 1 (Too Easy) → Quality 5 (best)
  - Grade 3 (Just Right) → Quality 3 (medium)
  - Grade 5 (Too Confusing) → Quality 1 (worst)

### Schedule Rules
- **Too Confusing (grade 5)**: Resets to today, reduces ease factor
- **Just Right (grade 3)**: Standard growth, normal ease factor
- **Too Easy (grade 1)**: Boosts ease factor and interval

### Session Engine Features

#### Flexible Sessions
- Default 10 cards per session
- "Add 10 more" endpoint excludes already-served card IDs
- Session tracking with completion stats

#### Card Distribution
- ~60% due cards (cards ready for review)
- ~20% recent misses (last 48h with grade=5 or timedOut)
- Up to 3 new cards per session

#### Adaptive Difficulty Weighting
- **Default weights**: Easy 40%, Medium 45%, Hard 15%
- **High mastery (>75%)**: Easy 25%, Medium 45%, Hard 30%
- New cards bias: introduce Easy first, then Medium; delay Hard until Medium accuracy ≥ 65%

#### Timeout Policy
- Zero interaction in 10s → treat as grade 5
- Interaction but timeout → treat as grade 3
- Records `timedOut=true` and `timeMs`

#### Recent Miss Priority
- If grade=5 in last 48h, force `nextDue` to "today"
- Ensures missed cards reappear at end of session

#### Insight Card Injection
- Non-graded insight cards every 4-5 cards
- Also injected right after a miss
- Provides learning reinforcement

## API Endpoints

### POST /api/session/create
Create a new study session.

**Request:**
```json
{
  "pattern": "two-pointers",
  "sizePlanned": 10
}
```

**Response:**
```json
{
  "session": {
    "id": "session_id",
    "userId": "user_id",
    "pattern": "two-pointers",
    "startedAt": "2024-01-01T00:00:00Z",
    "sizePlanned": 10,
    "sizeCompleted": 0,
    "servedCardIds": [],
    "accuracy": null,
    "avgResponseMs": null
  }
}
```

### GET /api/session/cards?sessionId=xxx&size=10&pattern=two-pointers
Get cards for a session with adaptive difficulty.

**Response:**
```json
{
  "cards": [
    {
      "id": "card_id",
      "slug": "card_slug",
      "pattern": "Two Pointers",
      "type": "mcq",
      "difficulty": "E",
      "prompt": {...},
      "answer": {...},
      "subtype": "recognition",
      "estSeconds": 60
    }
  ]
}
```

### POST /api/session/add-more
Add more cards to existing session.

**Request:**
```json
{
  "sessionId": "session_id",
  "additionalSize": 10
}
```

### POST /api/session/end
End session and get statistics.

**Request:**
```json
{
  "sessionId": "session_id"
}
```

**Response:**
```json
{
  "stats": {
    "totalCards": 10,
    "completedCards": 8,
    "accuracy": 0.875,
    "avgResponseMs": 45000,
    "difficultyDistribution": {
      "E": 3,
      "M": 4,
      "H": 1
    }
  }
}
```

### POST /api/session/submit
Submit card attempt with enhanced tracking.

**Request:**
```json
{
  "cardId": "card_id",
  "sessionId": "session_id",
  "answer": {
    "grade": 3,
    "timeMs": 45000,
    "timedOut": false,
    "choice": 0,
    "order": [1, 2, 3],
    "text": "user input",
    "blanks": ["fill1", "fill2"]
  },
  "feedback": {...}
}
```

## Usage Example

```typescript
import { 
  createStudySession, 
  getSessionCards, 
  submitCardAttempt, 
  endStudySession 
} from '@/lib/enhanced-session-engine'

// Create session
const session = await createStudySession(userId, 'two-pointers', 10)

// Get cards
const cards = await getSessionCards(userId, session.id, 10, [], 'two-pointers')

// Submit attempt
await submitCardAttempt(
  userId, 
  cardId, 
  session.id, 
  3, // grade
  feedback, 
  45000, // timeMs
  false, // timedOut
  { choice: 0 } // attemptData
)

// End session
const stats = await endStudySession(session.id)
```

## Migration

Run the migration script to update existing cards with estSeconds:

```bash
npx tsx scripts/migrate-enhanced-session.ts
```

## Database Schema Changes

The following changes were made to the Prisma schema:

1. Added `StudySession` model
2. Added indexes for performance
3. Updated `Card` model to include `estSeconds` defaults
4. Enhanced `Attempt` model with cross-type fields

Run `npx prisma db push` to apply schema changes to your database.
