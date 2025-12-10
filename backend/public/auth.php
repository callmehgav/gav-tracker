<?php
// Every admin-protected endpoint must include this file.
require_once __DIR__ . '/cors.php';

session_start();

// Call this function at the top of any PHP endpoint that requires admin access.
function require_admin() {
    
    // If no session or not logged in → block the request.
    if (!isset($_SESSION['admin']) || $_SESSION['admin'] !== true) {
        http_response_code(401);
        echo json_encode([ "error" => "Unauthorized" ]);
        exit;
    }
}
