<?php
$ch = curl_init();

$data = [
    'title' => 'Test URL',
    'description' => 'Test URL description',
    'price' => '50',
    'capacity' => '10',
    'duration' => '60',
    'image_360_url' => 'https://viajaxmundo.com/es/wp-content/uploads/2023/11/aguas-turquesas-millpu.jpg',
    '_method' => 'PUT'
];

require __DIR__.'/vendor/autoload.php';
$app = require_once __DIR__.'/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

$admin = \App\Models\User::where('email', 'admin@dmgotravel.com')->first();
$token = $admin->createToken('test')->plainTextToken;

curl_setopt_array($ch, [
    CURLOPT_URL => 'http://127.0.0.1:8000/api/admin/services/2',
    CURLOPT_POST => true,
    CURLOPT_POSTFIELDS => $data,
    CURLOPT_RETURNTRANSFER => true,
    CURLOPT_HTTPHEADER => [
        'Authorization: Bearer ' . $token,
    ],
]);

$response = curl_exec($ch);
echo $response . "\n";
curl_close($ch);
