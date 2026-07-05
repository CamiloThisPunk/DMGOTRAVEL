<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;

class ServicePackage extends Model
{
    use HasFactory, SoftDeletes;
    protected $fillable = [
        'title',
        'type',
        'description',
        'itinerary',
        'price',
        'capacity',
        'duration',
        'image_360_url',
        'is_active',
    ];

    protected $casts = [
        'price' => 'decimal:2',
        'capacity' => 'integer',
        'duration' => 'integer',
        'is_active' => 'boolean',
        'itinerary' => 'array',
    ];

    /**
     * Scope to only active service packages (for public catalog).
     */
    public function scopeActive(\Illuminate\Database\Eloquent\Builder $query): \Illuminate\Database\Eloquent\Builder
    {
        return $query->where('is_active', true);
    }

    /**
     * Get all reservations for this service package.
     */
    public function reservations(): HasMany
    {
        return $this->hasMany(Reservation::class);
    }
}
