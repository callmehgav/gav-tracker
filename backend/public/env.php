<?php
require_once __DIR__ . '/cors.php';

// Loads environment variables from a .env file (local only).
// Railway's environment variables override .env automatically.

function load_env($file = __DIR__ . '/../.env') {

    if (!file_exists($file)) {
        return;
    }

    $lines = file($file, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES);

    foreach ($lines as $line) {

        // Skip comments
        if (strpos(trim($line), '#') === 0) {
            continue;
        }

        // Split into KEY=VALUE
        if (strpos($line, '=') !== false) {
            list($key, $value) = explode('=', $line, 2);
            $key   = trim($key);
            $value = trim($value);

            // Set environment variable
            putenv("$key=$value");
        }
    }
}

// Load variables immediately
load_env();
