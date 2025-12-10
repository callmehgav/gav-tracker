<?php
require_once __DIR__ . '/env.php';
require_once __DIR__ . '/auth.php';
require_once __DIR__ . '/cors.php';

session_start();
require_admin();

header("Content-Type: application/json");

// stops.json path
$stopsFile = __DIR__ . '/../data/stops.json';

// Read incoming JSON
$data = json_decode(file_get_contents("php://input"), true);

if (!isset($data['stops']) || !is_array($data['stops'])) {
    http_response_code(400);
    echo json_encode(["error" => "Missing or invalid 'stops' array"]);
    exit;
}

// Reassign IDs in order (guarantees perfect indexing)
foreach ($data['stops'] as $i => &$stop) {
    $stop['id'] = $i + 1;
}

file_put_contents($stopsFile, json_encode($data['stops'], JSON_PRETTY_PRINT));

echo json_encode(["success" => true]);
