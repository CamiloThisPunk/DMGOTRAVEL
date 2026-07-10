<?php

namespace Tests\Unit\Services\Catalog;

use App\Models\ServicePackage;
use App\Services\Catalog\PackageManagementService;
use App\Services\Media\ImageUploadService;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Tests\TestCase;

class PackageManagementServiceTest extends TestCase
{
    use RefreshDatabase;

    private PackageManagementService $service;

    protected function setUp(): void
    {
        parent::setUp();
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

    public function test_can_list_all_packages(): void
    {
        ServicePackage::factory()->count(3)->create(['type' => 'servicio']);
        ServicePackage::factory()->count(2)->create(['type' => 'paquete']);

        $result = $this->service->listAll();
        $this->assertCount(5, $result->items());

        $filtered = $this->service->listAll(15, 'servicio');
        $this->assertCount(3, $filtered->items());
    }

    public function test_can_find_package_by_id(): void
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
            'title' => 'New Title'
        ]);
    }

    public function test_can_create_package_with_image_and_itinerary_string(): void
    {
        Storage::fake('public');
        $file = UploadedFile::fake()->create('test.jpg', 100, 'image/jpeg');

        $data = [
            'title' => 'New Package',
            'description' => 'Test Desc',
            'price' => 150.00,
            'capacity' => 10,
            'duration' => 120,
            'image_360' => $file,
            'itinerary' => json_encode([['day' => 1, 'activity' => 'Arrival']]),
            'is_active' => true,
        ];

        $package = $this->service->create($data);

        $this->assertEquals('New Package', $package->title);
        $this->assertNotNull($package->image_360_url);
        $this->assertIsArray($package->itinerary);
    }

    public function test_can_update_package_with_image_and_itinerary_string(): void
    {
        Storage::fake('public');
        $package = ServicePackage::factory()->create([
            'image_360_url' => 'old_image.jpg'
        ]);
        
        $file = UploadedFile::fake()->create('new.jpg', 100, 'image/jpeg');

        $updated = $this->service->update($package, [
            'title' => 'Updated Title',
            'image_360' => $file,
            'itinerary' => json_encode([['day' => 2, 'activity' => 'Tour']]),
        ]);

        $this->assertEquals('Updated Title', $updated->title);
        $this->assertNotEquals('old_image.jpg', $updated->image_360_url);
        $this->assertIsArray($updated->itinerary);
    }
}
