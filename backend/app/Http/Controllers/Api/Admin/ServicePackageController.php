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
use OpenApi\Attributes as OA;

class ServicePackageController extends Controller
{
    public function __construct(
        private readonly PackageManagementService $packageService
    ) {}

    #[OA\Get(
        path: '/api/admin/services',
        summary: 'List all service packages (Admin)',
        security: [['bearerAuth' => []]],
        tags: ['Admin Services'],
        responses: [
            new OA\Response(response: 200, description: 'Successful operation')
        ]
    )]
    public function index(Request $request): AnonymousResourceCollection
    {
        $perPage = $request->integer('per_page', 15);
        $type = $request->query('type');

        return ServicePackageResource::collection(
            $this->packageService->listAll($perPage, $type)
        );
    }

    #[OA\Post(
        path: '/api/admin/services',
        summary: 'Create a new service package',
        security: [['bearerAuth' => []]],
        tags: ['Admin Services'],
        requestBody: new OA\RequestBody(
            required: true,
            content: new OA\JsonContent(
                required: ['title', 'description', 'price', 'capacity', 'duration_days'],
                properties: [
                    new OA\Property(property: 'title', type: 'string'),
                    new OA\Property(property: 'description', type: 'string'),
                    new OA\Property(property: 'price', type: 'number'),
                    new OA\Property(property: 'capacity', type: 'integer'),
                    new OA\Property(property: 'duration_days', type: 'integer'),
                    new OA\Property(property: 'is_active', type: 'boolean')
                ]
            )
        ),
        responses: [
            new OA\Response(response: 201, description: 'Package created successfully')
        ]
    )]
    public function store(StoreServicePackageRequest $request): JsonResponse
    {
        $package = $this->packageService->create($request->validated());

        return (new ServicePackageResource($package))
            ->response()
            ->setStatusCode(201);
    }

    #[OA\Get(
        path: '/api/admin/services/{service}',
        summary: 'Show a specific service package',
        security: [['bearerAuth' => []]],
        tags: ['Admin Services'],
        parameters: [
            new OA\Parameter(name: 'service', description: 'Package ID', in: 'path', required: true, schema: new OA\Schema(type: 'integer'))
        ],
        responses: [
            new OA\Response(response: 200, description: 'Successful operation')
        ]
    )]
    public function show(ServicePackage $service): ServicePackageResource
    {
        return new ServicePackageResource($service);
    }

    #[OA\Patch(
        path: '/api/admin/services/{service}',
        summary: 'Update a service package',
        security: [['bearerAuth' => []]],
        tags: ['Admin Services'],
        parameters: [
            new OA\Parameter(name: 'service', description: 'Package ID', in: 'path', required: true, schema: new OA\Schema(type: 'integer'))
        ],
        requestBody: new OA\RequestBody(
            required: false,
            content: new OA\JsonContent(
                properties: [
                    new OA\Property(property: 'title', type: 'string'),
                    new OA\Property(property: 'description', type: 'string'),
                    new OA\Property(property: 'price', type: 'number'),
                    new OA\Property(property: 'capacity', type: 'integer'),
                    new OA\Property(property: 'duration_days', type: 'integer'),
                    new OA\Property(property: 'is_active', type: 'boolean')
                ]
            )
        ),
        responses: [
            new OA\Response(response: 200, description: 'Package updated successfully')
        ]
    )]
    public function update(
        UpdateServicePackageRequest $request,
        ServicePackage $service
    ): ServicePackageResource {
        $package = $this->packageService->update($service, $request->validated());

        return new ServicePackageResource($package);
    }

    #[OA\Delete(
        path: '/api/admin/services/{service}',
        summary: 'Deactivate/Delete a service package',
        security: [['bearerAuth' => []]],
        tags: ['Admin Services'],
        parameters: [
            new OA\Parameter(name: 'service', description: 'Package ID', in: 'path', required: true, schema: new OA\Schema(type: 'integer'))
        ],
        responses: [
            new OA\Response(response: 204, description: 'Package deactivated successfully')
        ]
    )]
    public function destroy(ServicePackage $service): JsonResponse
    {
        $this->packageService->deactivate($service);

        return response()->json(null, 204);
    }
}
