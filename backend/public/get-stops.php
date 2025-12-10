<?php
require_once __DIR__ . '/env.php';
require_once __DIR__ . '/cors.php';

header('Content-Type: application/json');

// Path to your JSON stops file
$stopsFile = __DIR__ . '/../data/stops.json';

// If the file does not exist, return an empty array
if (!file_exists($stopsFile)) {
    echo json_encode([]);
    exit;
}

// Load and output the stops
$stops = json_decode(file_get_contents($stopsFile), true);
echo json_encode($stops);
