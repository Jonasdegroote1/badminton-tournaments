import { calculateStandings } from "@/lib/calculateStandings";
import "@/styles/components/standingsTable.css";

export default function StandingsTable({ standings }) {
  if (!standings || !standings.matches) {
    return <p>Geen gegevens beschikbaar.</p>;
  }

  const results = calculateStandings([standings]);

  return (
    <div className="standings-grid">
      {/* Kopteksten */}
      <div className="standings-header">Team</div>
      <div className="standings-header">Gewonnen</div>
      <div className="standings-header">Verloren</div>
      <div className="standings-header">Sets Gewonnen</div>
      <div className="standings-header">Sets Verloren</div>
      <div className="standings-header">Totaal Punten</div>

      {/* Gegevens */}
      {results.map((team, index) => (
        <>
          <div key={`team-${team.teamId}`}>{team.teamName}</div>
          <div>{team.won}</div>
          <div>{team.lost}</div>
          <div>{team.setsWon}</div>
          <div>{team.setsLost}</div>
          <div>{team.points}</div>
        </>
      ))}
    </div>
  );
}
