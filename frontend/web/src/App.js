import { useEffect, useState , useCallback } from "react";
import RouteMap from "./components/RouteMap";
import StatsBar from "./components/StatBar";
import "./App.css";

import { buildRoutesFromPoints } from "./utils/routeBuilder";
import { computeStats } from "./utils/stats";

function App() {
  const API = process.env.REACT_APP_API_BASE; // if using env
  // const API = "http://localhost:8000"; // uncomment if not using env file

  const [trip, setTrip] = useState(null);
  const [editingPoints, setEditingPoints] = useState([]); 
  const [loading, setLoading] = useState(true);

  const [routes, setRoutes] = useState([]);
  const [stats, setStats] = useState(null);

  const [toast, setToast] = useState(null)

  const [isLoggedIn, setIsLoggedIn] = useState(false);

  function handleLoginStatusChange(status) {
    setIsLoggedIn(status);
  }

  function showToast(msg){
      console.log("TOAST:", msg); // <–– debug
    setToast(msg);
    setTimeout(()=> setToast(null),5000);
  }
  // --------------------------------------------------
  // LOAD TRIP DATA (stops.json through api-route.php)
  // --------------------------------------------------
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
  // --------------------------------------------------
  // LOAD maintananceCost
  // --------------------------------------------------
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


  // --------------------------------------------------
  // BUILD ROUTES after loading
  // --------------------------------------------------
  useEffect(() => {
    if (!trip) return;
    buildRoutesFromPoints(trip.points, setRoutes);
  }, [trip]);

  
// Build routes live as user edits stops
useEffect(() => {
  if (!editingPoints.length) return;
  buildRoutesFromPoints(editingPoints, setRoutes);
}, [editingPoints]);

  // --------------------------------------------------
  // COMPUTE STATS once routes are built
  // --------------------------------------------------
  useEffect(() => {
  if (!trip) return;
  if (routes.length === 0) return;

  const baseStats = computeStats(routes, trip.points);

  setStats(prev => ({
    ...(prev || {}),
    ...baseStats
  }));
}, [routes, trip]);


  // --------------------------------------------------
  // STOP EDIT CALLBACKS
  // --------------------------------------------------
  const handleStopChange = useCallback((index, updatedStop) => {
  setEditingPoints(prev => {
    const updated = [...prev];
    updated[index] = updatedStop;
    return updated;
  });
}, []);

const handleStopDelete = useCallback((index) => {
  setEditingPoints(prev => prev.filter((_, i) => i !== index));
}, []);

const handleAddStop = useCallback((insertIndex, newStop) => {
  setEditingPoints(prev => {
    const updated = [...prev];
    updated.splice(insertIndex + 1, 0, newStop);
    return updated;
  });
}, []);


  // --------------------------------------------------
  // SAVE CHANGES — Batch write to update-stops.php
  // --------------------------------------------------
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

    // Re-fetch data without reloading the page
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


  // --------------------------------------------------
  // DISCARD CHANGES (restore from loaded trip)
  // --------------------------------------------------
  const handleDiscard = () => {
    if (!trip) return;
    setEditingPoints(JSON.parse(JSON.stringify(trip.points)));
    showToast("Changes discarded");
  };

  // --------------------------------------------------
  // LOADING STATES
  // --------------------------------------------------
  if (loading) return <div>Loading...</div>;
  if (!trip) return <div>Error loading trip.</div>;

  // --------------------------------------------------
  // MAIN UI
  // --------------------------------------------------
  return (
  <>
    <div className="app-wrapper">
      <StatsBar
        {...stats}
        onLoginStatusChange={handleLoginStatusChange}
        onSave={handleSave}
        onDiscard={handleDiscard}
        showToast={showToast}
      />

      <RouteMap
        points={editingPoints}
        routes={routes}
        loggedIn={isLoggedIn}
        onChange={handleStopChange}
        onDelete={handleStopDelete}
        onAddStop={handleAddStop}
      />
    </div>

    {toast && <div className="global-toast">{toast}</div>}

  </>
);

}

export default App;
