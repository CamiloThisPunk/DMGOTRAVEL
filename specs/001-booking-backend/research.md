# Research & Decisions: booking-backend

**Feature**: [spec.md](file:///C:/Users/Asus%20TUF/Desktop/DMGOTRAVEL/specs/001-booking-backend/spec.md)

## Decisions

### Decision 1: Strict Layered Architecture (Controller -> Service -> Model)
- **Decision**: Aislar la lógica de negocio en clases `Service` (ej. `ReservationService`), dejando a los Controladores únicamente la responsabilidad del enrutamiento HTTP y validación de requests.
- **Rationale**: Requerido por la Constitución (Principio I). Permite pruebas unitarias del 80% sobre la capa de negocio mockeando la base de datos, y facilita la reutilización de código (por ejemplo, si STITCH MCP necesita invocar un servicio internamente).
- **Alternatives considered**: Fat Controllers (Rechazado por violación de la constitución y dificultad de testing).

### Decision 2: Laravel Sanctum for SPA Authentication
- **Decision**: Usar Laravel Sanctum configurado para autenticación basada en estado (cookies/CSRF) o tokens API, compatible con la integración de STITCH.
- **Rationale**: Es el estándar de primera parte en Laravel para SPAs y APIs simples. Cumple con el Principio IV de la Constitución.
- **Alternatives considered**: JWT/Tymon (Rechazado por ser de terceros y agregar complejidad innecesaria para el alcance actual); Laravel Passport (Rechazado, Oauth2 completo no es necesario para este flujo).

### Decision 3: Spatie Laravel Permission for RBAC
- **Decision**: Integrar `spatie/laravel-permission` y verificar roles mediante middleware en `routes/api.php` en lugar de dentro de los controladores.
- **Rationale**: Requerido por el Principio IV. Centraliza la seguridad.
- **Alternatives considered**: Policies/Gates nativos de Laravel (Rechazado en favor de Spatie debido a la facilidad de asignar permisos granulares a roles definidos de Admin vs Cliente).

### Decision 4: Centralized Exception Handling
- **Decision**: Sobrescribir el renderizador de excepciones en `bootstrap/app.php` o `app/Exceptions/Handler.php` (dependiendo de la versión exacta de Laravel 11) para asegurar que todos los errores 422, 403, 404 y 500 sigan un formato JSON predecible.
- **Rationale**: STITCH requiere un contrato de errores consistente (Principio VII).
- **Alternatives considered**: Manejar errores manualmente en cada controlador (Rechazado, propenso a errores humanos y duplicación de código).
