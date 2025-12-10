<?php
// Universal CORS handler for all API endpoints

// Allowed origin — use "*" or your domain
header("Access-Control-Allow-Origin: http://localhost:3000");

// Allow credentials (for PHP sessions)
header("Access-Control-Allow-Credentials: true");

// Allowed headers for JSON requests
header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With");

// Allowed HTTP methods
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");

// If this is a preflight request, respond and exit
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

// Always serve JSON
header("Content-Type: application/json");
