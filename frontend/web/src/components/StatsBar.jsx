import "../styles/StatsBar.css";

export default function StatsBar({
  totalMiles,
  milesDone,
  milesLeft,
  dieselCostTotal,
  dieselCostSpent,
  dieselCostLeft,
  parksVisited,
  snowVisited,
  daysSinceStart
}) {
  return (
    <div className="stats-bar">
      <div className="stats-section logo"> 
        <img src="/assets/logos/logoNoWords.png" alt="Gav's Nexus" className="stats-logo"/>
      </div>

      <div className="stats-group">
        <div className="stat-item">
          <strong>Total Miles:</strong> {Math.round(totalMiles)}
        </div>
        <div className="stat-item">
          <strong>Completed:</strong> {Math.round(milesDone)}
        </div>
        <div className="stat-item">
          <strong>Remaining:</strong> {Math.round(milesLeft)}
        </div>
      </div>

      <div className="stats-group">
        <div className="stat-item">
          <strong>Diesel Expected:</strong> ${dieselCostTotal}
        </div>
        <div className="stat-item">
          <strong>Diesel Spent:</strong> ${dieselCostSpent}
        </div>
        <div className="stat-item">
          <strong>Remaining Fuel:</strong> ${dieselCostLeft}
        </div>
      </div>

      <div className="stats-group">
        <div className="stat-item">
          <strong>Parks Hit:</strong> {parksVisited}
        </div>
        <div className="stat-item">
          <strong>Snow Resorts Hit:</strong> {snowVisited}
        </div>
        <div className="stat-item">
          <strong>Days Since Start:</strong> {daysSinceStart}
        </div>
      </div>
    </div>
  );
}
