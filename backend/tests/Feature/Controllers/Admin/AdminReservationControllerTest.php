<?php

namespace Tests\Feature\Controllers\Admin;

use App\Models\Reservation;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Laravel\Sanctum\Sanctum;
use Spatie\Permission\Models\Role;
use Tests\TestCase;

class AdminReservationControllerTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        Role::firstOrCreate(['name' => 'admin', 'guard_name' => 'web']);
    }

    public function test_admin_can_list_all_reservations(): void
    {
        // Arrange
        $admin = User::factory()->create();
        $admin->assignRole('admin');
        Sanctum::actingAs($admin, ['*']);

        Reservation::factory()->count(3)->create();

        // Act
        $response = $this->getJson('/api/admin/reservations');

        // Assert
        $response->assertStatus(200)
                 ->assertJsonStructure([
                     'data' => [
                         '*' => ['id', 'client', 'service', 'service_title', 'status', 'total_price']
                     ]
                 ]);

        $this->assertCount(3, $response->json('data'));
    }

    public function test_admin_can_filter_reservations_by_status(): void
    {
        // Arrange
        $admin = User::factory()->create();
        $admin->assignRole('admin');
        Sanctum::actingAs($admin, ['*']);

        Reservation::factory()->count(2)->create(['status' => 'pending']);
        Reservation::factory()->count(3)->create(['status' => 'confirmed']);

        // Act
        $response = $this->getJson('/api/admin/reservations?status=confirmed');

        // Assert
        $response->assertStatus(200);
        $this->assertCount(3, $response->json('data'));
        $this->assertEquals('confirmed', $response->json('data.0.status'));
    }

    public function test_non_admin_cannot_list_reservations(): void
    {
        // Arrange
        $client = User::factory()->create();
        Sanctum::actingAs($client, ['*']);

        // Act
        $response = $this->getJson('/api/admin/reservations');

        // Assert
        $response->assertStatus(403);
    }

    public function test_admin_can_update_reservation_status(): void
    {
        // Arrange
        $admin = User::factory()->create();
        $admin->assignRole('admin');
        Sanctum::actingAs($admin, ['*']);

        $reservation = Reservation::factory()->create(['status' => 'pending']);

        $payload = ['status' => 'confirmed'];

        // Act
        $response = $this->patchJson("/api/admin/reservations/{$reservation->id}/status", $payload);

        // Assert
        $response->assertStatus(200)
                 ->assertJsonPath('data.status', 'confirmed');

        $this->assertDatabaseHas('reservations', [
            'id' => $reservation->id,
            'status' => 'confirmed',
        ]);
        
        $this->assertDatabaseHas('audit_logs', [
            'action' => 'reservation.status_updated',
            'entity_id' => $reservation->id,
            'user_id' => $admin->id,
        ]);
    }

    public function test_admin_cannot_update_status_with_invalid_transition(): void
    {
        // Arrange
        $admin = User::factory()->create();
        $admin->assignRole('admin');
        Sanctum::actingAs($admin, ['*']);

        $reservation = Reservation::factory()->create(['status' => 'completed']);

        $payload = ['status' => 'cancelled'];

        // Act
        $response = $this->patchJson("/api/admin/reservations/{$reservation->id}/status", $payload);

        // Assert
        $response->assertStatus(422)
                 ->assertJsonValidationErrors(['status']);
                 
        $this->assertStringContainsString('Cannot transition', $response->json('errors.status.0'));
    }
}
