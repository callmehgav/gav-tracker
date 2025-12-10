<?php
require_once __DIR__ . '/cors.php';
require_once __DIR__ . '/env.php';
require_once __DIR__ . '/auth.php';
session_start();
require_admin();

header('Content-Type: application/json');

$stopsFile = __DIR__ . '/../data/stops.json';

// Load input
$data = json_decode(file_get_contents("php://input"), true);

// Required fields
$name   = $data['name']   ?? null;
$lat    = $data['lat']    ?? null;
$lng    = $data['lng']    ?? null;
$type   = $data['type']   ?? 'other';
$status = $data['status'] ?? 'planned';
$notes  = $data['notes']  ?? '';

// Validate
if ($name === null || $lat === null || $lng === null) {
    http_response_code(400);
    echo json_encode(["error" => "Missing required fields"]);
    exit;
}

// Load existing stops
$stops = file_exists($stopsFile)
    ? json_decode(file_get_contents($stopsFile), true)
    : [];

// Generate new unique ID
$newId = count($stops) > 0
    ? max(array_column($stops, 'id')) + 1
    : 1;

// Build new stop
$newStop = [
    "id"     => $newId,
    "name"   => $name,
    "lat"    => $lat,
    "lng"    => $lng,
    "type"   => $type,
    "status" => $status,
    "notes"  => $notes
];

// Append and save
$stops[] = $newStop;
file_put_contents($stopsFile, json_encode($stops, JSON_PRETTY_PRINT));

echo json_encode([
    "success" => true,
    "id"      => $newId
]);
