"use client";

import { useEffect, useState } from "react";
import AddTeamForm from "./AddTeamForm";
import useTournamentStore from "@/lib/tournamentStore";
import "../../styles/components/teamsTable.css";
import TeamRow from "./TeamRow";

export default function TeamsTable() {
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAddTeamForm, setShowAddTeamForm] = useState(false);
  const [addTeamSuccess, setAddTeamSuccess] = useState(false);  // Voor het weergeven van succesbericht

  const selectedTournament = useTournamentStore((state) => state.selectedTournament);

  useEffect(() => {
    if (!selectedTournament) return;

    fetch(`/api/team/available?tournamentId=${selectedTournament.id}`)
      .then((res) => res.json())
      .then((data) => {
        console.log("Teams fetched from API:", data);
        setTeams(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Fout bij ophalen teams:", error);
        setError("Fout bij het laden van teams.");
        setLoading(false);
      });
  }, [selectedTournament]);

  if (!selectedTournament) return <p>Selecteer eerst een toernooi.</p>;
  if (loading) return <p>Teams worden geladen...</p>;
  if (error) return <p>{error}</p>;

  const handleAddTeam = () => {
    setShowAddTeamForm(true); // Toont het formulier wanneer de knop wordt ingedrukt
  };

  const handleCloseForm = () => {
    setShowAddTeamForm(false); // Verbergt het formulier wanneer het gesloten wordt
    setAddTeamSuccess(false);  // Reset de successtatus bij het sluiten van het formulier
  };

  // Deze functie kan worden aangeroepen na het succesvol toevoegen van een team in de AddTeamForm component
  const handleTeamAdded = () => {
    setAddTeamSuccess(true);  // Zet succesmelding aan
    setShowAddTeamForm(false);  // Sluit het formulier
    // Het herladen van de teams kan hier gebeuren als dat nodig is
    setLoading(true);  // Start de loading state om teams opnieuw te laden
    fetch(`/api/team/available?tournamentId=${selectedTournament.id}`)
      .then((res) => res.json())
      .then((data) => {
        setTeams(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Fout bij ophalen teams:", error);
        setError("Fout bij het laden van teams.");
        setLoading(false);
      });
  };

  return (
    <>
      {/* Toon succesmelding na toevoegen team */}
      {addTeamSuccess && <p className="success-message">Team succesvol toegevoegd!</p>}

      <div className="add-team-button-container">
        <button className="add-team-button" onClick={handleAddTeam}>
          Voeg team toe
        </button>
      </div>

      {/* Toon het formulier voor het toevoegen van een team als showAddTeamForm true is */}
      {showAddTeamForm && (
        <div className="add-team-form-container">
          <AddTeamForm
            tournamentId={selectedTournament.id}
            onClose={handleCloseForm}
            onTeamAdded={handleTeamAdded}  // Pass success callback naar AddTeamForm
          />
        </div>
      )}

      {/* De tabel header met teams */}
      <div className="team-grid teams-table-header">
        <div>Speler 1</div>
        <div>Speler 2</div>
        <div>Poule</div>
        <div>Sterkte</div>
        <div>Acties</div>
      </div>

      <ul className="teams-table-list">
        {teams.map((team) => (
          <TeamRow key={team.id} team={team} />
        ))}
      </ul>
    </>
  );
}
