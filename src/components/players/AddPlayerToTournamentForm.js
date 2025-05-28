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

  // Spelers ophalen
  useEffect(() => {
    fetch(`/api/available-players?tournamentId=${tournamentId}`)
      .then((res) => {
        if (!res.ok) throw new Error("Fout bij ophalen spelers.");
        return res.json();
      })
      .then((data) => setAvailablePlayers(data))
      .catch((err) => {
        console.error("Fout bij ophalen spelers:", err);
        setError("Fout bij ophalen spelers.");
      });
  }, [tournamentId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedPlayerId) return;

    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/player-tournament", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          playerId: parseInt(selectedPlayerId),
          tournamentId,
        }),
      });

      if (!res.ok) {
        let err = { error: "Fout bij toevoegen speler." };
        try {
          err = await res.json();
        } catch (jsonError) {
          console.error("Fout bij uitlezen foutbericht:", jsonError);
        }
        throw new Error(err.error);
      }

      const added = await res.json();
      const addedPlayer = availablePlayers.find((p) => p.id === added.playerId);
      onPlayerAdded(addedPlayer);
      onClose();
    } catch (err) {
      console.error("❌ Fout bij toevoegen speler:", err);
      setError(err.message || "Onbekende fout.");
    } finally {
      setLoading(false);
    }
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
            <button type="button" className="btn btn-secondary" onClick={onClose}>
              Annuleren
            </button>
          </div>
        </form>
      </div>
    </Modal>
  );
}
