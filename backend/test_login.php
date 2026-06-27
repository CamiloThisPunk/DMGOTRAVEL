<?php
require __DIR__.'/vendor/autoload.php';
$app = require_once __DIR__.'/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

$email = 'admin@dmgotravel.com';
$password = 'admin_password';

$user = \App\Models\User::where('email', $email)->first();

if (!$user) {
    echo "User not found.\n";
} else {
    echo "User found: " . $user->name . "\n";
    if (\Illuminate\Support\Facades\Hash::check($password, $user->password)) {
        echo "Password matches!\n";
    } else {
        echo "Password DOES NOT match!\n";
    }
}
