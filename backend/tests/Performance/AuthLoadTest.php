<?php

namespace Tests\Performance;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Hash;
use Tests\TestCase;
use Database\Seeders\RoleSeeder;

class AuthLoadTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        $this->seed(RoleSeeder::class);
        Hash::setRounds(4); 
    }

    public function test_api_can_handle_high_load_on_auth_system(): void
    {
        $startTime = microtime(true);

        for ($i = 0; $i < 50; $i++) {
            $email = "loaduser{$i}@test.com";
            
            $this->postJson('/api/auth/register', [
                'name' => "User {$i}",
                'email' => $email,
                'password' => 'password123',
                'password_confirmation' => 'password123'
            ])->assertStatus(201);
            
            $this->postJson('/api/auth/login', [
                'email' => $email,
                'password' => 'password123'
            ])->assertStatus(200);
        }

        $executionTime = microtime(true) - $startTime;
        $this->assertDatabaseCount('users', 50);
        $this->assertLessThan(10.0, $executionTime);
    }
}
