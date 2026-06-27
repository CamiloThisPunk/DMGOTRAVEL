# Client API Contracts

Todas las rutas requieren autenticación con Sanctum Bearer Token (`Authorization: Bearer {token}`).

## POST `/api/client/reservations`
Crea una nueva reserva.

**Request (JSON)**:
```json
{
  "service_package_id": 1,
  "reservation_date": "2026-07-15",
  "guests_count": 2
}
```

**Response 201 Created**:
```json
{
  "data": {
    "id": 101,
    "service": {
      "id": 1,
      "title": "Tour Ciudad Colonial"
    },
    "reservation_date": "2026-07-15",
    "guests_count": 2,
    "status": "pending",
    "total_price": 50.00,
    "created_at": "2026-06-25T12:00:00Z"
  }
}
```

**Response 422 Unprocessable Entity** (Ejemplo capacidad excedida):
```json
{
  "message": "The given data was invalid.",
  "errors": {
    "guests_count": [
      "Not enough capacity available for the selected date."
    ]
  }
}
```

## GET `/api/client/reservations`
Lista el historial de reservas del cliente autenticado.

**Response 200 OK**:
```json
{
  "data": [
    {
      "id": 101,
      "service_title": "Tour Ciudad Colonial",
      "reservation_date": "2026-07-15",
      "status": "pending",
      "total_price": 50.00
    }
  ]
}
```

## PATCH `/api/client/reservations/{id}/cancel`
Cancela una reserva (solo si está `pending`).

**Response 200 OK**:
```json
{
  "data": {
    "id": 101,
    "status": "cancelled"
  }
}
```

**Response 422 Unprocessable Entity** (Si no está pending):
```json
{
  "message": "Only pending reservations can be cancelled.",
  "error_code": "INVALID_STATE_TRANSITION"
}
```
