<?php

namespace Tests\Feature\Controllers\Auth;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Spatie\Permission\Models\Role;
use Tests\TestCase;

class AuthControllerTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        // Ensure the client role exists for registration
        Role::firstOrCreate(['name' => 'client', 'guard_name' => 'web']);
    }

    public function test_user_can_register_successfully_and_save_to_db(): void
    {
        // Arrange
        $payload = [
            'name' => 'Jane Doe',
            'email' => 'jane@example.com',
            'password' => 'password123',
            'password_confirmation' => 'password123',
        ];

        // Act
        $response = $this->postJson('/api/auth/register', $payload);

        // Assert
        $response->assertStatus(201)
                 ->assertJsonStructure([
                     'data' => [
                         'user' => ['id', 'name', 'email'],
                         'token',
                     ]
                 ]);

        $this->assertDatabaseHas('users', [
            'email' => 'jane@example.com',
            'name' => 'Jane Doe',
        ]);
        
        $user = User::where('email', 'jane@example.com')->first();
        $this->assertTrue($user->hasRole('client'));
    }

    public function test_registration_fails_with_invalid_data(): void
    {
        // Arrange
        $payload = [
            'name' => '', // Invalid
            'email' => 'not-an-email', // Invalid
            'password' => 'short', // Invalid
        ];

        // Act
        $response = $this->postJson('/api/auth/register', $payload);

        // Assert
        $response->assertStatus(422)
                 ->assertJsonValidationErrors(['name', 'email', 'password']);
    }

    public function test_user_can_login_with_correct_credentials(): void
    {
        // Arrange
        $user = User::factory()->create([
            'email' => 'login@example.com',
            'password' => bcrypt('password123'),
        ]);

        $payload = [
            'email' => 'login@example.com',
            'password' => 'password123',
        ];

        // Act
        $response = $this->postJson('/api/auth/login', $payload);

        // Assert
        $response->assertStatus(200)
                 ->assertJsonStructure([
                     'data' => [
                         'user' => ['id', 'name', 'email'],
                         'token',
                     ]
                 ]);
                 
        $this->assertDatabaseHas('personal_access_tokens', [
            'tokenable_id' => $user->id,
            'tokenable_type' => User::class,
        ]);
    }

    public function test_login_fails_with_incorrect_credentials(): void
    {
        // Arrange
        User::factory()->create([
            'email' => 'login@example.com',
            'password' => bcrypt('password123'),
        ]);

        $payload = [
            'email' => 'login@example.com',
            'password' => 'wrongpassword',
        ];

        // Act
        $response = $this->postJson('/api/auth/login', $payload);

        // Assert
        $response->assertStatus(422)
                 ->assertJsonValidationErrors(['email']);
    }

    public function test_authenticated_user_can_logout(): void
    {
        // Arrange
        $user = User::factory()->create();
        $token = $user->createToken('auth_token')->plainTextToken;

        // Act
        $response = $this->withHeaders([
            'Authorization' => 'Bearer ' . $token,
        ])->postJson('/api/auth/logout');

        // Assert
        $response->assertStatus(204);
        
        $this->assertDatabaseMissing('personal_access_tokens', [
            'tokenable_id' => $user->id,
        ]);
    }

    public function test_unauthenticated_user_cannot_logout(): void
    {
        // Act
        $response = $this->postJson('/api/auth/logout');

        // Assert
        $response->assertStatus(401);
    }
}
