// prisma/seed/courtSeed.js

module.exports = async (prisma) => {
  const courts = [
    { name: 'Terrein 1' },
    { name: 'Terrein 2' },
    { name: 'Terrein 3' },
    { name: 'Terrein 4' },
    { name: 'Terrein 5' },
    { name: 'Terrein 6' },
    { name: 'Terrein 7' },
    { name: 'Terrein 8' },
    { name: 'Terrein 9' },
    { name: 'Terrein 10' }
  ];

  for (const court of courts) {
    await prisma.court.create({ data: court });
  }

  console.log('Courts seeded successfully!');
};
