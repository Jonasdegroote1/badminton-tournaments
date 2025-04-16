import React, { useState } from "react";
import "../../styles/components/MatchCard.css";
import ScoreForm from "@/components/matches/ScoreForm";

const MatchCard = ({ match, index }) => {
  const [isFormVisible, setFormVisible] = useState(false);

  const formatTeam = (team) => {
    const { player1, player2 } = team;
    return `${player1.firstName} ${player1.lastName} & ${player2.firstName} ${player2.lastName}`;
  };

  const handleDeleteSet = async (setId) => {
    if (!window.confirm("Weet je zeker dat je deze set wilt verwijderen?")) return;

    try {
      const response = await fetch("/api/setResult", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id: setId }),
      });

      if (response.ok) {
        // Simpelste manier om te herladen
        location.reload();
      } else {
        const data = await response.json();
        alert("Verwijderen mislukt: " + data.error);
      }
    } catch (error) {
      console.error("Fout bij verwijderen:", error);
      alert("Er ging iets mis bij het verwijderen.");
    }
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

      {match.setResults?.length > 0 && (
        <div className="set-results">
          <h4>Set scores:</h4>
          <div className="set-cards">
            {match.setResults.map((set, idx) => (
              <div key={idx} className="set-card">
                <p>
                  Set {set.setNumber}: {set.team1Score} - {set.team2Score}
                </p>
                <button
                  className="delete-set-btn"
                  onClick={() => handleDeleteSet(set.id)}
                >
                  ❌
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {match.setResults?.length === 0 && (
        <>
          <button
            className="add-set-btn"
            onClick={() => setFormVisible((prev) => !prev)}
          >
            {isFormVisible ? "Annuleer" : "Set scores toevoegen"}
          </button>

          {isFormVisible && <ScoreForm matchId={match.id} />}
        </>
      )}
    </div>
  );
};

export default MatchCard;
