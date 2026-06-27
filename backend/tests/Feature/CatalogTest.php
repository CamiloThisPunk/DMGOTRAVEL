<?php

namespace Tests\Feature;

use App\Models\ServicePackage;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class CatalogTest extends TestCase
{
    use RefreshDatabase;

    public function test_public_can_list_active_packages(): void
    {
        ServicePackage::factory()->count(3)->create(['is_active' => true]);
        ServicePackage::factory()->inactive()->create();

        $response = $this->getJson('/api/services');

        $response->assertStatus(200)
            ->assertJsonCount(3, 'data'); // Only active packages should be returned
    }

    public function test_public_can_view_single_active_package(): void
    {
        $package = ServicePackage::factory()->create(['is_active' => true]);

        $response = $this->getJson("/api/services/{$package->id}");

        $response->assertStatus(200)
            ->assertJsonPath('data.id', $package->id);
    }

    public function test_public_cannot_view_inactive_package(): void
    {
        $package = ServicePackage::factory()->inactive()->create();

        $response = $this->getJson("/api/services/{$package->id}");

        $response->assertStatus(404);
    }
}
