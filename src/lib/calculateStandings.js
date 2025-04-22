export function calculateStandings(poules) {
  const standings = {};

  poules.forEach((poule) => {
    poule.matches.forEach((match) => {
      if (!match.setResults || match.setResults.length === 0) return;

      const [team1, team2] = match.teams.map((entry) => entry.team);
      const team1Id = team1.id;
      const team2Id = team2.id;

      // Initialiseer beide teams indien nodig
      [team1, team2].forEach((team) => {
        if (!standings[team.id]) {
          standings[team.id] = {
            teamId: team.id,
            teamName: `${team.player1.firstName} ${team.player1.lastName}` +
                      (team.player2 ? ` & ${team.player2.firstName} ${team.player2.lastName}` : ''),
            played: 0,
            won: 0,
            lost: 0,
            setsWon: 0,
            setsLost: 0,
            points: 0,
          };
        }
      });

      let team1SetsWon = 0;
      let team2SetsWon = 0;
      let team1TotalPoints = 0;
      let team2TotalPoints = 0;

      match.setResults.forEach((set) => {
        if (set.team1Score > set.team2Score) {
          team1SetsWon++;
        } else {
          team2SetsWon++;
        }
        team1TotalPoints += set.team1Score;
        team2TotalPoints += set.team2Score;
      });

      // Update stats
      standings[team1Id].played++;
      standings[team2Id].played++;

      standings[team1Id].setsWon += team1SetsWon;
      standings[team1Id].setsLost += team2SetsWon;
      standings[team1Id].points += team1TotalPoints;

      standings[team2Id].setsWon += team2SetsWon;
      standings[team2Id].setsLost += team1SetsWon;
      standings[team2Id].points += team2TotalPoints;

      if (team1SetsWon > team2SetsWon) {
        standings[team1Id].won++;
        standings[team2Id].lost++;
      } else {
        standings[team2Id].won++;
        standings[team1Id].lost++;
      }
    });
  });

  // Sorteer: won > setverschil > punten
  const sortedStandings = Object.values(standings).sort((a, b) => {
    if (b.won !== a.won) return b.won - a.won;

    const setDiffA = a.setsWon - a.setsLost;
    const setDiffB = b.setsWon - b.setsLost;
    if (setDiffB !== setDiffA) return setDiffB - setDiffA;

    return b.points - a.points;
  });

  return sortedStandings;
}
