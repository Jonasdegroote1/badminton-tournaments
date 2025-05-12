import React, { useState, useEffect, useRef } from "react";
import useSWR, { mutate } from "swr";
import MatchCard from "./MatchCard";
import "../../styles/components/PouleSection.css";

// Fetcher voor SWR
const fetcher = (url) => fetch(url).then((res) => res.json());

const PouleSection = ({ poule }) => {
  const [isOpen, setIsOpen] = useState(false);
  const contentRef = useRef(null);

  // Haal de matches op via SWR, maar alleen als de poule geopend is
  const { data: matches = [], error, isLoading } = useSWR(
    isOpen && poule ? `/api/matches?pouleId=${poule.id}` : null, // Haal matches alleen op als de poule geopend is
    fetcher,
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
      revalidateIfStale: false,
      refreshInterval: 0,
    }
  );

  // Functie om matches te genereren
  const handleGenerateMatches = async () => {
    try {
      const res = await fetch("/api/generate-matches", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pouleId: poule.id }),
      });
      if (!res.ok) throw new Error("Failed to generate matches");
      // Herlaad de matches direct na genereren
      mutate(`/api/matches?pouleId=${poule.id}`);
    } catch (err) {
      console.error("Error generating matches:", err);
    }
  };

  // Functie om de poule in- of uit te klappen
  const toggleOpen = () => {
    setIsOpen((prevState) => !prevState);
  };

  // Sorteer de matches op basis van of ze gespeeld zijn of niet
  const sortMatches = (matches) => {
    return [...matches].sort((a, b) => {
      const aHasSets = a.setResults && a.setResults.length > 0;
      const bHasSets = b.setResults && b.setResults.length > 0;

      // Te spelen matches bovenaan (zonder sets), gespeelde onderaan (met sets)
      if (aHasSets && !bHasSets) return 1; // a is gespeeld, b niet, dus a komt onder b
      if (!aHasSets && bHasSets) return -1; // a is niet gespeeld, b wel, dus a komt boven b
      return 0; // Als beide hetzelfde zijn, blijf dan de volgorde behouden
    });
  };

  // Gebruik useEffect om de matches te sorteren zodra ze zijn opgehaald of geüpdatet
  useEffect(() => {
    if (matches.length > 0) {
      const sortedMatches = sortMatches(matches);
      mutate(`/api/matches?pouleId=${poule.id}`, sortedMatches, false); // Werk de matches bij in SWR zonder opnieuw te fetchen
    }
  }, [matches, poule.id]);

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
        ref={contentRef}
        className={`poule-content ${isOpen ? "open" : "closed"}`}
      >
        {/* Knop voor het genereren van matches */}
        <button className="create-match-button" onClick={handleGenerateMatches}>
          + create matches
        </button>

        <div className="matches-list">
          {isLoading ? (
            <p>Loading...</p>
          ) : matches.length > 0 ? (
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
