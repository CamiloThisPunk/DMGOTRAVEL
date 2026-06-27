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
}
