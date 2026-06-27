<?php

namespace Tests\Feature;

use App\Models\Reservation;
use App\Models\ServicePackage;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;
use Database\Seeders\RoleSeeder;

class ReservationTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        $this->seed(RoleSeeder::class);
    }

    public function test_client_can_create_reservation(): void
    {
        $client = User::factory()->client()->create();
        $package = ServicePackage::factory()->create([
            'capacity' => 10,
            'price' => 100,
        ]);

        $response = $this->actingAs($client)
            ->postJson('/api/client/reservations', [
                'service_package_id' => $package->id,
                'reservation_date' => '2027-05-01',
                'guests_count' => 2,
            ]);

        $response->assertStatus(201)
            ->assertJsonPath('data.guests_count', 2)
            ->assertJsonPath('data.total_price', 200);
    }

    public function test_admin_can_update_status(): void
    {
        $admin = User::factory()->admin()->create();
        $reservation = Reservation::factory()->create(['status' => 'pending']);

        $response = $this->actingAs($admin)
            ->patchJson("/api/admin/reservations/{$reservation->id}/status", [
                'status' => 'confirmed',
            ]);

        $response->assertStatus(200)
            ->assertJsonPath('data.status', 'confirmed');
    }

    public function test_client_cannot_access_admin_routes(): void
    {
        $client = User::factory()->client()->create();
        $reservation = Reservation::factory()->create();

        $response = $this->actingAs($client)
            ->patchJson("/api/admin/reservations/{$reservation->id}/status", [
                'status' => 'confirmed',
            ]);

        // Spatie returns 403 when role is missing.
        $response->assertStatus(403);
    }
}
