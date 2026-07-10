<?php

namespace Tests\Feature\Admin;

use App\Models\AuditLog;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;
use Database\Seeders\RoleSeeder;

class ClientOversightTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        $this->seed(RoleSeeder::class);
    }

    public function test_admin_can_list_clients(): void
    {
        $admin = User::factory()->admin()->create();
        User::factory()->client()->count(3)->create();

        $response = $this->actingAs($admin)->getJson('/api/admin/clients');

        $response->assertStatus(200)
            ->assertJsonCount(3, 'data');
    }

    public function test_admin_can_list_audit_logs(): void
    {
        $admin = User::factory()->admin()->create();
        
        AuditLog::create([
            'user_id' => $admin->id,
            'action' => 'test.action',
            'entity_type' => User::class,
            'entity_id' => 1,
            'old_values' => [],
            'new_values' => [],
        ]);

        $response = $this->actingAs($admin)->getJson('/api/admin/logs');

        $response->assertStatus(200)
            ->assertJsonCount(1, 'data');
    }
}
