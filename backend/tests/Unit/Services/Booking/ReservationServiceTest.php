<?php

namespace Tests\Unit\Services\Booking;

use App\Models\Reservation;
use App\Models\ServicePackage;
use App\Models\User;
use App\Services\Booking\ReservationService;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Validation\ValidationException;
use Tests\TestCase;

class ReservationServiceTest extends TestCase
{
    use RefreshDatabase;

    private ReservationService $service;

    protected function setUp(): void
    {
        parent::setUp();
        $this->service = new ReservationService();
    }

    public function test_can_create_reservation_if_capacity_available(): void
    {
        $client = User::factory()->client()->create();
        $package = ServicePackage::factory()->create([
            'capacity' => 10,
            'price' => 100,
        ]);

        $data = [
            'service_package_id' => $package->id,
            'reservation_date' => '2027-01-01',
            'guests_count' => 5,
        ];

        $reservation = $this->service->createReservation($client, $data);

        $this->assertDatabaseHas('reservations', [
            'id' => $reservation->id,
            'guests_count' => 5,
            'total_price' => 500, // 100 * 5
            'status' => 'pending',
        ]);
    }

    public function test_cannot_create_reservation_if_capacity_exceeded(): void
    {
        $client = User::factory()->client()->create();
        $package = ServicePackage::factory()->create([
            'capacity' => 10,
        ]);

        // Existing reservation takes 8 spots
        Reservation::factory()->create([
            'service_package_id' => $package->id,
            'reservation_date' => '2027-01-01',
            'guests_count' => 8,
            'status' => 'confirmed',
        ]);

        $data = [
            'service_package_id' => $package->id,
            'reservation_date' => '2027-01-01',
            'guests_count' => 3, // 8 + 3 = 11 > 10
        ];

        $this->expectException(ValidationException::class);
        $this->service->createReservation($client, $data);
    }

    public function test_client_can_cancel_own_pending_reservation(): void
    {
        $client = User::factory()->client()->create();
        $reservation = Reservation::factory()->create([
            'client_id' => $client->id,
            'status' => 'pending',
        ]);

        $updated = $this->service->clientCancel($reservation, $client);

        $this->assertEquals('cancelled', $updated->status);
    }

    public function test_can_list_for_client(): void
    {
        $client = User::factory()->client()->create();
        Reservation::factory()->count(3)->create(['client_id' => $client->id]);
        Reservation::factory()->count(2)->create();

        $result = $this->service->listForClient($client);
        $this->assertCount(3, $result->items());
    }

    public function test_can_list_all(): void
    {
        Reservation::factory()->count(2)->create(['status' => 'pending']);
        Reservation::factory()->count(3)->create(['status' => 'confirmed']);

        $result = $this->service->listAll();
        $this->assertCount(5, $result->items());

        $filtered = $this->service->listAll(15, 'confirmed');
        $this->assertCount(3, $filtered->items());
    }

    public function test_client_cannot_cancel_others_reservation(): void
    {
        $client = User::factory()->client()->create();
        $otherClient = User::factory()->client()->create();
        $reservation = Reservation::factory()->create([
            'client_id' => $otherClient->id,
            'status' => 'pending',
        ]);

        $this->expectException(ValidationException::class);
        $this->service->clientCancel($reservation, $client);
    }

    public function test_client_cannot_cancel_confirmed_reservation(): void
    {
        $client = User::factory()->client()->create();
        $reservation = Reservation::factory()->create([
            'client_id' => $client->id,
            'status' => 'confirmed',
        ]);

        $this->expectException(ValidationException::class);
        $this->service->clientCancel($reservation, $client);
    }

    public function test_admin_can_update_status(): void
    {
        $reservation = Reservation::factory()->create(['status' => 'pending']);

        $updated = $this->service->adminUpdateStatus($reservation, 'confirmed');

        $this->assertEquals('confirmed', $updated->status);
    }

    public function test_admin_cannot_update_invalid_status(): void
    {
        $reservation = Reservation::factory()->create(['status' => 'cancelled']);

        $this->expectException(ValidationException::class);
        $this->service->adminUpdateStatus($reservation, 'confirmed');
    }
}
