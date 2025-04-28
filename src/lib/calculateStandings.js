export function calculateStandings(poules) {
  const standings = {};

  poules.forEach((poule) => {
    poule.teams.forEach((team) => {
      if (!standings[team.id]) {
        standings[team.id] = {
          teamId: team.id,
          teamName: `${team.player1?.firstName || ""} ${team.player1?.lastName || ""}` +
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

    if (!poule.matches) return;

    poule.matches.forEach((match) => {
      if (!match.setResults || match.setResults.length === 0) return;
      if (!match.teams || match.teams.length < 2) return;

      const [team1Entry, team2Entry] = match.teams;
      const team1 = team1Entry?.team;
      const team2 = team2Entry?.team;

      if (!team1 || !team2) return;

      const team1Id = team1.id;
      const team2Id = team2.id;

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

  const sorted = Object.values(standings).sort((a, b) => {
    if (b.won !== a.won) return b.won - a.won;
    const setDiffA = a.setsWon - a.setsLost;
    const setDiffB = b.setsWon - b.setsLost;
    if (setDiffB !== setDiffA) return setDiffB - setDiffA;
    return b.points - a.points;
  });

  // Medaille toevoegen
  sorted.forEach((team, index) => {
    if (index === 0) {
      team.teamName = "🥇 " + team.teamName;
    } else if (index === 1) {
      team.teamName = "🥈 " + team.teamName;
    } else if (index === 2) {
      team.teamName = "🥉 " + team.teamName;
    }
  });

  return sorted;
}
