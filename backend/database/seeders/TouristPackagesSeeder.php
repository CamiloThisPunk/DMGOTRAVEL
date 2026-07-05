<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class TouristPackagesSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $packages = [
            [
                'title' => 'Ayacucho Extremo',
                'type' => 'paquete',
                'description' => 'Un paquete diseñado para los amantes de la adrenalina. Explora los cañones, cascadas escondidas y realiza deportes extremos en los parajes más impresionantes de Ayacucho.',
                'price' => 450.00,
                'capacity' => 10,
                'duration' => 3,
                'image_360_url' => env('APP_URL') . '/images/seed/tour-adventure.jpg',
                'is_active' => true,
                'itinerary' => json_encode([
                    [
                        'title' => 'Día 1: Llegada y Aclimatación',
                        'activities' => [
                            ['time' => '09:00', 'title' => 'Llegada a Huamanga', 'description' => 'Recojo del aeropuerto y traslado al hotel. Mates de coca de bienvenida.'],
                            ['time' => '15:00', 'title' => 'City Tour Suave', 'description' => 'Caminata ligera por el centro histórico para aclimatar el cuerpo a la altura.']
                        ]
                    ],
                    [
                        'title' => 'Día 2: Aventura en los Cañones',
                        'activities' => [
                            ['time' => '08:00', 'title' => 'Trekking al Cañón', 'description' => 'Caminata de 3 horas hacia el cañón oculto con impresionantes vistas de la cordillera.'],
                            ['time' => '13:00', 'title' => 'Rapel y Descenso', 'description' => 'Descenso con cuerdas por las paredes del cañón guiado por profesionales.']
                        ]
                    ],
                    [
                        'title' => 'Día 3: Retorno a Casa',
                        'activities' => [
                            ['time' => '10:00', 'title' => 'Visita Artesanal', 'description' => 'Tiempo libre para comprar souvenirs en el Barrio de Santa Ana.'],
                            ['time' => '14:00', 'title' => 'Traslado al aeropuerto', 'description' => 'Fin de nuestros servicios.']
                        ]
                    ]
                ])
            ],
            [
                'title' => 'Ayacucho Histórico y Wari',
                'type' => 'paquete',
                'description' => 'Explora la historia viva de Ayacucho, desde sus iglesias coloniales hasta el imponente complejo arqueológico de Wari. Un viaje a través del tiempo en el corazón de los Andes.',
                'price' => 350.00,
                'capacity' => 20,
                'duration' => 2,
                'image_360_url' => env('APP_URL') . '/images/seed/tour-wari.jpg',
                'is_active' => true,
                'itinerary' => json_encode([
                    [
                        'title' => 'Día 1: Capital Retablista',
                        'activities' => [
                            ['time' => '09:00', 'title' => 'Ruta de las Iglesias', 'description' => 'Visita guiada por la Catedral y el templo de Santo Domingo.'],
                            ['time' => '12:00', 'title' => 'Taller de Retablos', 'description' => 'Visita a la casa de un maestro retablista ayacuchano.']
                        ]
                    ],
                    [
                        'title' => 'Día 2: El Imperio Wari',
                        'activities' => [
                            ['time' => '08:00', 'title' => 'Complejo Arqueológico Wari', 'description' => 'Exploración de la antigua capital del primer imperio andino.'],
                            ['time' => '12:00', 'title' => 'Pueblo de Quinua', 'description' => 'Visita a la Pampa de Ayacucho y talleres de cerámica.']
                        ]
                    ]
                ])
            ],
            [
                'title' => 'Aguas Turquesas de Millpu',
                'type' => 'paquete',
                'description' => 'Maravíllate con las piscinas naturales de aguas color turquesa escondidas entre formaciones rocosas. Un destino imperdible para amantes de la naturaleza y fotografía.',
                'price' => 150.00,
                'capacity' => 15,
                'duration' => 1,
                'image_360_url' => env('APP_URL') . '/images/seed/tour-millpu.jpg',
                'is_active' => true,
                'itinerary' => json_encode([
                    [
                        'title' => 'Día 1: Naturaleza Virgen',
                        'activities' => [
                            ['time' => '06:00', 'title' => 'Salida hacia Circamarca', 'description' => 'Viaje en transporte turístico desde Huamanga hasta la comunidad de Circamarca.'],
                            ['time' => '10:00', 'title' => 'Caminata a las piscinas', 'description' => 'Ascenso por el cañón apreciando las pozas escalonadas de agua turquesa.'],
                            ['time' => '13:00', 'title' => 'Almuerzo campestre', 'description' => 'Trucha frita a orillas del río antes de retornar a la ciudad.']
                        ]
                    ]
                ])
            ]
        ];

        foreach ($packages as $pkg) {
            \App\Models\ServicePackage::create($pkg);
        }
    }
}
