<?php

namespace Tests\Feature\Controllers\Public;

use App\Models\ServicePackage;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class CatalogControllerTest extends TestCase
{
    use RefreshDatabase;

    public function test_anyone_can_list_active_packages(): void
    {
        // Arrange
        ServicePackage::factory()->count(3)->create(['is_active' => true]);
        ServicePackage::factory()->count(2)->create(['is_active' => false]);

        // Act
        $response = $this->getJson('/api/services');

        // Assert
        $response->assertStatus(200)
                 ->assertJsonStructure([
                     'data' => [
                         '*' => ['id', 'title', 'price', 'capacity', 'image_360_url', 'is_active']
                     ],
                     'links',
                     'meta',
                 ]);

        // Should only see the 3 active ones
        $this->assertCount(3, $response->json('data'));
    }

    public function test_anyone_can_list_active_packages_with_type_filter(): void
    {
        // Arrange
        ServicePackage::factory()->create(['is_active' => true, 'type' => 'paquete']);
        ServicePackage::factory()->create(['is_active' => true, 'type' => 'servicio']);

        // Act
        $response = $this->getJson('/api/services?type=paquete');

        // Assert
        $response->assertStatus(200);
        $this->assertCount(1, $response->json('data'));
        $this->assertEquals('paquete', $response->json('data.0.type'));
    }

    public function test_anyone_can_view_an_active_package(): void
    {
        // Arrange
        $package = ServicePackage::factory()->create(['is_active' => true]);

        // Act
        $response = $this->getJson("/api/services/{$package->id}");

        // Assert
        $response->assertStatus(200)
                 ->assertJsonStructure([
                     'data' => ['id', 'title', 'price', 'capacity']
                 ]);
        
        $this->assertEquals($package->id, $response->json('data.id'));
    }

    public function test_viewing_inactive_package_returns_404(): void
    {
        // Arrange
        $package = ServicePackage::factory()->create(['is_active' => false]);

        // Act
        $response = $this->getJson("/api/services/{$package->id}");

        // Assert
        $response->assertStatus(404);
    }
}
