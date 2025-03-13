// components/PouleManagement.js
"use client";
import { useState, useEffect } from "react";
import PouleCard from "./PouleCard";
import "../../styles/components/pouleManagement.css";
import useTournamentStore from "@/lib/tournamentStore";

export default function PouleManagement({ poules, setPoules }) {
  const { selectedTournament } = useTournamentStore();
  const [loading, setLoading] = useState(false);  // Voeg een loading state toe
  const [error, setError] = useState(null);  // Voeg een error state toe voor betere foutafhandeling

  // Haal de poules op bij het selecteren van een toernooi
  useEffect(() => {
    if (!selectedTournament) return;
    setLoading(true); // Start de loading state

    fetch(`/api/poules?tournamentId=${selectedTournament.id}`)
      .then((res) => res.json())
      .then((data) => {
        console.log("Opgehaalde poules:", data);
        setPoules(data);
        setLoading(false); // Zet de loading state uit als de data is opgehaald
      })
      .catch((error) => {
        console.error("Fout bij ophalen poules:", error);
        setLoading(false); // Zet de loading state uit bij een fout
        setError("Er is een fout opgetreden bij het ophalen van de poules.");
      });
  }, [selectedTournament, setPoules]);

  // Verwijder een poule
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

  // Verwijder een team uit een poule
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

  // Voeg een team toe aan een poule
  const handleAddTeam = (pouleId, pouleStrengthId) => {
  fetch(`/api/team?strengthId=${pouleStrengthId}&tournamentId=${selectedTournament.id}`)
    .then((res) => res.json())
    .then((data) => {
      const teamIds = data.map((team) => team.id); // Verkrijg de team IDs
      const teamId = window.prompt("Kies een team ID om toe te voegen: " + teamIds.join(", "));
      
      if (teamId && teamIds.includes(parseInt(teamId))) {
        // Voeg het team toe aan de poule
        fetch(`/api/add-team-to-poule`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ teamId: parseInt(teamId), pouleId }), // Zorg ervoor dat teamId een integer is
        })
          .then((res) => res.json())
          .then((team) => {
            // Na succesvol toevoegen van het team, herlaad de poules
            fetch(`/api/poules?tournamentId=${selectedTournament.id}`)
              .then((res) => res.json())
              .then((data) => {
                setPoules(data); // Zet de opgehaalde poules in de state
              })
              .catch((error) => console.error("Fout bij ophalen poules:", error));
          })
          .catch((error) => console.error("Fout bij toevoegen team aan poule:", error));
      } else {
        alert("Ongeldige team ID.");
      }
    })
    .catch((error) => console.error("Fout bij ophalen teams:", error));
};



  return (
    <div className="poule-management">
      {loading && <p>De poules worden geladen...</p>} {/* Toon een loading bericht */}
      {error && <p className="error-message">{error}</p>} {/* Toon een foutbericht */}
      
      {poules.length === 0 ? <p>Geen poules gevonden voor dit toernooi.</p> : null}

      <ul className="poule-list">
        {poules.map((poule) => (
          <PouleCard 
            key={poule.id} 
            data={poule} 
            onDelete={handleDeletePoule} 
            onRemoveTeam={handleRemoveTeam} 
            handleAddTeam={handleAddTeam} 
          />
        ))}
      </ul>
    </div>
  );
}
