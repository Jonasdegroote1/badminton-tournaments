"use client";

import { useState, useEffect } from "react";
import "../../styles/components/teamSelectionModal.css"; // Zorg ervoor dat je de juiste stijl hebt voor je modal

export default function TeamSelectionModal({ isOpen, onClose, strengthId, tournamentId, onAddTeam }) {
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true); // We voegen een loading state toe
  const [selectedTeam, setSelectedTeam] = useState(null);

  // Zorg ervoor dat we roleId loggen bij het openen van de modal en in de client-side omgeving
  useEffect(() => {
    // Alleen in de browseromgeving (client-side) loggen
    if (typeof window !== "undefined") {
      const token = JSON.parse(localStorage.getItem("token")); // of haal het token uit cookies, context, etc.
      if (token) {
        console.log('Role ID:', token?.roleId); // Log de roleId
      }
    }
  }, []); // Dit wordt alleen uitgevoerd bij het laden van de component

  useEffect(() => {
    if (!isOpen) return; // Zorg ervoor dat de modal pas data ophaalt als deze zichtbaar is
    setLoading(true); // Start de loading state

    fetch(`/api/team?strengthId=${strengthId}&tournamentId=${tournamentId}`)
      .then((res) => res.json())
      .then((data) => {
        setTeams(data);
        setLoading(false); // Zet de loading state uit zodra de data is geladen
      })
      .catch((error) => {
        console.error("Error fetching teams:", error);
        setLoading(false); // Zet loading uit zelfs als er een fout is
      });
  }, [isOpen, strengthId, tournamentId]);

  const handleTeamSelect = (team) => {
    setSelectedTeam(team);
  };

  const handleAdd = () => {
    if (selectedTeam) {
      onAddTeam(selectedTeam.id); // Voeg team toe aan de poule
      onClose(); // Sluit de modal
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
            <ul className="team-list">
              {teams.length > 0 ? (
                teams.map((team) => (
                  <li
                    key={team.id}
                    onClick={() => handleTeamSelect(team)}
                    className={selectedTeam?.id === team.id ? "selected" : ""}
                  >
                    {team.player1.firstName} & {team.player2 ? team.player2.firstName : "Geen tweede speler"}
                  </li>
                ))
              ) : (
                <p>Geen teams beschikbaar</p> // Toon een bericht als er geen teams zijn
              )}
            </ul>
          )}
          <button onClick={handleAdd} disabled={!selectedTeam}>Voeg team toe</button>
          <button onClick={onClose}>Annuleren</button>
        </div>
      </div>
    )
  );
}
