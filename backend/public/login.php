<?php

require_once __DIR__ . '/env.php';
require_once __DIR__ . '/cors.php';
// Handle OPTIONS preflight request
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

session_start();


// Receive JSON input
$data = json_decode(file_get_contents("php://input"), true);

$username = $data['username'] ?? '';
$password = $data['password'] ?? '';

// Load environment values
$envUser = getenv("ADMIN_USERNAME");
$envPass = getenv("ADMIN_PASSWORD");

// Validate credentials
if ($username === $envUser && $password === $envPass) {
    $_SESSION['admin'] = true;
    echo json_encode([ "success" => true ]);
    exit;
}

// Invalid login
http_response_code(401);
echo json_encode([ "error" => "Invalid credentials" ]);
