<?php
require 'vendor/autoload.php';
$app = require_once 'bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

$user = App\Models\User::where('email', 'admin@dmgotravel.com')->first();
if ($user) {
    $user->password = Illuminate\Support\Facades\Hash::make('admin_password');
    $user->save();
    echo "Password updated successfully.";
} else {
    echo "User not found.";
}
