<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Reservation extends Model
{
    use HasFactory;
    protected $fillable = [
        'client_id',
        'service_package_id',
        'reservation_date',
        'guests_count',
        'status',
        'total_price',
    ];

    protected $casts = [
        'reservation_date' => 'date',
        'guests_count' => 'integer',
        'total_price' => 'decimal:2',
    ];

    /**
     * Valid status transitions.
     */
    public const STATUS_TRANSITIONS = [
        'pending' => ['confirmed', 'cancelled'],
        'confirmed' => ['completed', 'cancelled'],
        'cancelled' => [],
        'completed' => [],
    ];

    public function client(): BelongsTo
    {
        return $this->belongsTo(User::class, 'client_id');
    }

    public function servicePackage(): BelongsTo
    {
        return $this->belongsTo(ServicePackage::class);
    }

    /**
     * Check if transition to given status is valid.
     */
    public function canTransitionTo(string $newStatus): bool
    {
        $allowed = self::STATUS_TRANSITIONS[$this->status] ?? [];

        return in_array($newStatus, $allowed, true);
    }

    /**
     * Scope for a specific client.
     */
    public function scopeForClient(
        \Illuminate\Database\Eloquent\Builder $query,
        int $clientId
    ): \Illuminate\Database\Eloquent\Builder {
        return $query->where('client_id', $clientId);
    }
}
