"use client";
import { useEffect, useState } from "react";
import AddPlayerForm from "./AddPlayerForm";
import PlayerRow from "./PlayerRow";
import useTournamentStore from "@/lib/tournamentStore";
import "../../styles/components/playersTable.css";

export default function PlayerTable() {
  const [players, setPlayers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAddPlayerForm, setShowAddPlayerForm] = useState(false);
  const [addPlayerSuccess, setAddPlayerSuccess] = useState(false);
  const selectedTournament = useTournamentStore((state) => state.selectedTournament);
  const tournamentId = selectedTournament?.id;

  const [tournaments, setTournaments] = useState([]);

  // Haal alle toernooien op
  useEffect(() => {
    fetch("/api/tournaments")  // Dit is een voorbeeld; pas de route aan zoals nodig
      .then((res) => res.json())
      .then((data) => {
        setTournaments(data);
      })
      .catch((err) => {
        console.error("Fout bij ophalen toernooien:", err);
        setError("Er is een fout opgetreden bij het ophalen van de toernooien.");
      });
  }, []);

  const handleAddPlayer = () => {
    setShowAddPlayerForm(true);
  };

  const handleCloseForm = () => {
    setShowAddPlayerForm(false);
    setAddPlayerSuccess(false);
  };

  const handlePlayerAdded = (newPlayer) => {
    setPlayers((prevPlayers) => [...prevPlayers, newPlayer]);
  };

  useEffect(() => {
    if (!tournamentId) return; // alleen fetchen als er een tournamentId is

    setLoading(true);
    setError(null);

    fetch(`/api/players?tournamentId=${tournamentId}`)
      .then((res) => res.json())
      .then((data) => {
        setPlayers(data);
        setLoading(false);
      })
      .catch((error) => {
        setError("Fout bij het laden van spelers.");
        setLoading(false);
      });
  }, [tournamentId]);

  if (loading) return <p>Loading spelers...</p>;
  if (error) return <p>{error}</p>;

  return (
    <>
      <div className="add-player-button-container">
        <button className="btn btn-primary" onClick={handleAddPlayer}>Speler toevoegen</button>
      </div>

      {showAddPlayerForm && (
        <AddPlayerForm
          tournaments={tournaments}
          onClose={handleCloseForm}
          onPlayerAdded={handlePlayerAdded}
        />
      )}

      <div className="player-grid teams-table-header">
        <p>naam</p>
        <p>club</p>
        <p>mail</p>
        <p>gsm</p>
        <p>acties</p>
      </div>

      <div className="player-grid">
        {players.map((player) => (
          <PlayerRow key={player.id} player={player} />
        ))}
      </div>
    </>
  );
}
