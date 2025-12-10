import { useState, useRef, useEffect, useCallback } from "react";
import { MapContainer, TileLayer, Polyline, Marker,Pane } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

import LocationMenu from "./LocationMenu";
import AddStopPopup from "./AddStopPopup";

import {
  getUs,
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
  onAddStop,
  playback,
  setPlayback
}) {
  const [selectedIndex, setSelectedIndex] = useState(null);
  const [selectedLatLng, setSelectedLatLng] = useState(null);
  const [menuPos, setMenuPos] = useState(null);
  const [addMenu, setAddMenu] = useState(null);
  const [cameraFree, setCameraFree] = useState(false);
  const mapMovingProgrammatically = useRef(false);
  const [playbackTrail, setPlaybackTrail] = useState([]);

  const mapRef = useRef(null);

  // Playback marker (moving US)
  const [playbackPosition, setPlaybackPosition] = useState(null);

  // Latest visited stop
  const visitedStops = points.filter(p => p.status === "visited");
  const latestVisited = visitedStops[visitedStops.length - 1];

    function getIconByType(p) {
    if (p.type === "national_park") return getParkIcon(p.status);
    if (p.type === "snow_resort") return getSnowIcon(p.status);
    if (p.type === "camp") return getCampIcon(p.status);
    if (p.type === "city") return getCityIcon(p.status);
    if (p.type === "shop") return getShopIcon(p.status);
    if (p.type === "monument") return getMonumentIcon(p.status);
    return getCampIcon(p.status);
  }

  // ICON PICKER
  function getIcon(p) {
    // If this is the latest visited stop
    if (latestVisited && p.id === latestVisited.id) {

      // During playback → use the normal icon (no us.png)
      if (playback.mode) {
        return getIconByType(p); // fallback to type icon
      }

      // Normal mode → Highlight with US icon
      const icon = getUs();
      icon.options.zIndexOffset = 99999;
      return icon;
    }

    if (p.type === "national_park") return getParkIcon(p.status);
    if (p.type === "snow_resort") return getSnowIcon(p.status);
    if (p.type === "camp") return getCampIcon(p.status);
    if (p.type === "city") return getCityIcon(p.status);
    if (p.type === "shop") return getShopIcon(p.status);
    if (p.type === "monument") return getMonumentIcon(p.status);
    return getCampIcon(p.status);
  }

  // Convert lat/lng to screen point
  const updateMenuPosition = useCallback(() => {
    if (!selectedLatLng || !mapRef.current) {
      console.log("bad LatLng Data: "+selectedLatLng+ " or "+!mapRef.current)
      return;}

    const map = mapRef.current;
    const point = map.latLngToContainerPoint(selectedLatLng);
    setMenuPos({ x: point.x, y: point.y });
  }, [selectedLatLng, mapRef]);

  // Update menu when map moves
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    const moveHandler = () => updateMenuPosition();

    map.on("move", moveHandler);
    map.on("zoom", moveHandler);

    return () => {
      map.off("move", moveHandler);
      map.off("zoom", moveHandler);
    };
  }, [updateMenuPosition]);

  // Initialize playback marker
  
/* eslint-disable react-hooks/exhaustive-deps */
useEffect(() => {
    if (playback?.mode) {
      // Build full animation path
      const path = routes
        .filter(r => r.visited)
        .flatMap(r => r.coords);

      if (path.length > 0) {
        setPlaybackPosition(path[0]);
        setPlaybackTrail([path[0]]); // reset trail to starting point
      }
    } else {
      setPlaybackPosition(null);
      setPlaybackTrail([]); // clear trail when playback exits
    }
  }, [playback?.mode]);

  // PLAYBACK ANIMATION LOOP
useEffect(() => {
  if (!playback?.mode || !playback?.playing) return;

  setCameraFree(false);

  const animationPath = routes
    .filter(r => r.visited)
    .flatMap(r => r.coords);

  if (!animationPath.length) return;

  const interval = setInterval(() => {
    setPlayback(prev => {
      if (!prev.mode || !prev.playing) return prev;

      let nextIndex = prev.index + prev.direction * prev.speed;
      const lastIndex = animationPath.length - 1;

      if (nextIndex < 0) nextIndex = 0;
      if (nextIndex > lastIndex) return { ...prev, playing: false };

      const nextPoint = animationPath[nextIndex];
      setPlaybackPosition(nextPoint);
      setPlaybackTrail(t => {
        // prevent duplicates
        if (t.length && t[t.length - 1][0] === nextPoint[0] && t[t.length - 1][1] === nextPoint[1]) {
          return t;
        }
        return [...t, nextPoint];
      });
      if (mapRef.current && !cameraFree) {
        mapMovingProgrammatically.current = true;

        mapRef.current.setView(
          nextPoint,
          mapRef.current.getZoom(),
          { animate: true }
        );

        setTimeout(() => {
          mapMovingProgrammatically.current = false;
        }, 80);
      }

      return { ...prev, index: nextIndex };
    });
  }, 60);

  return () => clearInterval(interval);
}, [
  playback.mode,
  playback.playing,
  playback.speed,
  playback.direction
  // DO NOT add cameraFree or setPlayback
  // DO NOT add routes
]);
// Update menu position when a marker is selected, retry if map isn't ready yet
useEffect(() => {
  if (!selectedLatLng) return;

  // If map isn't ready on first click, retry shortly
  if (!mapRef.current) {
    console.log("map not ready, retrying updateMenuPosition...");
    setTimeout(() => {
      updateMenuPosition();
    }, 50);
    return;
  }

  updateMenuPosition();
}, [selectedLatLng]);


  // Marker click
  function handleMarkerClick(index, stop) {
    
    setSelectedIndex(index);
    setSelectedLatLng([stop.lat, stop.lng]);
    setAddMenu(null);
  }

  const initialCenter = latestVisited
    ? [latestVisited.lat, latestVisited.lng]
    : [39.5, -98.35];

  return (
    <div style={{ height: "100vh", width: "100vw", position: "relative" }}>
      <MapContainer
      ref={mapRef}

        center={initialCenter}
        zoom={4}
        zoomControl={false}
        style={{ height: "100%", width: "100%" }}
      >
        <TileLayer url="https://tiles.stadiamaps.com/tiles/alidade_smooth_dark/{z}/{x}/{y}.png" />

        {/* PANE DEFINITIONS MUST COME FIRST */}
        <Pane name="playbackPane" style={{ zIndex: 20000 }} />
        <Pane name="visitedPane" style={{ zIndex: 600 }} />
        <Pane name="unvisitedPane" style={{ zIndex: 500 }} />
        <Pane name="trailPane" style={{ zIndex: 700 }} />  
                {/* GREEN TRAIL */}
          {playbackTrail.length > 1 && (
          <Polyline
            positions={playbackTrail}
            color="lime"
            weight={2}
            pane="trailPane"
          />
        )}    
        {routes.map(route => (
          
          <Polyline
            key={route.key}
            positions={route.coords}
            color={route.visited ? "dodgerblue" : "gray"}
            weight={4}
            pane={route.visited ? "visitedPane" : "unvisitedPane"}
            
          />
        ))}


        {/* STATIC MARKERS */}
        {points.map((p, index) => {
          const isLatest =
            latestVisited &&
            p.lat === latestVisited.lat &&
            p.lng === latestVisited.lng;
            

            return (
              <Marker
                key={p.id ?? index}
                position={[p.lat, p.lng]}
                zIndexOffset={isLatest ? 999999 : 0}
                icon={getIcon(p)}
                eventHandlers={{
                  click: () => handleMarkerClick(index, p)
                }}
              />
            );

        })}

        {/* PLAYBACK MARKER */}
        {playbackPosition && (
          <Marker
            position={playbackPosition}
            icon={getUs()}
            pane="playbackPane" 
          />
        )}
      </MapContainer>

      {/* LOCATION MENU */}
      {selectedIndex !== null && menuPos && (
        <div
          style={{
            position: "absolute",
            left: menuPos.x,
            top: menuPos.y - 20,
            transform: "translate(-50%, -100%)",
            zIndex: 99990,
            pointerEvents: "auto",
            
          }}
        >
          <LocationMenu
            stop={points[selectedIndex]}
            index={selectedIndex}
            loggedIn={loggedIn}
            onChange={onChange}
            onDelete={onDelete}
            onAddStopClick={(idx )=>
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
