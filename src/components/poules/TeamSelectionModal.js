"use client";

import { useState, useEffect } from "react";
import "../../styles/components/teamSelectionModal.css"; // Zorg ervoor dat je de juiste stijl hebt voor je modal

export default function TeamSelectionModal({ isOpen, onClose, strengthId, tournamentId, pouleId, onAddTeam }) {
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedTeam, setSelectedTeam] = useState(null);

  useEffect(() => {
    if (!isOpen) return;
    setLoading(true);

    fetch(`/api/team?strengthId=${strengthId}&tournamentId=${tournamentId}`)
      .then((res) => res.json())
      .then((data) => {
        setTeams(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching teams:", error);
        setLoading(false);
      });
  }, [isOpen, strengthId, tournamentId]);

  // Log de props om te controleren of pouleId goed wordt doorgegeven
  console.log("Received props in modal:", { pouleId, strengthId, tournamentId });

  const handleTeamSelect = (event) => {
    const selectedId = parseInt(event.target.value, 10);
    const team = teams.find((team) => team.id === selectedId);
    setSelectedTeam(team);
  };

  const handleAdd = () => {
    if (selectedTeam) {
      console.log("Team toegevoegd:", selectedTeam.id);
      console.log("Poule ID:", pouleId); // Controleer de pouleId
      onAddTeam(selectedTeam.id, pouleId); // Voeg team toe aan de poule
      onClose();
    }
  };

  return (
    isOpen && (
      <div className="modal-overlay">
        <div className="modal-content">
          <h2>Selecteer een Team</h2>
          {loading ? (
            <p>Loading teams...</p>
          ) : (
            <form>
              <label htmlFor="teamSelect">Kies een team:</label>
              <select
                id="teamSelect"
                onChange={handleTeamSelect}
                value={selectedTeam ? selectedTeam.id : ""}
              >
                <option value="" disabled>Kies een team</option>
                {teams.length > 0 ? (
                  teams.map((team) => (
                    <option key={team.id} value={team.id}>
                      {team.player1.firstName} & {team.player2 ? team.player2.firstName : "Geen tweede speler"}
                    </option>
                  ))
                ) : (
                  <option value="" disabled>Geen teams beschikbaar</option>
                )}
              </select>
            </form>
          )}
          <button onClick={handleAdd} disabled={!selectedTeam}>Voeg team toe</button>
          <button onClick={onClose}>Annuleren</button>
        </div>
      </div>
    )
  );
}
