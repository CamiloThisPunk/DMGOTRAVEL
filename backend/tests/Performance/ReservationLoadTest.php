<?php

namespace Tests\Performance;

use App\Models\ServicePackage;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;
use Database\Seeders\RoleSeeder;

class ReservationLoadTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        $this->seed(RoleSeeder::class);
    }

    public function test_api_can_handle_high_load_of_reservations(): void
    {
        $package = ServicePackage::factory()->create([
            'is_active' => true,
            'capacity' => 150, 
            'price' => 100.00
        ]);

        $clients = User::factory()->client()->count(100)->create();

        $startTime = microtime(true);

        foreach ($clients as $client) {
            $this->actingAs($client)->postJson('/api/client/reservations', [
                'service_package_id' => $package->id,
                'reservation_date' => now()->addDays(10)->format('Y-m-d'),
                'guests_count' => 1,
            ])->assertStatus(201);
        }

        $executionTime = microtime(true) - $startTime;
        $this->assertDatabaseCount('reservations', 100);
        $this->assertLessThan(5.0, $executionTime);
    }
}
