# Public API Contracts

## GET `/api/services`
Devuelve el catálogo de servicios y paquetes activos.

**Query Parameters** (Opcionales):
- `page`: int
- `per_page`: int

**Response 200 OK**:
```json
{
  "data": [
    {
      "id": 1,
      "title": "Tour Ciudad Colonial",
      "description": "Recorrido histórico guiado.",
      "price": 25.00,
      "capacity": 15,
      "duration": 180,
      "image_360_url": "https://storage/images/tour-360.jpg",
      "is_active": true
    }
  ],
  "links": {
    "first": "...",
    "last": "...",
    "prev": null,
    "next": null
  },
  "meta": {
    "current_page": 1,
    "last_page": 1,
    "per_page": 15,
    "total": 5
  }
}
```

## GET `/api/services/{id}`
Devuelve detalles de un servicio activo específico.

**Response 200 OK**:
```json
{
  "data": {
    "id": 1,
    "title": "Tour Ciudad Colonial",
    "description": "Recorrido histórico guiado.",
    "price": 25.00,
    "capacity": 15,
    "duration": 180,
    "image_360_url": "https://storage/images/tour-360.jpg",
    "is_active": true
  }
}
```
**Response 404 Not Found**:
```json
{
  "message": "Resource not found.",
  "error_code": "NOT_FOUND"
}
```
