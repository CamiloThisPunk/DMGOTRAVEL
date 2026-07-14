<?php

use App\Http\Controllers\Api\Admin\ClientOversightController;
use App\Http\Controllers\Api\Admin\ReservationController as AdminReservationController;
use App\Http\Controllers\Api\Admin\ServicePackageController;
use App\Http\Controllers\Api\Auth\AuthController;
use App\Http\Controllers\Api\Client\ReservationController as ClientReservationController;
use App\Http\Controllers\Api\Public\CatalogController;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Storage;

/*
|--------------------------------------------------------------------------
| Public Routes (No Authentication Required)
|--------------------------------------------------------------------------
*/

Route::get('/debug-db', function () {
    try {
        \DB::connection()->getPdo();
        return ['status' => 'success', 'message' => 'DB Connected!'];
    } catch (\Exception $e) {
        return ['status' => 'error', 'message' => $e->getMessage()];
    }
});


Route::get('/services', [CatalogController::class, 'index']);
Route::get('/services/{servicePackage}', [CatalogController::class, 'show']);

Route::get('/images', function (\Illuminate\Http\Request $request) {
    $path = $request->query('path');
    if (!$path || !Storage::disk('public')->exists($path)) {
        abort(404);
    }
    return response()->file(Storage::disk('public')->path($path));
});

/*
|--------------------------------------------------------------------------
| Authentication Routes
|--------------------------------------------------------------------------
*/

Route::prefix('auth')->group(function () {
    Route::post('/register', [AuthController::class, 'register']);
    Route::post('/login', [AuthController::class, 'login']);

    Route::get('/google/redirect', [\App\Http\Controllers\Api\Auth\SocialAuthController::class, 'redirect']);
    Route::get('/google/callback', [\App\Http\Controllers\Api\Auth\SocialAuthController::class, 'callback']);

    Route::middleware('auth:sanctum')->group(function () {
        Route::get('/me', function (\Illuminate\Http\Request $request) {
            return response()->json(['user' => $request->user()]);
        });
        Route::post('/logout', [AuthController::class, 'logout']);
    });
});

/*
|--------------------------------------------------------------------------
| Client Authenticated Routes
|--------------------------------------------------------------------------
*/

Route::middleware('auth:sanctum')->prefix('client')->group(function () {
    Route::get('/reservations', [ClientReservationController::class, 'index']);
    Route::post('/reservations', [ClientReservationController::class, 'store']);
    Route::patch('/reservations/{reservation}/cancel', [ClientReservationController::class, 'cancel']);
});

/*
|--------------------------------------------------------------------------
| Admin Routes (Requires admin role)
|--------------------------------------------------------------------------
*/

Route::middleware(['auth:sanctum', 'role:admin'])->prefix('admin')->group(function () {
    // Service Package CRUD
    Route::apiResource('services', ServicePackageController::class);

    // Reservation Management
    Route::get('/reservations', [AdminReservationController::class, 'index']);
    Route::patch('/reservations/{reservation}/status', [AdminReservationController::class, 'updateStatus']);

    // Client Oversight & Audit Logs
    Route::get('/clients', [ClientOversightController::class, 'clients']);
    Route::get('/logs', [ClientOversightController::class, 'logs']);
});
