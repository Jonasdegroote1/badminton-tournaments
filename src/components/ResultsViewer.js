"use client";

import PouleSelector from "@/app/components/results/PouleSelector";
import StandingsTable from "@/app/components/results/StandingsTable";
import { useState } from "react";
import useSWR from "swr";
import LoadingShuttlecock from "@/components/LoadingShuttlecock";  // Zorg ervoor dat je deze component hebt.
import "@/styles/components/ResultViewer.css";

const fetcher = (url) => fetch(url).then((res) => res.json());

export default function ResultsViewer({ tournament }) {
  const [selectedPouleId, setSelectedPouleId] = useState(null);

  const { data: poules, error, isLoading } = useSWR(
    tournament ? `/api/poules?tournamentId=${tournament.id}` : null,
    fetcher
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
