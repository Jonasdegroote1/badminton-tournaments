import { calculateStandings } from "@/lib/calculateStandings";
import "@/styles/components/standingsTable.css";
import useSWR from "swr";

// Fetcher voor SWR
const fetcher = (url) => fetch(url).then((res) => res.json());

export default function StandingsTable({ poule }) {
  const { data: matches = [], error, isLoading, mutate } = useSWR(
    poule?.id ? `/api/matches?pouleId=${poule.id}` : null,
    fetcher,
    {
      revalidateOnFocus: true,
      revalidateOnReconnect: true,
    }
  );

  if (!poule) return <p>Geen poule geselecteerd.</p>;
  if (isLoading) return <p>Standings laden...</p>;
  if (error) return <p>Fout bij laden van wedstrijden.</p>;

  const results = calculateStandings([{ ...poule, matches }]);

  return (
    <div className="standings-grid">
      <div className="standings-header">Team</div>
      <div className="standings-header">Gewonnen</div>
      <div className="standings-header">Verloren</div>
      <div className="standings-header">Sets Gewonnen</div>
      <div className="standings-header">Sets Verloren</div>
      <div className="standings-header">Totaal Punten</div>

      {results.map((team) => (
        <div key={`team-${team.teamId}`}>
          <div>{team.teamName}</div>
          <div>{team.won}</div>
          <div>{team.lost}</div>
          <div>{team.setsWon}</div>
          <div>{team.setsLost}</div>
          <div>{team.points}</div>
        </div>
      ))}
    </div>
  );
}
