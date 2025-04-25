// src/lib/prisma.js
 import { PrismaClient } from '@prisma/client';
 
 // Maak een nieuwe Prisma Client instantie
 const prisma = new PrismaClient();
 
 // Exporteer prisma zodat je het in andere delen van je code kunt gebruiken
 export { prisma };