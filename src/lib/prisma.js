import { PrismaClient } from '@prisma/client/edge'

// Voorkom meerdere Prisma instanties tijdens development (door hot reloads)
const globalForPrisma = globalThis

const prisma = globalForPrisma.prisma ??
  new PrismaClient({
    log: [], // Log alle activiteiten
  })

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma

export { prisma }
