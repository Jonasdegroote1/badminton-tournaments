"use client";
import { useEffect, useState } from "react";
import Modal from "../modal";
import "../../styles/components/addPlayerToTournamentForm.css";
import "../../styles/components/btn.css"; // centrale button styling

export default function AddPlayerToTournamentForm({ tournamentId, onClose, onPlayerAdded }) {
  const [availablePlayers, setAvailablePlayers] = useState([]);
  const [selectedPlayerId, setSelectedPlayerId] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch(`/api/available-players?tournamentId=${tournamentId}`)
      .then((res) => res.json())
      .then((data) => setAvailablePlayers(data))
      .catch(() => setError("Fout bij ophalen spelers."));
  }, [tournamentId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedPlayerId) return;

    setLoading(true);
    const res = await fetch("/api/player-tournament", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ playerId: parseInt(selectedPlayerId), tournamentId }),
    });

    if (res.ok) {
      const added = await res.json();
      const addedPlayer = availablePlayers.find(p => p.id === added.playerId);
      onPlayerAdded(addedPlayer);
      onClose();
    } else {
      const err = await res.json();
      setError(err.error || "Fout bij toevoegen speler.");
    }
    setLoading(false);
  };

  return (
    <Modal onClose={onClose}>
      <div className="modal">
        <h2>Speler toevoegen aan toernooi</h2>
        {error && <p className="error">{error}</p>}
        <form onSubmit={handleSubmit}>
          <select
            value={selectedPlayerId}
            onChange={(e) => setSelectedPlayerId(e.target.value)}
            required
          >
            <option value="">-- Selecteer speler --</option>
            {availablePlayers.map((player) => (
              <option key={player.id} value={player.id}>
                {player.firstName} {player.lastName}
              </option>
            ))}
          </select>
          <div className="button-group modal-buttons">
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? "Toevoegen..." : "Toevoegen"}
            </button>
            <button
              type="button"
              className="btn btn-secondary"
              onClick={onClose}
            >
              Annuleren
            </button>
          </div>
        </form>
      </div>
    </Modal>
  );
}
