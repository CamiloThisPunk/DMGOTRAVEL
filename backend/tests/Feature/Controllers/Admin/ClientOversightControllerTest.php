<?php

namespace Tests\Feature\Controllers\Admin;

use App\Models\AuditLog;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Laravel\Sanctum\Sanctum;
use Spatie\Permission\Models\Role;
use Tests\TestCase;

class ClientOversightControllerTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        Role::firstOrCreate(['name' => 'admin', 'guard_name' => 'web']);
        Role::firstOrCreate(['name' => 'client', 'guard_name' => 'web']);
    }

    public function test_admin_can_list_clients(): void
    {
        // Arrange
        $admin = User::factory()->create();
        $admin->assignRole('admin');

        User::factory()->client()->count(3)->create();
        User::factory()->create(); // without role

        Sanctum::actingAs($admin, ['*']);

        // Act
        $response = $this->getJson('/api/admin/clients');

        // Assert
        $response->assertStatus(200)
                 ->assertJsonStructure([
                     'data' => [
                         '*' => ['id', 'name', 'email']
                     ]
                 ]);

        // Should see the 3 clients
        $this->assertCount(3, $response->json('data'));
    }

    public function test_non_admin_cannot_list_clients(): void
    {
        // Arrange
        $client = User::factory()->client()->create();
        Sanctum::actingAs($client, ['*']);

        // Act
        $response = $this->getJson('/api/admin/clients');

        // Assert
        $response->assertStatus(403);
    }

    public function test_admin_can_list_audit_logs(): void
    {
        // Arrange
        $admin = User::factory()->create();
        $admin->assignRole('admin');

        AuditLog::create([
            'user_id' => $admin->id,
            'action' => 'test.action',
            'entity_type' => 'App\\Models\\Test',
            'entity_id' => 1,
            'created_at' => now(),
        ]);

        Sanctum::actingAs($admin, ['*']);

        // Act
        $response = $this->getJson('/api/admin/logs');

        // Assert
        $response->assertStatus(200)
                 ->assertJsonStructure([
                     'data' => [
                         '*' => ['id', 'user_id', 'action', 'entity_type', 'entity_id', 'old_values', 'new_values']
                     ]
                 ]);

        $this->assertCount(1, $response->json('data'));
        $this->assertEquals('test.action', $response->json('data.0.action'));
    }
}
