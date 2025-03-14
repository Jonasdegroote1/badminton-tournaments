"use client";

import { useState, useEffect } from "react";
import "../../styles/components/teamSelectionModal.css"; // Zorg voor de juiste CSS-stijl

export default function TeamSelectionModal({
  isOpen,
  onClose,
  strengthId,
  tournamentId,
  onTeamAdded,
}) {
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedTeamId, setSelectedTeamId] = useState(null);
  const [selectedPouleId, setSelectedPouleId] = useState(null);

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

  useEffect(() => {
    if (!strengthId || !tournamentId) return;

    // Dynamisch ophalen van de pouleId op basis van strengthId en tournamentId
    fetch(`/api/get-poule-id?strengthId=${strengthId}&tournamentId=${tournamentId}`)
      .then((res) => res.json())
      .then((data) => {
        setSelectedPouleId(data.pouleId); // Stel de pouleId in
      })
      .catch((error) => {
        console.error("Error fetching pouleId:", error);
      });
  }, [strengthId, tournamentId]);

  const handleSelectTeam = (teamId) => {
    setSelectedTeamId(teamId);
  };

  const handleConfirmSelection = () => {
    if (!selectedTeamId || !strengthId || !selectedPouleId) {
      console.log("Geen team geselecteerd, geen strengthId of geen pouleId!");
      return;
    }

    console.log("Bevestigen team toevoeging:", selectedTeamId);

    fetch(`/api/add-team-to-poule`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        teamId: selectedTeamId,
        strengthId: strengthId,
        pouleId: selectedPouleId, // Gebruik het dynamisch geselecteerde pouleId
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        console.log("Team toegevoegd:", data);
        onTeamAdded(); // Refresh de lijst met teams in de poule
        onClose(); // Sluit de modal
      })
      .catch((error) => {
        console.error("Fout bij toevoegen team aan poule:", error);
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
            <select onChange={(e) => handleSelectTeam(e.target.value)}>
              <option value="">Selecteer een team</option>
              {teams.map((team) => (
                <option key={team.id} value={team.id}>
                  {team.player1.firstName} &{" "}
                  {team.player2 ? team.player2.firstName : "Geen tweede speler"}
                </option>
              ))}
            </select>
          )}
          <button onClick={onClose}>Annuleren</button>
          <button onClick={handleConfirmSelection}>Bevestigen</button>
        </div>
      </div>
    )
  );
}
