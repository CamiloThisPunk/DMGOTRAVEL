<?php

namespace App\Http\Controllers\Api\Public;

use App\Http\Controllers\Controller;
use App\Http\Resources\ServicePackageResource;
use App\Services\Catalog\CatalogService;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;
use OpenApi\Attributes as OA;

class CatalogController extends Controller
{
    public function __construct(
        private readonly CatalogService $catalogService
    ) {}

    #[OA\Get(
        path: '/api/services',
        summary: 'List active service packages',
        tags: ['Catalog'],
        responses: [
            new OA\Response(response: 200, description: 'Successful operation')
        ]
    )]
    /**
     * List active service packages for the public catalog.
     */
    public function index(Request $request): AnonymousResourceCollection
    {
        $perPage = $request->integer('per_page', 15);
        $page = $request->integer('page', 1);
        $packages = $this->catalogService->listActive($perPage, $page);

        return ServicePackageResource::collection($packages);
    }

    /**
     * Show a single active service package.
     */
    public function show(int $servicePackage): ServicePackageResource
    {
        $package = $this->catalogService->findActiveOrFail($servicePackage);

        return new ServicePackageResource($package);
    }
}
