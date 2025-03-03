// prisma/seed/teamSeed.js

module.exports = async (prisma) => {
  // Fetch existing Players, Pools, and Strengths
  const players = await prisma.player.findMany();
  const pools = await prisma.pool.findMany();
  const strengths = await prisma.strength.findMany();

  if (players.length < 2) {
    console.log('Not enough players to form teams!');
    return;
  }

  if (pools.length === 0 || strengths.length === 0) {
    console.log('Pools or Strengths are missing, ensure they are seeded first!');
    return;
  }

  const numberOfTeams = Math.floor(players.length / 2);  // Assuming two players per team

  const teams = [];

  for (let i = 0; i < numberOfTeams; i++) {
    const player1 = players[i * 2]; // Player 1 in this team
    const player2 = players[i * 2 + 1]; // Player 2 in this team

    const team = {
      player1Id: player1.id,
      player2Id: player2.id,
      poolId: pools[Math.floor(Math.random() * pools.length)].id, // Randomly assign pool
      strengthId: strengths[Math.floor(Math.random() * strengths.length)].id, // Randomly assign strength
    };

    teams.push(team);
  }

  // Create teams in the database
  for (const team of teams) {
    await prisma.team.create({
      data: team,
    });
  }

  console.log(`${numberOfTeams} teams seeded successfully!`);
};
