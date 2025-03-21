"use client";

import { useEffect, useState } from "react";
import { prisma } from "@/lib/prisma";
import AddTeamForm from "./AddTeamForm";
import useTournamentStore from "@/lib/tournamentStore";
import "../../styles/components/teamsTable.css";
import TeamRow from "./TeamRow";

export default function TeamsTable() {
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAddTeamForm, setShowAddTeamForm] = useState(false);
  const [addTeamSuccess, setAddTeamSuccess] = useState(false);  

  const selectedTournament = useTournamentStore((state) => state.selectedTournament);

  useEffect(() => {
    if (!selectedTournament) return;

    const url = `/api/team/available?tournamentId=${selectedTournament.id}`;
    fetch(url)
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
    setShowAddTeamForm(true); 
  };

  const handleCloseForm = () => {
    setShowAddTeamForm(false);
    setAddTeamSuccess(false);
  };

  const handleTeamAdded = () => {
    setAddTeamSuccess(true); 
    setShowAddTeamForm(false);
    setLoading(true);
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
      {addTeamSuccess && <p className="success-message">Team succesvol toegevoegd!</p>}

      <div className="add-team-button-container">
        <button className="add-team-button" onClick={handleAddTeam}>
          Voeg team toe
        </button>
      </div>

      {showAddTeamForm && (
        <div className="add-team-form-container">
          <AddTeamForm
            tournamentId={selectedTournament.id}
            onClose={handleCloseForm}
            onTeamAdded={handleTeamAdded} 
          />
        </div>
      )}

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
