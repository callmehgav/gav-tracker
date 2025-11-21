import { useEffect, useState } from "react";
import RouteMap from "./components/RouteMap";
import StatsBar from "./components/StatsBar";
import logo from "./assets/logos/logoNoWords.png";

import { buildRoutesFromPoints } from "./utils/routeBuilder";
import { computeStats } from "./utils/stats";

function App() {
  const [trip, setTrip] = useState(null);
  const [loading, setLoading] = useState(true);
  const [routes, setRoutes] = useState([]);
  const [stats, setStats] = useState(null);

  // --------------------------------------------------
  // LOAD TRIP DATA FROM PHP
  // --------------------------------------------------
  useEffect(() => {
    fetch("http://localhost:8000/api-route.php")
      .then(res => res.json())
      .then(data => {
        setTrip(data);
        setLoading(false);
      })
      .catch(err => {
        console.error("Failed to fetch trip:", err);
        setLoading(false);
      });
  }, []);

  // --------------------------------------------------
  // BUILD OSRM ROUTES
  // --------------------------------------------------
  useEffect(() => {
    if (!trip) return;
    if (routes.length > 0) return;  // prevent running twice

    let hasRun = false; // lock

    if (!hasRun) {
      hasRun = true;
      buildRoutesFromPoints(trip.points, setRoutes);
    }
  }, [trip, routes.length]);


  // --------------------------------------------------
  // COMPUTE STATS (only after OSRM is fully done)
  // --------------------------------------------------
  useEffect(() => {
    if (!trip) return;
    if (routes.length === 0) return;

    setStats(computeStats(routes, trip.points));
  }, [routes, trip]);

  // --------------------------------------------------
  // LOADING STATE
  // --------------------------------------------------
  if (loading) return <div>Loading...</div>;
  if (!trip) return <div>No data.</div>;

  // --------------------------------------------------
  // RENDER UI
  // --------------------------------------------------
  return (
    <div style={{ height: "100vh", width: "100vw", position: "relative" }}>
      
      {/* Stats Bar */}
      {stats && <StatsBar {...stats} />}

      {/* Logo */}
      <div style={{
        position: "absolute",
        top: "20px",
        left: "20px",
        zIndex: 1000,
        backgroundColor: "rgba(0,0,0,0.6)",
        padding: "10px 14px",
        borderRadius: "12px",
        backdropFilter: "blur(6px)"
      }}>
        <img
          src={logo}
          alt="Gav Tracker Logo"
          style={{
            width: "40px",
            transform: "scale(1.8)"
          }}
        />
      </div>

      {/* Map */}
      <RouteMap points={trip.points} routes={routes} />
    </div>
  );
}

export default App;
