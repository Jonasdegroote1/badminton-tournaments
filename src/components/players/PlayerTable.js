"use client";
import { useEffect, useState } from "react";
import AddPlayerForm from "./AddPlayerForm";
import PlayerRow from "./PlayerRow";
import useTournamentStore from "@/lib/tournamentStore";
import AddPlayerToTournamentForm from "./AddPlayerToTournamentForm";
import "../../styles/components/playersTable.css";

export default function PlayerTable() {
  const [players, setPlayers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAddPlayerForm, setShowAddPlayerForm] = useState(false);
  const [showAddToTournamentForm, setShowAddToTournamentForm] = useState(false);
  const selectedTournament = useTournamentStore((state) => state.selectedTournament);
  const tournamentId = selectedTournament?.id;

  const handleAddPlayer = () => setShowAddPlayerForm(true);
  const handleAddPlayerTournament = () => setShowAddToTournamentForm(true);

  const handleCloseForm = () => setShowAddPlayerForm(false);
  const handleCloseAddToTournament = () => setShowAddToTournamentForm(false);

  const handlePlayerAdded = (newPlayer) => {
    setPlayers((prev) => [...prev, newPlayer]);
  };

  useEffect(() => {
    if (!tournamentId) return;
    setLoading(true);
    setError(null);

    fetch(`/api/players?tournamentId=${tournamentId}`)
      .then((res) => res.json())
      .then((data) => {
        setPlayers(data);
        setLoading(false);
      })
      .catch(() => {
        setError("Fout bij het laden van spelers.");
        setLoading(false);
      });
  }, [tournamentId]);

  if (loading) return <p>Loading spelers...</p>;
  if (error) return <p>{error}</p>;

  return (
    <>
      <div className="add-player-button-container">
        <button className="btn btn-primary" onClick={handleAddPlayer}>Speler aanmaken</button>
        <button className="btn btn-primary" onClick={handleAddPlayerTournament}>Speler toevoegen aan toernooi</button>
      </div>

      {showAddPlayerForm && (
        <AddPlayerForm
          onClose={handleCloseForm}
          onPlayerAdded={handlePlayerAdded}
        />
      )}

      {showAddToTournamentForm && tournamentId && (
        <AddPlayerToTournamentForm
          tournamentId={tournamentId}
          onClose={handleCloseAddToTournament}
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
          <PlayerRow key={player.id} player={player} tournamentId={tournamentId} />
        ))}
      </div>
    </>
  );
}
