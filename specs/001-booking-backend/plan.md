# Implementation Plan: booking-backend

**Branch**: `001-booking-backend` | **Date**: 2026-06-25 | **Spec**: [spec.md](file:///C:/Users/Asus%20TUF/Desktop/DMGOTRAVEL/specs/001-booking-backend/spec.md)

**Input**: Feature specification from `specs/001-booking-backend/spec.md`

## Summary

Construir un backend robusto en Laravel bajo una arquitectura en capas (Controladores, Servicios, Modelos, Recursos) para gestionar servicios turísticos y reservas. El backend actuará como una API RESTful consumida exclusivamente por un frontend pre-diseñado en STITCH a través del Model Context Protocol (MCP).

## Technical Context

**Language/Version**: PHP 8.2+

**Primary Dependencies**: Laravel 11, Laravel Sanctum (Auth), spatie/laravel-permission (RBAC)

**Storage**: MariaDB 10.6+

**Testing**: PHPUnit, Laravel Testing Utils

**Target Platform**: Web Service (API REST) integrándose con STITCH vía MCP

**Project Type**: web-service

**Performance Goals**: Tiempos de respuesta API < 300ms para endpoints CRUD.

**Constraints**:
- Cumplimiento estricto ACID y claves foráneas.
- Toda la lógica de negocio debe aislarse en la Capa de Servicios.
- No renderizar vistas Blade; todas las respuestas deben ser JSON a través de `JsonResource`.
- STITCH maneja toda la UI/UX. El proyecto en STITCH tiene el nombre DMGOTRAVEL.

**Scale/Scope**: MVP central de gestión de reservas, con roles de Administrador y Cliente.

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- [x] **Gate 1 — Arquitectura:** Controladores delgados, lógica en servicios, respuestas vía JsonResource.
- [x] **Gate 2 — Datos:** Migraciones con claves foráneas, SoftDeletes en todos los modelos.
- [x] **Gate 3 — Seguridad:** Endpoints protegidos con Sanctum + permisos spatie.
- [x] **Gate 4 — Pruebas:** ≥80% cobertura en Capa de Servicios.
- [x] **Gate 5 — Formato:** PSR-12 vía Laravel Pint.
- [x] **Gate 6 — Errores:** Respuestas estandarizadas (422/403/404/500).
- [x] **Gate 7 — Integración STITCH:** API 100% consumible.

## Project Structure

### Documentation (this feature)

```text
specs/001-booking-backend/
├── plan.md
├── research.md
├── data-model.md
├── quickstart.md
├── contracts/
│   ├── auth.md
│   ├── admin.md
│   └── client.md
└── tasks.md
```

### Source Code (repository root)

```text
app/
├── Http/
│   ├── Controllers/
│   │   ├── Api/
│   │   │   ├── Admin/
│   │   │   ├── Client/
│   │   │   └── Public/
│   │   ├── Requests/
│   │   └── Resources/
├── Models/
└── Services/
    ├── Auth/
    ├── Booking/
    └── Catalog/

database/
├── migrations/
└── seeders/

routes/
└── api.php

tests/
├── Feature/
└── Unit/
    └── Services/
```

**Structure Decision**: Monolito Laravel API-only (Web Service) estructurado en capas lógicas dentro de `app/`, con separación explícita de namespaces para Admin, Client y Public en los controladores para alinearse con los flujos de STITCH.

## Layer Responsibilities Diagram

```mermaid
flowchart TD
    Request([Petición HTTP de STITCH]) --> Routing[routes/api.php]
    Routing --> Middleware{Sanctum / RBAC}
    
    subgraph Capa de Presentación
        Middleware -- Validado --> Controller[Controller\nValida Request, Invoca Service]
        Controller -. Responde .-> Resource[JsonResource\nFormatea salida]
    end
    
    subgraph Capa de Dominio
        Controller -- Llama --> Service[Service Class\nLógica de negocio y transacciones]
    end
    
    subgraph Capa de Datos
        Service -- Usa --> Model[Eloquent Model\nAcceso a BBDD y Relaciones]
        Model <--> DB[(MariaDB)]
    end
    
    Resource --> Response([Respuesta JSON estandarizada])
```

## Complexity Tracking

No constitution violations detected. No complexity justification needed.

## PRUEBAS DE INTEGRACION
## SDET Unit Testing Prompt

The following prompt was used to guide the AI in generating robust unit tests for the backend controllers:

```text
Actúa como un Ingeniero SDET (Software Development Engineer in Test) Senior especializado en Clean Architecture.
Estás trabajando en el sistema "DMGOTRAVEL", compuesto por un Backend en Laravel 11 (PHP 8.2+) y un Frontend en React 19 (Vite).

# ALCANCE DEL PROYECTO (CONTROLADORES OBJETIVO)
El sistema divide su lógica de negocio en los siguientes controladores de la API. Debes tener en cuenta el namespace y el contexto de cada uno al generar las pruebas:
- `Api\Admin\ClientOversightController.php` (Gestión administrativa de clientes)
- `Api\Admin\ReservationController.php` (Gestión administrativa de reservas)
- `Api\Admin\ServicePackageController.php` (Gestión de paquetes de servicio/turísticos)
- `Api\Auth\AuthController.php` (Autenticación y emisión de tokens Sanctum)
- `Api\Client\ReservationController.php` (Gestión de reservas desde la vista del cliente)
- `Api\Public\CatalogController.php` (Catálogo público de destinos/paquetes)

# OBJETIVO
Tu tarea es analizar el código fuente proporcionado de cualquiera de estos controladores y generar pruebas unitarias (PHPUnit) completas y robustas que garanticen, como mínimo, un 80% de cobertura de código (Code Coverage) incluyendo líneas, funciones, ramas lógicas (branches) y declaraciones (statements).

# REGLAS DE EJECUCIÓN ESTRICTAS
1. AISLAMIENTO TOTAL (Mocking): Las pruebas deben ser estrictamente unitarias. 
   - Utiliza `Mockery` de forma nativa para simular inyecciones de dependencias, repositorios, servicios, FormRequests, facades o modelos. 
   - NO uses la base de datos real ni `RefreshDatabase` a menos que se indique explícitamente. Aísla la lógica del controlador.
2. PATRÓN AAA: Estructura cada test siguiendo el patrón Arrange (Preparar), Act (Actuar), Assert (Afirmar). Añade comentarios breves indicando cada fase.
3. COBERTURA EXHAUSTIVA: Debes escribir casos de prueba para:
   - El "Happy Path" (flujo exitoso principal con respuestas HTTP 200/201).
   - Manejo de excepciones, errores de validación (HTTP 422) y fallos de autorización (HTTP 401/403).
   - Cada rama condicional (`if`, `else`, `switch`, ternarios y retornos tempranos/early returns).
4. CONVENCIONES DE CÓDIGO:
   - Usa nombres de métodos descriptivos con snake_case para los tests (ej. `test_it_returns_422_when_reservation_data_is_invalid`).
   - Mantén el código modular, limpio y respetando los principios SOLID.

# FORMATO DE SALIDA DE LA RESPUESTA
Eres un agente integrado en un flujo de trabajo de terminal. 
- NO imprimas saludos, confirmaciones, advertencias ni explicaciones teóricas.
- NO uses formato Markdown alrededor de tu respuesta más allá de un único bloque de código principal.
- Devuelve EXCLUSIVAMENTE el bloque de código final listo para ser escrito en el sistema de archivos o copiado al buffer de LazyVim.
```

## SDET Integration Testing Prompt

The following prompt was used to guide the AI in generating robust integration (Feature) tests for the backend controllers:

```text
Actúa como un Ingeniero SDET (Software Development Engineer in Test) Senior especializado en Pruebas de Integración de APIs REST.
Estás trabajando en el sistema "DMGOTRAVEL", con un Backend en Laravel 11 (PHP 8.2+).

# ALCANCE DEL PROYECTO (CONTROLADORES OBJETIVO)
El sistema divide su lógica de negocio en los siguientes controladores de la API. Debes tener en cuenta el namespace, los roles implicados y el contexto de cada uno al generar las pruebas:
- `Api\Admin\ClientOversightController.php` (Requiere rol Admin)
- `Api\Admin\ReservationController.php` (Requiere rol Admin)
- `Api\Admin\ServicePackageController.php` (Requiere rol Admin)
- `Api\Auth\AuthController.php` (Endpoints públicos y protegidos por token)
- `Api\Client\ReservationController.php` (Requiere autenticación de Cliente)
- `Api\Public\CatalogController.php` (Acceso público)

# OBJETIVO
Tu tarea es analizar el código fuente proporcionado de cualquiera de estos controladores y generar pruebas de integración (Feature Tests con PHPUnit) robustas que validen el flujo completo de la petición HTTP, desde el enrutamiento hasta la persistencia de datos.

# REGLAS DE EJECUCIÓN ESTRICTAS
1. INTEGRACIÓN REAL (Sin Mocking de Arquitectura Base): 
   - Las pruebas DEBEN interactuar con la base de datos. Utiliza el trait `RefreshDatabase` al inicio de la clase.
   - Utiliza Factories de Laravel (ej. `User::factory()->create()`) para preparar el estado inicial de la base de datos.
2. FLUJO HTTP Y AUTENTICACIÓN (Sanctum & Spatie):
   - Utiliza los métodos HTTP de prueba nativos (`$this->getJson()`, `$this->postJson()`, `$this->putJson()`, `$this->deleteJson()`).
   - Si el endpoint requiere autenticación, simula la sesión utilizando `Sanctum::actingAs($user, ['*'])`.
   - Si el controlador está en el namespace `Admin` o requiere permisos, asegúrate de crear y asignar el rol/permiso correspondiente al usuario de prueba mediante Spatie antes de hacer la petición.
3. PATRÓN AAA Y COBERTURA DE ESCENARIOS:
   - "Happy Path": Peticiones exitosas verificando códigos HTTP (200 OK / 201 Created), comprobando la estructura de la respuesta JSON (`assertJsonStructure`, `assertJsonPath`) y verificando la persistencia en base de datos (`$this->assertDatabaseHas()`).
   - Validaciones de Request: Envía payloads incorrectos/incompletos y verifica las respuestas HTTP 422 y la estructura de errores JSON.
   - Seguridad: Evalúa intentos de acceso sin autenticación (esperando HTTP 401) o con un rol sin privilegios (esperando HTTP 403).
4. CONVENCIONES DE CÓDIGO:
   - Usa snake_case para los nombres de los métodos de prueba (ej. `test_admin_can_successfully_create_a_tour_package_and_save_it_to_db`).
   - Mantén el código modular, declarativo y limpio.

# FORMATO DE SALIDA DE LA RESPUESTA
Eres un agente integrado en un flujo de trabajo de terminal. 
- NO imprimas saludos, confirmaciones, advertencias ni explicaciones teóricas.
- NO uses formato Markdown alrededor de tu respuesta más allá de un único bloque de código principal.
- Devuelve EXCLUSIVAMENTE el bloque de código final listo para ser escrito en el sistema de archivos o copiado al buffer.

# INPUT DEL USUARIO
A continuación se proporciona el código del controlador para el cual debes generar las pruebas de integración:
[INSERTA_EL_CÓDIGO_DEL_CONTROLADOR_AQUÍ]
```
## PRUEBAS DE CARGA O ESTRES
## Performance Testing Prompt

The following prompt was used to guide the AI in generating load and stress tests for the API endpoints using k6:

```text
Actúa como un Ingeniero de Rendimiento (Performance Test Engineer) Senior.
Estás trabajando en el sistema "DMGOTRAVEL", que cuenta con una API REST construida en Laravel 11.

# OBJETIVO
Tu tarea es analizar el endpoint o controlador proporcionado y generar un script de pruebas de carga y estrés utilizando la herramienta "k6" (escrito en JavaScript/ES6).

# REGLAS DE EJECUCIÓN ESTRICTAS
1. ESTRUCTURA DEL SCRIPT K6:
   - Importa los módulos necesarios de k6 (`http`, `check`, `sleep`).
   - Define el bloque `export const options = { ... }` para configurar las etapas (stages) de la prueba. 
2. CONFIGURACIÓN DE CARGA (STAGES):
   - Configura un patrón de tráfico realista: un "ramp-up" (subida de usuarios), un período de carga sostenida, y un "ramp-down" (bajada de usuarios). Ejemplo: 30s hasta 50 usuarios, 1m con 50 usuarios, 30s bajando a 0 usuarios.
3. UMBRALES DE ÉXITO (THRESHOLDS):
   - Define métricas estrictas de rendimiento en las `options`.
   - El 95% de las peticiones deben responder en menos de 500ms (`http_req_duration: ['p(95)<500']`).
   - La tasa de error debe ser inferior al 1% (`http_req_failed: ['rate<0.01']`).
4. LÓGICA DE LA PETICIÓN Y AUTENTICACIÓN:
   - Construye la petición HTTP correspondiente (GET, POST, etc.) hacia una URL base ficticia (ej. `http://127.0.0.1:8000/api/v1/...`).
   - Si el endpoint requiere autenticación, incluye un header con un token Bearer de prueba.
   - Si es una petición POST/PUT, genera un payload JSON dinámico o representativo basado en el contexto del controlador.
5. VALIDACIONES (CHECKS):
   - Implementa `check()` para verificar que el código de estado HTTP (status) sea el esperado (ej. 200 o 201).
   - Añade un `sleep(1)` (o una pausa aleatoria entre 1 y 3 segundos) al final del ciclo de vida del usuario virtual (VU) para simular el comportamiento humano real y no hacer un ataque DDoS ciego.

# FORMATO DE SALIDA DE LA RESPUESTA
Eres un agente integrado en un flujo de trabajo de terminal estricto.
- NO imprimas saludos, confirmaciones, advertencias ni explicaciones teóricas.
- NO uses formato Markdown alrededor de tu respuesta más allá de un único bloque de código principal conteniendo el script de k6.
- Devuelve EXCLUSIVAMENTE el bloque de código final listo para ser ejecutado.

# INPUT DEL USUARIO
A continuación se proporciona el código del endpoint/controlador para el cual debes generar el script de k6:
[INSERTA_EL_ENDPOINT_AQUÍ]
```
