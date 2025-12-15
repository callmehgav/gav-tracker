<?php
require_once __DIR__ . '/cors.php';
require_once __DIR__ . '/env.php';
require_once __DIR__ . '/auth.php';
ini_set('memory_limit', '512M');

// Logging helper
function logRoute($msg) {
    $logFile = __DIR__ . "/../data/routes-debug.log";
    $timestamp = date("Y-m-d H:i:s");
    file_put_contents($logFile, "[$timestamp] $msg\n", FILE_APPEND);
}

logRoute("=== NEW ROUTE REQUEST ===");

// Paths
$stopsFile = __DIR__ . "/../data/stops.json";
$cacheFile = __DIR__ . "/../data/routes-cache.json";

// 1. Load stops.json
if (!file_exists($stopsFile)) {
    logRoute("ERROR: stops.json not found");
    http_response_code(500);
    echo json_encode(["error" => "stops.json not found"]);
    exit;
}

$stopsJson = file_get_contents($stopsFile);
$points = json_decode($stopsJson, true);

if (!is_array($points)) {
    logRoute("ERROR: Invalid stops.json format");
    http_response_code(500);
    echo json_encode(["error" => "Invalid stops.json format"]);
    exit;
}

$pointsHash = md5(json_encode($points));
logRoute("Stops hash: $pointsHash");

// 2. Try serving from cache
if (file_exists($cacheFile)) {
    $cacheJson = file_get_contents($cacheFile);
    $cache = json_decode($cacheJson, true);

    if (is_array($cache) && isset($cache["hash"], $cache["routes"])) {
        if ($cache["hash"] === $pointsHash) {
            logRoute("CACHE HIT – returning cached routes.");
            echo json_encode($cache["routes"]);
            exit;
        } else {
            logRoute("CACHE MISMATCH – old hash: {$cache['hash']} new hash: $pointsHash");
        }
    } else {
        logRoute("Cache file exists but invalid format.");
    }
} else {
    logRoute("No cache file found – building routes.");
}

// 3. Rebuild routes --------------------------------------------------

$routes = [];
$METERS_TO_MILES = 1609.34;

$pointsCount = count($points);
logRoute("Rebuilding routes for $pointsCount stops.");

for ($i = 0; $i < $pointsCount - 1; $i++) {
    $current = $points[$i];

    if (isset($current["status"]) && $current["status"] === "skipped") {
        logRoute("Stop $i skipped.");
        continue;
    }

    // Find next non skipped stop
    $nextIndex = $i + 1;
    while (
        $nextIndex < $pointsCount &&
        isset($points[$nextIndex]["status"]) &&
        $points[$nextIndex]["status"] === "skipped"
    ) {
        logRoute("Skipping stop $nextIndex");
        $nextIndex++;
    }

    if ($nextIndex >= $pointsCount) {
        logRoute("Reached end of stops.");
        break;
    }

    $next = $points[$nextIndex];
    $key  = "{$i}-{$nextIndex}";
    logRoute("Building segment $key");

    if (!isset($current["lat"], $current["lng"], $next["lat"], $next["lng"])) {
        logRoute("ERROR: Missing lat/lng for segment $key");
        continue;
    }

    $startLat = $current["lat"];
    $startLng = $current["lng"];
    $endLat   = $next["lat"];
    $endLng   = $next["lng"];

    $osrmUrl =
        "http://router.project-osrm.org/route/v1/driving/" .
        "{$startLng},{$startLat};{$endLng},{$endLat}" .
        "?overview=full&geometries=geojson";

    logRoute("Requesting OSRM: $osrmUrl");

    $osrmJson = @file_get_contents($osrmUrl);

    if ($osrmJson === false) {
        logRoute("ERROR: OSRM request failed for segment $key");
        continue;
    }

    $osrm = json_decode($osrmJson, true);

    if (
        !is_array($osrm) ||
        !isset($osrm["routes"][0]["geometry"]["coordinates"]) ||
        !isset($osrm["routes"][0]["distance"])
    ) {
        logRoute("ERROR: OSRM returned invalid data for segment $key");
        continue;
    }

    // Convert lng/lat → lat/lng
    $coords = array_map(function ($c) {
        return [$c[1], $c[0]];
    }, $osrm["routes"][0]["geometry"]["coordinates"]);

    $distanceMiles = $osrm["routes"][0]["distance"] / $METERS_TO_MILES;

    $routes[] = [
        "key"      => $key,
        "coords"   => $coords,
        "distance" => $distanceMiles,
        "visited"  => isset($next["status"]) && $next["status"] === "visited"
    ];

    logRoute("Segment $key built: " . count($coords) . " points, {$distanceMiles} miles.");

    usleep(100000); // 0.1s pause
}

// 4. Save cache
$cacheData = [
    "hash"   => $pointsHash,
    "routes" => $routes
];

file_put_contents($cacheFile, json_encode($cacheData, JSON_PRETTY_PRINT));
logRoute("Cache saved. Total routes: " . count($routes));

// 5. Output
logRoute("Returning rebuilt routes.");
echo json_encode($routes);
