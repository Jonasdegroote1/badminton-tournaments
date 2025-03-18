"use client";

import { useEffect, useState } from "react";
import TeamRow from "./TeamRow";
import useTournamentStore from "@/lib/tournamentStore";
import "../../styles/components/teamsTable.css";

export default function TeamsTable() {
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const selectedTournament = useTournamentStore(
    (state) => state.selectedTournament
  );

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

  return (
    <>
      <div className=" team-grid teams-table-header">
        <div>Speler 1</div>
        <div>Speler 2</div>
        <div>Poule</div>
        <div>Sterkte</div>
        <div>Acties</div>
      </div>

      <ul className="teams-table-list">
        {teams.map((team) => (
          <li key={team.id}>
            <TeamRow team={team} />
          </li>
        ))}
      </ul>
    </>
  );
}
