<?php

namespace Tests\Unit\Controllers\Admin;

use App\Http\Controllers\Api\Admin\ReservationController;
use App\Http\Requests\Admin\UpdateReservationStatusRequest;
use App\Http\Resources\ReservationResource;
use App\Models\Reservation;
use App\Models\ServicePackage;
use App\Models\User;
use App\Services\Booking\ReservationService;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;
use Illuminate\Pagination\LengthAwarePaginator;
use Illuminate\Support\Stringable;
use Illuminate\Validation\ValidationException;
use Mockery;
use Mockery\MockInterface;
use PHPUnit\Framework\Attributes\Test;
use Tests\TestCase;

class AdminReservationControllerTest extends TestCase
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
    public function test_index_returns_collection_with_default_pagination(): void
    {
        // Arrange
        $paginator = new LengthAwarePaginator([], 0, 15);

        $request = Mockery::mock(Request::class);
        $request->shouldReceive('integer')
            ->with('per_page', 15)
            ->andReturn(15);
        $request->shouldReceive('string')
            ->with('status')
            ->andReturn(new Stringable(''));

        $this->reservationService->shouldReceive('listAll')
            ->once()
            ->with(15, null)
            ->andReturn($paginator);

        // Act
        $response = $this->controller->index($request);

        // Assert
        $this->assertInstanceOf(AnonymousResourceCollection::class, $response);
    }

    #[Test]
    public function test_index_passes_custom_per_page_and_status_filter(): void
    {
        // Arrange
        $paginator = new LengthAwarePaginator([], 0, 10);

        $request = Mockery::mock(Request::class);
        $request->shouldReceive('integer')
            ->with('per_page', 15)
            ->andReturn(10);
        $request->shouldReceive('string')
            ->with('status')
            ->andReturn(new Stringable('confirmed'));

        $this->reservationService->shouldReceive('listAll')
            ->once()
            ->with(10, 'confirmed')
            ->andReturn($paginator);

        // Act
        $response = $this->controller->index($request);

        // Assert
        $this->assertInstanceOf(AnonymousResourceCollection::class, $response);
    }

    #[Test]
    public function test_index_passes_null_status_when_empty_string(): void
    {
        // Arrange
        $paginator = new LengthAwarePaginator([], 0, 15);

        $request = Mockery::mock(Request::class);
        $request->shouldReceive('integer')
            ->with('per_page', 15)
            ->andReturn(15);
        $request->shouldReceive('string')
            ->with('status')
            ->andReturn(new Stringable(''));

        $this->reservationService->shouldReceive('listAll')
            ->once()
            ->with(15, null)
            ->andReturn($paginator);

        // Act
        $this->controller->index($request);

        // Assert — Mockery expectations verify the null was passed
        $this->assertTrue(true);
    }

    #[Test]
    public function test_index_passes_pending_status_filter(): void
    {
        // Arrange
        $paginator = new LengthAwarePaginator([], 0, 15);

        $request = Mockery::mock(Request::class);
        $request->shouldReceive('integer')
            ->with('per_page', 15)
            ->andReturn(15);
        $request->shouldReceive('string')
            ->with('status')
            ->andReturn(new Stringable('pending'));

        $this->reservationService->shouldReceive('listAll')
            ->once()
            ->with(15, 'pending')
            ->andReturn($paginator);

        // Act
        $response = $this->controller->index($request);

        // Assert
        $this->assertInstanceOf(AnonymousResourceCollection::class, $response);
    }

    // ─── UPDATE STATUS ──────────────────────────────────────────

    #[Test]
    public function test_update_status_returns_reservation_resource(): void
    {
        // Arrange
        $client = User::factory()->create();
        $package = ServicePackage::factory()->create();
        $reservation = Reservation::factory()->create([
            'client_id' => $client->id,
            'service_package_id' => $package->id,
            'status' => 'pending',
        ]);

        $updatedReservation = $reservation->replicate();
        $updatedReservation->id = $reservation->id;
        $updatedReservation->status = 'confirmed';

        $request = Mockery::mock(UpdateReservationStatusRequest::class);
        $request->shouldReceive('validated')
            ->once()
            ->with('status')
            ->andReturn('confirmed');

        $this->reservationService->shouldReceive('adminUpdateStatus')
            ->once()
            ->with(Mockery::on(fn ($r) => $r->id === $reservation->id), 'confirmed')
            ->andReturn($updatedReservation);

        // Act
        $response = $this->controller->updateStatus($request, $reservation);

        // Assert
        $this->assertInstanceOf(ReservationResource::class, $response);
    }

    #[Test]
    public function test_update_status_delegates_cancel_to_service(): void
    {
        // Arrange
        $client = User::factory()->create();
        $package = ServicePackage::factory()->create();
        $reservation = Reservation::factory()->create([
            'client_id' => $client->id,
            'service_package_id' => $package->id,
            'status' => 'confirmed',
        ]);

        $cancelledReservation = $reservation->replicate();
        $cancelledReservation->id = $reservation->id;
        $cancelledReservation->status = 'cancelled';

        $request = Mockery::mock(UpdateReservationStatusRequest::class);
        $request->shouldReceive('validated')
            ->with('status')
            ->andReturn('cancelled');

        $this->reservationService->shouldReceive('adminUpdateStatus')
            ->once()
            ->with(Mockery::on(fn ($r) => $r->id === $reservation->id), 'cancelled')
            ->andReturn($cancelledReservation);

        // Act
        $response = $this->controller->updateStatus($request, $reservation);

        // Assert
        $this->assertInstanceOf(ReservationResource::class, $response);
    }

    #[Test]
    public function test_update_status_propagates_validation_exception_from_service(): void
    {
        // Arrange
        $client = User::factory()->create();
        $package = ServicePackage::factory()->create();
        $reservation = Reservation::factory()->create([
            'client_id' => $client->id,
            'service_package_id' => $package->id,
            'status' => 'completed',
        ]);

        $request = Mockery::mock(UpdateReservationStatusRequest::class);
        $request->shouldReceive('validated')
            ->with('status')
            ->andReturn('confirmed');

        $this->reservationService->shouldReceive('adminUpdateStatus')
            ->once()
            ->andThrow(
                ValidationException::withMessages([
                    'status' => ["Cannot transition from 'completed' to 'confirmed'."],
                ])
            );

        // Act & Assert
        $this->expectException(ValidationException::class);
        $this->controller->updateStatus($request, $reservation);
    }
}
