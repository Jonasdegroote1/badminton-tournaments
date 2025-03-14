"use client";
import { useState, useEffect } from "react";
import PouleCard from "./PouleCard";
import TeamSelectionModal from "./TeamSelectionModal"; // Zorg ervoor dat de modal hier is geïmporteerd
import "../../styles/components/pouleManagement.css";
import useTournamentStore from "@/lib/tournamentStore";

export default function PouleManagement({ poules, setPoules }) {
  const { selectedTournament } = useTournamentStore();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false); // State voor de modal
  const [selectedPouleId, setSelectedPouleId] = useState(null); // Huidige poule waar team toegevoegd moet worden

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

  // Open de modal om een team toe te voegen
  const handleOpenModal = (pouleId) => {
    setSelectedPouleId(pouleId); // Zet de geselecteerde poule-id
    setIsModalOpen(true); // Open de modal
  };

  // Sluit de modal
  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  // Voeg een team toe aan de poule
  const handleAddTeamToPoule = (teamId) => {
    fetch(`/api/add-team-to-poule`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ teamId, pouleId: selectedPouleId }), // Gebruik de geselecteerde poule-id
    })
      .then((res) => res.json())
      .then(() => {
        // Na succesvol toevoegen van het team, herlaad de poules
        fetch(`/api/poules?tournamentId=${selectedTournament.id}`)
          .then((res) => res.json())
          .then((data) => {
            setPoules(data); // Zet de opgehaalde poules in de state
          })
          .catch((error) => console.error("Fout bij ophalen poules:", error));
      })
      .catch((error) => console.error("Fout bij toevoegen team aan poule:", error));
  };

  return (
    <div className="poule-management">
      {loading && <p>De poules worden geladen...</p>}
      {error && <p className="error-message">{error}</p>}

      {poules.length === 0 ? <p>Geen poules gevonden voor dit toernooi.</p> : null}

      <ul className="poule-list">
        {poules.map((poule) => (
          <PouleCard
            key={poule.id}
            data={poule}
            onDelete={handleDeletePoule}
            onRemoveTeam={handleRemoveTeam}
            handleOpenModal={handleOpenModal} // Voeg de functie door naar PouleCard
          />
        ))}
      </ul>

      {/* Team selection modal */}
      <TeamSelectionModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        strengthId={selectedTournament.strengthId}
        tournamentId={selectedTournament.id}
        onAddTeam={handleAddTeamToPoule} // Voer de functie uit voor toevoegen van een team
      />
    </div>
  );
}
