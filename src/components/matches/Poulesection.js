import React, { useEffect, useState, useRef } from "react";
import MatchCard from "./MatchCard";
import "../../styles/components/PouleSection.css";

const PouleSection = ({ poule }) => {
  const [matches, setMatches] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const contentRef = useRef(null);

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

      await fetchMatches();
    } catch (error) {
      console.error("Error generating matches:", error);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchMatches();
    }
  }, [poule.id, isOpen]);

  const toggleOpen = () => {
    setIsOpen((prev) => !prev);
  };

  return (
    <div className="poule-section">
      <div className="poule-header" onClick={toggleOpen}>
        <h2 className="poule-title">{poule.name}</h2>
        <h3>{poule.strength.name}</h3>
        <button className={`toggle-button ${isOpen ? "open" : ""}`}>
          {isOpen ? "▲ Close" : "▼ Open"}
        </button>
      </div>

      <div
        className={`poule-content ${isOpen ? "open" : "closed"}`}
        ref={contentRef}
        style={{
          maxHeight: isOpen ? `${contentRef.current?.scrollHeight}px` : "0px",
        }}
      >
        <button className="create-match-button" onClick={handleGenerateMatches}>
          + create matches
        </button>
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
    </div>
  );
};

export default PouleSection;
