<?php

namespace Tests\Performance;

use App\Models\ServicePackage;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;
use Database\Seeders\RoleSeeder;

class CatalogLoadTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        $this->seed(RoleSeeder::class);
    }

    public function test_api_can_handle_high_load_on_public_catalog(): void
    {
        ServicePackage::factory()->count(50)->create(['is_active' => true]);

        $startTime = microtime(true);

        for ($i = 0; $i < 200; $i++) {
            $this->getJson('/api/services')->assertStatus(200);
        }

        $executionTime = microtime(true) - $startTime;
        $this->assertLessThan(5.0, $executionTime);
    }
}
