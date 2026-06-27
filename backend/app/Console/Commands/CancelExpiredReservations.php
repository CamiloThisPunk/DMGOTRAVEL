<?php

namespace App\Console\Commands;

use App\Models\Reservation;
use Illuminate\Console\Command;

class CancelExpiredReservations extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'reservations:cancel-expired';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Cancel pending reservations that have exceeded the 48 hour limit.';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $expiredTime = now()->subHours(48);

        $reservations = Reservation::where('status', 'pending')
            ->where('created_at', '<', $expiredTime)
            ->get();

        $count = 0;
        foreach ($reservations as $reservation) {
            $reservation->update(['status' => 'cancelled']);
            
            \App\Models\AuditLog::create([
                'user_id' => null, // System action
                'action' => 'reservation.auto_cancelled',
                'entity_type' => Reservation::class,
                'entity_id' => $reservation->id,
                'old_values' => ['status' => 'pending'],
                'new_values' => ['status' => 'cancelled'],
                'created_at' => now(),
            ]);
            $count++;
        }

        $this->info("Successfully cancelled {$count} expired reservations.");
    }
}
