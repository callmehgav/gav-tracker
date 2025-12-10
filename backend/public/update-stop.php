<?php
require_once __DIR__ . '/env.php';
require_once __DIR__ . '/auth.php';
require_once __DIR__ . '/cors.php';

session_start();
require_admin();


// Path to stops.json
$stopsFile = __DIR__ . '/../data/stops.json';

// Load incoming JSON
$data = json_decode(file_get_contents("php://input"), true);

$id     = $data['id'] ?? null;
$status = $data['status'] ?? null;
$notes  = $data['notes'] ?? null;

// Validate required fields
if ($id === null) {
    http_response_code(400);
    echo json_encode(["error" => "Missing stop ID"]);
    exit;
}

// Load stops
$stops = json_decode(file_get_contents($stopsFile), true);

// Find and update stop
$found = false;
foreach ($stops as &$stop) {
    if ($stop['id'] == $id) {
        if ($status !== null) $stop['status'] = $status;
        if ($notes !== null)  $stop['notes']  = $notes;
        $found = true;
        break;
    }
}

// If not found
if (!$found) {
    http_response_code(404);
    echo json_encode(["error" => "Stop not found"]);
    exit;
}

// Save updated JSON
file_put_contents($stopsFile, json_encode($stops, JSON_PRETTY_PRINT));

// Success response
echo json_encode(["success" => true]);
