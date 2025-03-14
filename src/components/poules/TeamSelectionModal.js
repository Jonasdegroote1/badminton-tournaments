"use client";

import { useState, useEffect } from "react";
import "../../styles/components/teamSelectionModal.css"; // Zorg voor de juiste CSS-stijl

export default function TeamSelectionModal({ isOpen, onClose, strengthId, tournamentId, onTeamAdded }) {
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedTeamId, setSelectedTeamId] = useState(null); // Houdt het geselecteerde team bij

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

  const handleSelectTeam = (teamId) => {
    setSelectedTeamId(teamId); // Sla het geselecteerde team op
    console.log("Geselecteerd team:", teamId); // Log het geselecteerde team
  };

  const handleConfirmSelection = () => {
    if (!selectedTeamId) {
      console.log("Geen team geselecteerd!"); // Log een foutmelding als er geen team is geselecteerd
      return;
    }

    console.log("Bevestigen team toevoeging:", selectedTeamId); // Log de bevestiging

    fetch(`/api/add-team-to-poule`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ teamId: selectedTeamId, strengthId }),
    })
      .then((res) => res.json())
      .then((data) => {
        console.log("Team toegevoegd:", data); // Log succesdata
        onTeamAdded(); // Refresh de lijst met teams in de poule
        onClose(); // Sluit de modal
      })
      .catch((error) => {
        console.error("Fout bij toevoegen team aan poule:", error); // Log de fout
      });
  };

  return (
    isOpen && (
      <div className="modal-overlay">
        <div className="modal-content">
          <h2>Voeg een team toe</h2>
          {loading ? (
            <p>Teams laden...</p>
          ) : (
            <>
              <select onChange={(e) => handleSelectTeam(e.target.value)} value={selectedTeamId || ""}>
                <option value="">Selecteer een team</option>
                {teams.map((team) => (
                  <option key={team.id} value={team.id}>
                    {team.player1.firstName} & {team.player2 ? team.player2.firstName : "Geen tweede speler"}
                  </option>
                ))}
              </select>
              {selectedTeamId && (
                <button onClick={handleConfirmSelection}>Bevestig toevoeging</button>
              )}
            </>
          )}
          <button onClick={onClose}>Annuleren</button>
        </div>
      </div>
    )
  );
}
