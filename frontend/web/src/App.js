import { useEffect, useState, useCallback } from "react";
import RouteMap from "./components/RouteMap";
import StatsBar from "./components/StatBar";
import "./App.css";
import LoadingScreen from "./components/LoadingScreen";
import { computeStats } from "./utils/stats";

function App() {
  const API = process.env.REACT_APP_API_BASE; // if using env
  // const API = "http://localhost:8000"; // uncomment if not using env file

  const [trip, setTrip] = useState(null);
  const [editingPoints, setEditingPoints] = useState([]);
  const [loading, setLoading] = useState(true);

  const [routes, setRoutes] = useState([]);
  const [stats, setStats] = useState(null);

  const [toast, setToast] = useState(null);

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [playback, setPlayback] = useState({
    mode: false,     // are we in playback mode
    playing: false,  // is animation running
    speed: 1,        // 1,2,5,10,100,...
    direction: 1     // 1 forward, -1 reverse
  });

  // PLAYBACK CONTROLS ----------------------------
  function enterPlaybackMode() {
    setPlayback({
      mode: true,
      playing: true,
      speed: 1,
      direction: 1
    });
  }

  function exitPlaybackMode() {
    // full reset out of playback mode
    setPlayback({
      mode: false,
      playing: false,
      speed: 1,
      direction: 1
    });
  }

  function togglePlayPause() {
    setPlayback(p => ({
      ...p,
      playing: !p.playing
    }));
  }

  function stopPlayback() {
    // hard stop: also exits playback mode so RouteMap clears trail + marker
    setPlayback({
      mode: false,
      playing: false,
      speed: 1,
      direction: 1
    });
  }

  function resetToStart() {
    // let RouteMap handle actual index reset; this just ensures we're playing forward
    setPlayback(p => ({
      ...p,
      direction: 1,
      playing: true
    }));
  }

  function setPlaybackSpeed(newSpeed) {
    setPlayback(p => ({
      ...p,
      speed: newSpeed
    }));
  }
function reverse() {
  setPlayback(p => {
    const speeds = [-2, -5, -10, -100, -1000];

    // Already reversing → cycle speeds
    if (p.speed < 0) {
      const currentIndex = speeds.indexOf(p.speed);
      const nextSpeed = speeds[(currentIndex + 1) % speeds.length];
      return {
        ...p,
        speed: nextSpeed,
        playing: true
      };
    }

    // Was going forward → reset to -2x
    return {
      ...p,
      speed: -2,
      playing: true
    };
  });
}
function fastForward() {
  setPlayback(p => {
    const speeds = [2, 5, 10, 100, 1000];

    // Already forward → cycle speeds
    if (p.speed > 0) {
      const currentIndex = speeds.indexOf(p.speed);
      const nextSpeed = speeds[(currentIndex + 1) % speeds.length];
      return {
        ...p,
        speed: nextSpeed,
        playing: true
      };
    }

    // Was reversing → reset to forward 2x
    return {
      ...p,
      speed: 2,
      playing: true
    };
  });
}

  // AUTH / TOAST ----------------------------
  function handleLoginStatusChange(status) {
    setIsLoggedIn(status);
  }

  function showToast(msg) {
    console.log("TOAST:", msg);
    setToast(msg);
    setTimeout(() => setToast(null), 5000);
  }

  // LOAD TRIP DATA (stops.json via api-route.php) ----
  useEffect(() => {
    fetch(`${API}/api-route.php`)
      .then(res => res.json())
      .then(data => {
        setTrip(data);
        setEditingPoints(JSON.parse(JSON.stringify(data.points)));
        setLoading(false);
      })
      .catch(err => {
        console.error("Failed to load trip:", err);
        setLoading(false);
      });
  }, [API]);

  // LOAD maintananceCost -----------------------------
  useEffect(() => {
    fetch(`${API}/getStats.php`)
      .then(res => res.json())
      .then(data => {
        setStats(prev => ({
          ...(prev || {}),
          maintananceCost: data.maintananceCost
        }));
      })
      .catch(err => console.error(err));
  }, [API]);

  // LOAD ROUTES FROM BACKEND -------------------------
  useEffect(() => {
    if (!trip) return;

    fetch(`${API}/get-routes.php`)
      .then(res => res.json())
      .then(data => {
        setRoutes(data);
      })
      .catch(err => console.error("Failed to load routes:", err));
  }, [API, trip]);

  // COMPUTE STATS once routes are built --------------
  useEffect(() => {
    if (!trip) return;
    if (routes.length === 0) return;

    const baseStats = computeStats(routes, trip.points);

    setStats(prev => ({
      ...(prev || {}),
      ...baseStats,
      // preserve maintananceCost from previous fetch
      maintananceCost: prev?.maintananceCost
    }));
  }, [routes, trip]);

  // STOP EDIT CALLBACKS ------------------------------
  const handleStopChange = useCallback((index, updatedStop) => {
    setEditingPoints(prev => {
      const updated = [...prev];
      updated[index] = updatedStop;
      return updated;
    });
  }, []);

  const handleStopDelete = useCallback(index => {
    setEditingPoints(prev => prev.filter((_, i) => i !== index));
  }, []);

  const handleAddStop = useCallback((insertIndex, newStop) => {
    setEditingPoints(prev => {
      const updated = [...prev];
      updated.splice(insertIndex + 1, 0, newStop);
      return updated;
    });
  }, []);

  // SAVE CHANGES -------------------------------------
  const handleSave = async () => {
    try {
      const res = await fetch(`${API}/update-stops.php`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ stops: editingPoints })
      });

      if (!res.ok) {
        showToast("Save failed");
        return false;
      }

      const newTrip = await fetch(`${API}/api-route.php`).then(r => r.json());
      setTrip(newTrip);
      setEditingPoints(JSON.parse(JSON.stringify(newTrip.points)));

      showToast("Changes saved!");
      return true;
    } catch (err) {
      console.error("Save error:", err);
      showToast("Error saving changes");
      return false;
    }
  };

  // DISCARD CHANGES ----------------------------------
  const handleDiscard = () => {
    if (!trip) return;
    setEditingPoints(JSON.parse(JSON.stringify(trip.points)));
    showToast("Changes discarded");
  };

  // LOADING STATES -----------------------------------
  if (loading) return <LoadingScreen />;
  if (!trip) return <div>Error loading trip.</div>;

  // MAIN UI ------------------------------------------
  return (
    <>
      <div className="app-wrapper">
        <StatsBar
          {...stats}
          onLoginStatusChange={handleLoginStatusChange}
          onSave={handleSave}
          onDiscard={handleDiscard}
          showToast={showToast}
          /* Playback props */
          playback={playback}
          enterPlaybackMode={enterPlaybackMode}
          exitPlaybackMode={exitPlaybackMode}
          togglePlayPause={togglePlayPause}
          stopPlayback={stopPlayback}
          reverse={reverse}
          resetToStart={resetToStart}
          setPlaybackSpeed={setPlaybackSpeed}
          fastForward={fastForward}
        />

        <RouteMap
          points={editingPoints}
          routes={routes}
          loggedIn={isLoggedIn}
          onChange={handleStopChange}
          onDelete={handleStopDelete}
          onAddStop={handleAddStop}
          /* Playback props */
          playback={playback}
          setPlayback={setPlayback}
        />
      </div>

      {toast && <div className="global-toast">{toast}</div>}
    </>
  );
}

export default App;
