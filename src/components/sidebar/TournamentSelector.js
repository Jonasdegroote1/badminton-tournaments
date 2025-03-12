"use client";

import { useEffect, useState } from "react";
import useTournamentStore from "@/lib/tournamentStore"; // Zustand-store
import "../../styles/components/tournamentSelector.css";

export default function TournamentSelector() {
  const [tournaments, setTournaments] = useState([]);
  const { selectedTournament, setSelectedTournament } = useTournamentStore();

  useEffect(() => {
    fetch("/api/tournaments") // Haal toernooien op uit de database
      .then((res) => res.json())
      .then((data) => {
        setTournaments(data);

        // Automatisch het eerstvolgende toernooi selecteren
        if (data.length > 0 && !selectedTournament) {
          const sortedTournaments = [...data].sort((a, b) => new Date(a.date) - new Date(b.date)); // Sorteer op datum
          setSelectedTournament(sortedTournaments[0]); // Stel eerstvolgende in als standaard
        }
      });
  }, []);

  return (
    <div className="tournament-selector">
      <label className="tournament-label">SELECT TOURNAMENT</label>
      <select 
        className="tournament-dropdown"
        value={selectedTournament ? selectedTournament.id : ""}
        onChange={(e) => {
          const selected = tournaments.find(t => t.id == e.target.value);
          setSelectedTournament(selected);
        }}
      >
        {tournaments.map((tournament) => (
          <option key={tournament.id} value={tournament.id}>
            {tournament.name} {tournament.date} {tournament.session}
          </option>
        ))}
      </select>
    </div>
  );
}
