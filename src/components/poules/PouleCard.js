"use client";  // Zorg ervoor dat deze file als clientcomponent wordt behandeld

import { useState } from "react";
import TeamItem from "./TeamItem"; // Importeer TeamItem van zijn bestand
import "../../styles/components/pouleCard.css";

export default function PouleCard({ data, onDelete, onEdit }) {
  const handleDelete = () => {
    if (window.confirm(`Weet je zeker dat je ${data.name} wilt verwijderen?`)) {
      onDelete(data.id);  // Verwijder de poule via de onDelete-functie
    }
  };

  const handleEdit = () => {
    onEdit(data.id);  // Bewerk de poule via de onEdit-functie
  };

  return (
    <li key={data.id} className="poule-item">
      <div className="poule-item-header">
        <span>{data.name}</span>
        <div className="poule-item-actions">
          <button className="edit-btn" onClick={handleEdit}>Bewerken</button>
          <button className="delete-btn" onClick={handleDelete}>Verwijderen</button>
        </div>
      </div>
      <TeamItem data={data.teams || []} />  {/* Zorg ervoor dat teams een lege array heeft als data nog niet beschikbaar is */}
    </li>
  );
}
