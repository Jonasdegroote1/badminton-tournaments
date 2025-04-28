"use client";

import useTournamentStore from "@/lib/tournamentStore";
import TournamentSelector from "@/components/sidebar/TournamentSelector";
import ResultsViewer from "@/components/ResultsViewer";
import LoadingShuttlecock from "@/components/LoadingShuttlecock";


export default function Home() {
  const { selectedTournament } = useTournamentStore();

  return (
    <div className="results-page">
      <TournamentSelector />
      {selectedTournament && <ResultsViewer tournament={selectedTournament} />}
    </div>
  );
}
