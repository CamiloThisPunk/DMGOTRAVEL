<?php
require __DIR__.'/vendor/autoload.php';
$app = require_once __DIR__.'/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

$request = Illuminate\Http\Request::create('/api/auth/login', 'POST', [
    'email' => 'admin@dmgotravel.com',
    'password' => 'admin_password'
]);
$response = $kernel->handle($request);
echo $response->getContent();
