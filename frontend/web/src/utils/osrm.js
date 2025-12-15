import polyline from "@mapbox/polyline";

export async function getOSRMRoute(start, end) {
const API =
  process.env.REACT_APP_API_BASE ||
  (process.env.NODE_ENV === "development"
    ? "http://localhost:8000"
    : "https://tracker.gavs-nexus.com");
  const url = `${API}/osrm-route.php?start=${start}&end=${end}`;
    //console.log("Requesting OSRM:", url);

  try {
    const res = await fetch(url);
    const data = await res.json();

    if (!data || !data.geometry) {
      console.error("OSRM invalid response:", data);
      return null;
    }
        //console.log("OSRM response:", data);

    // Decode the polyline
    const decoded = polyline.decode(data.geometry);

    return {
      coords: decoded.map(([lat, lng]) => [lat, lng]),
      distance: data.distance_meters,
      duration: data.duration_seconds
    };

  } catch (error) {
    console.error("OSRM fetch failed:", error);
    return null;
  }
}
