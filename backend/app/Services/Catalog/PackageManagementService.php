<?php

namespace App\Services\Catalog;

use App\Models\AuditLog;
use App\Models\Reservation;
use App\Models\ServicePackage;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\DB;
use App\Services\Media\ImageUploadService;

class PackageManagementService
{
    protected ImageUploadService $imageUploadService;

    public function __construct(ImageUploadService $imageUploadService)
    {
        $this->imageUploadService = $imageUploadService;
    }

    /**
     * List all service packages for admin (including inactive).
     */
    public function listAll(int $perPage = 15, ?string $type = null): LengthAwarePaginator
    {
        $query = ServicePackage::query();
        if ($type) {
            $query->where('type', $type);
        }
        return $query->orderBy('created_at', 'desc')
            ->paginate($perPage);
    }

    /**
     * Find a service package by ID (including inactive).
     */
    public function findOrFail(int $id): ServicePackage
    {
        return ServicePackage::findOrFail($id);
    }

    /**
     * Create a new service package.
     *
     * @param array<string, mixed> $data
     */
    public function create(array $data): ServicePackage
    {
        if (isset($data['image_360'])) {
            $data['image_360_url'] = $this->imageUploadService->storeImage($data['image_360']);
            unset($data['image_360']);
        }
        
        if (isset($data['itinerary']) && is_string($data['itinerary'])) {
            $data['itinerary'] = json_decode($data['itinerary'], true);
        }

        $package = ServicePackage::create($data);
        $package->refresh();

        $this->logAction('service_package.created', $package, null, $package->toArray());

        Cache::flush();

        return $package;
    }

    /**
     * Update an existing service package.
     *
     * @param array<string, mixed> $data
     */
    public function update(ServicePackage $package, array $data): ServicePackage
    {
        $oldValues = $package->toArray();

        if (isset($data['image_360'])) {
            $this->imageUploadService->deleteImage($package->image_360_url);
            $data['image_360_url'] = $this->imageUploadService->storeImage($data['image_360']);
            unset($data['image_360']);
        }

        if (isset($data['itinerary']) && is_string($data['itinerary'])) {
            $data['itinerary'] = json_decode($data['itinerary'], true);
        }

        $package->update($data);

        // Sync total_price on active reservations when price changes
        if (isset($data['price']) && (float) $data['price'] !== (float) $oldValues['price']) {
            Reservation::where('service_package_id', $package->id)
                ->whereIn('status', ['pending', 'confirmed'])
                ->update([
                    'total_price' => DB::raw('guests_count * ' . (float) $data['price']),
                ]);
        }

        $this->logAction(
            'service_package.updated',
            $package,
            $oldValues,
            $package->fresh()->toArray()
        );

        Cache::flush();

        return $package->fresh();
    }

    /**
     * Deactivate a service package (soft action via is_active flag).
     */
    public function deactivate(ServicePackage $package): ServicePackage
    {
        $oldValues = ['is_active' => $package->is_active];

        $package->update(['is_active' => false]);
        $package->delete();

        $this->logAction(
            'service_package.deactivated',
            $package,
            $oldValues,
            ['is_active' => false]
        );

        Cache::flush();

        return $package;
    }

    /**
     * Log an audit action for a service package.
     */
    private function logAction(
        string $action,
        ServicePackage $package,
        ?array $oldValues,
        ?array $newValues
    ): void {
        AuditLog::create([
            'user_id' => Auth::id(),
            'action' => $action,
            'entity_type' => ServicePackage::class,
            'entity_id' => $package->id,
            'old_values' => $oldValues,
            'new_values' => $newValues,
            'created_at' => now(),
        ]);
    }
}
