<?php
require_once __DIR__ . '/cors.php';

// Require start and end params
if (!isset($_GET["start"]) || !isset($_GET["end"])) {
    echo json_encode(["error" => "Missing start or end"]);
    exit;
}

$start = $_GET["start"]; // "lat,lng"
$end = $_GET["end"];     // "lat,lng"

// Convert input to OSRM format: lng,lat
function flipCoords($pair) {
    list($lat, $lng) = explode(",", $pair);
    return "$lng,$lat";
}

$startOSRM = flipCoords($start);
$endOSRM = flipCoords($end);

$url = "https://router.project-osrm.org/route/v1/driving/$startOSRM;$endOSRM?overview=full&geometries=polyline";

// Fetch OSRM response
$response = @file_get_contents($url);

if ($response === FALSE) {
    echo json_encode(["error" => "OSRM request failed"]);
    exit;
}

$data = json_decode($response, true);

// Validate OSRM response
if (!isset($data["routes"][0])) {
    echo json_encode(["error" => "No route found"]);
    exit;
}

// Return important routing data
$route = $data["routes"][0];

echo json_encode([
    "geometry" => $route["geometry"],
    "distance_meters" => $route["distance"],
    "duration_seconds" => $route["duration"]
]);
