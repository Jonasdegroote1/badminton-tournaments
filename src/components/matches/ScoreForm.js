import React, { useState } from "react";
import "../../styles/components/ScoreForm.css";

const ScoreForm = ({ matchId, onSetAdded }) => {
  const [setScores, setSetScores] = useState([
    { team1Score: "", team2Score: "" },
    { team1Score: "", team2Score: "" },
    { team1Score: "", team2Score: "" },
  ]);

  const handleChange = (index, team, value) => {
    const newScores = [...setScores];
    newScores[index][team] = value;
    setSetScores(newScores);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const validSets = setScores.filter(
      (set) => set.team1Score !== "" && set.team2Score !== ""
    );

    if (validSets.length < 2 || validSets.length > 3) {
      alert("Er moeten tussen de 2 en 3 sets ingevuld worden.");
      return;
    }

    const invalidScores = validSets.some(
      (r) => r.team1Score < 0 || r.team2Score < 0
    );
    if (invalidScores) {
      alert("Scores mogen niet negatief zijn.");
      return;
    }

    try {
      const response = await fetch("/api/set-results", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(
          validSets.map((set, index) => ({
            matchId,
            setNumber: index + 1,
            team1Score: parseInt(set.team1Score, 10),
            team2Score: parseInt(set.team2Score, 10),
          }))
        ),
      });

      if (!response.ok) {
        throw new Error("Score kon niet opgeslagen worden");
      }

      const data = await response.json();
      console.log("Score opgeslagen:", data);
      alert("Score succesvol opgeslagen!");

      if (onSetAdded) {
        onSetAdded(data);
      }

      setSetScores([
        { team1Score: "", team2Score: "" },
        { team1Score: "", team2Score: "" },
        { team1Score: "", team2Score: "" },
      ]);
    } catch (error) {
      console.error("Fout bij versturen:", error);
      alert("Er ging iets mis bij het opslaan van de score.");
    }
  };

  return (
    <form className="score-form" onSubmit={handleSubmit}>
      <h4>Voer set scores in:</h4>
      {setScores.map((set, i) => (
        <div key={i} className="set-score">
          <label>Set {i + 1}:</label>
          <input
            type="number"
            min="0"
            placeholder="Team 1"
            value={set.team1Score}
            onChange={(e) => handleChange(i, "team1Score", e.target.value)}
          />
          <span>-</span>
          <input
            type="number"
            min="0"
            placeholder="Team 2"
            value={set.team2Score}
            onChange={(e) => handleChange(i, "team2Score", e.target.value)}
          />
        </div>
      ))}
      <button type="submit" className="btn btn-primary">
        Score opslaan
      </button>
    </form>
  );
};

export default ScoreForm;
