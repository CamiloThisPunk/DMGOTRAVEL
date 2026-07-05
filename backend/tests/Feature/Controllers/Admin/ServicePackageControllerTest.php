<?php

namespace Tests\Feature\Controllers\Admin;

use App\Models\ServicePackage;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Laravel\Sanctum\Sanctum;
use Spatie\Permission\Models\Role;
use Tests\TestCase;

class ServicePackageControllerTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        Role::firstOrCreate(['name' => 'admin', 'guard_name' => 'web']);
    }

    public function test_admin_can_list_all_packages_including_inactive(): void
    {
        // Arrange
        $admin = User::factory()->create();
        $admin->assignRole('admin');
        Sanctum::actingAs($admin, ['*']);

        ServicePackage::factory()->count(2)->create(['is_active' => true]);
        ServicePackage::factory()->count(1)->create(['is_active' => false]);

        // Act
        $response = $this->getJson('/api/admin/services');

        // Assert
        $response->assertStatus(200)
                 ->assertJsonStructure([
                     'data' => [
                         '*' => ['id', 'title', 'price', 'is_active']
                     ]
                 ]);

        $this->assertCount(3, $response->json('data'));
    }

    public function test_non_admin_cannot_list_packages(): void
    {
        // Arrange
        $client = User::factory()->create();
        Sanctum::actingAs($client, ['*']);

        // Act
        $response = $this->getJson('/api/admin/services');

        // Assert
        $response->assertStatus(403);
    }

    public function test_admin_can_create_a_service_package(): void
    {
        // Arrange
        $admin = User::factory()->create();
        $admin->assignRole('admin');
        Sanctum::actingAs($admin, ['*']);

        $payload = [
            'title' => 'New Adventure',
            'description' => 'A great adventure',
            'type' => 'paquete',
            'price' => 150.00,
            'capacity' => 20,
            'duration' => 120, // 2 hours
        ];

        // Act
        $response = $this->postJson('/api/admin/services', $payload);

        // Assert
        $response->assertStatus(201)
                 ->assertJsonPath('data.title', 'New Adventure');

        $this->assertDatabaseHas('service_packages', [
            'title' => 'New Adventure',
            'type' => 'paquete',
            'price' => 150.00,
            'capacity' => 20,
        ]);
    }

    public function test_creating_package_fails_validation(): void
    {
        // Arrange
        $admin = User::factory()->create();
        $admin->assignRole('admin');
        Sanctum::actingAs($admin, ['*']);

        $payload = [
            'title' => '', // Invalid
            'type' => 'invalid_type', // Invalid
            'price' => -10, // Invalid
        ];

        // Act
        $response = $this->postJson('/api/admin/services', $payload);

        // Assert
        $response->assertStatus(422)
                 ->assertJsonValidationErrors(['title', 'type', 'price', 'capacity', 'duration']);
    }

    public function test_admin_can_update_a_package(): void
    {
        // Arrange
        $admin = User::factory()->create();
        $admin->assignRole('admin');
        Sanctum::actingAs($admin, ['*']);

        $package = ServicePackage::factory()->create(['title' => 'Old Title']);

        $payload = [
            'title' => 'Updated Title',
        ];

        // Act
        $response = $this->patchJson("/api/admin/services/{$package->id}", $payload);

        // Assert
        $response->assertStatus(200)
                 ->assertJsonPath('data.title', 'Updated Title');

        $this->assertDatabaseHas('service_packages', [
            'id' => $package->id,
            'title' => 'Updated Title',
        ]);
    }

    public function test_admin_can_deactivate_a_package(): void
    {
        // Arrange
        $admin = User::factory()->create();
        $admin->assignRole('admin');
        Sanctum::actingAs($admin, ['*']);

        $package = ServicePackage::factory()->create(['is_active' => true]);

        // Act
        $response = $this->deleteJson("/api/admin/services/{$package->id}");

        // Assert
        $response->assertStatus(204);

        $this->assertDatabaseHas('service_packages', [
            'id' => $package->id,
            'is_active' => false,
        ]);
    }

    public function test_admin_can_view_a_single_package(): void
    {
        // Arrange
        $admin = User::factory()->create();
        $admin->assignRole('admin');
        Sanctum::actingAs($admin, ['*']);

        $package = ServicePackage::factory()->create();

        // Act
        $response = $this->getJson("/api/admin/services/{$package->id}");

        // Assert
        $response->assertStatus(200)
                 ->assertJsonPath('data.id', $package->id);
    }
}
