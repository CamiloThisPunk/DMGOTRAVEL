<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\UpdateReservationStatusRequest;
use App\Http\Resources\ReservationResource;
use App\Models\Reservation;
use App\Services\Booking\ReservationService;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;

class ReservationController extends Controller
{
    public function __construct(
        private readonly ReservationService $reservationService
    ) {}

    /**
     * List all reservations (admin view).
     */
    public function index(Request $request): AnonymousResourceCollection
    {
        $reservations = $this->reservationService->listAll(
            $request->integer('per_page', 15),
            $request->string('status')->toString() ?: null
        );

        return ReservationResource::collection($reservations);
    }

    /**
     * Update a reservation's status.
     */
    public function updateStatus(
        UpdateReservationStatusRequest $request,
        Reservation $reservation
    ): ReservationResource {
        $reservation = $this->reservationService->adminUpdateStatus(
            $reservation,
            $request->validated('status')
        );

        return new ReservationResource($reservation);
    }
}
