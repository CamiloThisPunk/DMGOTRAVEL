<?php

namespace Tests\Unit\Controllers\Admin;

use App\Http\Controllers\Api\Admin\ClientOversightController;
use App\Models\AuditLog;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;
use Illuminate\Pagination\LengthAwarePaginator;
use PHPUnit\Framework\Attributes\Test;
use Tests\TestCase;

/**
 * Tests for ClientOversightController.
 *
 * This controller calls Eloquent statics directly (User::clients(), AuditLog::orderBy()),
 * so we bootstrap the app with in-memory SQLite to cover these paths properly.
 */
class ClientOversightControllerTest extends TestCase
{
    use RefreshDatabase;

    private ClientOversightController $controller;

    protected function setUp(): void
    {
        parent::setUp();
        $this->controller = new ClientOversightController();
    }

    // ─── CLIENTS ─────────────────────────────────────────────────

    #[Test]
    public function test_clients_returns_anonymous_resource_collection(): void
    {
        // Arrange — Create users with the 'client' role
        $user = User::factory()->create();
        $user->assignRole('client');

        $request = new \Illuminate\Http\Request();
        $request->merge(['per_page' => 15]);

        // Act
        $response = $this->controller->clients($request);

        // Assert
        $this->assertInstanceOf(AnonymousResourceCollection::class, $response);
    }

    #[Test]
    public function test_clients_uses_custom_per_page(): void
    {
        // Arrange
        User::factory()->count(3)->create()->each(fn ($u) => $u->assignRole('client'));

        $request = new \Illuminate\Http\Request();
        $request->merge(['per_page' => 2]);

        // Act
        $response = $this->controller->clients($request);

        // Assert
        $this->assertInstanceOf(AnonymousResourceCollection::class, $response);
        $resource = $response->resource;
        $this->assertInstanceOf(LengthAwarePaginator::class, $resource);
        $this->assertEquals(2, $resource->perPage());
    }

    #[Test]
    public function test_clients_returns_only_client_role_users(): void
    {
        // Arrange
        $client = User::factory()->create(['name' => 'Client User']);
        $client->assignRole('client');

        $admin = User::factory()->create(['name' => 'Admin User']);
        $admin->assignRole('admin');

        $request = new \Illuminate\Http\Request();

        // Act
        $response = $this->controller->clients($request);

        // Assert
        $resource = $response->resource;
        $this->assertEquals(1, $resource->total());
    }

    #[Test]
    public function test_clients_returns_empty_when_no_clients_exist(): void
    {
        // Arrange — no users created
        $request = new \Illuminate\Http\Request();

        // Act
        $response = $this->controller->clients($request);

        // Assert
        $resource = $response->resource;
        $this->assertEquals(0, $resource->total());
    }

    // ─── LOGS ────────────────────────────────────────────────────

    #[Test]
    public function test_logs_returns_anonymous_resource_collection(): void
    {
        // Arrange — Create an audit log entry
        AuditLog::create([
            'user_id' => null,
            'action' => 'test.action',
            'entity_type' => 'App\\Models\\User',
            'entity_id' => 1,
            'old_values' => null,
            'new_values' => ['key' => 'value'],
            'created_at' => now(),
        ]);

        $request = new \Illuminate\Http\Request();

        // Act
        $response = $this->controller->logs($request);

        // Assert
        $this->assertInstanceOf(AnonymousResourceCollection::class, $response);
    }

    #[Test]
    public function test_logs_uses_custom_per_page(): void
    {
        // Arrange
        for ($i = 0; $i < 5; $i++) {
            AuditLog::create([
                'user_id' => null,
                'action' => "test.action.{$i}",
                'entity_type' => 'App\\Models\\User',
                'entity_id' => $i + 1,
                'old_values' => null,
                'new_values' => null,
                'created_at' => now(),
            ]);
        }

        $request = new \Illuminate\Http\Request();
        $request->merge(['per_page' => 2]);

        // Act
        $response = $this->controller->logs($request);

        // Assert
        $resource = $response->resource;
        $this->assertInstanceOf(LengthAwarePaginator::class, $resource);
        $this->assertEquals(2, $resource->perPage());
        $this->assertEquals(5, $resource->total());
    }

    #[Test]
    public function test_logs_returns_empty_when_no_logs_exist(): void
    {
        // Arrange — no logs
        $request = new \Illuminate\Http\Request();

        // Act
        $response = $this->controller->logs($request);

        // Assert
        $resource = $response->resource;
        $this->assertEquals(0, $resource->total());
    }

    #[Test]
    public function test_logs_are_ordered_by_created_at_descending(): void
    {
        // Arrange
        AuditLog::create([
            'user_id' => null,
            'action' => 'older.action',
            'entity_type' => 'App\\Models\\User',
            'entity_id' => 1,
            'old_values' => null,
            'new_values' => null,
            'created_at' => now()->subDay(),
        ]);
        AuditLog::create([
            'user_id' => null,
            'action' => 'newer.action',
            'entity_type' => 'App\\Models\\User',
            'entity_id' => 2,
            'old_values' => null,
            'new_values' => null,
            'created_at' => now(),
        ]);

        $request = new \Illuminate\Http\Request();

        // Act
        $response = $this->controller->logs($request);

        // Assert
        $items = $response->resource->items();
        $this->assertEquals('newer.action', $items[0]->action);
        $this->assertEquals('older.action', $items[1]->action);
    }
}
