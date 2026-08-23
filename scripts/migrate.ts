import { createDatabaseSchema } from '../lib/schema'
import { seedDatabase } from '../lib/seed'

async function main() {
  try {
    console.log('Creating database schema...')
    await createDatabaseSchema()
    
    console.log('Seeding database...')
    await seedDatabase()
    
    console.log('Migration completed successfully!')
    process.exit(0)
  } catch (error) {
    console.error('Migration failed:', error)
    process.exit(1)
  }
}

main()