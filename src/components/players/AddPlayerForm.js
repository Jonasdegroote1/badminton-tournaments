"use client";
import { useState, useEffect } from "react";
import Modal from "../modal";
import "../../styles/components/AddPlayerForm.css";  // Behoud eigen form-styling
import "../../styles/components/btn.css";        // Importeer centrale button-styling

export default function AddPlayerForm({ onClose, onPlayerAdded, tournaments = [] }) {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [clubId, setClubId] = useState("");
  const [mail, setMail] = useState("");
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [clubs, setClubs] = useState([]);

  useEffect(() => {
    const fetchClubs = async () => {
      try {
        const response = await fetch("/api/clubs");
        if (!response.ok) {
          throw new Error("Fout bij het ophalen van clubs.");
        }
        const data = await response.json();
        setClubs(data);
      } catch (error) {
        setError(error.message || "Er is een fout opgetreden.");
      }
    };

    fetchClubs();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!firstName || !lastName || !clubId || !mail || !phone) {
      setError("Alle velden moeten ingevuld worden.");
      return;
    }

    setLoading(true);
    setError(null);
    const parsedClubId = parseInt(clubId, 10);

    try {
      const response = await fetch("/api/players", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          firstName,
          lastName,
          clubId: parsedClubId,
          mail,
          phone,
        }),
      });

      if (!response.ok) {
        throw new Error("Er is een fout opgetreden bij het toevoegen van de speler.");
      }

      const newPlayer = await response.json();
      onPlayerAdded(newPlayer);
      onClose();
    } catch (error) {
      setError(error.message || "Er is een fout opgetreden.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal onClose={onClose}>
      <div className="add-player-form">
        <h2>Voeg een speler toe</h2>
        {error && <p className="error">{error}</p>}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Voornaam</label>
            <input
              type="text"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label>Achternaam</label>
            <input
              type="text"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label>Club</label>
            <select
              value={clubId}
              onChange={(e) => setClubId(e.target.value)}
              required
            >
              <option value="">Selecteer een club</option>
              {clubs.map((club) => (
                <option key={club.id} value={club.id}>
                  {club.name}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label>Mail</label>
            <input
              type="email"
              value={mail}
              onChange={(e) => setMail(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label>Telefoon</label>
            <input
              type="text"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              required
            />
          </div>

          <div className="form-actions modal-buttons">
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? "Toevoegen..." : "Speler toevoegen"}
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
