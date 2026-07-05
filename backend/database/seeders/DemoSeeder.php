<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\ServicePackage;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DemoSeeder extends Seeder
{
    public function run(): void
    {
        // Crear un usuario cliente de demostración
        $client = User::firstOrCreate(
            ['email' => 'client@test.com'],
            [
                'name' => 'Carlos Cliente',
                'password' => Hash::make('client_password'),
                'phone' => '999888777'
            ]
        );
        $client->assignRole('client');

        // Crear servicios de demostración
        $services = [
            [
                'title' => 'Aguas Turquesas de Millpu',
                'description' => 'Descubre las increíbles pozas de aguas turquesas en medio de la naturaleza. Un paisaje único en Ayacucho que no te puedes perder. Incluye transporte, guía y ticket de ingreso.',
                'price' => 120.00,
                'capacity' => 15,
                'duration' => 600, // 10 horas en minutos
                'image_360_url' => env('APP_URL') . '/images/seed/demo-tour-1.jpg'
            ],
            [
                'title' => 'City Tour & Ruinas Wari',
                'description' => 'Un recorrido por el centro histórico de la ciudad, visitando sus iglesias principales y luego una expedición al complejo arqueológico Wari, capital del primer imperio andino.',
                'price' => 65.00,
                'capacity' => 20,
                'duration' => 300, // 5 horas
                'image_360_url' => env('APP_URL') . '/images/seed/demo-tour-1.jpg'
            ],
            [
                'title' => 'Trekking Pampa de Ayacucho',
                'description' => 'Caminata hasta el histórico obelisco en la Pampa de la Quinua, escenario de la Batalla de Ayacucho. Disfruta de la flora, fauna y de talleres artesanales en el pueblo.',
                'price' => 90.00,
                'capacity' => 12,
                'duration' => 480, // 8 horas
                'image_360_url' => env('APP_URL') . '/images/seed/demo-tour-1.jpg'
            ],
        ];

        foreach ($services as $service) {
            ServicePackage::firstOrCreate(
                ['title' => $service['title']],
                $service
            );
        }
    }
}
