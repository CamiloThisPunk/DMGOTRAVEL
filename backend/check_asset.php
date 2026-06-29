<?php
require __DIR__.'/vendor/autoload.php';
$app = require_once __DIR__.'/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

echo asset('storage/services/360/tkhI46uLSiqOlGNsSHmhGVj0llqwSa1NLdbAwkON.jpg');
