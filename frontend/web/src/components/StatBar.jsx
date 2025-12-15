import { useState,useRef, useEffect } from "react";
import "../styles/StatBar.css";
import logo from "../assets/logos/logoNoWords.png";
import { Play, Pause, Rewind, FastForward, Square } from "lucide-react";
import { X, Menu } from "lucide-react";

export default function StatsBar({
  totalMiles,
  milesDone,
  milesLeft,
  dieselCostTotal,
  dieselCostSpent,
  maintananceCost,
  parksVisited,
  snowVisited,
  daysSinceStart,
  onLoginStatusChange,
  onSave,           
  onDiscard,
  showToast,
  playback,
  enterPlaybackMode,
  exitPlaybackMode,
  togglePlayPause,
  reverse,
  resetToStart,
  setPlaybackSpeed,
  fastForward
         
}) {
const API =
  process.env.REACT_APP_API_BASE ||
  (process.env.NODE_ENV === "development"
    ? "http://localhost:8000"
    : "https://tracker.gavs-nexus.com");

  const [loggedIn, setLoggedIn] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [editMaint, setEditMaint] = useState(maintananceCost??"");

const barRef = useRef(null);

useEffect(() => {
  function handleOutside(e) {
    if (barRef.current && !barRef.current.contains(e.target)) {
      if (expanded) setExpanded(false); // collapse
    }
  }

  document.addEventListener("mousedown", handleOutside);
  return () => document.removeEventListener("mousedown", handleOutside);
}, [expanded]);


  // LOGIN HANDLER
  const handleLogin = async () => {
    try {
      const res = await fetch(`${API}/login.php`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ username, password })
      });

      if (res.ok) {
        setLoggedIn(true);
        onLoginStatusChange(true);
        setShowLoginModal(false);
        setUsername("");
        setPassword("");
      } else {
        showToast("Invalid credentials");
      }
    } catch (err) {
      console.error("Login error:", err);
      showToast("Login failed");
    }
  };

  // LOGOUT HANDLER
  const handleLogout = async () => {
    await fetch(`${API}/logout.php`, {
      method: "POST",
      credentials: "include"
    });

    setLoggedIn(false);
    onLoginStatusChange(false);
  };
return (
  <>
    <div className="statsbar-wrapper"ref={barRef}>

      {/* IF PLAYBACK MODE, REPLACE UI ENTIRELY */}
      {playback.mode ? (
        
        <div className="playback-controls">
        <button className="pb-btn" onClick={reverse}>
          <Rewind size={22} />
        </button>

        <button className="pb-btn" onClick={togglePlayPause}>
          {playback.playing ? <Pause size={22} /> : <Play size={22} />}
        </button>

        <button className="pb-btn" onClick={fastForward}>
          <FastForward size={22} />
        </button>

        <span className="pb-speed-indicator">{playback.speed}x</span>

        <button className="pb-btn stop-btn" onClick={exitPlaybackMode}>
          <Square size={22} />
        </button>

        </div>

      ) : (
      /* NORMAL MODE BELOW (unchanged except wrapped in this conditional) */
      <>
        <div className="statsbar-header">

          {/* LEFT SIDE — Logo + Arrow */}
          <div 
            className="statsbar-left"
            onClick={() => setExpanded(!expanded)}
            style={{ cursor: "pointer" }}
          >
            <a 
              href="https://gavs-nexus.com" 
              target="_blank" 
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
            >
              <img src={logo} alt="Logo" className="statsbar-logo" />
            </a>
        <div
          className={`statsbar-arrow ${expanded ? "arrow-left" : "arrow-right"}`}
        >
          {expanded ? <X size={22} color="#fff" /> : <Menu size={22} color="#fff" />}
        </div>

        </div>
          {/* RIGHT SIDE — Save / Discard */}
          {loggedIn && (
            <div className="statsbar-right-buttons">
              <button 
                className="save-btn" 
                onClick={async (e) => {
                  e.stopPropagation();

                  const res = await fetch(`${API}/saveMaintCost.php`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ maintananceCost: Number(editMaint) })
                  });
                  
                  if (!res.ok) {
                    showToast("Error saving Maintenance Cost");
                    return;
                  }

                  const ok = await onSave();
                  showToast(ok ? "Saved" : "Save Failed");
                }}
              >
                ✔
              </button>

              <button 
                className="discard-btn" 
                onClick={(e) => {
                  e.stopPropagation();
                  setEditMaint(maintananceCost);
                  onDiscard();
                }}
              >
                ✖
              </button>
            </div>
          )}


        </div>

        {/* EXPANDED CONTENT */}
        {expanded && (
          <div className="statsbar-content">

            {/* GROUP 1 */}
            <div className="stats-group">
              <div className="stat-row"><strong>Total Miles:</strong> {Math.round(totalMiles)}</div>
              <div className="stat-row"><strong>Completed Miles:</strong> {Math.round(milesDone)}</div>
              <div className="stat-row"><strong>Remaining Miles:</strong> {Math.round(milesLeft)}</div>
            </div>

            {/* GROUP 2 */}
            <div className="stats-group">
              <div className="stat-row"><strong>Diesel Expected:</strong> ${dieselCostTotal}</div>
              <div className="stat-row"><strong>Diesel Spent:</strong> ${dieselCostSpent}</div>
              <div className="stat-row">
                <strong>Maintanance:</strong>

                {!loggedIn ? (
                  <span style={{ marginLeft: "6px" }}>${maintananceCost}</span>
                ) : (
                  <input
                    type="number"
                    value={editMaint}
                    placeholder={maintananceCost}
                    onChange={(e) => setEditMaint(e.target.value)}
                    style={{
                      marginLeft: "6px",
                      width: "90px",
                      padding: "3px 6px",
                      borderRadius: "4px",
                    }}
                  />
                )}
              </div>
            </div>

            {/* GROUP 3 */}
            <div className="stats-group">
              <div className="stat-row"><strong>Parks Hit:</strong> {parksVisited}</div>
              <div className="stat-row"><strong>Snow Resorts:</strong> {snowVisited}</div>
              <div className="stat-row"><strong>Days Since Start:</strong> {daysSinceStart}</div>
            </div>

            {/* AUTH BUTTON */}
            <div className="auth-section">
              {!loggedIn ? (
                <button className="login-btn" onClick={() => setShowLoginModal(true)}>
                  Login
                </button>
              ) : (
                <button className="logout-btn" onClick={handleLogout}>
                  Logout
                </button>
              )}
                <button
            className="playback-start-btn"
            onClick={(e) => {
              e.stopPropagation();
              enterPlaybackMode();
            }}
          >
            Playback Mode
          </button>

            </div>

          </div>
        )}
      </>
      )}
      
    </div>

    {/* LOGIN MODAL */}
    {showLoginModal && (
      <div className="login-modal-backdrop">
        <div className="login-modal">
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <div className="login-buttons">
            <button onClick={handleLogin}>Submit</button>
            <button onClick={() => setShowLoginModal(false)}>Cancel</button>
          </div>
        </div>
      </div>
    )}
    
  </>
);


}
