import React from "react";
import "@/styles/components/loadingShuttlecock.css";

export default function LoadingShuttlecock() {
  return (
    <div className="shuttlecock-loader">
      <div className="shuttlecock">
        <div className="feather feather1"></div>
        <div className="feather feather2"></div>
        <div className="feather feather3"></div>
        <div className="feather feather4"></div>
        <div className="head"></div>
      </div>
    </div>
  );
}
