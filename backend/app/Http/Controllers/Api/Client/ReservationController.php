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
use OpenApi\Attributes as OA;

class ReservationController extends Controller
{
    public function __construct(
        private readonly ReservationService $reservationService
    ) {}

    #[OA\Get(
        path: '/api/client/reservations',
        summary: 'List the authenticated client\'s reservations',
        security: [['bearerAuth' => []]],
        tags: ['Client Reservations'],
        responses: [
            new OA\Response(response: 200, description: 'Successful operation')
        ]
    )]
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

    #[OA\Post(
        path: '/api/client/reservations',
        summary: 'Create a new reservation',
        security: [['bearerAuth' => []]],
        tags: ['Client Reservations'],
        requestBody: new OA\RequestBody(
            required: true,
            content: new OA\JsonContent(
                required: ['service_package_id', 'reservation_date', 'guests_count'],
                properties: [
                    new OA\Property(property: 'service_package_id', type: 'integer'),
                    new OA\Property(property: 'reservation_date', type: 'string', format: 'date'),
                    new OA\Property(property: 'guests_count', type: 'integer')
                ]
            )
        ),
        responses: [
            new OA\Response(response: 201, description: 'Reservation created successfully')
        ]
    )]
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

    #[OA\Patch(
        path: '/api/client/reservations/{reservation}/cancel',
        summary: 'Cancel a pending reservation',
        security: [['bearerAuth' => []]],
        tags: ['Client Reservations'],
        parameters: [
            new OA\Parameter(name: 'reservation', description: 'Reservation ID', in: 'path', required: true, schema: new OA\Schema(type: 'integer'))
        ],
        responses: [
            new OA\Response(response: 200, description: 'Reservation cancelled successfully')
        ]
    )]
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
