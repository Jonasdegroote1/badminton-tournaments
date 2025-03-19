export default function PlayerRow({ player }) {
  return (
    <div className="player-row">
      <p>{player.firstName} {player.lastName}</p>
      <p>{player.club.name}</p>
      <p>{player.mail}</p>
      <p>{player.phone}</p>
      <div className="player-row-actions">
        <button className="btn btn-small">edit</button>
        <button className="btn btn-small btn-delete">delete</button>
      </div>
    </div>
  );
}