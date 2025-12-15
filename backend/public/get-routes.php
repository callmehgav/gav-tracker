<?php
require_once __DIR__ . '/cors.php';
require_once __DIR__ . '/env.php';
require_once __DIR__ . '/auth.php';


// Paths
$stopsFile = __DIR__ . "/../data/stops.json";
$cacheFile = __DIR__ . "/../data/routes-cache.json";
    // 1. Load stops.json
    if (!file_exists($stopsFile)) {
        http_response_code(500);
        echo json_encode(["error" => "stops.json not found"]);
        exit;
    }

    $stopsJson = file_get_contents($stopsFile);
    $points = json_decode($stopsJson, true);

    // stops.json is an ARRAY directly
    if (!is_array($points)) {
        http_response_code(500);
        echo json_encode(["error" => "Invalid stops.json format"]);
        exit;
    }

    // Hash the entire array to detect changes
    $pointsHash = md5(json_encode($points));


// 2. If cache exists and hash matches, return cached routes
if (file_exists($cacheFile)) {
    $cacheJson = file_get_contents($cacheFile);
    $cache     = json_decode($cacheJson, true);

    if (is_array($cache) && isset($cache["hash"], $cache["routes"])) {
        if ($cache["hash"] === $pointsHash) {
            echo json_encode($cache["routes"]);
            exit;
        }
    }
}

// 3. Cache is missing or stale - rebuild routes from OSRM

$routes = [];
$METERS_TO_MILES = 1609.34;

// Loop over stops and build segments like your JS routeBuilder
$pointsCount = count($points);

for ($i = 0; $i < $pointsCount - 1; $i++) {
    $current = $points[$i];

    // Skip segments starting from skipped stops
    if (isset($current["status"]) && $current["status"] === "skipped") {
        continue;
    }

    // Find the next non skipped stop
    $nextIndex = $i + 1;
    while (
        $nextIndex < $pointsCount &&
        isset($points[$nextIndex]["status"]) &&
        $points[$nextIndex]["status"] === "skipped"
    ) {
        $nextIndex++;
    }

    if ($nextIndex >= $pointsCount) {
        break;
    }

    $next = $points[$nextIndex];
    $key  = "{$i}-{$nextIndex}";

    // Expect lat/lng keys on each stop
    if (!isset($current["lat"], $current["lng"], $next["lat"], $next["lng"])) {
        continue;
    }

    $startLat = $current["lat"];
    $startLng = $current["lng"];
    $endLat   = $next["lat"];
    $endLng   = $next["lng"];

    // 4. Call OSRM route API (driving, geojson, full overview)
    $osrmUrl = "http://router.project-osrm.org/route/v1/driving/" .
        "{$startLng},{$startLat};{$endLng},{$endLat}" .
        "?overview=full&geometries=geojson";

    $osrmJson = @file_get_contents($osrmUrl);
    if ($osrmJson === false) {
        // If a segment fails, just skip it
        continue;
    }

    $osrm = json_decode($osrmJson, true);
    if (
        !is_array($osrm) ||
        !isset($osrm["routes"][0]["geometry"]["coordinates"]) ||
        !isset($osrm["routes"][0]["distance"])
    ) {
        continue;
    }

    // OSRM coordinates come as [lng, lat] - convert to [lat, lng]
    $coords = array_map(function ($c) {
        return [$c[1], $c[0]];
    }, $osrm["routes"][0]["geometry"]["coordinates"]);

    $distanceMiles = $osrm["routes"][0]["distance"] / $METERS_TO_MILES;

    $routes[] = [
        "key"      => $key,
        "coords"   => $coords, // raw high fidelity
        "distance" => $distanceMiles,
        "visited"  => isset($next["status"]) && $next["status"] === "visited"
    ];

    // Optional tiny delay to be polite to public OSRM server
    usleep(100000); // 0.1 seconds
}

// 5. Save cache for next time
$cacheData = [
    "hash"   => $pointsHash,
    "routes" => $routes
];

file_put_contents($cacheFile, json_encode($cacheData, JSON_PRETTY_PRINT));

// 6. Respond with routes
echo json_encode($routes);
