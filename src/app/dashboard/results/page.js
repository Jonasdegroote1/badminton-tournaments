"use client";

import { useState } from "react";
import useTournamentStore from "@/lib/tournamentStore";
import PouleSelector from "@/app/components/results/PouleSelector";
import StandingsTable from "@/app/components/results/StandingsTable";

export default function ResultsPage() {
  const [selectedPoule, setSelectedPoule] = useState(null);
  const { selectedTournament } = useTournamentStore(); // <-- get tournament from store

  return (
    <div className="results-page">
      <h1>Resultaten</h1>

      {selectedTournament ? (
        <PouleSelector
          tournamentId={selectedTournament.id}
          onSelectPoule={setSelectedPoule}
        />
      ) : (
        <p>Geen toernooi geselecteerd.</p>
      )}

      {selectedPoule && (
        <div className="results-section">
          <h2>Geselecteerde Poule: {selectedPoule.name}</h2>
          <p><strong>Sterkte:</strong> {selectedPoule.strength?.name || "-"}</p>
          <p><strong>Aantal teams:</strong> {selectedPoule.teams?.length || 0}</p>
          <pre>{JSON.stringify(selectedPoule, null, 2)}</pre> {/* debug */}
        </div>
      )}
    </div>
  );
}
