const { faker } = require('@faker-js/faker');

module.exports = async (prisma) => {
  const numberOfPlayers = 10;  // Number of players to create
  const players = [];

  // Generate the players
  for (let i = 0; i < numberOfPlayers; i++) {
    const player = {
      firstName: faker.person.firstName(),
      lastName: faker.person.lastName(),
      mail: faker.internet.email(),
      phone: faker.phone.number(),
      clubId: Math.floor(Math.random() * 5) + 1,  // Randomly assign to one of 5 clubs
    };
    players.push(player);
  }

  // Create players in the database
  for (const player of players) {
    await prisma.player.create({ data: player });  // Ensure this is inside the async function
  }

  console.log(`${numberOfPlayers} random players seeded successfully!`);
};
