# Luntr MVP

A minimal MVP for pattern-based coding practice with spaced repetition and AI-powered feedback.

## Features

- **Daily Training Sessions**: Exactly 10 coding problems per session (Pattern ID and Solution Planning)
- **AI-Powered Feedback**: Gemini-powered explanations and grading with fallback to rule-based checks
- **Spaced Repetition**: SM-2 algorithm for optimal learning intervals
- **Progress Tracking**: Streak counting and weakest pattern identification
- **Mobile-First**: Responsive design optimized for mobile devices

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

# Seed the database with sample cards
npm run seed
```

### 3. Development

```bash
npm run dev
```

## Usage

1. **Authentication**: Use the existing login/signup pages (demo user is created automatically)
2. **Onboarding**: Complete profile setup with coding level and daily practice time
3. **Dashboard**: View patterns to practice, streak, and focus areas
4. **Training Sessions**: Practice with 10 coding problems per session, get AI feedback, and self-grade confidence

## Problem Types

### Pattern Identification
- Multiple choice questions about coding pattern recognition
- AI provides rationale for correct answers
- Fallback to stored rationales if AI fails

### Solution Planning
- Write 2-5 step coding approaches
- AI grades on 0-5 scale with brief feedback
- Fallback to keyword matching if AI fails

## Patterns Covered

- Two Pointers
- Sliding Window  
- Binary Search
- Hashing

## File Structure

```
/app
  /onboarding          # Profile setup
  /app                  # Dashboard (protected)
  /app/session          # Session player (protected)
/components
  /deck                 # Card components
  /ui                   # UI components
/lib
  /auth-guard.ts        # Authentication helpers
  /sm2.ts              # Spaced repetition algorithm
  /session-engine.ts    # Session management
  /gemini.ts           # AI integration
  /feedback.ts         # Fallback feedback
/content
  /copy.ts             # All app copy (editable)
  /seed/problems.yaml  # Sample cards
```

## Customization

- **Copy**: Edit `/content/copy.ts` to modify all non-landing/auth text
- **Problems**: Add new problems to `/content/seed/problems.yaml` and run `npm run seed`
- **Patterns**: Extend the pattern types in the seed data

## API Endpoints

- `POST /api/onboarding` - Save user profile
- `GET /api/session/cards` - Get training session problems
- `POST /api/session/submit` - Submit problem attempt
- `POST /api/ai/grade` - AI grading (pattern rationale & solution scoring)

## Deployment

The app must pass `next build` for deployment. Ensure all environment variables are set in production.