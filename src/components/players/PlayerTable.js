"use client";
import { useEffect, useState } from "react";
import PlayerRow from "./PlayerRow"; // Zorg dat dit pad klopt met jouw projectstructuur
import useTournamentStore from "@/lib/tournamentStore";
import "../../styles/components/playersTable.css";

export default function PlayerTable() {
  const [players, setPlayers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

    const selectedTournament = useTournamentStore((state) => state.selectedTournament);
    const tournamentId = selectedTournament?.id;

  useEffect(() => {
    if (!tournamentId) return; // alleen fetchen als er een tournamentId is

    setLoading(true);
    setError(null);

    fetch(`/api/players?tournamentId=${tournamentId}`)
      .then((res) => res.json())
      .then((data) => {
        console.log("Players fetched from API:", data);
        setPlayers(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Fout bij ophalen spelers:", error);
        setError("Fout bij het laden van spelers.");
        setLoading(false);
      });
  }, [tournamentId]); // elke keer als tournamentId wijzigt opnieuw fetchen

  if (loading) return <p>Loading spelers...</p>;
  if (error) return <p>{error}</p>;

  return (
    <>
      <div className="player-grid teams-table-header">
        <p>naam</p>
        <p>club</p>
        <p>e-mail</p>
        <p>gsm</p>
        <p>acties</p>
      </div>

      <div className="player-grid">
        {players.map((player) => (
          <PlayerRow key={player.id} player={player} tournamentId={tournamentId} />
        ))}
      </div>
    </>
  );
}
