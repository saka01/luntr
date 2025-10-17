# Pattern Gym MVP

A minimal MVP for single-pattern coding practice with spaced repetition and AI-powered feedback.

## Features

- **Single Pattern Focus**: Currently only "Sliding Window" pattern enabled (MVP)
- **Daily Training Sessions**: Exactly 10 coding problems per session (Pattern ID and Solution Planning)
- **AI-Powered Feedback**: Gemini-powered explanations and grading with fallback to rule-based checks
- **Spaced Repetition**: SM-2 algorithm for optimal learning intervals
- **Progress Tracking**: Streak counting and mastery percentage for Sliding Window
- **Mobile-First**: Responsive design optimized for mobile devices (390×844)

## Setup

### 1. Environment Variables

Create a `.env.local` file with:

```bash
DATABASE_URL="postgresql://username:password@localhost:5432/pattern_gym"
GEMINI_API_KEY="your_gemini_api_key_here"
```

### 2. Database Setup

```bash
# Install dependencies
npm install

# Generate Prisma client
npx prisma generate

# Run database migrations
npx prisma migrate dev

# Seed the database with 12 Sliding Window cards
npm run seed
```

### 3. Development

```bash
npm run dev
```

## Usage

1. **Authentication**: Use the existing login/signup pages
2. **Onboarding**: Complete profile setup with coding level and daily practice time
3. **Dashboard**: View Sliding Window mastery, cards due, and streak
4. **Training Sessions**: Practice with 10 Sliding Window problems per session, get AI feedback, and self-grade confidence

## Problem Types

### Pattern Identification (MCQ)
- Multiple choice questions about Sliding Window pattern recognition
- AI provides rationale for correct answers (≤30 words)
- Fallback to stored rationales if AI fails

### Solution Planning
- Write 2-5 step coding approaches for Sliding Window problems
- AI grades on 0-5 scale with brief feedback (≤40 words)
- Fallback to keyword matching if AI fails

## Current Pattern

- **Sliding Window**: The only pattern enabled in this MVP
  - 8 MCQ cards for pattern identification
  - 4 plan cards for solution design
  - Covers: max sum, longest substring, k distinct chars, min window, etc.

## File Structure

```
/config
  activePattern.ts           # Single pattern configuration
/app
  /onboarding               # Profile setup
  /app                      # Dashboard (protected)
  /app/session              # Session player (protected)
/components
  /deck                     # Card components
  /ui                       # UI components
/lib
  /auth-guard.ts            # Authentication helpers
  /sm2.ts                   # Spaced repetition algorithm
  /session-engine.ts        # Session management (single pattern)
  /gemini.ts                # AI integration
  /feedback.ts              # Fallback feedback
/content
  /copy.ts                  # All app copy (editable)
  /seed/problems.yaml       # 12 Sliding Window cards
```

## Customization

- **Copy**: Edit `/content/copy.ts` to modify all non-landing/auth text
- **Problems**: Add new Sliding Window problems to `/content/seed/problems.yaml` and run `npm run seed`
- **Pattern**: Change `ACTIVE_PATTERN` in `/config/activePattern.ts` (requires new seed data)

## API Endpoints

- `POST /api/onboarding` - Save user profile
- `GET /api/session/cards` - Get training session problems (Sliding Window only)
- `POST /api/session/submit` - Submit problem attempt
- `POST /api/ai/grade` - AI grading (pattern rationale & solution scoring)

## Notes

- Only "Sliding Window" is enabled in MVP; other patterns are disabled placeholders
- All queries filter by the active pattern automatically
- Mobile-optimized with 44px+ tap targets and 16px+ font sizes
- No payments, notifications, or analytics present
- Landing/auth pages remain unchanged