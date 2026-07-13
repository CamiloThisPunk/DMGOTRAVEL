<?php
require 'vendor/autoload.php';
$app = require_once 'bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

$res = App\Models\Reservation::orderBy('id', 'desc')->take(5)->get();
foreach($res as $r) {
    echo "ID: " . $r->id . " URL: " . $r->payment_voucher_url . "\n";
}
