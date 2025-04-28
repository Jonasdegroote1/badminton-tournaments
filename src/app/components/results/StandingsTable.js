import { calculateStandings } from "@/lib/calculateStandings";
import "@/styles/components/standingsTable.css"; // Zorg dat dit pad klopt

export default function StandingsTable({ standings }) {
  if (!standings || !standings.matches) {
    return <p>Geen gegevens beschikbaar.</p>;
  }

  const results = calculateStandings([standings]);

  return (
    <div className="standings-container">
      {results.map((team, index) => (
        <div key={team.teamId} className="team-card">
          <div className="team-name">
            {index === 0 && <span>🥇</span>}
            {index === 1 && <span>🥈</span>}
            {index === 2 && <span>🥉</span>}
            {team.teamName}
          </div>
          <div className="team-stats">
            <div><span className="stat-label">Gewonnen</span><br />{team.won}</div>
            <div><span className="stat-label">Verloren</span><br />{team.lost}</div>
            <div><span className="stat-label">Sets Gewonnen</span><br />{team.setsWon}</div>
            <div><span className="stat-label">Sets Verloren</span><br />{team.setsLost}</div>
            <div><span className="stat-label">Totaal Punten</span><br />{team.points}</div>
          </div>
        </div>
      ))}
    </div>
  );
}
