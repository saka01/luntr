import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

const waitlistSchema = z.object({
  email: z.string().min(1, 'Email is required').email('Please enter a valid email address'),
  firstName: z.string().optional(),
  source: z.string().optional(),
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    console.log('Received waitlist data:', body)
    const validatedData = waitlistSchema.parse(body)

    // Check if email already exists
    const existingEntry = await prisma.waitlist.findUnique({
      where: { email: validatedData.email }
    })

    if (existingEntry) {
      return NextResponse.json(
        { error: 'Email already exists in waitlist' },
        { status: 409 }
      )
    }

    // Create new waitlist entry
    const waitlistEntry = await prisma.waitlist.create({
      data: {
        email: validatedData.email,
        firstName: validatedData.firstName,
        source: validatedData.source || 'unknown',
      }
    })

    // Get total count for position
    const totalCount = await prisma.waitlist.count()

    return NextResponse.json({
      success: true,
      data: {
        id: waitlistEntry.id,
        position: totalCount,
        email: waitlistEntry.email,
        firstName: waitlistEntry.firstName,
      }
    })

  } catch (error) {
    console.error('Waitlist API error:', error)
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid data provided', details: error.errors },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { error: 'Internal server error', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}

export async function GET() {
  try {
    const count = await prisma.waitlist.count()
    return NextResponse.json({ count })
  } catch (error) {
    console.error('Waitlist count error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
