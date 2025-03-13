// components/PouleCard.js
"use client";

import { useState } from "react";
import TeamItem from "./TeamItem";
import TeamSelectionModal from "./TeamSelectionModal"; // Importeer de modal
import "../../styles/components/pouleCard.css";

export default function PouleCard({ data, onDelete, onEdit, onRemoveTeam, handleAddTeam }) {
  const [isModalOpen, setIsModalOpen] = useState(false); // Staat voor het openen/sluiten van de modal

  const handleDelete = () => {
    onDelete(data.id);  // Verwijder de poule via de onDelete-functie
  };

  const handleAddTeamClick = () => {
    setIsModalOpen(true); // Open de modal
  };

  const handleCloseModal = () => {
    setIsModalOpen(false); // Sluit de modal
  };

  const handleTeamAdd = (teamId) => {
    handleAddTeam(data.id, data.strengthId); // Voeg het team toe aan de poule
  };

  return (
    <li key={data.id} className="poule-item">
      <div className="poule-item-header">
        <div className="poule-title">
          <span className="poule-name">{data.name}</span>
          <span className="poule-strength">{data.strength?.name || "Onbekend"}</span>
        </div>
        <div className="poule-item-actions">
          <button className="edit-btn" onClick={() => onEdit(data.id)}>Bewerken</button>
          <button className="delete-btn" onClick={handleDelete}>Verwijderen</button>
        </div>
      </div>
      <TeamItem data={data.teams || []} onRemove={(teamId) => onRemoveTeam(teamId, data.id)} />
      <button className="add-team-btn" onClick={handleAddTeamClick}>Voeg team toe</button>

      <TeamSelectionModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        strengthId={data.strengthId}
        tournamentId={data.tournamentId}
        onAddTeam={handleTeamAdd}
      />
    </li>
  );
}
