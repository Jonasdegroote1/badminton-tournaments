import React, { useState } from "react";
import "../../styles/components/MatchCard.css";
import ScoreForm from "@/components/matches/ScoreForm";
import useSWR, { mutate } from "swr";

// Fetcher voor SWR
const fetcher = (url) => fetch(url).then((res) => res.json());

const MatchCard = ({ match, index, pouleId }) => {
  const [isFormVisible, setFormVisible] = useState(false);
  const [setResults, setSetResults] = useState(match.setResults || []);

  // Functie om de teamnaam te formatteren
  const formatTeam = (team) => {
    const { player1, player2 } = team;
    return `${player1.firstName} ${player1.lastName} & ${player2.firstName} ${player2.lastName}`;
  };

  // Functie om een set te verwijderen
  const handleDeleteSet = async (setId) => {
    if (!window.confirm("Weet je zeker dat je deze set wilt verwijderen?")) return;

    try {
      const response = await fetch("/api/set-results", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id: setId }),
      });

      if (response.ok) {
        setSetResults((prevResults) => prevResults.filter((set) => set.id !== setId));
        // Herlaad de matches na verwijderen van de set
        mutate(`/api/matches?pouleId=${pouleId}`);
      } else {
        let errorMessage = "Verwijderen mislukt.";
        if (response.headers.get("Content-Type")?.includes("application/json")) {
          const data = await response.json();
          errorMessage = data.error || errorMessage;
        }
        alert(errorMessage);
      }
    } catch (error) {
      console.error("Fout bij verwijderen:", error);
      alert("Er ging iets mis bij het verwijderen.");
    }
  };

  // Functie wanneer een nieuwe set wordt toegevoegd
  const handleSetAdded = (newSets) => {
    if (!Array.isArray(newSets)) return;
    setSetResults((prev) => [...prev, ...newSets]);
    setFormVisible(false);

    // Na toevoegen van de set, herlaad de matches
    mutate(`/api/matches?pouleId=${pouleId}`);
  };

  return (
    <div className="match-card">
      <div className="match-info">
        <h3>Match {index + 1}</h3>
        <p>Status: {match.status}</p>
        <p>Court: {match.courtId ?? "N/A"}</p>
      </div>

      <div className="teams">
        {match.teams.length === 2 ? (
          <>
            <p>{formatTeam(match.teams[0].team)}</p>
            <p>🆚</p>
            <p>{formatTeam(match.teams[1].team)}</p>
          </>
        ) : (
          <p>Teams nog niet beschikbaar</p>
        )}
      </div>

      {setResults.length > 0 ? (
        <div className="set-results">
          <h4>Set scores:</h4>
          <div className="set-cards">
            {setResults.map((set) => (
              <div key={set.id} id={set.id} className="set-card">
                <p>
                  Set {set.setNumber}: {set.team1Score} - {set.team2Score}
                </p>
                <button
                  className="delete-set-btn"
                  onClick={() => handleDeleteSet(set.id)}
                >
                  ❌ Verwijder
                </button>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <>
          <button
            className="add-set-btn"
            onClick={() => setFormVisible((prev) => !prev)}
          >
            {isFormVisible ? "Annuleer" : "Set scores toevoegen"}
          </button>

          {isFormVisible && (
            <ScoreForm matchId={match.id} onSetAdded={handleSetAdded} />
          )}
        </>
      )}
    </div>
  );
};

export default MatchCard;
