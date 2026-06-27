<!--
  SYNC IMPACT REPORT
  ==================
  Version change: (new) → 1.0.0
  Modified principles: N/A (initial ratification)
  Added sections:
    - Core Principles (7 principles)
    - Technology Stack & Constraints
    - Development Workflow & Quality Gates
    - Governance
  Removed sections: N/A
  Templates requiring updates:
    - .specify/templates/plan-template.md        ✅ compatible (Constitution Check section present)
    - .specify/templates/spec-template.md         ✅ compatible (no constitution-specific overrides needed)
    - .specify/templates/tasks-template.md        ✅ compatible (phase structure accommodates service-layer testing)
  Follow-up TODOs: None
-->

# DMGOTRAVEL Constitution

## Core Principles

### I. Arquitectura en Capas con MVC Estricto

El backend Laravel DEBE seguir una Arquitectura en Capas con patrón MVC estricto:

- **Modelos (M):** Eloquent ORM es la ÚNICA interfaz de acceso a datos.
  Cada modelo DEBE declarar `$fillable`, `$casts`, y relaciones explícitas.
  Toda consulta compleja DEBE utilizar scopes de Eloquent, nunca queries
  crudas fuera del Modelo.
- **Vistas (V):** Las respuestas de la API DEBEN estructurarse
  exclusivamente mediante clases `JsonResource` y `ResourceCollection`
  de Laravel. Ningún controlador DEBE devolver arrays o modelos en crudo.
- **Controladores (C):** Son exclusivos para el flujo HTTP
  (Request → Response). DEBEN delegar toda lógica a la Capa de Servicios
  y NO DEBEN contener reglas de negocio, queries directas ni
  transformaciones de datos.
- **Capa de Servicios (Service Layer):** Toda lógica de negocio compleja
  (validación de capacidades, flujos de reserva, cálculos de
  disponibilidad) DEBE aislarse en clases Service inyectadas por
  constructor. Los controladores invocan servicios; los servicios
  invocan modelos.

**Justificación:** Mantener controladores delgados y servicios
desacoplados permite pruebas unitarias aisladas, reutilización de
lógica entre endpoints, y evolución independiente de cada capa.

### II. Integración Frontend vía STITCH MCP

La UI/UX DEBE diseñarse y mantenerse en STITCH. Toda integración
frontend se ejecuta conectándose a STITCH mediante su MCP (Model
Context Protocol) en AntiGravity:

- La maquetación, estilos y componentes visuales son responsabilidad
  exclusiva de STITCH. El backend NO DEBE imponer directrices de
  presentación.
- Las vistas conectadas en STITCH DEBEN adaptarse a sus diseños
  preexistentes sin modificaciones externas.
- La comunicación entre STITCH y el backend se realiza exclusivamente
  mediante la API RESTful definida en el Principio I.

**Justificación:** Separar completamente la responsabilidad visual
(STITCH) de la lógica de datos (Laravel) elimina acoplamientos
y permite que diseñadores y desarrolladores trabajen en paralelo.

### III. Integridad de Datos y Cumplimiento ACID

MariaDB es el motor de base de datos con cumplimiento estricto ACID:

- Todas las relaciones entre entidades DEBEN reforzarse con claves
  foráneas a nivel de base de datos (no solo en Eloquent).
- Cada modelo Eloquent DEBE implementar el trait `SoftDeletes` para
  eliminación lógica. La eliminación física está PROHIBIDA en
  producción.
- Las migraciones DEBEN ser el ÚNICO mecanismo para modificar el
  esquema. Cambios manuales en la base de datos están PROHIBIDOS.
- Las transacciones de base de datos DEBEN utilizarse para operaciones
  que involucren múltiples tablas (ej. creación de reserva con
  servicios asociados).

**Justificación:** Las claves foráneas a nivel de base de datos
previenen inconsistencias que el ORM solo no puede garantizar.
SoftDeletes preserva trazabilidad y permite auditoría.

### IV. Autenticación y Control de Acceso RBAC

Laravel Sanctum DEBE ser el ÚNICO mecanismo de autenticación de la API.
El control de acceso basado en roles (RBAC) se implementa con
`spatie/laravel-permission`:

- Cada endpoint DEBE tener asignado al menos un permiso o rol requerido.
- Los middleware de autorización DEBEN aplicarse a nivel de ruta, no
  dentro de controladores.
- Los tokens de Sanctum DEBEN tener TTL configurado y capacidades
  (abilities) limitadas al rol del usuario.
- Las rutas públicas (sin autenticación) DEBEN documentarse
  explícitamente y justificarse.

**Justificación:** Centralizar autenticación en Sanctum y autorización
en spatie/laravel-permission garantiza un punto único de control,
auditable y extensible sin duplicación de lógica en controladores.

### V. Pruebas Centradas en la Capa de Servicios

La cobertura mínima de pruebas unitarias DEBE ser del 80%, enfocada
en la Capa de Servicios:

- Las clases Service DEBEN probarse independientemente de los
  controladores HTTP, mockeando repositorios y dependencias externas.
- Cada Service DEBE tener su archivo de prueba correspondiente en
  `tests/Unit/Services/`.
- Las pruebas de Feature (`tests/Feature/`) validan el flujo HTTP
  completo (request → controller → service → response) pero NO
  sustituyen las pruebas unitarias de servicios.
- El framework de pruebas es PHPUnit con las utilidades de testing
  de Laravel (RefreshDatabase, factories, mocks).

**Justificación:** Probar servicios de forma aislada asegura que la
lógica de negocio funciona correctamente independientemente del
transporte HTTP, permitiendo refactorizaciones seguras.

### VI. Formato de Código y Estándar PSR-12

Todo el código generado DEBE cumplir con el estándar PSR-12 y pasar
el formateador Laravel Pint sin errores:

- `laravel/pint` DEBE ejecutarse antes de cada commit.
- La configuración de Pint DEBE residir en `pint.json` en la raíz
  del proyecto backend.
- Las violaciones de formato son errores bloqueantes: código que no
  pase Pint NO DEBE fusionarse.

**Justificación:** Un estándar de formato uniforme elimina discusiones
de estilo en revisiones de código y garantiza legibilidad consistente
en todo el equipo.

### VII. Respuestas de Error Estandarizadas para la API

Todos los errores devueltos por la API DEBEN seguir un formato JSON
estandarizado para que STITCH los procese de manera amigable:

- **422 (Validación):** `{"message": "...", "errors": {"field": ["..."]}}`
  siguiendo el formato nativo de Laravel para errores de validación.
- **403 (Autorización):** `{"message": "...", "error_code": "FORBIDDEN"}`
  con mensaje descriptivo del permiso faltante.
- **404 (No encontrado):** `{"message": "...", "error_code": "NOT_FOUND"}`
  con identificación del recurso buscado.
- **500 (Error interno):** `{"message": "...", "error_code": "SERVER_ERROR"}`
  sin exponer detalles internos en producción.
- Un `ExceptionHandler` centralizado DEBE interceptar todas las
  excepciones y formatearlas según esta estructura.

**Justificación:** Un formato de error predecible permite que STITCH
implemente manejo de errores consistente en toda la interfaz, mejorando
la experiencia del usuario final.

## Technology Stack & Constraints

| Componente       | Tecnología                       | Restricción                                         |
|------------------|----------------------------------|-----------------------------------------------------|
| Backend          | Laravel (PHP 8.2+)               | API RESTful exclusivamente                          |
| Frontend         | STITCH vía MCP en AntiGravity    | Diseño preexistente; sin imposiciones del backend   |
| Base de Datos    | MariaDB 10.6+                    | ACID estricto, claves foráneas obligatorias         |
| Autenticación    | Laravel Sanctum                  | Tokens con TTL y abilities                          |
| Autorización     | spatie/laravel-permission        | RBAC a nivel de ruta                                |
| ORM              | Eloquent                         | SoftDeletes obligatorio en todos los modelos        |
| Formato          | Laravel Pint (PSR-12)            | Bloqueante para merge                               |
| Testing          | PHPUnit + Laravel Testing Utils  | 80% cobertura mínima en Capa de Servicios           |
| API Responses    | JsonResource / ResourceCollection| Prohibido devolver arrays/modelos en crudo           |

- La metodología de desarrollo es **Desarrollo Impulsado por
  Especificaciones (SSD)** gestionada a través de Spec Kit.
- Todas las fases del proyecto (especificación, planificación,
  implementación) DEBEN regirse por esta constitución.

## Development Workflow & Quality Gates

### Flujo de Desarrollo

1. **Especificación** (`/speckit-specify`): Definir requisitos del
   feature alineados con los principios de esta constitución.
2. **Planificación** (`/speckit-plan`): Diseño técnico que DEBE pasar
   el Constitution Check antes de la implementación.
3. **Generación de Tareas** (`/speckit-tasks`): Tareas organizadas
   por historia de usuario, incluyendo tareas obligatorias de pruebas
   de servicios.
4. **Implementación** (`/speckit-implement`): Ejecución de tareas con
   validación continua contra esta constitución.
5. **Convergencia** (`/speckit-converge`): Verificación de cobertura
   completa del spec contra el código implementado.

### Quality Gates

Cada feature DEBE superar las siguientes puertas antes de ser
aceptado:

- [ ] **Gate 1 — Arquitectura:** Controladores delgados, lógica en
  servicios, respuestas vía JsonResource.
- [ ] **Gate 2 — Datos:** Migraciones con claves foráneas, SoftDeletes
  en todos los modelos, transacciones donde corresponda.
- [ ] **Gate 3 — Seguridad:** Endpoints protegidos con Sanctum +
  permisos spatie, rutas públicas justificadas.
- [ ] **Gate 4 — Pruebas:** ≥80% cobertura en Capa de Servicios,
  tests unitarios aislados de HTTP.
- [ ] **Gate 5 — Formato:** `php artisan pint --test` pasa sin errores.
- [ ] **Gate 6 — Errores:** Todas las respuestas de error siguen el
  formato JSON estandarizado (422/403/404/500).
- [ ] **Gate 7 — Integración STITCH:** La API es consumible por STITCH
  sin adaptaciones ad-hoc en el frontend.

## Governance

Esta constitución es el documento rector del proyecto DMGOTRAVEL.
Tiene precedencia sobre todas las demás prácticas y convenciones:

- **Enmiendas:** Cualquier modificación a esta constitución DEBE
  documentarse con justificación, incrementar la versión según
  Semantic Versioning (MAJOR para cambios incompatibles, MINOR para
  adiciones, PATCH para clarificaciones), y actualizar la fecha de
  última enmienda.
- **Cumplimiento:** Todo feature, plan y tarea generados por Spec Kit
  DEBEN validarse contra los principios aquí definidos antes de
  aprobarse.
- **Revisión de Conformidad:** Al inicio de cada fase de planificación,
  el Constitution Check del plan-template DEBE verificar alineación
  con los 7 principios.
- **Resolución de Conflictos:** Ante conflictos entre esta constitución
  y otras guías del proyecto, esta constitución prevalece.

**Version**: 1.0.0 | **Ratified**: 2025-06-25 | **Last Amended**: 2025-06-25
