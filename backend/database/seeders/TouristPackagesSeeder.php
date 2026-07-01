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
                'image_360_url' => 'https://lh3.googleusercontent.com/aida-public/AB6AXuA5kkY-5qkPUzcvjSVlzB43Obo-7-Sy1NMpkOrc3S5sVMVsWotBiCn6bldT_ZpgmFlt3fdt9B1mZ-PuUWEMy91_VaDVu1kqbBiu9RJb_rnHWVNWb5aJqcZ-HRRvNoBQUknxn5QRgGUhJ7V3rmZC6EK7zuHRFp3i7mJiFfmP6mXDXYQnpXzBHYqIu0i7nFWDtiv3PjxdXZy_swcxHvc8_4__EENx7y_uEFRKek7tQr08huTrWFt_rksOgBW9S56b9LJZT5e4PcMiEA',
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
                'image_360_url' => 'https://lh3.googleusercontent.com/aida-public/AB6AXuDl0mPPLKDX3K7G78e0Zo_wbnZoe4gOmNI7IHXXABUR6wAaVXeELwhrP9-kq_gMsSl0Agrc_OpGJ6mAmFM_UQjKvdQuF2QwaZ5lzXTjA-k8glSuc1oPEig1ZhJvabRSn-6sRHhb1y7YI12NNiB2oDgUI7GyF9dtyT7Hc817t1Ie27MDVTC9fRQgV3VidKyfPkrsiSDuPAvYiQLX_7tHunMRDXtv2659736oDMWf01GRvGudnOpMRIsrfgasIRi66-jA2469k1DVmg',
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
                'image_360_url' => 'https://lh3.googleusercontent.com/aida-public/AB6AXuBKjp7J__Q1SvOcgddB-NXGCEYv5ITf-OmhsgJ5l8J75wdtya4xi_vlhJwss4KpX2FFWBvviGF5LQoznboq05Isqf4ObzyvkCSzxLxY1VX_Gcnu3tfwLnwdeQcGXHDkVxAub6Iv-hKl08aIl8nLkpjgCHSz7PeRxlMVzR13ZrPsUwakcHVVFu6_Yhq48m3sWDifqK7UJHmEm-lHmDwfZAcBbYEX_2_cerhMMyzfiaYFi6Awq8kPh-93G_NtVaOb3eb63hTyRXBaOg',
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
