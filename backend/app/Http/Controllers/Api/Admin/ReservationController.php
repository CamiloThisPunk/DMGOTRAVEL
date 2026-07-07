<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\UpdateReservationStatusRequest;
use App\Http\Resources\ReservationResource;
use App\Models\Reservation;
use App\Services\Booking\ReservationService;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;
use OpenApi\Attributes as OA;

class ReservationController extends Controller
{
    public function __construct(
        private readonly ReservationService $reservationService
    ) {}

    #[OA\Get(
        path: '/api/admin/reservations',
        summary: 'List all reservations (Admin)',
        security: [['bearerAuth' => []]],
        tags: ['Admin Reservations'],
        responses: [
            new OA\Response(response: 200, description: 'Successful operation')
        ]
    )]
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

    #[OA\Patch(
        path: '/api/admin/reservations/{reservation}/status',
        summary: 'Update a reservation status',
        security: [['bearerAuth' => []]],
        tags: ['Admin Reservations'],
        parameters: [
            new OA\Parameter(name: 'reservation', description: 'Reservation ID', in: 'path', required: true, schema: new OA\Schema(type: 'integer'))
        ],
        requestBody: new OA\RequestBody(
            required: true,
            content: new OA\JsonContent(
                required: ['status'],
                properties: [
                    new OA\Property(property: 'status', type: 'string', enum: ['pending', 'confirmed', 'cancelled', 'completed'])
                ]
            )
        ),
        responses: [
            new OA\Response(response: 200, description: 'Status updated successfully')
        ]
    )]
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
