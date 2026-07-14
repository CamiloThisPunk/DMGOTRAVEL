<?php
require __DIR__.'/vendor/autoload.php';
$app = require_once __DIR__.'/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

try {
    Illuminate\Support\Facades\DB::statement("ALTER TABLE users ADD COLUMN IF NOT EXISTS google_id VARCHAR(255)");
    Illuminate\Support\Facades\DB::statement("ALTER TABLE users ADD COLUMN IF NOT EXISTS avatar VARCHAR(255)");
    echo "Columns added successfully.\n";
} catch (\Exception $e) {
    echo "Error: " . $e->getMessage() . "\n";
}
