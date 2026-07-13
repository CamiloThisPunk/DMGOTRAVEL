<?php
require 'vendor/autoload.php';
$app = require_once 'bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

$r = App\Models\Reservation::whereNotNull('payment_voucher_url')->orderBy('id', 'desc')->first();
echo $r->payment_voucher_url;
