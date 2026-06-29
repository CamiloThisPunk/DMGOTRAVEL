<?php

namespace App\Services\Catalog;

use App\Models\ServicePackage;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Support\Facades\Cache;

class CatalogService
{
    /**
     * List active service packages for public catalog.
     */
    public function listActive(int $perPage = 15, int $page = 1): LengthAwarePaginator
    {
        $cacheKey = "catalog.active_page_{$page}_per_{$perPage}";

        return Cache::remember($cacheKey, now()->addMinutes(30), function () use ($perPage, $page) {
            return ServicePackage::active()
                ->withCount('reservations')
                ->orderByDesc('reservations_count')
                ->orderBy('title')
                ->paginate(perPage: $perPage, page: $page);
        });
    }

    /**
     * Get a single active service package by ID.
     *
     * @throws \Illuminate\Database\Eloquent\ModelNotFoundException
     */
    public function findActiveOrFail(int $id): ServicePackage
    {
        $cacheKey = "catalog.active_package_{$id}";
        
        return Cache::remember($cacheKey, now()->addMinutes(30), function () use ($id) {
            return ServicePackage::active()->findOrFail($id);
        });
    }
}
