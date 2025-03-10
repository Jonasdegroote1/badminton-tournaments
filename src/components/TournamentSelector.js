"use client";
import { useEffect, useState } from "react";
import "../styles/components/tournamentSelector.css";

export default function TournamentSelector() {
  const [tournaments, setTournaments] = useState([]);

  useEffect(() => {
    fetch("/api/tournaments") // Simulatie van database-call
      .then((res) => res.json())
      .then((data) => setTournaments(data));
  }, []);

  return (
    <div className="tournament-selector">
      <label className="tournament-label">SELECT TOURNAMENT</label>
      <select className="tournament-dropdown">
        {tournaments.map((tournament) => (
          <option key={tournament.id}>{tournament.name} {tournament.date} {tournament.session}</option>
        ))}
      </select>
    </div>
  );
}
