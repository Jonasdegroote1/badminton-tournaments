"use client";

import { useState } from "react";
import useTournamentStore from "@/lib/tournamentStore";
import useSWR from "swr";
import PouleSelector from "@/app/components/results/PouleSelector";
import StandingsTable from "@/app/components/results/StandingsTable";

const fetcher = (url) => fetch(url).then((res) => res.json());

export default function ResultsPage() {
  const { selectedTournament } = useTournamentStore();
  const [selectedPouleId, setSelectedPouleId] = useState(null);

  const { data: poules, error, isLoading } = useSWR(
    selectedTournament ? `/api/poules?tournamentId=${selectedTournament.id}` : null,
    fetcher,
    {
      refreshInterval: 5000, // <-- live updates!
    }
  );

  if (error) return <p>Fout bij ophalen van poules.</p>;
  if (isLoading) return <p>Bezig met laden...</p>;
  if (!poules || poules.length === 0) return <p>Geen poules gevonden.</p>;

  const selectedPoule = poules.find((p) => p.id === selectedPouleId);

  return (
    <div className="results-page">
      <h1>Resultaten</h1>

      <PouleSelector poules={poules} onSelectPouleId={setSelectedPouleId} />

      {selectedPoule && (
        <div className="results-section">
          <h2>Geselecteerde Poule: {selectedPoule.name}</h2>
          <p><strong>Sterkte:</strong> {selectedPoule.strength?.name || "-"}</p>
          <p><strong>Aantal teams:</strong> {selectedPoule.teams?.length || 0}</p>

          <StandingsTable standings={selectedPoule} />
        </div>
      )}
    </div>
  );
}
