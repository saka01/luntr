import { prisma } from '../lib/prisma'

async function updateCardEstSeconds() {
  try {
    console.log('🔄 Updating card estSeconds...')
    
    // Update cards based on type
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
    
    console.log('✅ Successfully updated all card estSeconds!')
    
  } catch (error) {
    console.error('❌ Error updating estSeconds:', error)
    throw error
  } finally {
    await prisma.$disconnect()
  }
}

updateCardEstSeconds()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
