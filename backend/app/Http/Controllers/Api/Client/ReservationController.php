<?php

namespace App\Http\Controllers\Api\Client;

use App\Http\Controllers\Controller;
use App\Http\Requests\Client\StoreReservationRequest;
use App\Http\Resources\ReservationResource;
use App\Services\Booking\ReservationService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;
use App\Models\Reservation;

class ReservationController extends Controller
{
    public function __construct(
        private readonly ReservationService $reservationService
    ) {}

    /**
     * List the authenticated client's reservations.
     */
    public function index(Request $request): AnonymousResourceCollection
    {
        $reservations = $this->reservationService->listForClient(
            $request->user(),
            $request->integer('per_page', 15)
        );

        return ReservationResource::collection($reservations);
    }

    /**
     * Create a new reservation for the authenticated client.
     */
    public function store(StoreReservationRequest $request): JsonResponse
    {
        $reservation = $this->reservationService->createReservation(
            $request->user(),
            $request->validated()
        );

        return (new ReservationResource($reservation))
            ->response()
            ->setStatusCode(201);
    }

    /**
     * Cancel a pending reservation.
     */
    public function cancel(Request $request, Reservation $reservation): ReservationResource
    {
        $reservation = $this->reservationService->clientCancel(
            $reservation,
            $request->user()
        );

        return new ReservationResource($reservation);
    }
}
