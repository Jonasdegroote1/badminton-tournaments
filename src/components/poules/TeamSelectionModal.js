import { useState, useEffect } from "react";
import "../../styles/components/teamSelectionModal.css";

export default function TeamSelectionModal({ isOpen, onClose, pouleId, strengthId, tournamentId, onAddTeam }) {
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedTeam, setSelectedTeam] = useState(null);

  useEffect(() => {
    if (!isOpen) return; // Zorg ervoor dat de modal pas data ophaalt als deze zichtbaar is
    setLoading(true); // Start de loading state

    fetch(`/api/team?strengthId=${strengthId}&tournamentId=${tournamentId}`)
      .then((res) => res.json())
      .then((data) => {
        console.log('Fetched Teams:', data);
        setTeams(data);
        setLoading(false); // Zet de loading state uit zodra de data is geladen
      })
      .catch((error) => {
        console.error("Error fetching teams:", error);
        setLoading(false); // Zet loading uit zelfs als er een fout is
      });
  }, [isOpen, strengthId, tournamentId]);

  const handleTeamSelect = (event) => {
    const selectedId = parseInt(event.target.value, 10);
    console.log('Selected Team ID:', selectedId);
    console.log('poufffle:', pouleId);

    const team = teams.find((team) => team.id === selectedId);
    console.log('Selected Team:', team);

    setSelectedTeam(team); // Stel het geselecteerde team in
  };

  const handleAdd = () => {
    console.log("handleAdd aangeroepen");

    if (!selectedTeam) {
      console.log("❌ Geen team geselecteerd.");
    } else {
      console.log("✅ Geselecteerd team ID:", selectedTeam.id);
    }

    if (!pouleId) {
      console.log("❌ Geen poule geselecteerd.", pouleId);
    } else {
      console.log("✅ Geselecteerde poule ID:", pouleId);
    }

    if (selectedTeam && pouleId) {
      console.log("🚀 Team wordt toegevoegd...",);
      onAddTeam(selectedTeam.id, pouleId); // Voeg team toe aan de poule
      onClose(); // Sluit de modal
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
