<?php

namespace Tests\Feature\Controllers\Client;

use App\Models\Reservation;
use App\Models\ServicePackage;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Laravel\Sanctum\Sanctum;
use Spatie\Permission\Models\Role;
use Tests\TestCase;

class ClientReservationControllerTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        Role::firstOrCreate(['name' => 'client', 'guard_name' => 'web']);
    }

    public function test_authenticated_client_can_list_their_reservations(): void
    {
        // Arrange
        $client = User::factory()->client()->create();
        $otherClient = User::factory()->client()->create();

        Reservation::factory()->count(2)->create(['client_id' => $client->id]);
        Reservation::factory()->create(['client_id' => $otherClient->id]);

        Sanctum::actingAs($client, ['*']);

        // Act
        $response = $this->getJson('/api/client/reservations');

        // Assert
        $response->assertStatus(200)
                 ->assertJsonStructure([
                     'data' => [
                         '*' => ['id', 'service', 'service_title', 'reservation_date', 'guests_count', 'total_price', 'status']
                     ],
                 ]);

        // Should only see their own 2 reservations
        $this->assertCount(2, $response->json('data'));
    }

    public function test_unauthenticated_client_cannot_list_reservations(): void
    {
        // Act
        $response = $this->getJson('/api/client/reservations');

        // Assert
        $response->assertStatus(401);
    }

    public function test_client_can_create_a_reservation(): void
    {
        // Arrange
        $client = User::factory()->client()->create();
        Sanctum::actingAs($client, ['*']);

        $package = ServicePackage::factory()->create([
            'capacity' => 10,
            'price' => 100,
            'is_active' => true,
        ]);

        $payload = [
            'service_package_id' => $package->id,
            'reservation_date' => '2027-10-10',
            'guests_count' => 3,
        ];

        // Act
        $response = $this->postJson('/api/client/reservations', $payload);

        // Assert
        $response->assertStatus(201)
                 ->assertJsonStructure([
                     'data' => ['id', 'status', 'total_price', 'guests_count']
                 ]);

        $this->assertEquals(300, $response->json('data.total_price'));
        
        $this->assertDatabaseHas('reservations', [
            'client_id' => $client->id,
            'service_package_id' => $package->id,
            'guests_count' => 3,
            'total_price' => 300,
            'status' => 'pending',
        ]);
    }

    public function test_client_cannot_create_reservation_if_over_capacity(): void
    {
        // Arrange
        $client = User::factory()->client()->create();
        Sanctum::actingAs($client, ['*']);

        $package = ServicePackage::factory()->create([
            'capacity' => 5,
            'is_active' => true,
        ]);

        // Existing reservation taking 4 spots
        Reservation::factory()->create([
            'service_package_id' => $package->id,
            'reservation_date' => '2027-10-10',
            'guests_count' => 4,
            'status' => 'confirmed'
        ]);

        $payload = [
            'service_package_id' => $package->id,
            'reservation_date' => '2027-10-10',
            'guests_count' => 2, // 4 + 2 = 6 > 5
        ];

        // Act
        $response = $this->postJson('/api/client/reservations', $payload);

        // Assert
        $response->assertStatus(422)
                 ->assertJsonValidationErrors(['guests_count']);
    }

    public function test_client_can_cancel_their_own_pending_reservation(): void
    {
        // Arrange
        $client = User::factory()->client()->create();
        Sanctum::actingAs($client, ['*']);

        $reservation = Reservation::factory()->create([
            'client_id' => $client->id,
            'status' => 'pending',
        ]);

        // Act
        $response = $this->patchJson("/api/client/reservations/{$reservation->id}/cancel");

        // Assert
        $response->assertStatus(200);
        $this->assertEquals('cancelled', $response->json('data.status'));

        $this->assertDatabaseHas('reservations', [
            'id' => $reservation->id,
            'status' => 'cancelled',
        ]);
        
        // Ensure audit log is created
        $this->assertDatabaseHas('audit_logs', [
            'action' => 'reservation.status_updated',
            'entity_id' => $reservation->id,
            'user_id' => $client->id,
        ]);
    }

    public function test_client_cannot_cancel_someone_elses_reservation(): void
    {
        // Arrange
        $client = User::factory()->client()->create();
        $otherClient = User::factory()->client()->create();
        Sanctum::actingAs($client, ['*']);

        $reservation = Reservation::factory()->create([
            'client_id' => $otherClient->id,
            'status' => 'pending',
        ]);

        // Act
        $response = $this->patchJson("/api/client/reservations/{$reservation->id}/cancel");

        // Assert
        $response->assertStatus(422)
                 ->assertJsonValidationErrors(['reservation']);
    }
}
