"use client";
import "../../styles/components/pouleCard.css";
import TeamItem from "./TeamItem";

export default function PouleCard({ data, onDelete, onEdit, onRemoveTeam }) {
  const handleDelete = () => {
       onDelete(data.id);  // Verwijder de poule via de onDelete-functie
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
    </li>
  );
}
