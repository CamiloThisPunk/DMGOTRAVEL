<?php

namespace Tests\Unit\Models;

use App\Models\Reservation;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class UserTest extends TestCase
{
    use RefreshDatabase;

    public function test_user_has_reservations_relation(): void
    {
        $user = User::factory()->create();
        $this->assertInstanceOf(\Illuminate\Database\Eloquent\Relations\HasMany::class, $user->reservations());
    }

    public function test_clients_scope_filters_correctly(): void
    {
        $this->seed(\Database\Seeders\RoleSeeder::class);
        $client = User::factory()->client()->create();
        $admin = User::factory()->admin()->create();

        $clients = User::clients()->get();

        $this->assertCount(1, $clients);
        $this->assertEquals($client->id, $clients->first()->id);
    }
}
