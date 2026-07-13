<?php

namespace App\Services\Booking;

use App\Models\AuditLog;
use App\Models\Reservation;
use App\Models\ServicePackage;
use App\Models\User;
use App\Services\Media\ImageUploadService;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;

class ReservationService
{
    public function __construct(
        private readonly ImageUploadService $imageUploadService
    ) {}
    /**
     * List reservations for a specific client.
     */
    public function listForClient(User $client, int $perPage = 15): LengthAwarePaginator
    {
        return Reservation::forClient($client->id)
            ->with('servicePackage')
            ->orderBy('created_at', 'desc')
            ->paginate($perPage);
    }

    /**
     * List all reservations (admin).
     */
    public function listAll(int $perPage = 15, ?string $status = null): LengthAwarePaginator
    {
        $query = Reservation::with(['client', 'servicePackage'])
            ->orderBy('created_at', 'desc');

        if ($status) {
            $query->where('status', $status);
        }

        return $query->paginate($perPage);
    }

    /**
     * Create a new reservation within a DB transaction.
     *
     * Validates capacity and calculates total price.
     *
     * @param array{service_package_id: int, reservation_date: string, guests_count: int, special_requests?: string} $data
     *
     * @throws ValidationException
     */
    public function createReservation(User $client, array $data, $voucherFile = null): Reservation
    {
        return DB::transaction(function () use ($client, $data, $voucherFile) {
            $package = ServicePackage::active()->lockForUpdate()->findOrFail($data['service_package_id']);

            $this->validateCapacity($package, $data['reservation_date'], $data['guests_count']);

            $totalPrice = $package->price * $data['guests_count'];

            // Handle voucher upload
            $voucherUrl = null;
            if ($voucherFile) {
                $voucherPath = $this->imageUploadService->storeImage($voucherFile, 'vouchers');
                $voucherUrl = asset('storage/' . $voucherPath);
            }

            $reservation = Reservation::create([
                'client_id' => $client->id,
                'service_package_id' => $package->id,
                'reservation_date' => $data['reservation_date'],
                'guests_count' => $data['guests_count'],
                'status' => 'pending',
                'total_price' => $totalPrice,
                'payment_voucher_url' => $voucherUrl,
                'special_requests' => $data['special_requests'] ?? null,
            ]);

            $this->logAction(
                'reservation.created',
                $reservation,
                null,
                $reservation->toArray()
            );

            return $reservation->load('servicePackage');
        });
    }

    /**
     * Client cancels their own pending reservation.
     *
     * @throws ValidationException
     */
    public function clientCancel(Reservation $reservation, User $client): Reservation
    {
        if ($reservation->client_id !== $client->id) {
            throw ValidationException::withMessages([
                'reservation' => ['You can only cancel your own reservations.'],
            ]);
        }

        if ($reservation->status !== 'pending') {
            throw ValidationException::withMessages([
                'status' => ['Only pending reservations can be cancelled.'],
            ]);
        }

        return $this->updateStatus($reservation, 'cancelled');
    }

    /**
     * Admin updates a reservation status.
     *
     * @throws ValidationException
     */
    public function adminUpdateStatus(Reservation $reservation, string $newStatus): Reservation
    {
        if (!$reservation->canTransitionTo($newStatus)) {
            throw ValidationException::withMessages([
                'status' => [
                    "Cannot transition from '{$reservation->status}' to '{$newStatus}'.",
                ],
            ]);
        }

        return $this->updateStatus($reservation, $newStatus);
    }

    /**
     * Validate that there is enough capacity for the requested date.
     *
     * @throws ValidationException
     */
    private function validateCapacity(
        ServicePackage $package,
        string $date,
        int $guestsCount
    ): void {
        $bookedGuests = Reservation::where('service_package_id', $package->id)
            ->whereDate('reservation_date', $date)
            ->whereIn('status', ['pending', 'confirmed'])
            ->sum('guests_count');

        $available = $package->capacity - $bookedGuests;

        if ($guestsCount > $available) {
            throw ValidationException::withMessages([
                'guests_count' => [
                    "Not enough capacity available for the selected date. Available: {$available}.",
                ],
            ]);
        }
    }

    /**
     * Perform the actual status update with audit logging.
     */
    private function updateStatus(Reservation $reservation, string $newStatus): Reservation
    {
        return DB::transaction(function () use ($reservation, $newStatus) {
            $oldStatus = $reservation->status;

            $reservation->update(['status' => $newStatus]);

            $this->logAction(
                'reservation.status_updated',
                $reservation,
                ['status' => $oldStatus],
                ['status' => $newStatus]
            );

            return $reservation->fresh(['servicePackage', 'client']);
        });
    }

    /**
     * Log an audit action.
     */
    private function logAction(
        string $action,
        Reservation $reservation,
        ?array $oldValues,
        ?array $newValues
    ): void {
        AuditLog::create([
            'user_id' => Auth::id(),
            'action' => $action,
            'entity_type' => Reservation::class,
            'entity_id' => $reservation->id,
            'old_values' => $oldValues,
            'new_values' => $newValues,
            'created_at' => now(),
        ]);
    }
}
