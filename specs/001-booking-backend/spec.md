# Feature Specification: booking-backend

**Feature Branch**: `001-booking-backend`

**Created**: 2026-06-25

**Status**: Draft

**Input**: User description: "Construya el backend en capas y conecte el frontend (ya diseñado en STITCH) para el sistema web de gestión de reservas y servicios turísticos de DMGOTRAVEL. El sistema debe digitalizar y centralizar los procesos operativos. El sistema tiene DOS tipos de usuarios con flujos separados: ADMINISTRADOR y CLIENTE."

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Client Public Catalog (Priority: P1)

A prospective client visits the web system to browse available services and packages without needing to create an account. They can see details like 360° images, prices, and duration.

**Why this priority**: The public catalog is the primary entry point for tourists to discover offerings and drives engagement.

**Independent Test**: Can retrieve a list of active services and packages via a public API endpoint without providing an authentication token.

**Acceptance Scenarios**:

1. **Given** unauthenticated access, **When** requesting the services catalog, **Then** a list of active services is returned in a standard JSON format.
2. **Given** unauthenticated access, **When** requesting the services catalog, **Then** deactivated services are omitted from the results.

---

### User Story 2 - Client Registration & Authentication (Priority: P1)

A tourist registers for an account and logs in to the system. The authentication is handled via Laravel Sanctum and returns an API token that the STITCH frontend will use for authenticated requests.

**Why this priority**: Required for clients to be able to create and manage their own reservations securely.

**Independent Test**: Can successfully create an account, log in, receive a valid Sanctum token, and access a protected endpoint (e.g., fetching their own profile details).

**Acceptance Scenarios**:

1. **Given** valid registration details, **When** submitting the registration, **Then** a new user account is created with the Client role.
2. **Given** valid login credentials, **When** authenticating, **Then** a valid Sanctum token is returned.

---

### User Story 3 - Client Booking Flow (Priority: P1)

An authenticated client browses the catalog, selects a service or package, and creates a reservation. They can view their booking history in a dedicated panel and cancel bookings if the status is still 'pending'.

**Why this priority**: This represents the core business value of the platform (digitalizing tourist reservations).

**Independent Test**: Authenticated user can create a reservation, view it in a list of their reservations, and successfully cancel it if it's pending.

**Acceptance Scenarios**:

1. **Given** an authenticated client, **When** creating a reservation for an active service, **Then** the reservation is created with a 'pending' status.
2. **Given** a reservation with 'pending' status, **When** the owning client cancels it, **Then** the status is updated to 'cancelled'.
3. **Given** a reservation with 'confirmed' status, **When** the owning client attempts to cancel it, **Then** a 422 error is returned.

---

### User Story 4 - Admin Service & Package Management (Priority: P2)

An administrator logs in to manage the catalog. They can create, read, update, and deactivate services and packages. They can configure properties like capacity, price, duration, and manage 360° images.

**Why this priority**: Essential for maintaining an up-to-date catalog, but less critical than the client ability to view existing ones.

**Independent Test**: Admin user can perform CRUD operations on services/packages, and deactivated items no longer appear in the client's public catalog.

**Acceptance Scenarios**:

1. **Given** an authenticated admin, **When** creating a new service with capacity, price, and duration, **Then** the service is saved and available.
2. **Given** an authenticated admin, **When** deactivating a service, **Then** the service is no longer returned in the public catalog endpoint.
3. **Given** an authenticated client, **When** attempting to create a service, **Then** a 403 Forbidden error is returned.

---

### User Story 5 - Admin Booking Management (Priority: P2)

An administrator lists all reservations in the system. They can review pending bookings, confirm them, cancel them, or mark them as completed once the service has been rendered.

**Why this priority**: Crucial for operational workflow and managing the lifecycle of tourist reservations.

**Independent Test**: Admin can fetch all reservations and change the status of a specific reservation to 'confirmed', 'cancelled', or 'completed'.

**Acceptance Scenarios**:

1. **Given** an authenticated admin, **When** requesting the reservations list, **Then** all reservations (across all clients) are returned.
2. **Given** a 'pending' reservation, **When** an admin updates its status to 'confirmed', **Then** the reservation status is successfully updated.

---

### User Story 6 - Admin Auditing & Client Oversight (Priority: P3)

An administrator views a list of all registered client accounts and can inspect an audit log of state changes in the system (e.g., who changed a booking status and when).

**Why this priority**: Important for administrative oversight and tracking accountability, but not critical for the core booking flow.

**Independent Test**: Admin can fetch a list of clients and a chronological list of system logs via specific API endpoints.

**Acceptance Scenarios**:

1. **Given** an authenticated admin, **When** requesting the client list, **Then** a read-only list of client accounts is returned.
2. **Given** a reservation status change, **When** an admin requests the audit log, **Then** a record of the state change is present.

---

### Edge Cases

- What happens if a client tries to cancel a reservation that has already been confirmed by an administrator? (Should return a 422 Unprocessable Entity error).
- What happens if a client tries to book a service that exceeds its maximum capacity for a given date? (Should return a 422 Validation error).
- What happens if an admin deactivates a service that currently has pending or confirmed reservations? (Assumption: The service becomes hidden from the catalog but existing reservations remain valid).
- What happens if the 360° image upload fails or the format is invalid? (Should return a standard 422 error per the Constitution).

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST provide a public REST API endpoint to retrieve active services and packages.
- **FR-002**: System MUST allow user registration and login, issuing Sanctum API tokens.
- **FR-003**: System MUST allow authenticated clients to create reservations for active services/packages.
- **FR-004**: System MUST allow clients to view their reservation history.
- **FR-005**: System MUST allow clients to cancel their own reservations ONLY IF the status is 'pending'.
- **FR-006**: System MUST provide a full CRUD via API for administrators to manage services and packages.
- **FR-007**: System MUST support associating 360° images, capacity limits, prices, and duration to services/packages.
- **FR-008**: System MUST allow administrators to list all reservations in the system.
- **FR-009**: System MUST allow administrators to update reservation statuses (confirm, cancel, complete).
- **FR-010**: System MUST maintain an audit log of significant state changes (e.g., reservation status updates).
- **FR-011**: System MUST allow administrators to view a read-only list of client accounts.
- **FR-012**: System MUST implement Role-Based Access Control (RBAC) to restrict admin endpoints to administrators only, returning a 403 error for unauthorized access.

### Key Entities

- **User**: Represents registered tourists or DMGOTRAVEL staff. Key attributes: email, password, roles (via spatie/laravel-permission).
- **ServicePackage**: The offering available for booking. Key attributes: title, description, price, capacity, duration, active_status, 360_image_url.
- **Reservation**: A booking made by a client for a service. Key attributes: client_id, service_id, date, status (pending, confirmed, cancelled, completed).
- **AuditLog**: A record of a state change. Key attributes: user_id, action, entity_type, entity_id, timestamp.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: The STITCH frontend can successfully complete the client booking flow and admin management flow exclusively via the REST API.
- **SC-002**: 100% of API endpoints return standardized JSON errors (422, 403, 404, 500) per the Constitution requirements.
- **SC-003**: 100% of successful API responses utilize `JsonResource` or `ResourceCollection`.
- **SC-004**: Role-Based Access Control correctly prevents Clients from accessing Admin endpoints, returning a 403 Forbidden error in all unauthorized attempts.

## Assumptions

- STITCH frontend handles all UI rendering, routing, and form state management. The backend is exclusively a REST JSON API. The project in STITCH is named "DMGOTRAVEL".
- 360° images are uploaded to a standard storage service (like local disk storage) and their accessible URLs are stored in the database.
- Administrator accounts are pre-seeded or created out-of-band; there is no public registration flow for admins.
- SoftDeletes are used globally for entities per the Constitution (ServicePackage, Reservation, User).
- The system uses standard email/password authentication.
