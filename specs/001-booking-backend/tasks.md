---
description: "Task list for booking-backend implementation (Enterprise REST API)"
---

# Tasks: booking-backend

**Input**: Design documents from `specs/001-booking-backend/`

**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)

---

## Phase 1: Setup & Foundational (Shared Infrastructure)

**Purpose**: Project initialization, security, and global API configuration.

- [X] T001 Initialize Laravel 11 API Headless project with Sanctum and `spatie/laravel-permission`.
- [X] T002 [P] Configure database connection (MariaDB) and apply strict JSON formatting for all exceptions (404, 403, 422, 500) in `bootstrap/app.php`.
- [X] T003 [P] Configure `config/cors.php` to allow requests and credentials (`supports_credentials => true`) from the STITCH preview environment.
- [X] T004 Install and configure `darkaonline/l5-swagger` (OpenAPI) to autogenerate API contracts for manual frontend wiring.

---

## Phase 2: Módulo Base y Autenticación (User Story 2)

**Goal**: Secure Client Registration & Authentication (Priority: P1)
**Independent Test**: Can successfully create an account, log in, and receive a valid Sanctum Bearer token via Postman/Swagger.

- [X] T005 [US2] Crear Migración, Modelo y Seeder para `User` (con índices en `email`) en `database/migrations/` y `app/Models/User.php`. Configurar roles ('admin', 'client') usando Spatie.
- [X] T006 [US2] Crear `AuthService` en `app/Services/Auth/AuthService.php` para encapsular la lógica de hashing, validación y emisión de tokens.
- [X] T007 [P] [US2] Crear Form Requests (`RegisterRequest`, `LoginRequest`) en `app/Http/Requests/Auth/` con reglas de validación estrictas.
- [X] T008 [US2] Crear `AuthController` en `app/Http/Controllers/Api/Public/AuthController.php` (Registro, Login, Logout) delegando la lógica al `AuthService`.
- [X] T009 [P] [US2] Crear `UserResource` en `app/Http/Resources/UserResource.php` para estandarizar la respuesta JSON.
- [X] T010 [US2] [STITCH MCP] Conectar los formularios de Login/Registro del proyecto DMGOTRAVEL en STITCH con los endpoints de Sanctum.

---

## Phase 3: Módulo de Catálogo y Administración (User Stories 1, 4, 6)

**Goal**: High-performance Public Catalog (P1), Admin Management (P2) and Oversight (P3).
**Independent Test**: Can retrieve cached active services; Admin can perform CRUD on services using `multipart/form-data` and view audit logs.

- [X] T011 [P] [US1] Crear Migraciones, Modelos y Factories para `Category`, `ServicePackage` y `AuditLog` en `app/Models/` (incluyendo SoftDeletes y claves foráneas).
- [X] T012 [US4] Crear `ImageUploadService` en `app/Services/Media/ImageUploadService.php` para validar tipos MIME y almacenar imágenes 360° de forma segura.
- [X] T013 [US4] Crear `PackageManagementService` en `app/Services/Catalog/PackageManagementService.php` para operaciones CRUD del administrador.
- [X] T014 [P] [US1] Crear `CatalogService` en `app/Services/Catalog/CatalogService.php`. **Crítico:** Implementar `Cache::remember()` para optimizar el listado público de servicios.
- [X] T015 [US4] Crear Controladores API: `ServicePackageController` en `app/Http/Controllers/Api/Admin/` y `CatalogController` en `app/Http/Controllers/Api/Public/`, usando Form Requests para validación.
- [X] T016 [US6] Crear Controlador API `ClientOversightController` en `app/Http/Controllers/Api/Admin/ClientOversightController.php` para consultar lista de Clientes y Logs de Auditoría.
- [X] T017 [P] [US1] Crear `ServicePackageResource` en `app/Http/Resources/ServicePackageResource.php` asegurando el Eager Loading de imágenes y categorías para evitar el problema N+1.
- [X] T018 [US4] [STITCH MCP] Conectar las tablas de administración y tarjetas del catálogo público en STITCH usando los datos de la API.

---

## Phase 4: Módulo de Reservas y Transacciones (User Stories 3, 5)

**Goal**: Concurrency-safe Booking Flow (P1) and Admin Booking Management (P2)
**Independent Test**: API prevents double-booking when capacity is exceeded, returning a 422 JSON response.

- [X] T019 [P] [US3] Crear Migración, Modelo y Factory para `Reservation` en `app/Models/Reservation.php`.
- [X] T020 [US3] Crear `ReservationService` en `app/Services/Booking/ReservationService.php`. **Crítico:** Implementar `DB::transaction` y `lockForUpdate()` al verificar la capacidad máxima para prevenir Overbooking.
- [X] T021 [P] [US3] Crear lógica de transición de estado en `ReservationService`, registrando cada cambio automáticamente en la tabla `AuditLog`.
- [X] T022 [US3] Crear `ReservationController` en `app/Http/Controllers/Api/Client/ReservationController.php` y en `app/Http/Controllers/Api/Admin/ReservationController.php` delegando la creación y cambio de estado al servicio.
- [X] T023 [P] [US3] Crear `ReservationResource` en `app/Http/Resources/ReservationResource.php`.
- [X] T024 [US5] Configurar un comando en `app/Console/Commands/` (Scheduler) para cancelar automáticamente reservas en estado 'pending' tras 48 horas.
- [X] T025 [US3] [STITCH MCP] Conectar el formulario de creación y gestión de reservas en STITCH, mapeando las validaciones y errores (Overbooking).

---

## Phase 5: Módulo de Pruebas y Aseguramiento de Calidad (QA)

**Goal**: Garantizar la resiliencia de la API antes de la integración con STITCH.

- [X] T026 [P] [US3] Escribir Unit Tests aislados en `tests/Unit/Services/ReservationServiceTest.php` forzando escenarios de capacidad excedida para validar el rollback de la base de datos.
- [X] T027 [P] [US4] Escribir Unit Tests aislados para `PackageManagementService` en `tests/Unit/Services/Catalog/PackageManagementServiceTest.php` verificando la correcta subida y eliminación lógica (SoftDeletes).
- [X] T028 [P] [US2] Escribir Feature Tests para el flujo de `AuthController` en `tests/Feature/AuthTest.php`.
- [X] T029 [P] [US1] Escribir Feature Tests para el catálogo público en `tests/Feature/CatalogTest.php`.
- [X] T030 [P] [US3] Escribir Feature Tests para endpoints protegidos, validando que el middleware RBAC bloquee a un usuario 'client' de acceder a rutas `/api/admin/*` en `tests/Feature/ReservationTest.php`.
- [X] T031 [P] Exportar la colección completa de endpoints (vía Swagger o Postman) para facilitar el testing.

---

## Dependencies & Execution Order

- **Phase 1** bloquea todas las demás fases. La configuración de CORS y Excepciones es vital para el frontend.
- **Phase 2 (Autenticación)** bloquea Phase 3 y 4. Se requiere el sistema de usuarios para probar Sanctum.
- **Phase 3 y 4** pueden avanzar en paralelo en el lado de los Modelos y Servicios, pero la Phase 4 (Reservas) depende de que existan `ServicePackages` para ser reservados.
- **Phase 5 (Pruebas)** debe ejecutarse módulo por módulo conforme se completan las Fases 2, 3 y 4.
- Las tareas `[STITCH MCP]` se ejecutan al final de cada módulo como "cableado" (Wiring).
