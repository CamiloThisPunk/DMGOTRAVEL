<?php
require __DIR__.'/vendor/autoload.php';
$app = require_once __DIR__.'/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

$services = \App\Models\ServicePackage::all(['id', 'title', 'image_360_url']);
foreach ($services as $s) {
    echo "ID: {$s->id} | {$s->title} | URL: {$s->image_360_url}\n";
}
