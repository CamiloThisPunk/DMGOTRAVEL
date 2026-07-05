<?php

namespace Tests\Unit\Controllers\Client;

use App\Http\Controllers\Api\Client\ReservationController;
use App\Http\Requests\Client\StoreReservationRequest;
use App\Http\Resources\ReservationResource;
use App\Models\Reservation;
use App\Models\ServicePackage;
use App\Models\User;
use App\Services\Booking\ReservationService;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;
use Illuminate\Pagination\LengthAwarePaginator;
use Illuminate\Validation\ValidationException;
use Mockery;
use Mockery\MockInterface;
use PHPUnit\Framework\Attributes\Test;
use Tests\TestCase;

class ClientReservationControllerTest extends TestCase
{
    use RefreshDatabase;

    private ReservationService|MockInterface $reservationService;
    private ReservationController $controller;

    protected function setUp(): void
    {
        parent::setUp();
        $this->reservationService = Mockery::mock(ReservationService::class);
        $this->controller = new ReservationController($this->reservationService);
    }

    protected function tearDown(): void
    {
        Mockery::close();
        parent::tearDown();
    }

    // ─── INDEX ───────────────────────────────────────────────────

    #[Test]
    public function test_index_returns_collection_for_authenticated_client(): void
    {
        // Arrange
        $fakeUser = User::factory()->create();
        $paginator = new LengthAwarePaginator([], 0, 15);

        $request = Mockery::mock(Request::class);
        $request->shouldReceive('user')
            ->once()
            ->andReturn($fakeUser);
        $request->shouldReceive('integer')
            ->with('per_page', 15)
            ->andReturn(15);

        $this->reservationService->shouldReceive('listForClient')
            ->once()
            ->with(Mockery::on(fn ($u) => $u->id === $fakeUser->id), 15)
            ->andReturn($paginator);

        // Act
        $response = $this->controller->index($request);

        // Assert
        $this->assertInstanceOf(AnonymousResourceCollection::class, $response);
    }

    #[Test]
    public function test_index_passes_custom_per_page(): void
    {
        // Arrange
        $fakeUser = User::factory()->create();
        $paginator = new LengthAwarePaginator([], 0, 30);

        $request = Mockery::mock(Request::class);
        $request->shouldReceive('user')->andReturn($fakeUser);
        $request->shouldReceive('integer')
            ->with('per_page', 15)
            ->andReturn(30);

        $this->reservationService->shouldReceive('listForClient')
            ->once()
            ->with(Mockery::on(fn ($u) => $u->id === $fakeUser->id), 30)
            ->andReturn($paginator);

        // Act
        $response = $this->controller->index($request);

        // Assert
        $this->assertInstanceOf(AnonymousResourceCollection::class, $response);
    }

    // ─── STORE ───────────────────────────────────────────────────

    #[Test]
    public function test_store_returns_201_with_reservation_resource(): void
    {
        // Arrange
        $fakeUser = User::factory()->create();
        $package = ServicePackage::factory()->create(['price' => 1500.00]);
        $validatedData = [
            'service_package_id' => $package->id,
            'reservation_date' => '2026-08-15',
            'guests_count' => 3,
        ];

        $fakeReservation = Reservation::factory()->create([
            'client_id' => $fakeUser->id,
            'service_package_id' => $package->id,
            'status' => 'pending',
            'guests_count' => 3,
            'total_price' => 4500.00,
        ]);

        $request = Mockery::mock(StoreReservationRequest::class);
        $request->shouldReceive('user')
            ->once()
            ->andReturn($fakeUser);
        $request->shouldReceive('validated')
            ->once()
            ->withNoArgs()
            ->andReturn($validatedData);

        $this->reservationService->shouldReceive('createReservation')
            ->once()
            ->with(Mockery::on(fn ($u) => $u->id === $fakeUser->id), $validatedData)
            ->andReturn($fakeReservation);

        // Act
        $response = $this->controller->store($request);

        // Assert
        $this->assertInstanceOf(JsonResponse::class, $response);
        $this->assertEquals(201, $response->getStatusCode());
    }

    #[Test]
    public function test_store_propagates_capacity_validation_exception(): void
    {
        // Arrange
        $fakeUser = User::factory()->create();
        $validatedData = [
            'service_package_id' => 1,
            'reservation_date' => '2026-08-15',
            'guests_count' => 100,
        ];

        $request = Mockery::mock(StoreReservationRequest::class);
        $request->shouldReceive('user')->andReturn($fakeUser);
        $request->shouldReceive('validated')->andReturn($validatedData);

        $this->reservationService->shouldReceive('createReservation')
            ->once()
            ->andThrow(
                ValidationException::withMessages([
                    'guests_count' => ['Not enough capacity available for the selected date. Available: 5.'],
                ])
            );

        // Act & Assert
        $this->expectException(ValidationException::class);
        $this->controller->store($request);
    }

    // ─── CANCEL ──────────────────────────────────────────────────

    #[Test]
    public function test_cancel_returns_reservation_resource(): void
    {
        // Arrange
        $fakeUser = User::factory()->create();
        $package = ServicePackage::factory()->create();
        $reservation = Reservation::factory()->create([
            'client_id' => $fakeUser->id,
            'service_package_id' => $package->id,
            'status' => 'pending',
        ]);

        $cancelledReservation = $reservation->replicate();
        $cancelledReservation->id = $reservation->id;
        $cancelledReservation->status = 'cancelled';

        $request = Mockery::mock(Request::class);
        $request->shouldReceive('user')
            ->once()
            ->andReturn($fakeUser);

        $this->reservationService->shouldReceive('clientCancel')
            ->once()
            ->with(
                Mockery::on(fn ($r) => $r->id === $reservation->id),
                Mockery::on(fn ($u) => $u->id === $fakeUser->id)
            )
            ->andReturn($cancelledReservation);

        // Act
        $response = $this->controller->cancel($request, $reservation);

        // Assert
        $this->assertInstanceOf(ReservationResource::class, $response);
    }

    #[Test]
    public function test_cancel_throws_when_reservation_not_owned_by_client(): void
    {
        // Arrange
        $fakeUser = User::factory()->create();
        $otherUser = User::factory()->create();
        $package = ServicePackage::factory()->create();
        $reservation = Reservation::factory()->create([
            'client_id' => $otherUser->id,
            'service_package_id' => $package->id,
            'status' => 'pending',
        ]);

        $request = Mockery::mock(Request::class);
        $request->shouldReceive('user')->andReturn($fakeUser);

        $this->reservationService->shouldReceive('clientCancel')
            ->once()
            ->andThrow(
                ValidationException::withMessages([
                    'reservation' => ['You can only cancel your own reservations.'],
                ])
            );

        // Act & Assert
        $this->expectException(ValidationException::class);
        $this->controller->cancel($request, $reservation);
    }

    #[Test]
    public function test_cancel_throws_when_reservation_is_not_pending(): void
    {
        // Arrange
        $fakeUser = User::factory()->create();
        $package = ServicePackage::factory()->create();
        $reservation = Reservation::factory()->create([
            'client_id' => $fakeUser->id,
            'service_package_id' => $package->id,
            'status' => 'confirmed',
        ]);

        $request = Mockery::mock(Request::class);
        $request->shouldReceive('user')->andReturn($fakeUser);

        $this->reservationService->shouldReceive('clientCancel')
            ->once()
            ->andThrow(
                ValidationException::withMessages([
                    'status' => ['Only pending reservations can be cancelled.'],
                ])
            );

        // Act & Assert
        $this->expectException(ValidationException::class);
        $this->controller->cancel($request, $reservation);
    }
}
