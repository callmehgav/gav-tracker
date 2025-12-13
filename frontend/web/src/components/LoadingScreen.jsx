import React from "react";
import "../styles/LoadingScreen.css";
import logo from "../assets/logos/logoNoWords.png";

export default function LoadingScreen() {
  return (
    <div className="loading-wrapper">
      <img src={logo} alt="Gav's Nexus Logo" className="loading-logo" />

      <div className="loading-text">Loading Gav's route...</div>

      <div className="spinner"></div>
    </div>
  );
}
