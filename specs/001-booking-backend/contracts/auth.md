# Auth API Contracts

## POST `/api/auth/register`
Registra un nuevo usuario (Cliente).

**Request (JSON)**:
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "secure_password",
  "password_confirmation": "secure_password"
}
```

**Response 201 Created**:
```json
{
  "data": {
    "user": {
      "id": 1,
      "name": "John Doe",
      "email": "john@example.com"
    },
    "token": "1|abc123token..."
  }
}
```

## POST `/api/auth/login`
Autentica a un usuario y emite un token de Sanctum.

**Request (JSON)**:
```json
{
  "email": "john@example.com",
  "password": "secure_password"
}
```

**Response 200 OK**:
```json
{
  "data": {
    "user": {
      "id": 1,
      "name": "John Doe",
      "email": "john@example.com",
      "roles": ["client"]
    },
    "token": "2|xyz987token..."
  }
}
```

## POST `/api/auth/logout`
Revoca el token actual (requiere Bearer Token).

**Response 204 No Content**
