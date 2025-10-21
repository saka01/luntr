import { prisma } from '../lib/prisma'
import fs from 'fs'
import path from 'path'
import yaml from 'js-yaml'

async function seed() {
  try {
    console.log('🌱 Starting seed...')
    
    // Read the YAML file
    const yamlPath = path.join(process.cwd(), 'content', 'seed', 'problems.yaml')
    const yamlContent = fs.readFileSync(yamlPath, 'utf8')
    const data = yaml.load(yamlContent) as any
    
    console.log(`📚 Found ${data.cards.length} cards to seed`)
    
    // Clear existing cards
    await prisma.card.deleteMany({})
    console.log('🗑️  Cleared existing cards')
    
    // Insert new cards
    for (const cardData of data.cards) {
      // Set estSeconds based on card type
      let estSeconds: number
      switch (cardData.type) {
        case 'mcq':
          estSeconds = 60
          break
        case 'fitb':
          estSeconds = 75
          break
        case 'order':
          estSeconds = 90
          break
        case 'plan':
          estSeconds = 120
          break
        case 'insight':
          estSeconds = 0
          break
        default:
          estSeconds = 60
      }

      await prisma.card.create({
        data: {
          slug: cardData.slug,
          pattern: cardData.pattern,
          type: cardData.type,
          difficulty: cardData.difficulty,
          prompt: cardData.prompt,
          answer: cardData.answer,
          estSeconds: estSeconds,
          subtype: cardData.subtype || null,
          tags: cardData.tags || null,
        }
      })
    }
    
    console.log('✅ Successfully seeded cards!')
    
  } catch (error) {
    console.error('❌ Error seeding:', error)
    throw error
  } finally {
    await prisma.$disconnect()
  }
}

seed()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
