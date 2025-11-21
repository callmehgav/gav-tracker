export function computeStats(routes, points) {
  const totalMiles = routes.reduce((sum, r) => sum + r.distance, 0);
  const milesDone = routes.filter(r => r.visited).reduce((sum, r) => sum + r.distance, 0);
  const milesLeft = totalMiles - milesDone;

  const MPG = 10;
  const DIESEL = 4.25;

  const dieselCostTotal = ((totalMiles / MPG) * DIESEL).toFixed(2);
  const dieselCostSpent = ((milesDone / MPG) * DIESEL).toFixed(2);
  const maintananceCost = 5500;

  const parksVisited = points.filter(
    p => p.type === "national_park" && p.status === "visited"
  ).length;

  const snowVisited = points.filter(
    p => p.type === "snow_resort" && p.status === "visited"
  ).length;

  const startDate = new Date("2025-11-14");
  const today = new Date();

  const daysSinceStart = Math.floor(
    (today - startDate) / (1000 * 60 * 60 * 24)
  );

  return {
    totalMiles,
    milesDone,
    milesLeft,
    dieselCostTotal,
    dieselCostSpent,
    maintananceCost,
    parksVisited,
    snowVisited,
    daysSinceStart
  };
}
