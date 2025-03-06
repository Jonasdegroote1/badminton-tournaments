// prisma/seed.js

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  // Import your separate seed files
  // await require('./seed/clubSeed')(prisma);
  // await require('./seed/playerSeed')(prisma);
  // await require('./seed/teamSeed')(prisma);
  // await require('./seed/strengthSeed')(prisma);
  // await require('./seed/pouleSeed')(prisma);
  await require('./seed/courtSeed')(prisma);

  console.log('Seeding complete!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
