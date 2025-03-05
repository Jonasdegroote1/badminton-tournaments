module.exports = async (prisma) => {
  // Haal bestaande Strengths op
  const strengths = await prisma.strength.findMany();
  
  // Haal bestaande Toernooien op
  const tournaments = await prisma.tournament.findMany();

  if (strengths.length === 0 || tournaments.length === 0) {
    console.log('Er zijn geen Strengths of Toernooien. Zorg ervoor dat ze eerst worden gezaaid!');
    return;
  }

  const numberOfPoules = 2; // Aantal poules om te creëren
  const poules = [];
  
  // Genereer de poules
  for (let i = 0; i < numberOfPoules; i++) {
    const poule = {
      name: `Poule ${i + 1}`,
      strengthId: strengths[Math.floor(Math.random() * strengths.length)].id, // Willekeurig strengthId toewijzen
      tournamentId: tournaments[Math.floor(Math.random() * tournaments.length)].id, // Willekeurig tournamentId toewijzen
    };
    poules.push(poule);
  }

  // Maak de poules aan in de database
  for (const poule of poules) {
    await prisma.poule.create({  // Zorg ervoor dat hier 'poule' is, en niet 'pool'
      data: poule
    });
  }

  console.log(`${numberOfPoules} random poules seeded successfully!`);
};
