<?php

namespace Tests\Unit\Controllers\Auth;

use App\Http\Controllers\Api\Auth\AuthController;
use App\Http\Requests\Auth\LoginRequest;
use App\Http\Requests\Auth\RegisterRequest;
use App\Models\User;
use App\Services\Auth\AuthService;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Mockery;
use Mockery\MockInterface;
use PHPUnit\Framework\Attributes\Test;
use Tests\TestCase;

class AuthControllerTest extends TestCase
{
    use RefreshDatabase;

    private AuthService|MockInterface $authService;
    private AuthController $controller;

    protected function setUp(): void
    {
        parent::setUp();
        $this->authService = Mockery::mock(AuthService::class);
        $this->controller = new AuthController($this->authService);
    }

    protected function tearDown(): void
    {
        Mockery::close();
        parent::tearDown();
    }

    // ─── REGISTER ────────────────────────────────────────────────

    #[Test]
    public function test_register_returns_201_with_user_and_token(): void
    {
        // Arrange
        $validatedData = [
            'name' => 'John Doe',
            'email' => 'john@example.com',
            'password' => 'secret1234',
        ];

        $fakeUser = User::factory()->create(['name' => 'John Doe', 'email' => 'john@example.com']);
        $fakeUser->assignRole('client');

        $request = Mockery::mock(RegisterRequest::class);
        $request->shouldReceive('validated')
            ->once()
            ->withNoArgs()
            ->andReturn($validatedData);

        $this->authService->shouldReceive('register')
            ->once()
            ->with($validatedData)
            ->andReturn([
                'user' => $fakeUser,
                'token' => 'fake-sanctum-token-abc123',
            ]);

        // Act
        $response = $this->controller->register($request);

        // Assert
        $this->assertInstanceOf(JsonResponse::class, $response);
        $this->assertEquals(201, $response->getStatusCode());

        $content = json_decode($response->getContent(), true);
        $this->assertArrayHasKey('data', $content);
        $this->assertArrayHasKey('user', $content['data']);
        $this->assertArrayHasKey('token', $content['data']);
        $this->assertEquals('fake-sanctum-token-abc123', $content['data']['token']);
    }

    #[Test]
    public function test_register_response_contains_user_data(): void
    {
        // Arrange
        $fakeUser = User::factory()->create([
            'name' => 'Maria Garcia',
            'email' => 'maria@example.com',
        ]);
        $fakeUser->assignRole('client');

        $request = Mockery::mock(RegisterRequest::class);
        $request->shouldReceive('validated')
            ->andReturn(['name' => 'Maria Garcia', 'email' => 'maria@example.com', 'password' => 'pass']);

        $this->authService->shouldReceive('register')
            ->andReturn(['user' => $fakeUser, 'token' => 'tok-maria']);

        // Act
        $response = $this->controller->register($request);

        // Assert
        $content = json_decode($response->getContent(), true);
        $this->assertEquals('Maria Garcia', $content['data']['user']['name']);
        $this->assertEquals('maria@example.com', $content['data']['user']['email']);
        $this->assertEquals('tok-maria', $content['data']['token']);
    }

    // ─── LOGIN ───────────────────────────────────────────────────

    #[Test]
    public function test_login_returns_200_with_user_and_token(): void
    {
        // Arrange
        $validatedData = [
            'email' => 'john@example.com',
            'password' => 'secret1234',
        ];

        $fakeUser = User::factory()->create(['email' => 'john@example.com']);
        $fakeUser->assignRole('client');

        $request = Mockery::mock(LoginRequest::class);
        $request->shouldReceive('validated')
            ->once()
            ->withNoArgs()
            ->andReturn($validatedData);

        $this->authService->shouldReceive('login')
            ->once()
            ->with($validatedData)
            ->andReturn([
                'user' => $fakeUser,
                'token' => 'fake-login-token-xyz789',
            ]);

        // Act
        $response = $this->controller->login($request);

        // Assert
        $this->assertInstanceOf(JsonResponse::class, $response);
        $this->assertEquals(200, $response->getStatusCode());

        $content = json_decode($response->getContent(), true);
        $this->assertArrayHasKey('data', $content);
        $this->assertArrayHasKey('user', $content['data']);
        $this->assertArrayHasKey('token', $content['data']);
        $this->assertEquals('fake-login-token-xyz789', $content['data']['token']);
    }

    #[Test]
    public function test_login_response_contains_user_id_and_email(): void
    {
        // Arrange
        $fakeUser = User::factory()->create(['email' => 'test@example.com']);
        $fakeUser->assignRole('client');

        $request = Mockery::mock(LoginRequest::class);
        $request->shouldReceive('validated')
            ->andReturn(['email' => 'test@example.com', 'password' => 'pass']);

        $this->authService->shouldReceive('login')
            ->andReturn(['user' => $fakeUser, 'token' => 'tok']);

        // Act
        $response = $this->controller->login($request);

        // Assert
        $content = json_decode($response->getContent(), true);
        $this->assertEquals($fakeUser->id, $content['data']['user']['id']);
        $this->assertEquals('test@example.com', $content['data']['user']['email']);
    }

    #[Test]
    public function test_login_propagates_validation_exception(): void
    {
        // Arrange
        $request = Mockery::mock(LoginRequest::class);
        $request->shouldReceive('validated')
            ->andReturn(['email' => 'bad@example.com', 'password' => 'wrong']);

        $this->authService->shouldReceive('login')
            ->once()
            ->andThrow(
                \Illuminate\Validation\ValidationException::withMessages([
                    'email' => ['The provided credentials are incorrect.'],
                ])
            );

        // Act & Assert
        $this->expectException(\Illuminate\Validation\ValidationException::class);
        $this->controller->login($request);
    }

    // ─── LOGOUT ──────────────────────────────────────────────────

    #[Test]
    public function test_logout_returns_204_and_calls_service(): void
    {
        // Arrange
        $fakeUser = User::factory()->create();

        $request = Mockery::mock(Request::class);
        $request->shouldReceive('user')
            ->once()
            ->andReturn($fakeUser);

        $this->authService->shouldReceive('logout')
            ->once()
            ->with(Mockery::on(fn ($u) => $u->id === $fakeUser->id));

        // Act
        $response = $this->controller->logout($request);

        // Assert
        $this->assertInstanceOf(JsonResponse::class, $response);
        $this->assertEquals(204, $response->getStatusCode());
    }

    #[Test]
    public function test_logout_response_body_is_null(): void
    {
        // Arrange
        $fakeUser = User::factory()->create();

        $request = Mockery::mock(Request::class);
        $request->shouldReceive('user')->andReturn($fakeUser);

        $this->authService->shouldReceive('logout');

        // Act
        $response = $this->controller->logout($request);

        // Assert
        $this->assertEquals(204, $response->getStatusCode());
    }
}
