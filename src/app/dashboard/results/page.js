"use client";

import { useState } from "react";
import useSWR from "swr";
import LoadingShuttlecock from "@/components/LoadingShuttlecock";  // Zorg ervoor dat je deze component hebt.
import useTournamentStore from "@/lib/tournamentStore"

const fetcher = (url) => fetch(url).then((res) => res.json());

export default function ResultsPage() {
    const { selectedTournament: tournament } = useTournamentStore();
    const [selectedPouleId, setSelectedPouleId] = useState(null);
    const { data: poules, error, isLoading } = useSWR(
      tournament ? `/api/poules?tournamentId=${tournament.id}` : null,
      fetcher,
      {
        revalidateOnFocus: false,
        revalidateOnReconnect: false,
        revalidateIfStale: false,
        refreshInterval: 0
      }
    );
  
  
    if (!tournament) return <p>Geen toernooi geselecteerd.</p>;
    if (error) return <p>Fout bij ophalen van poules.</p>;
  
    // Toon de laadtijd animatie wanneer de poules nog aan het laden zijn
    if (isLoading) {
      return (
        <div className="results-viewer">
          <h1>Resultaten</h1>
          <LoadingShuttlecock /> {/* Laad animatie toevoegen */}
        </div>
      );
    }
  
    if (!poules || poules.length === 0) return <p>Geen poules gevonden.</p>;
  
    const selectedPoule = poules.find((p) => p.id === selectedPouleId);

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
