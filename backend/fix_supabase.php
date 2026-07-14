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
    Illuminate\Support\Facades\DB::connection('pgsql')->statement("ALTER TABLE users ADD COLUMN IF NOT EXISTS google_id VARCHAR(255)");
    Illuminate\Support\Facades\DB::connection('pgsql')->statement("ALTER TABLE users ADD COLUMN IF NOT EXISTS avatar VARCHAR(255)");
    echo "Columns added to Supabase successfully.\n";
} catch (\Exception $e) {
    echo "Error: " . $e->getMessage() . "\n";
}
