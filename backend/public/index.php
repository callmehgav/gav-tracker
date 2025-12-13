<?php
$path = __DIR__ . '/../../frontend/web/build';

$request = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);
$file = realpath($path . $request);

// If file exists (JS, CSS, assets), serve it
if ($file && strpos($file, realpath($path)) === 0 && is_file($file)) {
    return readfile($file);
}

// Otherwise serve React root
readfile($path . '/index.html');
