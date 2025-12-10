<?php
require_once __DIR__ . '/cors.php';

session_start();

// Destroy entire session
session_unset();
session_destroy();

echo json_encode([ "success" => true ]);
