"use client";

import { useState } from "react";
import TeamItem from "./TeamItem";
import TeamSelectionModal from "./TeamSelectionModal"; 
import "../../styles/components/pouleCard.css";

export default function PouleCard({ data, onDelete, onRemoveTeam, handleAddTeamToPoule }) {
  const [isModalOpen, setIsModalOpen] = useState(false); 

  const handleDelete = () => {
    onDelete(data.id); 
  };

  const handleAddTeamClick = () => {
    setIsModalOpen(true); 
  };

  const handleCloseModal = () => {
    setIsModalOpen(false); 
  };

  const handleTeamAdd = (teamId) => {
    handleAddTeamToPoule(teamId, data.id); // Call the function with both teamId and pouleId
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
        pouleId={data.id}
        strengthId={data.strengthId}
        tournamentId={data.tournamentId}
        onAddTeam={handleTeamAdd} 
      />
    </li>
  );
}
