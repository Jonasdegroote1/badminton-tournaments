"use client";

import "../../styles/components/otherTournaments.css";
import { useState } from "react";

export default function OtherTournaments({ tournaments }) {
  const [showModal, setShowModal] = useState(false);
  const [name, setName] = useState("");
  const [date, setDate] = useState("");
  const [session, setSession] = useState("VM");

  const handleAddTournament = async (e) => {
    e.preventDefault();

    const newTournament = { name, date, session };  // Voeg session toe aan de request body

    // Log the new tournament data to the console to check
    console.log("Form Data to be sent:", newTournament);

    // Simuleer een API-call naar de database
    const response = await fetch("/api/tournaments", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newTournament),
    });

    if (response.ok) {
      alert("Tournament added successfully!");
      setShowModal(false);
      setName("");
      setDate("");
      setSession("VM");  // Reset de session naar de standaard waarde
    } else {
      alert("Failed to add tournament.");
    }
  };

  return (
    <div className="other-tournaments">
      <h3 className="other-title">OTHER TOURNAMENTS</h3>
      {tournaments.map((tournament, index) => (
        <div key={index} className="tournament-item">
          <p className="tournament-name">{tournament.name}</p>
          <p className="tournament-time">{tournament.date}</p>
        </div>
      ))}

      <button 
        className="btn btn-primary add-tournament" 
        onClick={() => setShowModal(true)}
      >
        + Add Tournament
      </button>

      {showModal && (
        <div className="modal">
          <div className="modal-content">
            <h2>Add Tournament</h2>
            <form onSubmit={handleAddTournament}>
              <label>Tournament Name:</label>
              <input 
                type="text" 
                value={name} 
                onChange={(e) => setName(e.target.value)} 
                required 
              />

              <label>Date:</label>
              <input 
                type="date" 
                value={date} 
                onChange={(e) => setDate(e.target.value)} 
                required 
              />

              <label>Session:</label>
              <select 
                value={session} 
                onChange={(e) => setSession(e.target.value)} 
                required
              >
                <option value="VM">Voormiddag</option>
                <option value="NM">Namiddag</option>
              </select>

              <div className="modal-buttons">
                <button type="submit" className="btn btn-primary">Save</button>
                <button type="button" onClick={() => setShowModal(false)} className="btn btn-secondary">Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
