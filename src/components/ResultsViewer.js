"use client";

import PouleSelector from "@/app/components/results/PouleSelector";
import StandingsTable from "@/app/components/results/StandingsTable";
import { useState } from "react";
import useSWR from "swr";


const fetcher = (url) => fetch(url).then((res) => res.json());

export default function ResultsViewer({ tournament }) {
  const [selectedPouleId, setSelectedPouleId] = useState(null);

  const { data: poules, error, isLoading } = useSWR(
    tournament ? `/api/poules?tournamentId=${tournament.id}` : null,
    fetcher
  );

  if (!tournament) return null;
  if (error) return <p>Fout bij ophalen van poules.</p>;
  if (isLoading) return <p>Bezig met laden...</p>;
  if (!poules || poules.length === 0) return <p>Geen poules gevonden.</p>;

  const selectedPoule = poules.find((p) => p.id === selectedPouleId);

  return (
    <div className="results-viewer">
      <PouleSelector poules={poules} onSelectPouleId={setSelectedPouleId} />

      {selectedPoule && (
        <div className="results-section">
          <h2>{selectedPoule.name}</h2>
          <p><strong>Sterkte:</strong> {selectedPoule.strength?.name || "-"}</p>
          <p><strong>Aantal teams:</strong> {selectedPoule.teams?.length || 0}</p>

          <StandingsTable standings={selectedPoule} />
        </div>
      )}
    </div>
  );
}
