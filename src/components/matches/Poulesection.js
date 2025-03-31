import React, { useEffect, useState } from "react";
import MatchCard from "./MatchCard";
import "../../styles/components/PouleSection.css"; // Zorg ervoor dat de CSS-bestand ook correct is aangepast

const PouleSection = ({ poule }) => {
  const [matches, setMatches] = useState([]);

  const fetchMatches = async () => {
  try {
    const response = await fetch(`/api/matches?pouleId=${poule.id}`);
    if (!response.ok) {
      throw new Error("Failed to fetch matches");
    }
    const data = await response.json();
    setMatches(data); // ✅ Zet opgehaalde matches in de state
  } catch (error) {
    console.error("Error fetching matches:", error);
  }
};


  const handleGenerateMatches = async () => {
    try {
      const response = await fetch("/api/generate-matches", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ pouleId: poule.id }),
      });

      if (!response.ok) {
        throw new Error("Failed to generate matches");
      }

      await fetchMatches(); // ✅ Na genereren direct opnieuw ophalen

    } catch (error) {
      console.error("Error generating matches:", error);
    }
  };


  useEffect(() => {
    const fetchMatches = async () => {
      try {
        const response = await fetch(`/api/matches?pouleId=${poule.id}`);
        if (!response.ok) {
          throw new Error("Failed to fetch matches");
        }
        const data = await response.json();
        setMatches(data);
      } catch (error) {
        console.error("Error fetching matches:", error);
      }
    };

    fetchMatches();
  }, [poule.id]);

  console.log("Poule:", poule);

  return (
    <div className="poule-section">
      <h2 className="poule-title">{poule.name}</h2>
      <button className="create-match-button" onClick={handleGenerateMatches}>+ create matches</button>
      <div className="matches-list">
        {matches.length > 0 ? (
          matches.map((match, index) => (
            <MatchCard key={match.id} match={match} index={index} />
          ))
        ) : (
          <p>No matches generated yet.</p>
        )}
      </div>
    </div>
  );
};

export default PouleSection;
