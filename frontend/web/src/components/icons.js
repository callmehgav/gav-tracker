import L from "leaflet";

// National park icons
import parkDefault from "../assets/icons/national-park-white.png";
import parkGreen from "../assets/icons/national-park-green.png";
import parkRed from "../assets/icons/national-park-red.png";

// Snow resort icons
import snowDefault from "../assets/icons/goggles-white.png";
import snowGreen from "../assets/icons/goggles-green.png";
import snowRed from "../assets/icons/goggles-red.png";

// Camp icons
import campDefault from "../assets/icons/fire-white.png";
import campGreen from "../assets/icons/fire-green.png";
import campRed from "../assets/icons/fire-red.png";

// Shop icons
import shopDefault from "../assets/icons/shop-white.png";
import shopGreen from "../assets/icons/shop-green.png";
import shopRed from "../assets/icons/shop-red.png";
export function getParkIcon(status) {
  let iconUrl =
    status === "visited" ? parkGreen :
    status === "skipped" ? parkRed :
    parkDefault;

  return new L.Icon({
    iconUrl,
    iconSize: [32, 32],
    iconAnchor: [16, 32]
  });
}

export function getCampIcon(status) {
  let iconUrl =
    status === "visited" ? campGreen :
    status === "skipped" ? campRed :
    campDefault;

  return new L.Icon({
    iconUrl,
    iconSize: [32, 32],
    iconAnchor: [16, 32]
  });
}

export function getSnowIcon(status) {
  let iconUrl =
    status === "visited" ? snowGreen :
    status === "skipped" ? snowRed :
    snowDefault;

  return new L.Icon({
    iconUrl,
    iconSize: [32, 32],
    iconAnchor: [16, 32]
  });
}

export function getShopIcon(status) {
  let iconUrl =
    status === "visited" ? shopGreen :
    status === "skipped" ? shopRed :
    shopDefault;

  return new L.Icon({
    iconUrl,
    iconSize: [32, 32],
    iconAnchor: [16, 32]
  });
}
