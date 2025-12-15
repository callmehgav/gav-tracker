/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useRef, useEffect, useCallback } from "react";
import { MapContainer, TileLayer, Polyline, Marker, Pane } from "react-leaflet";
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
  const [playbackTrail, setPlaybackTrail] = useState([]);
  const [shownStops, setShownStops] = useState(new Set());

  const mapRef = useRef(null);
  const mapMovingProgrammatically = useRef(false);

  const [playbackPosition, setPlaybackPosition] = useState(null);

  // index for internal playback animation
  const playbackIndexRef = useRef(0);

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

  // ICON LOGIC
  function getIcon(p) {
    if (latestVisited && p.id === latestVisited.id) {

      if (playback.mode) return getIconByType(p);

      const icon = getUs();
      icon.options.zIndexOffset = 99999;
      return icon;
    }
    return getIconByType(p);
  }

  // Menu position update
  const updateMenuPosition = useCallback(() => {
    if (!selectedLatLng || !mapRef.current) return;

    const map = mapRef.current;
    const point = map.latLngToContainerPoint(selectedLatLng);
    setMenuPos({ x: point.x, y: point.y });
  }, [selectedLatLng]);

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

  // START / EXIT playback setup
  useEffect(() => {
    if (playback?.mode) {
      const path = routes
        .filter(r => r.visited)
        .flatMap(r => r.coords);

      if (path.length > 0) {
        playbackIndexRef.current = 0;
        setPlaybackPosition(path[0]);
        setPlaybackTrail([path[0]]);
      }
    } else {
      playbackIndexRef.current = 0;
      setPlaybackPosition(null);
      setPlaybackTrail([]);
      setShownStops(new Set());
    }
  }, [playback?.mode]);

  // Sync react index → ref
  useEffect(() => {
    if (typeof playback?.index === "number") {
      playbackIndexRef.current = playback.index;
    }
  }, [playback?.index]);

  // Distance check (Haversine)
  function isNearStop(playbackPos, stop, thresholdMeters) {
    if (!playbackPos) return false;

    const [lat1, lng1] = playbackPos;
    const lat2 = stop.lat;
    const lng2 = stop.lng;

    const R = 6371000;
    const toRad = x => (x * Math.PI) / 180;

    const dLat = toRad(lat2 - lat1);
    const dLng = toRad(lng2 - lng1);

    const a =
      Math.sin(dLat / 2) ** 2 +
      Math.sin(dLng / 2) ** 2 *
        Math.cos(toRad(lat1)) *
        Math.cos(toRad(lat2));

    return 2 * R * Math.asin(Math.sqrt(a)) < thresholdMeters;
  }

  // Reveal stops as playback gets close (50 miles = 80467m)
  useEffect(() => {
    if (!playbackPosition) return;

    setShownStops(prev => {
      const updated = new Set(prev);

      points.forEach(p => {
        if (isNearStop(playbackPosition, p, 5000)) {
          updated.add(p.id);
        }
      });

      return updated;
    });
  }, [playbackPosition, points]);

  // PLAYBACK LOOP
  useEffect(() => {
    if (!playback?.mode || !playback?.playing) return;

    setCameraFree(false);

    const sortedRoutes = routes
      .slice()
      .sort((a, b) => Number(a.key.split("-")[0]) - Number(b.key.split("-")[0]));

    const animationPath = sortedRoutes
      .filter(r => r.visited)
      .flatMap(r => r.coords);

    if (!animationPath.length) return;

    const lastIndex = animationPath.length - 1;

    const interval = setInterval(() => {
      setPlayback(prev => {
        if (!prev.mode || !prev.playing) return prev;

        let nextIndex =
          playbackIndexRef.current + prev.direction * prev.speed;

        if (nextIndex < 0) nextIndex = 0;

        if (nextIndex > lastIndex) {
          const finalPoint = animationPath[lastIndex];
  playbackIndexRef.current = lastIndex;
  setPlaybackPosition(finalPoint);
  setPlaybackTrail(t => [...t, finalPoint]);

  return {
    ...prev,
    playing: false,
    index: lastIndex
  };
        }

        playbackIndexRef.current = nextIndex;
        const nextPoint = animationPath[nextIndex];

        setPlaybackPosition(nextPoint);

        setPlaybackTrail(t => {
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
        return {
          ...prev,
          index: nextIndex
        };

      });
    }, 60);

    return () => clearInterval(interval);
  }, [playback.mode, playback.playing, playback.speed, playback.direction]);

  // Update menu on selection
  useEffect(() => {
    if (!selectedLatLng) return;

    if (!mapRef.current) {
      setTimeout(updateMenuPosition, 50);
      return;
    }
    updateMenuPosition();
  }, [selectedLatLng, updateMenuPosition]);

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
        <TileLayer 
  url={`https://tiles.stadiamaps.com/tiles/alidade_smooth/{z}/{x}/{y}.png?api_key=${process.env.REACT_APP_STADIA_API_KEY}`}
          />

        {/* PANES */}
        <Pane name="playbackPane" style={{ zIndex: 9999999 }} />
        <Pane name="trailPane" style={{ zIndex: 700 }} />
        <Pane name="visitedPane" style={{ zIndex: 600 }} />
        <Pane name="unvisitedPane" style={{ zIndex: 500 }} />

        {/* GREEN TRAIL */}
        {playbackTrail.length > 1 && (
          <Polyline
            positions={playbackTrail}
            color="lime"
            weight={2}
            pane="trailPane"
          />
        )}

        {/* ROUTES HIDDEN DURING PLAYBACK */}
        {routes.map(route => {
          if (playback?.mode) return null;

          return (
            <Polyline
              key={route.key}
              positions={route.coords}
              color={route.visited ? "dodgerblue" : "gray"}
              weight={4}
              pane={route.visited ? "visitedPane" : "unvisitedPane"}
            />
          );
        })}

        {/* STATIC MARKERS */}
        {points.map((p, index) => {
          if (playback?.mode) {
            const near = isNearStop(playbackPosition, p, 2000);
            if (!shownStops.has(p.id) && !near) return null;
          }

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
            pane = "playbackPane"
            zIndexOffset={999999}
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
            pointerEvents: "auto"
          }}
        >
          <LocationMenu
            stop={points[selectedIndex]}
            index={selectedIndex}
            loggedIn={loggedIn}
            onChange={onChange}
            onDelete={onDelete}
            onAddStopClick={idx =>
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
