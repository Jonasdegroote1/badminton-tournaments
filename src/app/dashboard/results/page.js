"use client";

import { useState } from "react";
import useSWR from "swr";
import ScoreForm from "@/app/components/ScoreForm"; // Pas dit pad aan indien nodig

const fetcher = (url) => fetch(url).then((res) => res.json());

export default function ResultsPage() {
  const [selectedPouleId, setSelectedPouleId] = useState(null);

  const { data: poules } = useSWR("/api/poules", fetcher);
  const {
    data: matches,
    mutate,
    isLoading,
    error,
  } = useSWR(
    selectedPouleId ? `/api/matches?pouleId=${selectedPouleId}` : null,
    fetcher
  );

  if (!poules) return <p>Poules worden geladen...</p>;

  return (
    <div className="admin-matches-page">
      <h1>Wedstrijden beheren</h1>

      <label>Selecteer een poule:</label>
      <select
        value={selectedPouleId || ""}
        onChange={(e) => setSelectedPouleId(e.target.value)}
      >
        <option value="" disabled>
          Kies een poule
        </option>
        {poules.map((poule) => (
          <option key={poule.id} value={poule.id}>
            {poule.name}
          </option>
        ))}
      </select>

      {isLoading && <p>Wedstrijden worden geladen...</p>}
      {error && <p>Fout bij ophalen van wedstrijden.</p>}

      {matches &&
        matches.map((match) => (
          <div key={match.id} className="match-block">
            <h3>
              {match.teams?.[0]?.team?.name || "Team 1"} vs{" "}
              {match.teams?.[1]?.team?.name || "Team 2"}
            </h3>

            <ScoreForm matchId={match.id} onSetAdded={mutate} />

            {/* Toon eventueel de huidige score */}
            {match.setResults?.length > 0 && (
              <ul>
                {match.setResults.map((set, i) => (
                  <li key={i}>
                    Set {i + 1}: {set.team1Score} - {set.team2Score}
                  </li>
                ))}
              </ul>
            )}
          </div>
        ))}
    </div>
  );
}
