<?php

namespace Tests\Feature\Admin;

use App\Models\ServicePackage;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;
use Database\Seeders\RoleSeeder;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;

class ServicePackageTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        $this->seed(RoleSeeder::class);
    }

    public function test_admin_can_list_all_packages(): void
    {
        $admin = User::factory()->admin()->create();
        ServicePackage::factory()->count(2)->create(['type' => 'servicio']);
        ServicePackage::factory()->inactive()->create(['type' => 'paquete']);

        $response = $this->actingAs($admin)->getJson('/api/admin/services?type=servicio');

        $response->assertStatus(200)->assertJsonCount(2, 'data');
    }

    public function test_admin_can_create_package(): void
    {
        $admin = User::factory()->admin()->create();
        Storage::fake('public');
        
        $response = $this->actingAs($admin)->postJson('/api/admin/services', [
            'title' => 'Admin Pack',
            'description' => 'Desc',
            'price' => 150.00,
            'capacity' => 10,
            'duration' => 120,
            'is_active' => true,
            'type' => 'paquete',
        ]);

        $response->assertStatus(201)->assertJsonPath('data.title', 'Admin Pack');
    }

    public function test_admin_can_show_package(): void
    {
        $admin = User::factory()->admin()->create();
        $package = ServicePackage::factory()->create();

        $response = $this->actingAs($admin)->getJson("/api/admin/services/{$package->id}");

        $response->assertStatus(200)->assertJsonPath('data.id', $package->id);
    }

    public function test_admin_can_update_package(): void
    {
        $admin = User::factory()->admin()->create();
        $package = ServicePackage::factory()->create();

        $response = $this->actingAs($admin)->putJson("/api/admin/services/{$package->id}", [
            'title' => 'Updated Pack',
        ]);

        $response->assertStatus(200)->assertJsonPath('data.title', 'Updated Pack');
    }

    public function test_admin_can_destroy_package(): void
    {
        $admin = User::factory()->admin()->create();
        $package = ServicePackage::factory()->create();

        $response = $this->actingAs($admin)->deleteJson("/api/admin/services/{$package->id}");

        $response->assertStatus(204);
        $this->assertFalse($package->fresh()->is_active);
    }
}
