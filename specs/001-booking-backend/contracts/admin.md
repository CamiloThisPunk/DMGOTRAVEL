# Admin API Contracts

Todas las rutas requieren autenticación Bearer Token y el rol `admin` (403 Forbidden si no tiene el rol).

## CRUD Services (`/api/admin/services`)

**GET `/api/admin/services`**: Lista todos (activos e inactivos).
**POST `/api/admin/services`**: Crea uno nuevo.
**GET `/api/admin/services/{id}`**: Detalle completo.
**PUT `/api/admin/services/{id}`**: Actualiza campos.
**DELETE `/api/admin/services/{id}`**: Desactiva (SoftDelete o set `is_active=false`).

*Ejemplo Payload Creación*:
```json
{
  "title": "Nuevo Tour",
  "description": "Detalles...",
  "price": 100.00,
  "capacity": 20,
  "duration": 120,
  "is_active": true
}
```

## Booking Management (`/api/admin/reservations`)

**GET `/api/admin/reservations`**: Lista reservas de todos los clientes, con filtros (estado, fechas).

**PATCH `/api/admin/reservations/{id}/status`**: Actualiza el estado.
```json
{
  "status": "confirmed" // o 'cancelled', 'completed'
}
```

## Audit & Oversight (`/api/admin/clients` & `/api/admin/logs`)

**GET `/api/admin/clients`**:
```json
{
  "data": [
    {
      "id": 1,
      "name": "Juan Perez",
      "email": "juan@example.com",
      "created_at": "2026-05-01T..."
    }
  ]
}
```

**GET `/api/admin/logs`**:
```json
{
  "data": [
    {
      "id": 1,
      "user_id": 2, // Admin ID
      "action": "reservation.status_updated",
      "entity_type": "App\\Models\\Reservation",
      "entity_id": 101,
      "old_values": {"status": "pending"},
      "new_values": {"status": "confirmed"},
      "created_at": "2026-06-25T14:30:00Z"
    }
  ]
}
```
