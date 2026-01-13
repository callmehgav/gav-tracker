export function computeStats(routes, points) {
  const totalMiles = routes.reduce((sum, r) => sum + r.distance, 0);
  const milesDone = routes.filter(r => r.visited).reduce((sum, r) => sum + r.distance, 0);
  const milesLeft = totalMiles - milesDone;

  const fMPG = 10;
  const DIESEL = 4.5;

  const dieselCostTotal = ((totalMiles / fMPG) * DIESEL).toFixed(2);
  const dieselCostSpent = ((milesDone / fMPG) * DIESEL).toFixed(2);


  const tMPG = 14;
  const GAS = 4;

  const gasCostTotal = ((totalMiles / tMPG) * GAS).toFixed(2);
  const gasCostSpent = ((milesDone / tMPG) * GAS).toFixed(2);


  const parksVisited = points.filter(
    p => p.type === "national_park" && p.status === "visited"
  ).length;

  const snowVisited = points.filter(
    p => p.type === "snow_resort" && p.status === "visited"
  ).length;

  const startDate = new Date("2026-01-10");
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
    gasCostTotal,
    gasCostSpent,
    parksVisited,
    snowVisited,
    daysSinceStart
  };
}
