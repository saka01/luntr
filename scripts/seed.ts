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
      await prisma.card.create({
        data: {
          slug: cardData.slug,
          pattern: cardData.pattern,
          type: cardData.type,
          difficulty: cardData.difficulty,
          prompt: cardData.prompt,
          answer: cardData.answer,
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
