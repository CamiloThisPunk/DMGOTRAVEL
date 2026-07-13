<?php
require 'vendor/autoload.php';
$app = require_once 'bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

$res = App\Models\Reservation::whereNotNull('payment_voucher_url')->get();
foreach($res as $r) {
    if(strpos($r->payment_voucher_url, 'storage/vouchers/') !== false) {
        $parts = explode('storage/vouchers/', $r->payment_voucher_url);
        $path = $parts[1];
        $r->payment_voucher_url = 'https://dmgotravel-api.onrender.com/api/images?path=vouchers/' . $path;
        $r->save();
        echo 'Updated ' . $r->id . "\n";
    }
}
