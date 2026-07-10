<?php

namespace Tests\Performance;

use App\Models\Reservation;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;
use Database\Seeders\RoleSeeder;

class AdminLoadTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        $this->seed(RoleSeeder::class);
    }

    public function test_api_can_handle_high_load_on_admin_package_management(): void
    {
        $admin = User::factory()->admin()->create();
        $startTime = microtime(true);

        for ($i = 0; $i < 50; $i++) {
            $this->actingAs($admin)->postJson('/api/admin/services', [
                'title' => "Paquete de carga {$i}",
                'description' => 'Test',
                'price' => 150.00,
                'capacity' => 20,
                'duration' => 60,
                'is_active' => true,
                'type' => 'paquete'
            ])->assertStatus(201);
        }

        $executionTime = microtime(true) - $startTime;
        $this->assertDatabaseCount('service_packages', 50);
        $this->assertLessThan(5.0, $executionTime);
    }

    public function test_api_can_handle_high_load_on_admin_reservation_status_update(): void
    {
        $admin = User::factory()->admin()->create();
        $reservations = Reservation::factory()->count(100)->create(['status' => 'pending']);

        $startTime = microtime(true);

        foreach ($reservations as $reservation) {
            $this->actingAs($admin)->patchJson("/api/admin/reservations/{$reservation->id}/status", [
                'status' => 'confirmed'
            ])->assertStatus(200);
        }

        $executionTime = microtime(true) - $startTime;
        $this->assertDatabaseHas('reservations', ['status' => 'confirmed']);
        $this->assertLessThan(5.0, $executionTime);
    }
}
