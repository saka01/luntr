import { prisma } from '../lib/prisma'

async function migrateEnhancedSession() {
  try {
    console.log('🔄 Running enhanced session migration...')
    
    // Update existing cards with estSeconds if they don't have it
    console.log('📊 Updating card estSeconds...')
    const updates = [
      { type: 'mcq', estSeconds: 60 },
      { type: 'fitb', estSeconds: 75 },
      { type: 'order', estSeconds: 90 },
      { type: 'plan', estSeconds: 120 },
      { type: 'insight', estSeconds: 0 }
    ]
    
    for (const update of updates) {
      const result = await prisma.card.updateMany({
        where: { 
          type: update.type,
          estSeconds: null
        },
        data: { estSeconds: update.estSeconds }
      })
      console.log(`✅ Updated ${result.count} ${update.type} cards with estSeconds: ${update.estSeconds}`)
    }
    
    console.log('✅ Enhanced session migration completed!')
    
  } catch (error) {
    console.error('❌ Error in migration:', error)
    throw error
  } finally {
    await prisma.$disconnect()
  }
}

migrateEnhancedSession()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
