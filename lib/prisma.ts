
import "dotenv/config";
import { PrismaPg } from '@prisma/adapter-pg'
import { PrismaClient } from '../generated/prisma/client'

const connectionString = `${process.env.DATABASE_URL}`

const adapter = new PrismaPg({ connectionString })
const prisma = new PrismaClient({ adapter })

// Note: Prisma middleware ($use) doesn't work reliably with adapters
// Collection creation is handled in lib/auth.ts hooks instead

export { prisma }