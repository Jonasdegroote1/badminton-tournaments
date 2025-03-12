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
    </div>"use client";
import { useEffect, useState } from "react";
import useTournamentStore from "../lib/tournamentStore";
import "../styles/components/tournamentSelector.css";

export default function TournamentSelector() {
  const [tournaments, setTournaments] = useState([]);
  const { selectedTournament, setTournament } = useTournamentStore();

  useEffect(() => {
    fetch("/api/tournaments")
      .then((res) => res.json())
      .then((data) => setTournaments(data));
  }, []);

  return (
    <div className="tournament-selector">
      <label className="tournament-label">SELECT TOURNAMENT</label>
      <select
        className="tournament-dropdown"
        value={selectedTournament?.id || ""}
        onChange={(e) => {
          const tournament = tournaments.find(t => t.id === parseInt(e.target.value));
          setTournament(tournament);
        }}
      >
        {tournaments.map((tournament) => (
          <option key={tournament.id} value={tournament.id}>
            {tournament.name} {tournament.date}
          </option>
        ))}
      </select>
    </div>
  );
}

  );
}
