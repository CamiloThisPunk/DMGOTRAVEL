<?php

namespace Tests\Unit\Services\Auth;

use App\Models\User;
use App\Services\Auth\AuthService;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;
use Tests\TestCase;

class AuthServiceTest extends TestCase
{
    use RefreshDatabase;

    private AuthService $service;

    protected function setUp(): void
    {
        parent::setUp();
        $this->service = new AuthService();
    }

    public function test_can_register_user(): void
    {
        $data = [
            'name' => 'John Doe',
            'email' => 'john@example.com',
            'password' => 'secret123',
        ];

        $result = $this->service->register($data);

        $this->assertArrayHasKey('user', $result);
        $this->assertArrayHasKey('token', $result);
        $this->assertInstanceOf(User::class, $result['user']);
        $this->assertEquals('John Doe', $result['user']->name);
        $this->assertEquals('john@example.com', $result['user']->email);
        $this->assertTrue(Hash::check('secret123', $result['user']->password));
        $this->assertNotEmpty($result['token']);
        $this->assertDatabaseHas('users', ['email' => 'john@example.com']);
    }

    public function test_can_login_user(): void
    {
        $user = User::factory()->create([
            'email' => 'login@example.com',
            'password' => Hash::make('password123'),
        ]);

        $credentials = [
            'email' => 'login@example.com',
            'password' => 'password123',
        ];

        $result = $this->service->login($credentials);

        $this->assertArrayHasKey('user', $result);
        $this->assertArrayHasKey('token', $result);
        $this->assertEquals($user->id, $result['user']->id);
        $this->assertNotEmpty($result['token']);
    }

    public function test_login_throws_on_invalid_password(): void
    {
        User::factory()->create([
            'email' => 'login@example.com',
            'password' => Hash::make('password123'),
        ]);

        $credentials = [
            'email' => 'login@example.com',
            'password' => 'wrongpass',
        ];

        $this->expectException(ValidationException::class);
        $this->service->login($credentials);
    }

    public function test_login_throws_on_invalid_email(): void
    {
        $credentials = [
            'email' => 'nonexistent@example.com',
            'password' => 'password123',
        ];

        $this->expectException(ValidationException::class);
        $this->service->login($credentials);
    }

    public function test_can_logout_user(): void
    {
        $user = User::factory()->create();
        $token = $user->createToken('auth_token');
        
        // Authenticate the user with this token to simulate an active session
        $this->actingAs($user);
        
        // Mock currentAccessToken method to return the token we just created
        $userWithToken = \Mockery::mock($user)->makePartial();
        $userWithToken->shouldReceive('currentAccessToken')->andReturn($token->accessToken);
        
        $this->service->logout($userWithToken);

        $this->assertDatabaseMissing('personal_access_tokens', [
            'id' => $token->accessToken->id,
        ]);
    }
}
