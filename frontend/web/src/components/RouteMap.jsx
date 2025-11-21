import { MapContainer, TileLayer, Polyline, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

import {
  getCampIcon,
  getParkIcon,
  getSnowIcon,
  getShopIcon,
  getMonumentIcon
} from "./icons";

import "../styles/map-icons.css";

// Fix Leaflet default icons
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

export default function RouteMap({ points, routes }) {

  const latLngs = points.map(p => [p.lat, p.lng]);

  if (latLngs.length === 0) {
    return <p>No map data available</p>;
  }

  return (
    <MapContainer
      center={latLngs[0]}
      zoom={3.5}
      zoomControl={false}
      style={{
        height: "100vh",
        width: "100vw",
        filter: "drop-shadow(0px 0px 8px #00aaff88)"
      }}
    >
      <TileLayer
        url="https://tiles.stadiamaps.com/tiles/alidade_smooth_dark/{z}/{x}/{y}.png"
        attribution="© Stadia Maps, © OpenMapTiles, © OpenStreetMap contributors"
      />

      {/* Draw OSRM road routes */}
      {routes && routes.map(route => (
        <Polyline
          key={route.key}
          positions={route.coords}
          color={route.visited ? "dodgerblue" : "gray"}
          weight={5}
        />
      ))}

      {/* Draw markers */}
      {points.map((p, index) => (
        <Marker
          key={index}
          position={[p.lat, p.lng]}
          icon={
            p.type === "national_park"
              ? getParkIcon(p.status)
              : p.type === "snow_resort"
              ? getSnowIcon(p.status)
              : p.type === "camp"
              ? getCampIcon(p.status)
              : p.type === "shop"
              ? getShopIcon(p.status)
              : p.type === "monument"
              ? getMonumentIcon(p.status)
              : getCampIcon(p.status)
          }
        >
          <Popup>{p.name}</Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}
