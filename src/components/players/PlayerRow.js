export default function PlayerRow({ player, tournamentId }) {
  const teamDelete = () => {
    if (confirm(`Weet je zeker dat je ${player.firstName} ${player.lastName} uit dit toernooi wilt verwijderen?`)) {
      fetch(`/api/player-tournament?playerId=${player.id}&tournamentId=${tournamentId}`, {
        method: 'DELETE',
      })
        .then((res) => {
          if (!res.ok) throw new Error("Verwijderen mislukt");
          alert("Speler succesvol uit toernooi verwijderd");
          window.location.reload(); // Of trigger je eigen state update
        })
        .catch((err) => {
          console.error("Fout bij verwijderen speler:", err);
          alert("Fout bij het verwijderen van de speler uit het toernooi.");
        });
    }
  };

  return (
    <div className="player-row">
      <p>{player.firstName} {player.lastName}</p>
      <p>{player.club?.name || "-"}</p>
      <p>{player.mail}</p>
      <p>{player.phone}</p>
      <div className="player-row-actions">
        <button className="btn btn-small">edit</button>
        <button className="btn btn-small btn-delete" onClick={teamDelete}>delete</button>
      </div>
    </div>
  );
}
