<?php
require __DIR__.'/vendor/autoload.php';
$app = require_once __DIR__.'/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

// Force DB config to Supabase
config([
    'database.default' => 'pgsql',
    'database.connections.pgsql' => [
        'driver' => 'pgsql',
        'host' => 'aws-0-us-east-1.pooler.supabase.com',
        'port' => '6543',
        'database' => 'postgres',
        'username' => 'postgres.yqniqvwmdiphxdsbjxxz',
        'password' => 'Dixtopix123',
        'charset' => 'utf8',
        'prefix' => '',
        'schema' => 'public',
        'sslmode' => 'prefer',
    ],
]);

try {
    Illuminate\Support\Facades\DB::connection('pgsql')->statement("ALTER TABLE users ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMP NULL");
    echo "deleted_at column added to Supabase users table successfully.\n";
} catch (\Exception $e) {
    echo "Error: " . $e->getMessage() . "\n";
}
