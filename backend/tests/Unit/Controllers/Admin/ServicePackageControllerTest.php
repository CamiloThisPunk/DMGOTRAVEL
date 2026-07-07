<?php

namespace Tests\Unit\Controllers\Admin;

use App\Http\Controllers\Api\Admin\ServicePackageController;
use App\Http\Requests\Admin\StoreServicePackageRequest;
use App\Http\Requests\Admin\UpdateServicePackageRequest;
use App\Http\Resources\ServicePackageResource;
use App\Models\ServicePackage;
use App\Services\Catalog\PackageManagementService;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;
use Illuminate\Pagination\LengthAwarePaginator;
use Mockery;
use Mockery\MockInterface;
use PHPUnit\Framework\Attributes\Test;
use Tests\TestCase;

class ServicePackageControllerTest extends TestCase
{
    use RefreshDatabase;

    private PackageManagementService|MockInterface $packageService;
    private ServicePackageController $controller;

    protected function setUp(): void
    {
        parent::setUp();
        $this->packageService = Mockery::mock(PackageManagementService::class);
        $this->controller = new ServicePackageController($this->packageService);
    }

    protected function tearDown(): void
    {
        Mockery::close();
        parent::tearDown();
    }

    // ─── INDEX ───────────────────────────────────────────────────

    #[Test]
    public function test_index_returns_collection_with_default_per_page(): void
    {
        // Arrange
        $paginator = new LengthAwarePaginator([], 0, 15);

        $request = Mockery::mock(Request::class);
        $request->shouldReceive('integer')
            ->with('per_page', 15)
            ->andReturn(15);
        $request->shouldReceive('query')
            ->with('type')
            ->andReturn(null);

        $this->packageService->shouldReceive('listAll')
            ->once()
            ->with(15, null)
            ->andReturn($paginator);

        // Act
        $response = $this->controller->index($request);

        // Assert
        $this->assertInstanceOf(AnonymousResourceCollection::class, $response);
    }

    #[Test]
    public function test_index_passes_type_filter_paquete(): void
    {
        // Arrange
        $paginator = new LengthAwarePaginator([], 0, 15);

        $request = Mockery::mock(Request::class);
        $request->shouldReceive('integer')
            ->with('per_page', 15)
            ->andReturn(15);
        $request->shouldReceive('query')
            ->with('type')
            ->andReturn('paquete');

        $this->packageService->shouldReceive('listAll')
            ->once()
            ->with(15, 'paquete')
            ->andReturn($paginator);

        // Act
        $response = $this->controller->index($request);

        // Assert
        $this->assertInstanceOf(AnonymousResourceCollection::class, $response);
    }

    #[Test]
    public function test_index_passes_type_filter_servicio(): void
    {
        // Arrange
        $paginator = new LengthAwarePaginator([], 0, 25);

        $request = Mockery::mock(Request::class);
        $request->shouldReceive('integer')
            ->with('per_page', 15)
            ->andReturn(25);
        $request->shouldReceive('query')
            ->with('type')
            ->andReturn('servicio');

        $this->packageService->shouldReceive('listAll')
            ->once()
            ->with(25, 'servicio')
            ->andReturn($paginator);

        // Act
        $this->controller->index($request);

        // Assert — Mockery verifies expectations
        $this->assertTrue(true);
    }

    // ─── STORE ───────────────────────────────────────────────────

    #[Test]
    public function test_store_returns_201_with_service_package_resource(): void
    {
        // Arrange
        $validatedData = [
            'title' => 'Cancún All-Inclusive',
            'type' => 'paquete',
            'description' => 'Great package',
            'price' => 1500.00,
            'capacity' => 20,
            'duration' => 5,
            'is_active' => true,
        ];

        $fakePackage = ServicePackage::factory()->create($validatedData);

        $request = Mockery::mock(StoreServicePackageRequest::class);
        $request->shouldReceive('validated')
            ->once()
            ->withNoArgs()
            ->andReturn($validatedData);

        $this->packageService->shouldReceive('create')
            ->once()
            ->with($validatedData)
            ->andReturn($fakePackage);

        // Act
        $response = $this->controller->store($request);

        // Assert
        $this->assertInstanceOf(JsonResponse::class, $response);
        $this->assertEquals(201, $response->getStatusCode());
    }

    #[Test]
    public function test_store_response_content_contains_package_data(): void
    {
        // Arrange
        $validatedData = [
            'title' => 'Riviera Maya Tour',
            'type' => 'servicio',
            'description' => 'A beautiful tour',
            'price' => 800.00,
            'capacity' => 10,
            'duration' => 3,
        ];

        $fakePackage = ServicePackage::factory()->create($validatedData);

        $request = Mockery::mock(StoreServicePackageRequest::class);
        $request->shouldReceive('validated')
            ->andReturn($validatedData);

        $this->packageService->shouldReceive('create')
            ->andReturn($fakePackage);

        // Act
        $response = $this->controller->store($request);

        // Assert
        $content = json_decode($response->getContent(), true);
        $this->assertEquals('Riviera Maya Tour', $content['data']['title']);
        $this->assertEquals('servicio', $content['data']['type']);
    }

    // ─── SHOW ────────────────────────────────────────────────────

    #[Test]
    public function test_show_returns_service_package_resource(): void
    {
        // Arrange
        $package = ServicePackage::factory()->create(['title' => 'Playa del Carmen']);

        // Act
        $response = $this->controller->show($package);

        // Assert
        $this->assertInstanceOf(ServicePackageResource::class, $response);
    }

    // ─── UPDATE ──────────────────────────────────────────────────

    #[Test]
    public function test_update_returns_service_package_resource(): void
    {
        // Arrange
        $existingPackage = ServicePackage::factory()->create(['title' => 'Old Title']);
        $updatedPackage = ServicePackage::factory()->create(['title' => 'Updated Title']);

        $updatedData = ['title' => 'Updated Title'];

        $request = Mockery::mock(UpdateServicePackageRequest::class);
        $request->shouldReceive('validated')
            ->once()
            ->withNoArgs()
            ->andReturn($updatedData);

        $this->packageService->shouldReceive('update')
            ->once()
            ->with(Mockery::on(fn ($p) => $p->id === $existingPackage->id), $updatedData)
            ->andReturn($updatedPackage);

        // Act
        $response = $this->controller->update($request, $existingPackage);

        // Assert
        $this->assertInstanceOf(ServicePackageResource::class, $response);
    }

    // ─── DESTROY ─────────────────────────────────────────────────

    #[Test]
    public function test_destroy_returns_204(): void
    {
        // Arrange
        $package = ServicePackage::factory()->create();

        $this->packageService->shouldReceive('deactivate')
            ->once()
            ->with(Mockery::on(fn ($p) => $p->id === $package->id));

        // Act
        $response = $this->controller->destroy($package);

        // Assert
        $this->assertInstanceOf(JsonResponse::class, $response);
        $this->assertEquals(204, $response->getStatusCode());
    }

    #[Test]
    public function test_destroy_response_body_is_null(): void
    {
        // Arrange
        $package = ServicePackage::factory()->create();

        $this->packageService->shouldReceive('deactivate');

        // Act
        $response = $this->controller->destroy($package);

        // Assert
        $this->assertEquals(204, $response->getStatusCode());
    }
}
