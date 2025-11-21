import { useEffect, useState } from "react";
import RouteMap from "./components/RouteMap";
import StatsBar from "./components/StatsBar";

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


      {/* Map */}
      <RouteMap points={trip.points} routes={routes} />
    </div>
  );
}

export default App;
