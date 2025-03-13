"use client";
import { useState, useEffect } from "react";
import PouleCard from "./PouleCard";
import "../../styles/components/pouleManagement.css";
import useTournamentStore from "@/lib/tournamentStore";

export default function PouleManagement({ poules, setPoules }) {
  const { selectedTournament } = useTournamentStore();

  useEffect(() => {
    if (!selectedTournament) return;

    fetch(`/api/poules?tournamentId=${selectedTournament.id}`)
      .then((res) => res.json())
      .then((data) => {
        console.log("Opgehaalde poules:", data);
        setPoules(data);
      })
      .catch((error) => console.error("Fout bij ophalen poules:", error));
  }, [selectedTournament, setPoules]);

  const handleDeletePoule = (id) => {
    if (window.confirm("Weet je zeker dat je deze poule wilt verwijderen?")) {
      fetch(`/api/poules`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      })
        .then((res) => res.json())
        .then(() => setPoules((prev) => prev.filter((p) => p.id !== id)))
        .catch((error) => console.error("Fout bij verwijderen poule:", error));
    }
  };

  const handleRemoveTeam = (teamId, pouleId) => {
    fetch(`/api/remove-team-from-poule`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ teamId, pouleId }),
    })
      .then((res) => res.json())
      .then(() => {
        setPoules((prev) =>
          prev.map((poule) =>
            poule.id === pouleId
              ? { ...poule, teams: poule.teams.filter((team) => team.id !== teamId) }
              : poule
          )
        );
      })
      .catch((error) => console.error("Fout bij verwijderen team uit poule:", error));
  };

  return (
    <div className="poule-management">
      {poules.length === 0 ? <p>Geen poules gevonden voor dit toernooi.</p> : null}
      <ul className="poule-list">
        {poules.map((poule) => (
          <PouleCard key={poule.id} data={poule} onDelete={handleDeletePoule} onRemoveTeam={handleRemoveTeam} />
        ))}
      </ul>
    </div>
  );
}
