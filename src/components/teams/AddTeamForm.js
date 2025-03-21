"use client";

import { useState, useEffect } from 'react';
import "../../styles/components/addTeamForm.css";

export default function AddTeamForm({ tournamentId, onClose }) {
  const [players, setPlayers] = useState([]);
  const [strengths, setStrengths] = useState([]);
  const [player1, setPlayer1] = useState(null);
  const [player2, setPlayer2] = useState(null);
  const [strengthId, setStrengthId] = useState(null);
  const [error, setError] = useState('');
  const [usedPlayerIds, setUsedPlayerIds] = useState([]); // Gebruikte speler-ID's bijhouden

  // Haal spelers op
  useEffect(() => {
    fetch('/api/players?tournamentId=' + tournamentId)  // Het toernooi-ID meegeven aan de API-aanroep
      .then((res) => res.json())
      .then((data) => {
        setPlayers(data);

        // Haal een lijst van gebruikte speler-ID's op (alle spelers die al aan een team gekoppeld zijn)
        const usedIds = data.filter(player => player.teamId !== null).map(player => player.id);
        setUsedPlayerIds(usedIds);
      })
      .catch((error) => console.error("Fout bij ophalen spelers:", error));
  }, [tournamentId]);

  // Haal sterktes op
  useEffect(() => {
    fetch('/api/strength')
      .then((res) => res.json())
      .then((data) => setStrengths(data))
      .catch((error) => console.error("Fout bij ophalen sterktes:", error));
  }, []);

  const handleAddTeam = () => {
    if (!player1 || !player2 || !strengthId) {
      setError('Alle velden moeten ingevuld zijn');
      return;
    }

    // Cast de velden naar nummer (number) type
    const teamData = {
      player1Id: Number(player1),
      player2Id: Number(player2),
      strengthId: Number(strengthId),
      tournamentId: Number(tournamentId),
    };

    console.log('Verzonden data:', teamData);

    fetch('/api/team', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(teamData),
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error('Fout bij serveraanroep: ' + res.statusText);
        }
        return res.json();
      })
      .then((data) => {
        alert('Team succesvol toegevoegd');
        onClose();
      })
      .catch((err) => {
        console.error("Fout bij toevoegen team:", err);
        alert('Fout bij het toevoegen van het team');
      });
  };

  // Filter spelers die al aan een team zijn gekoppeld
  const availablePlayers = players.filter(player => !usedPlayerIds.includes(player.id));

  return (
    <div>
      <h3>Voeg team toe</h3>

      {error && <p style={{ color: 'red' }}>{error}</p>}

      <div>
        <label>Speler 1:</label>
        <select value={player1} onChange={(e) => setPlayer1(e.target.value)}>
          <option value={null}>Kies Speler 1</option>
          {availablePlayers.map((player) => (
            <option key={player.id} value={player.id}>
              {player.firstName} {player.lastName}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label>Speler 2:</label>
        <select value={player2} onChange={(e) => setPlayer2(e.target.value)}>
          <option value={null}>Kies Speler 2</option>
          {availablePlayers.map((player) => (
            <option key={player.id} value={player.id}>
              {player.firstName} {player.lastName}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label>Sterkte:</label>
        <select value={strengthId} onChange={(e) => setStrengthId(e.target.value)}>
          <option value={null}>Kies Sterkte</option>
          {strengths.map((strength) => (
            <option key={strength.id} value={strength.id}>
              {strength.name}
            </option>
          ))}
        </select>
      </div>

      <button className="add-team-button" onClick={handleAddTeam}>Voeg Team Toe</button>

      <button className="close-button" onClick={onClose}>Sluit Formulier</button>
    </div>
  );
}
