import { useState, useRef, useEffect, useCallback } from "react";
import { MapContainer, TileLayer, Polyline, Marker } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

import LocationMenu from "./LocationMenu";
import AddStopPopup from "./AddStopPopup";

import {
  getCampIcon,
  getCityIcon,
  getParkIcon,
  getSnowIcon,
  getShopIcon,
  getMonumentIcon
} from "./icons";

import "../styles/map-icons.css";

// Fix Leaflet default icons only once
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png"
});

export default function RouteMap({
  points,
  routes,
  loggedIn,
  onChange,
  onDelete,
  onAddStop
}) {
  const [selectedIndex, setSelectedIndex] = useState(null);

  //  store lat/lng instead of fixed pixel coords
  const [selectedLatLng, setSelectedLatLng] = useState(null);

  const [menuPos, setMenuPos] = useState(null);
  const [addMenu, setAddMenu] = useState(null);

  const mapRef = useRef(null);

  // ICON PICKER
  function getIcon(p) {
    if (p.type === "national_park") return getParkIcon(p.status);
    if (p.type === "snow_resort") return getSnowIcon(p.status);
    if (p.type === "camp") return getCampIcon(p.status);
    if (p.type === "city") return getCityIcon(p.status);
    if (p.type === "shop") return getShopIcon(p.status);
    if (p.type === "monument") return getMonumentIcon(p.status);
    return getCampIcon(p.status);
  }

  //  Convert a lat/lng to screen pixels
  // Convert a lat/lng to screen pixels
  const updateMenuPosition = useCallback(() => {
    if (!selectedLatLng || !mapRef.current) return;

    const map = mapRef.current;
    const point = map.latLngToContainerPoint(selectedLatLng);

    setMenuPos({ x: point.x, y: point.y });
  }, [selectedLatLng]);


  //  Recalculate menu position when the map moves/zooms
  // Recalculate menu position when the map moves/zooms
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    function moveHandler() {
      updateMenuPosition();
    }

    map.on("move", moveHandler);
    map.on("zoom", moveHandler);

    return () => {
      map.off("move", moveHandler);
      map.off("zoom", moveHandler);
    };
  }, [updateMenuPosition]);   // <— FIXED


  // When a new marker is clicked, immediately update position
  useEffect(() => {
    updateMenuPosition();
  }, [selectedLatLng, updateMenuPosition]);

  //  Click handler now stores lat/lng
  function handleMarkerClick(index, stop) {
    setSelectedIndex(index);
    setSelectedLatLng([stop.lat, stop.lng]);
    setAddMenu(null);
  }

  return (
    <div style={{ height: "100vh", width: "100vw", position: "relative" }}>

      {/* MAP */}
      
      <MapContainer
        ref={mapRef}
        center={[points[0].lat, points[0].lng]}
        zoom={4}
        zoomControl={false}
        style={{ height: "100%", width: "100%" }}
      >
        <TileLayer url="https://tiles.stadiamaps.com/tiles/alidade_smooth_dark/{z}/{x}/{y}.png" />

        {/* ROUTES */}
        {routes.map((route) => (
          <Polyline
            key={route.key}
            positions={route.coords}
            color={route.visited ? "dodgerblue" : "gray"}
            weight={5}
          />
        ))}

        {/* MARKERS */}
        {points.map((p, index) => (
          <Marker
            key={p.id ?? index}
            position={[p.lat, p.lng]}
            icon={getIcon(p)}
            eventHandlers={{
              click: () => handleMarkerClick(index, p)
            }}
          />
        ))}
      </MapContainer>

      {/* LOCATION MENU — follows map movement */}
      {selectedIndex !== null && menuPos && (
        <div
          style={{
            position: "absolute",
            left: menuPos.x,
            top: menuPos.y - 20,
            transform: "translate(-50%, -100%)",
            zIndex: 99990,
            pointerEvents: "auto"
          }}
        >
          <LocationMenu
            stop={points[selectedIndex]}
            index={selectedIndex}
            loggedIn={loggedIn}
            onChange={onChange}
            onDelete={onDelete}
            onAddStopClick={(idx) =>
              setAddMenu({ index: idx, position: menuPos })
            }
            onClose={() => {
              setSelectedLatLng(null);
              setSelectedIndex(null);
            }}
          />
        </div>
      )}

      {/* ADD STOP POPUP */}
      {addMenu && (
        <div
          style={{
            position: "absolute",
            left: "50%",
            top: "55%",
            transform: "translate(-50%, 0)",
            zIndex: 100000,
            pointerEvents: "auto"
          }}
        >
          <AddStopPopup
            insertIndex={addMenu.index}
            onAdd={onAddStop}
            onClose={() => setAddMenu(null)}
          />
        </div>
      )}
    </div>
  );
}
