<?php

return [
    'paths'                    => ['api/*'],
    'allowed_methods'          => ['POST'],
    'allowed_origins'          => [env('CORS_ALLOWED_ORIGIN', 'http://localhost')],
    'allowed_origins_patterns' => [],
    'allowed_headers'          => ['Content-Type', 'Accept'],
    'exposed_headers'          => [],
    'max_age'                  => 86400,
    'supports_credentials'     => false,
];
