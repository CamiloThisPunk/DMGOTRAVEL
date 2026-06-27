<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class AdminSeeder extends Seeder
{
    public function run(): void
    {
        $admin = User::firstOrCreate(
            ['email' => 'admin@dmgotravel.com'],
            [
                'name' => 'DMGOTRAVEL Admin',
                'password' => Hash::make('admin_password'),
            ]
        );

        $admin->assignRole('admin');
    }
}
