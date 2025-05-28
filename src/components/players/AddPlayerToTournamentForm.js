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

    const payload = {
      playerId: parseInt(selectedPlayerId),
      tournamentId,
    };

    console.log("➡️ Verstuurde data naar /api/player-tournament:", payload);

    setLoading(true);
    try {
      const res = await fetch("/api/player-tournament", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        const added = await res.json();
        console.log("✅ Response van server:", added);
        const addedPlayer = availablePlayers.find(p => p.id === added.playerId);
        onPlayerAdded(addedPlayer);
        onClose();
      } else {
        const err = await res.json();
        console.error("❌ Fout response van server:", err);
        setError(err.error || "Fout bij toevoegen speler.");
      }
    } catch (error) {
      console.error("❌ Fout tijdens fetch:", error);
      setError("Fout tijdens communicatie met server.");
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
            <button type="button" className="btn btn-secondary" onClick={onClose}>
              Annuleren
            </button>
          </div>
        </form>
      </div>
    </Modal>
  );
}
