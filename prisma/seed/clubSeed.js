// prisma/seed/clubSeed.js

module.exports = async (prisma) => {
  const clubs = [
    { name: 'Club A' },
    { name: 'Club B' },
    { name: 'Club C' },
    { name: 'Club D' },
    { name: 'Club E' }
  ];

  for (const club of clubs) {
    await prisma.club.create({ data: club });
  }

  console.log('Clubs seeded successfully!');
};
