// src/lib/prisma.js

import { PrismaClient } from '@prisma/client/edge'

// Voorkom meerdere Prisma instanties tijdens development (door hot reloads)
const globalForPrisma = globalThis

const prisma = globalForPrisma.prisma ??
  new PrismaClient({
    log: ['error'], // je kunt hier ook 'query', 'info' etc. loggen
  })

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma

export { prisma }
