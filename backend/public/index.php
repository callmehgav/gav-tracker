<?php

// Parse requested URI
$uri = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);

// 1. If request starts with /api, route to backend PHP
if (strpos($uri, '/api') === 0) {
    $localPath = __DIR__ . $uri . '.php';

    if (file_exists($localPath)) {
        require $localPath;
        exit();
    }

    http_response_code(404);
    echo json_encode(["error" => "API not found"]);
    exit();
}

// 2. Serve React build assets
$reactPath = __DIR__ . '/../../frontend/web/build';
$filePath  = realpath($reactPath . $uri);

if ($filePath && strpos($filePath, realpath($reactPath)) === 0 && is_file($filePath)) {
    return readfile($filePath);
}

// 3. SPA fallback for React Router
readfile($reactPath . '/index.html');
