import React from "react";
import "@/styles/components/loadingShuttlecock.css"; // Zorg ervoor dat het CSS-bestand goed is gekoppeld!

export default function LoadingShuttlecock() {
  return (
    <div className="loading-shuttlecock">
      <div className="shuttlecock-body">
        <div className="shuttlecock-feathers"></div>
      </div>
    </div>
  );
}
