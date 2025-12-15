<?php
require_once __DIR__ . '/env.php';
require_once __DIR__ . '/cors.php';
$data = json_decode(file_get_contents("php://input"), true);
$newCost = floatval($data["maintananceCost"]);

// load stops.json
$path = __DIR__ . "/../data/stats.json";
$stops = json_decode(file_get_contents($path), true);

// update global maintenance cost
$stops["maintananceCost"] = $newCost;

// save back to file
file_put_contents($path, json_encode($stops, JSON_PRETTY_PRINT));

echo json_encode(["success" => true, "maintananceCost" => $newCost]);
