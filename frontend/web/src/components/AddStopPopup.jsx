import { useState } from "react";
import "../styles/AddStopPopup.css";

export default function AddStopPopup({
  insertIndex,
  onAdd,
  onClose
}) {
  const [name, setName] = useState("");
  const [lat, setLat] = useState("");
  const [lng, setLng] = useState("");
  const [type, setType] = useState("camp");
  const [status, setStatus] = useState("planned");

  const handleSubmit = () => {
    if (!name.trim() || !lat.trim() || !lng.trim()) {
      alert("Name, latitude, and longitude are required.");
      return;
    }

    onAdd(insertIndex, {
      id: Date.now(),
      name,
      lat: parseFloat(lat),
      lng: parseFloat(lng),
      type,
      status,
      notes: "",
      arrived_at: "",
      departed_at: ""
    });

    onClose();
  };

  return (
    <div className="addstop-card">

      {/* Header */}

      {/* Name */}
        <div className="addstop-name-row">
        <div className="addstop-field" style={{ marginBottom: 0 }}>
            <label>Name</label>
            <input 
            type="text" 
            value={name}
            onChange={(e) => setName(e.target.value)}
            />
        </div>

        <button className="addstop-close" onClick={onClose}>✖</button>
        </div>

      {/* Lat/Lng */}
      <div className="addstop-row">
        <div className="addstop-field">
          <label>Latitude</label>
          <input 
            type="number" 
            value={lat}
            onChange={(e) => setLat(e.target.value)}
          />
        </div>

        <div className="addstop-field">
          <label>Longitude</label>
          <input 
            type="number" 
            value={lng}
            onChange={(e) => setLng(e.target.value)}
          />
        </div>
      </div>

      {/* Type + Status */}
      <div className="addstop-row">
        <div className="addstop-field">
          <label>Type</label>
          <select value={type} onChange={(e) => setType(e.target.value)}>
            <option value="camp">Camp</option>
            <option value="city">City</option>
            <option value="snow_resort">Snow Resort</option>
            <option value="national_park">National Park</option>
            <option value="monument">Monument</option>
            <option value="recreation_area">Recreation Area</option>
            <option value="shop">Shop</option>
            <option value="viewpoint">Viewpoint</option>
            <option value="other">Other</option>
          </select>
        </div>

        <div className="addstop-field">
          <label>Status</label>
          <select value={status} onChange={(e) => setStatus(e.target.value)}>
            <option value="planned">Planned</option>
            <option value="visited">Visited</option>
            <option value="skipped">Skipped</option>
          </select>
        </div>
      </div>

      {/* Submit */}
      <button className="addstop-submit" onClick={handleSubmit}>
        Add Stop
      </button>

    </div>
  );
}
