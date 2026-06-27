<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\StoreServicePackageRequest;
use App\Http\Requests\Admin\UpdateServicePackageRequest;
use App\Http\Resources\ServicePackageResource;
use App\Models\ServicePackage;
use App\Services\Catalog\PackageManagementService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;

class ServicePackageController extends Controller
{
    public function __construct(
        private readonly PackageManagementService $packageService
    ) {}

    public function index(Request $request): AnonymousResourceCollection
    {
        $perPage = $request->integer('per_page', 15);

        return ServicePackageResource::collection(
            $this->packageService->listAll($perPage)
        );
    }

    public function store(StoreServicePackageRequest $request): JsonResponse
    {
        $package = $this->packageService->create($request->validated());

        return (new ServicePackageResource($package))
            ->response()
            ->setStatusCode(201);
    }

    public function show(ServicePackage $service): ServicePackageResource
    {
        return new ServicePackageResource($service);
    }

    public function update(
        UpdateServicePackageRequest $request,
        ServicePackage $service
    ): ServicePackageResource {
        $package = $this->packageService->update($service, $request->validated());

        return new ServicePackageResource($package);
    }

    public function destroy(ServicePackage $service): JsonResponse
    {
        $this->packageService->deactivate($service);

        return response()->json(null, 204);
    }
}
