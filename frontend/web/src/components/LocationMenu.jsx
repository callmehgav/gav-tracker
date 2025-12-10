import "../styles/LocationMenu.css";

export default function LocationMenu({
  stop,
  index,
  loggedIn,
  onChange,
  onDelete,
  onAddStopClick,
  onClose
}) {
  if (!stop) return null;

  const handleFieldChange = (field, value) => {
    onChange(index, { ...stop, [field]: value });
  };

  const handleDelete = () => {
    if (!window.confirm("Delete this stop?")) return;
    onDelete(index);
  };

  //const coordsText = `${Number(stop.lat).toFixed(4)}, ${Number(stop.lng).toFixed(4)}`;

  return (
    <div className="location-menu-card">

      {/* HEADER */}
      <div className="location-menu-header">
        {/* NAME */}
      <div className="field-group">
        <label>Name</label>
        <input
          type="text"
          disabled={!loggedIn}
          value={stop.name}
          onChange={(e) => handleFieldChange("name", e.target.value)}
        />
      </div>


        <button
          className="location-menu-close"
          onClick={(e) => {
            e.stopPropagation();
            onClose();
          }}
        >
          ✖
        </button>
      </div>

      {/* TYPE (controls icon) */}
      <div className="field-group">
        <label>Type</label>
        <select
          disabled={!loggedIn}
          value={stop.type}
          onChange={(e) => handleFieldChange("type", e.target.value)}
        >
          <option value="camp">Camp</option>
          <option value="city">City</option>
          <option value="snow_resort">Snow Resort</option>
          <option value="national_park">National Park</option>
          <option value="monument">Monument</option>
          <option value="recreation_area">Recreation Area</option>
          <option value="shop">Shop</option>
          <option value="viewpoint">Viewpoint</option>
          <option value="start">Start</option>
          <option value="end">End</option>
          <option value="other">Other</option>
        </select>
      </div>
      {/* STATUS */}
      <div className="field-group">
        <label>Status</label>
        <select
          disabled={!loggedIn}
          value={stop.status || "planned"}
          onChange={(e) => handleFieldChange("status", e.target.value)}
        >
          <option value="planned">Planned</option>
          <option value="visited">Visited</option>
          <option value="skipped">Skipped</option>
        </select>
      </div>

      {/* NOTES */}
      <div className="field-group">
        <label>Notes</label>
        {loggedIn ? (
          <textarea
            value={stop.notes || ""}
            onChange={(e) => handleFieldChange("notes", e.target.value)}
          />
        ) : (
          <div className="notes-display">{stop.notes || "No notes"}</div>
        )}
      </div>

      {/* ARRIVAL */}
      <div className="field-group">
        <label>Arrived at</label>
        <input
          type="text"
          disabled={!loggedIn}
          value={stop.arrived_at || ""}
          placeholder="Optional"
          onChange={(e) => handleFieldChange("arrived_at", e.target.value)}
        />
      </div>

      {/* DEPARTURE */}
      <div className="field-group">
        <label>Departed at</label>
        <input
          type="text"
          disabled={!loggedIn}
          value={stop.departed_at || ""}
          placeholder="Optional"
          onChange={(e) => handleFieldChange("departed_at", e.target.value)}
        />
      </div>
      {/* COORDINATES (editable) */}
      <div className="field-group">
        <label>Latitude</label>
        <input
          type="number"
          step="0.0001"
          disabled={!loggedIn}
          value={stop.lat}
          onChange={(e) =>
            handleFieldChange("lat", parseFloat(e.target.value))
          }
        />
      </div>

      <div className="field-group">
        <label>Longitude</label>
        <input
          type="number"
          step="0.0001"
          disabled={!loggedIn}
          value={stop.lng}
          onChange={(e) =>
            handleFieldChange("lng", parseFloat(e.target.value))
          }
        />
      </div>


      {/* ACTION BUTTONS */}
      {loggedIn && (
        <div className="location-menu-actions">

          {/* Add stop after this */}
          <button
            className="add-btn"
            onClick={(e) => {
              e.stopPropagation();
              onAddStopClick(index);
            }}
          >
            + Add Stop After This
          </button>

          {/* Delete */}
          <button
            className="delete-btn"
            onClick={(e) => {
              e.stopPropagation();
              handleDelete();
            }}
          >
            Delete Stop
          </button>

        </div>
      )}

    </div>
  );
}
