<?php

namespace Tests\Unit\Models;

use App\Models\AuditLog;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class AuditLogTest extends TestCase
{
    use RefreshDatabase;

    public function test_audit_log_casts_and_relations(): void
    {
        $user = User::factory()->create();
        $log = AuditLog::create([
            'user_id' => $user->id,
            'action' => 'test_action',
            'entity_type' => 'test_type',
            'entity_id' => 1,
            'old_values' => ['status' => 'pending'],
            'new_values' => ['status' => 'confirmed'],
            'created_at' => now(),
        ]);

        $this->assertIsArray($log->old_values);
        $this->assertIsArray($log->new_values);
        $this->assertEquals('pending', $log->old_values['status']);
        $this->assertInstanceOf(\Illuminate\Database\Eloquent\Relations\BelongsTo::class, $log->user());
        $this->assertEquals($user->id, $log->user->id);
    }
}
