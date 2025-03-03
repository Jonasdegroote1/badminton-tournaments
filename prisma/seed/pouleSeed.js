// prisma/seed/poolSeed.js

module.exports = async (prisma) => {
  // First, seed some Strengths (or fetch existing ones)
  const strengths = await prisma.strength.findMany();
  
  const numberOfPoules = 2; // Number of poules to create
  const poules = [];
  
  // Generate the poules
  for (let i = 0; i < numberOfPoules; i++) {
    const poule = {
      name: `Poule ${i + 1}`,
      strengthId: strengths[Math.floor(Math.random() * strengths.length)].id, // Randomly assign a strengthId
    };
    poules.push(poule);
  }

  // Create poules in the database
  for (const poule of poules) {
    await prisma.pool.create({
      data: poule
    });
  }

  console.log(`${numberOfPoules} random poules seeded successfully!`);
};
