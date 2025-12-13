<?php

$buildPath = __DIR__ . '/../../frontend/web/build';
$requestUri = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);
$filePath = realpath($buildPath . $requestUri);

// 1. If the requested file exists inside the React build, serve it
if ($filePath && strpos($filePath, realpath($buildPath)) === 0 && is_file($filePath)) {
    $ext = pathinfo($filePath, PATHINFO_EXTENSION);

    // Set correct content-type headers
    $mimeTypes = [
        'js'   => 'application/javascript',
        'css'  => 'text/css',
        'json' => 'application/json',
        'png'  => 'image/png',
        'jpg'  => 'image/jpeg',
        'jpeg' => 'image/jpeg',
        'svg'  => 'image/svg+xml',
        'ico'  => 'image/x-icon',
        'html' => 'text/html',
        'map'  => 'application/json'
    ];

    if (isset($mimeTypes[$ext])) {
        header('Content-Type: ' . $mimeTypes[$ext]);
    }

    readfile($filePath);
    exit;
}

// 2. Otherwise, return index.html for React Router
readfile($buildPath . '/index.html');
