// src/lib/prisma.js

import { PrismaClient } from '@prisma/client/edge'
import { withAccelerate } from '@prisma/extension-accelerate'

// Geen globalThis checks nodig bij Edge/serverless
const prisma = new PrismaClient().$extends(withAccelerate())

export { prisma }
