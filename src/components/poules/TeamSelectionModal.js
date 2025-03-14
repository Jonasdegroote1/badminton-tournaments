"use client";

import { useState, useEffect } from "react";
import "../../styles/components/teamSelectionModal.css"; // Zorg ervoor dat je de juiste stijl hebt voor je modal

export default function TeamSelectionModal({ isOpen, onClose, strengthId, tournamentId, pouleId, onAddTeam }) {
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true); // We voegen een loading state toe
  const [selectedTeam, setSelectedTeam] = useState(null);

  useEffect(() => {
    if (!isOpen) return; // Zorg ervoor dat de modal pas data ophaalt als deze zichtbaar is
    setLoading(true); // Start de loading state

    fetch(`/api/team?strengthId=${strengthId}&tournamentId=${tournamentId}`)
      .then((res) => res.json())
      .then((data) => {
        console.log("Fetched Teams:", data); // Log de opgehaalde teams
        setTeams(data);
        setLoading(false); // Zet de loading state uit zodra de data is geladen
      })
      .catch((error) => {
        console.error("Error fetching teams:", error);
        setLoading(false); // Zet loading uit zelfs als er een fout is
      });
  }, [isOpen, strengthId, tournamentId]);

  const handleTeamSelect = (event) => {
    const selectedId = parseInt(event.target.value, 10); // Zorg ervoor dat de ID een getal is
    console.log('Selected Team ID:', selectedId);

    // Zoek team op basis van ID
    const team = teams.find((team) => team.id === selectedId);
    console.log('Selected Team:', team);

    setSelectedTeam(team); // Stel het geselecteerde team in
  };

  const handleAdd = () => {
    if (selectedTeam && pouleId) {
      console.log("Team toegevoegd:", selectedTeam.id);
      console.log("pouleId:", pouleId); // Toon pouleId voor controle

      onAddTeam(selectedTeam.id); // Voeg team toe aan de poule
      onClose(); // Sluit de modal
    } else {
      console.log("Geen team of poule geselecteerd.");
    }
  };

  return (
    isOpen && (
      <div className="modal-overlay">
        <div className="modal-content">
          <h2>Selecteer een Team</h2>
          {loading ? (
            <p>Loading teams...</p> // Toon een loading bericht terwijl de data wordt opgehaald
          ) : (
            <form>
              <label htmlFor="teamSelect">Kies een team:</label>
              <select
                id="teamSelect"
                onChange={handleTeamSelect}
                value={selectedTeam ? selectedTeam.id : ""} // Zorg ervoor dat de waarde goed is ingesteld
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
