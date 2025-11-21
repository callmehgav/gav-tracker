import "../styles/StatsBar.css";
import logo from "../assets/logos/logoNoWords.png";

export default function StatsBar({
  totalMiles,
  milesDone,
  milesLeft,
  dieselCostTotal,
  dieselCostSpent,
  maintananceCost,
  parksVisited,
  snowVisited,
  daysSinceStart
}) {
  return (
    <div className="stats-bar">

      {/* Logo inside the bar */}
      <div className="stats-logo">
        <img
          src={logo}
          alt="Gav Tracker Logo"
        />
      </div>

      <div className="stats-group">
        <div className="stat-item">
          <strong>Total Miles:</strong> {Math.round(totalMiles)}
        </div>
        <div className="stat-item">
          <strong>Completed Miles:</strong> {Math.round(milesDone)}
        </div>
        <div className="stat-item">
          <strong>Remaining Miles:</strong> {Math.round(milesLeft)}
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
          <strong>Est. Maintanance Spent:</strong> ${maintananceCost}
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
