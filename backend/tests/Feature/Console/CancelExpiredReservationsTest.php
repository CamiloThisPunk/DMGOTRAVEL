<?php

namespace Tests\Feature\Console;

use App\Models\Reservation;
use App\Models\ServicePackage;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class CancelExpiredReservationsTest extends TestCase
{
    use RefreshDatabase;

    public function test_it_cancels_reservations_older_than_48_hours(): void
    {
        $package = ServicePackage::factory()->create();
        $client = User::factory()->client()->create();

        // Expired
        $expired = Reservation::factory()->create([
            'status' => 'pending',
            'created_at' => now()->subHours(49),
            'service_package_id' => $package->id,
            'client_id' => $client->id,
        ]);

        // Not expired
        $notExpired = Reservation::factory()->create([
            'status' => 'pending',
            'created_at' => now()->subHours(10),
            'service_package_id' => $package->id,
            'client_id' => $client->id,
        ]);

        $this->artisan('reservations:cancel-expired')
            ->expectsOutput('Successfully cancelled 1 expired reservations.')
            ->assertExitCode(0);

        $this->assertEquals('cancelled', $expired->fresh()->status);
        $this->assertEquals('pending', $notExpired->fresh()->status);
        
        $this->assertDatabaseHas('audit_logs', [
            'entity_id' => $expired->id,
            'action' => 'reservation.auto_cancelled',
        ]);
    }
}
