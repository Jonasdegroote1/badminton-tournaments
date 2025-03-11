"use client";  // Zorg ervoor dat de code in de browser wordt uitgevoerd
import { useState, useEffect } from "react";
import PouleCard from "./PouleCard";
import "../../styles/components/pouleManagement.css";

export default function PouleManagement() {
  const [poules, setPoules] = useState([]);

  useEffect(() => {
    fetch("/api/poules")
      .then((res) => res.json())
      .then((data) => {
        console.log(data);  // Dit logt de opgehaalde data
        setPoules(data);
      })
      .catch((error) => {
        console.error("Fout bij het ophalen van de poules:", error);
      });
  }, []);

  const handleDelete = (id) => {
    if (window.confirm(`Weet je zeker dat je deze poule wilt verwijderen?`)) {
      fetch(`/api/poules`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id }),  // Verstuur de id als JSON
      })
        .then((res) => res.json())
        .then(() => {
          // Verwijder de poule uit de UI
          setPoules((prevPoules) => prevPoules.filter((poule) => poule.id !== id));
        })
        .catch((error) => {
          console.error("Fout bij het verwijderen van poule:", error);
        });
    }
  };

  const handleEdit = (id) => {
    // Dit kan bijvoorbeeld een navigatie zijn naar een bewerkingspagina of een modaal openen
    console.log("Bewerk poule met id:", id);
  };

  return (
    <div className="poule-management">
      <ul className="poule-list">
        {poules.map((poule) => (
          <PouleCard
            key={poule.id}
            data={poule}
            onDelete={handleDelete}
            onEdit={handleEdit}
          />
        ))}
      </ul>
    </div>
  );
}
