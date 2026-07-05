<?php

namespace Tests\Unit\Services\Catalog;

use App\Models\ServicePackage;
use App\Services\Catalog\PackageManagementService;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class PackageManagementServiceTest extends TestCase
{
    use RefreshDatabase;

    private PackageManagementService $service;
    private $imageUploadServiceMock;

    protected function setUp(): void
    {
        parent::setUp();
        $this->imageUploadServiceMock = \Mockery::mock(\App\Services\Media\ImageUploadService::class);
        $this->app->instance(\App\Services\Media\ImageUploadService::class, $this->imageUploadServiceMock);
        $this->service = app(PackageManagementService::class);
    }

    public function test_can_create_package(): void
    {
        $data = [
            'title' => 'Test Package',
            'description' => 'Test Desc',
            'price' => 100,
            'capacity' => 20,
            'duration' => 60,
        ];

        $package = $this->service->create($data);

        $this->assertDatabaseHas('service_packages', [
            'id' => $package->id,
            'title' => 'Test Package',
        ]);
        $this->assertTrue($package->is_active);
    }

    public function test_can_create_package_with_image_and_itinerary(): void
    {
        $this->imageUploadServiceMock->shouldReceive('storeImage')
            ->once()
            ->andReturn('http://example.com/image.jpg');

        $data = [
            'title' => 'Test Package Image',
            'description' => 'Desc',
            'price' => 100,
            'capacity' => 20,
            'duration' => 60,
            'image_360' => \Illuminate\Http\UploadedFile::fake()->create('photo.jpg', 100),
            'itinerary' => '{"day1": "arrival"}',
        ];

        $package = $this->service->create($data);

        $this->assertEquals('http://example.com/image.jpg', $package->image_360_url);
        $this->assertEquals(['day1' => 'arrival'], $package->itinerary);
    }

    public function test_can_deactivate_package(): void
    {
        $package = ServicePackage::factory()->create(['is_active' => true]);

        $updated = $this->service->deactivate($package);

        $this->assertFalse($updated->is_active);
        $this->assertDatabaseHas('service_packages', [
            'id' => $package->id,
            'is_active' => false,
        ]);
    }

    public function test_list_all_returns_paginator(): void
    {
        ServicePackage::factory()->count(20)->create();
        
        $paginator = $this->service->listAll(15);
        $this->assertEquals(15, $paginator->count());
        $this->assertEquals(20, $paginator->total());
        
        // With type filter
        ServicePackage::factory()->create(['type' => 'paquete']);
        $paginatorFilter = $this->service->listAll(15, 'paquete');
        // Because factories by default create 'servicio', the exact count may vary,
        // but it should return the one we just created
        $this->assertGreaterThanOrEqual(1, $paginatorFilter->total());
    }

    public function test_find_or_fail_returns_package(): void
    {
        $package = ServicePackage::factory()->create();
        $found = $this->service->findOrFail($package->id);
        $this->assertEquals($package->id, $found->id);
    }

    public function test_can_update_package(): void
    {
        $package = ServicePackage::factory()->create(['title' => 'Old Title']);
        
        $updated = $this->service->update($package, ['title' => 'New Title']);
        
        $this->assertEquals('New Title', $updated->title);
        $this->assertDatabaseHas('service_packages', [
            'id' => $package->id,
            'title' => 'New Title',
        ]);
    }

    public function test_can_update_package_with_image_and_itinerary(): void
    {
        $package = ServicePackage::factory()->create([
            'image_360_url' => 'http://example.com/old.jpg'
        ]);

        $this->imageUploadServiceMock->shouldReceive('deleteImage')
            ->once()
            ->with('http://example.com/old.jpg');

        $this->imageUploadServiceMock->shouldReceive('storeImage')
            ->once()
            ->andReturn('http://example.com/new.jpg');

        $data = [
            'image_360' => \Illuminate\Http\UploadedFile::fake()->create('new.jpg', 100),
            'itinerary' => '{"day2": "departure"}',
        ];

        $updated = $this->service->update($package, $data);

        $this->assertEquals('http://example.com/new.jpg', $updated->image_360_url);
        $this->assertEquals(['day2' => 'departure'], $updated->itinerary);
    }
}
