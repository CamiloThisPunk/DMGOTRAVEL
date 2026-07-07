<?php

namespace Tests\Unit\Controllers\Public;

use App\Http\Controllers\Api\Public\CatalogController;
use App\Http\Resources\ServicePackageResource;
use App\Models\ServicePackage;
use App\Services\Catalog\CatalogService;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;
use Illuminate\Pagination\LengthAwarePaginator;
use Mockery;
use Mockery\MockInterface;
use PHPUnit\Framework\Attributes\Test;
use Tests\TestCase;

class CatalogControllerTest extends TestCase
{
    use RefreshDatabase;

    private CatalogService|MockInterface $catalogService;
    private CatalogController $controller;

    protected function setUp(): void
    {
        parent::setUp();
        $this->catalogService = Mockery::mock(CatalogService::class);
        $this->controller = new CatalogController($this->catalogService);
    }

    protected function tearDown(): void
    {
        Mockery::close();
        parent::tearDown();
    }

    // ─── INDEX ───────────────────────────────────────────────────

    #[Test]
    public function test_index_returns_collection_with_defaults(): void
    {
        // Arrange
        $paginator = new LengthAwarePaginator([], 0, 15);

        $request = Mockery::mock(Request::class);
        $request->shouldReceive('integer')
            ->with('per_page', 15)
            ->andReturn(15);
        $request->shouldReceive('integer')
            ->with('page', 1)
            ->andReturn(1);
        $request->shouldReceive('query')
            ->with('type')
            ->andReturn(null);

        $this->catalogService->shouldReceive('listActive')
            ->once()
            ->with(15, 1, null)
            ->andReturn($paginator);

        // Act
        $response = $this->controller->index($request);

        // Assert
        $this->assertInstanceOf(AnonymousResourceCollection::class, $response);
    }

    #[Test]
    public function test_index_passes_custom_per_page_and_page(): void
    {
        // Arrange
        $paginator = new LengthAwarePaginator([], 0, 10);

        $request = Mockery::mock(Request::class);
        $request->shouldReceive('integer')
            ->with('per_page', 15)
            ->andReturn(10);
        $request->shouldReceive('integer')
            ->with('page', 1)
            ->andReturn(3);
        $request->shouldReceive('query')
            ->with('type')
            ->andReturn(null);

        $this->catalogService->shouldReceive('listActive')
            ->once()
            ->with(10, 3, null)
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
        $request->shouldReceive('integer')
            ->with('page', 1)
            ->andReturn(1);
        $request->shouldReceive('query')
            ->with('type')
            ->andReturn('paquete');

        $this->catalogService->shouldReceive('listActive')
            ->once()
            ->with(15, 1, 'paquete')
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
        $paginator = new LengthAwarePaginator([], 0, 15);

        $request = Mockery::mock(Request::class);
        $request->shouldReceive('integer')
            ->with('per_page', 15)
            ->andReturn(15);
        $request->shouldReceive('integer')
            ->with('page', 1)
            ->andReturn(1);
        $request->shouldReceive('query')
            ->with('type')
            ->andReturn('servicio');

        $this->catalogService->shouldReceive('listActive')
            ->once()
            ->with(15, 1, 'servicio')
            ->andReturn($paginator);

        // Act
        $response = $this->controller->index($request);

        // Assert
        $this->assertInstanceOf(AnonymousResourceCollection::class, $response);
    }

    // ─── SHOW ────────────────────────────────────────────────────

    #[Test]
    public function test_show_returns_service_package_resource(): void
    {
        // Arrange
        $fakePackage = ServicePackage::factory()->create(['title' => 'Tulum Adventure']);

        $this->catalogService->shouldReceive('findActiveOrFail')
            ->once()
            ->with($fakePackage->id)
            ->andReturn($fakePackage);

        // Act
        $response = $this->controller->show($fakePackage->id);

        // Assert
        $this->assertInstanceOf(ServicePackageResource::class, $response);
    }

    #[Test]
    public function test_show_throws_model_not_found_when_package_inactive(): void
    {
        // Arrange
        $this->catalogService->shouldReceive('findActiveOrFail')
            ->once()
            ->with(999)
            ->andThrow(new ModelNotFoundException());

        // Act & Assert
        $this->expectException(ModelNotFoundException::class);
        $this->controller->show(999);
    }

    #[Test]
    public function test_show_throws_model_not_found_when_package_does_not_exist(): void
    {
        // Arrange
        $this->catalogService->shouldReceive('findActiveOrFail')
            ->once()
            ->with(0)
            ->andThrow(new ModelNotFoundException());

        // Act & Assert
        $this->expectException(ModelNotFoundException::class);
        $this->controller->show(0);
    }
}
