# Data Model: booking-backend

## Entities

### User
Representa a los clientes y administradores del sistema (manejado por el modelo `User` de Laravel).
- **id**: bigint (PK)
- **name**: varchar(255)
- **email**: varchar(255) (unique)
- **password**: varchar(255)
- **created_at**: timestamp
- **updated_at**: timestamp
- **deleted_at**: timestamp (SoftDeletes)
- **Roles/Permissions**: Manejados a través de tablas pivot de `spatie/laravel-permission` (modelos `Role` y `Permission`).

### ServicePackage
Representa un servicio o paquete turístico ofrecido en el catálogo.
- **id**: bigint (PK)
- **title**: varchar(255)
- **description**: text
- **price**: decimal(10, 2)
- **capacity**: integer (número máximo de personas por reserva/día)
- **duration**: integer (minutos u horas, a definir convenciones en el modelo)
- **image_360_url**: varchar(255) (nullable, URL de almacenamiento)
- **is_active**: boolean (default: true)
- **created_at**: timestamp
- **updated_at**: timestamp
- **deleted_at**: timestamp (SoftDeletes)

### Reservation
Representa la reserva hecha por un cliente para un servicio.
- **id**: bigint (PK)
- **client_id**: bigint (FK -> users.id)
- **service_package_id**: bigint (FK -> service_packages.id)
- **reservation_date**: date
- **guests_count**: integer (debe ser <= ServicePackage.capacity)
- **status**: enum('pending', 'confirmed', 'cancelled', 'completed') (default: 'pending')
- **total_price**: decimal(10, 2) (calculado al momento de la reserva)
- **created_at**: timestamp
- **updated_at**: timestamp
- **deleted_at**: timestamp (SoftDeletes)

### AuditLog
Registro inmutable de cambios de estado críticos.
- **id**: bigint (PK)
- **user_id**: bigint (FK -> users.id, nullable para acciones del sistema)
- **action**: varchar(255) (ej. 'reservation.status_updated')
- **entity_type**: varchar(255) (ej. 'App\Models\Reservation')
- **entity_id**: bigint
- **old_values**: json (nullable)
- **new_values**: json (nullable)
- **created_at**: timestamp (no update/delete)

## Relationships & Foreign Keys (ACID Strict)
- `Reservation` `belongsTo` `User` (client)
  - DB Constraint: `FOREIGN KEY (client_id) REFERENCES users(id)`
- `Reservation` `belongsTo` `ServicePackage`
  - DB Constraint: `FOREIGN KEY (service_package_id) REFERENCES service_packages(id)`
- `AuditLog` `belongsTo` `User` (actor)
  - DB Constraint: `FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL`

## Validations & Constraints
- **Reservation Creation**: `guests_count` no puede exceder la capacidad disponible del servicio para esa fecha.
- **Status Transitions**:
  - `pending` -> `confirmed` | `cancelled`
  - `confirmed` -> `completed` | `cancelled`
  - Solo el admin puede mover a `confirmed` o `completed`.
  - El cliente solo puede cambiar a `cancelled` si el estado previo es `pending`.
