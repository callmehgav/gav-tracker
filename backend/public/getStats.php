<?php

require_once __DIR__ . '/env.php';
require_once __DIR__ . '/cors.php';

$path = __DIR__ . "/../data/stats.json";
$stops = json_decode(file_get_contents($path), true);

echo json_encode([
  "maintananceCost" => $stops["maintananceCost"] ?? 0
]);
