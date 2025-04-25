// src/lib/prisma.js

import { PrismaClient } from '@prisma/client/edge'

// Voorkom meerdere Prisma instanties tijdens development (door hot reloads)
const globalForPrisma = globalThis

const prisma = globalForPrisma.prisma ??
  new PrismaClient({
    log: ['error'], // je kunt hier ook 'query', 'info' etc. loggen
  })

// Log de Prisma Client versie
console.log('Prisma Client Versie:', prisma._version)  // Dit toont de versie van de Prisma Client

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma

export { prisma }
