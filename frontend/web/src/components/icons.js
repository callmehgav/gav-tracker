import L from "leaflet";
//us!
import us from "../assets/icons/yodaUs.png";
import "../styles/map-icons.css";
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

// City icons
import cityDefault from "../assets/icons/city-white.png";
import cityGreen from "../assets/icons/city-green.png";
import cityRed from "../assets/icons/city-red.png";

// Shop icons
import shopDefault from "../assets/icons/shop-white.png";
import shopGreen from "../assets/icons/shop-green.png";
import shopRed from "../assets/icons/shop-red.png";

//monument icons
import monumentDefault from "../assets/icons/monument-white.png"
import monumentGreen from "../assets/icons/monument-green.png"
import monumentRed from "../assets/icons/monument-red.png"

export function getUs() {
  return L.divIcon({
    html: `<img src="${us}" style="width:60px;height:60px; z-index:9999999;"/>`,
    className: "us-pulse", // allows CSS pulse
    iconSize: [60, 60],
    iconAnchor: [30, 60]   // center of a 60×60 icon
  });
}

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
export function getCityIcon(status) {
  let iconUrl =
    status === "visited" ? cityGreen :
    status === "skipped" ? cityRed :
    cityDefault;

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

export function getMonumentIcon(status) {
  let iconUrl =
    status === "visited" ? monumentGreen :
    status === "skipped" ? monumentRed :
    monumentDefault;

  return new L.Icon({
    iconUrl,
    iconSize: [32, 32],
    iconAnchor: [16, 32]
  });
}
