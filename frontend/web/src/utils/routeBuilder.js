import { getOSRMRoute } from "./osrm";
let RUNNING = false;

export async function buildRoutesFromPoints(points, setRoutes) {
  if (RUNNING) return;
  RUNNING = true;

  const METERS_TO_MILES = 1609.34;
  setRoutes([]);

  const processed = new Set();

  for (let i = 0; i < points.length - 1; i++) {
    const current = points[i];
    if (current.status === "skipped") continue;

    let nextIndex = i + 1;
    while (
      nextIndex < points.length &&
      points[nextIndex].status === "skipped"
    ) {
      nextIndex++;
    }

    if (nextIndex >= points.length) break;

    const key = `${i}-${nextIndex}`;
    if (processed.has(key)) continue;
    processed.add(key);

    const osrmRoute = await getOSRMRoute(
      `${current.lat},${current.lng}`,
      `${points[nextIndex].lat},${points[nextIndex].lng}`
    );
    await sleep(200); // 0.2 seconds between requests

    if (osrmRoute) {
      setRoutes(prev => [
        ...prev,
        {
          key,
          coords: osrmRoute.coords,
          distance: osrmRoute.distance / METERS_TO_MILES,
          visited: points[nextIndex].status === "visited"
        }
      ]);
    }
  }

  RUNNING = false;
}
function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}
