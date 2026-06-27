<?php

use App\Http\Controllers\Api\Admin\ClientOversightController;
use App\Http\Controllers\Api\Admin\ReservationController as AdminReservationController;
use App\Http\Controllers\Api\Admin\ServicePackageController;
use App\Http\Controllers\Api\Auth\AuthController;
use App\Http\Controllers\Api\Client\ReservationController as ClientReservationController;
use App\Http\Controllers\Api\Public\CatalogController;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| Public Routes (No Authentication Required)
|--------------------------------------------------------------------------
*/

Route::get('/services', [CatalogController::class, 'index']);
Route::get('/services/{servicePackage}', [CatalogController::class, 'show']);

/*
|--------------------------------------------------------------------------
| Authentication Routes
|--------------------------------------------------------------------------
*/

Route::prefix('auth')->group(function () {
    Route::post('/register', [AuthController::class, 'register']);
    Route::post('/login', [AuthController::class, 'login']);

    Route::middleware('auth:sanctum')->group(function () {
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
