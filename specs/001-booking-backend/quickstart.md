# Quickstart & Validation Guide: booking-backend

## Prerequisites
- PHP 8.2+ instalado localmente.
- MariaDB 10.6+ en ejecución.
- Composer.

## Setup Instructions

1. Clonar el repositorio e instalar dependencias:
   ```bash
   composer install
   ```
2. Configurar entorno:
   ```bash
   cp .env.example .env
   php artisan key:generate
   ```
3. Configurar base de datos en `.env` (credenciales de MariaDB local).
4. Ejecutar migraciones y seeders (incluir roles/permisos de Spatie y usuario Admin inicial):
   ```bash
   php artisan migrate --seed
   ```
5. Levantar el servidor:
   ```bash
   php artisan serve
   ```

## Validation Scenarios

Estas pruebas validan el funcionamiento End-to-End de la API sin requerir el frontend. Puedes usar Postman, Insomnia, o `curl`.

### Scenario 1: Public Catalog (Unauthenticated)
1. Realiza una petición `GET http://localhost:8000/api/services`
2. **Expected Outcome**: Respuesta 200 OK con un array JSON de servicios activos (ver [public.md](file:///C:/Users/Asus%20TUF/Desktop/DMGOTRAVEL/specs/001-booking-backend/contracts/public.md)).

### Scenario 2: Client Authentication & Booking
1. Registra un cliente: `POST http://localhost:8000/api/auth/register` (ver [auth.md](file:///C:/Users/Asus%20TUF/Desktop/DMGOTRAVEL/specs/001-booking-backend/contracts/auth.md)). Extrae el `token` de la respuesta.
2. Crea una reserva: `POST http://localhost:8000/api/client/reservations` con el Header `Authorization: Bearer <token>` (ver [client.md](file:///C:/Users/Asus%20TUF/Desktop/DMGOTRAVEL/specs/001-booking-backend/contracts/client.md)).
3. **Expected Outcome**: Respuesta 201 Created con el detalle de la reserva en estado `pending`.

### Scenario 3: Admin Management & RBAC Protection
1. Usando el token de cliente del escenario 2, intenta listar reservas: `GET http://localhost:8000/api/admin/reservations`.
2. **Expected Outcome**: Respuesta 403 Forbidden.
3. Haz login con credenciales del Admin pre-seedeado: `POST http://localhost:8000/api/auth/login`. Extrae el token de admin.
4. Con el token de Admin, repite `GET http://localhost:8000/api/admin/reservations`.
5. **Expected Outcome**: Respuesta 200 OK listando todas las reservas del sistema (ver [admin.md](file:///C:/Users/Asus%20TUF/Desktop/DMGOTRAVEL/specs/001-booking-backend/contracts/admin.md)).
