<?php

namespace Database\Factories;

use App\Models\Reservation;
use App\Models\ServicePackage;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

class ReservationFactory extends Factory
{
    protected $model = Reservation::class;

    public function definition(): array
    {
        $package = ServicePackage::factory();
        $guestsCount = fake()->numberBetween(1, 5);

        return [
            'client_id' => User::factory(),
            'service_package_id' => $package,
            'reservation_date' => fake()->dateTimeBetween('+1 week', '+3 months')->format('Y-m-d'),
            'guests_count' => $guestsCount,
            'status' => 'pending',
            'total_price' => fake()->randomFloat(2, 20, 1000),
        ];
    }

    public function confirmed(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => 'confirmed',
        ]);
    }

    public function cancelled(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => 'cancelled',
        ]);
    }

    public function completed(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => 'completed',
        ]);
    }
}
