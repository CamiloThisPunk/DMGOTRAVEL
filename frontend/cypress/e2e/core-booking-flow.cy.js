describe('Flujo Core de Reservas (E2E Completo sin BD real)', () => {
  beforeEach(() => {
    // Interceptar llamadas al backend
    cy.intercept('GET', '**/sanctum/csrf-cookie', { statusCode: 204 }).as('csrfCookie');

    cy.intercept('POST', '**/api/auth/login', {
      statusCode: 200,
      body: {
        token: 'fake-jwt-token-client',
        user: { id: 1, name: 'Cliente Test', email: 'cliente@correo.com', roles: ['client'] }
      }
    }).as('loginRequest');

    cy.intercept('GET', '**/api/services?type=paquete', {
      statusCode: 200,
      body: {
        data: [{
          id: 1,
          title: "Paquete Aventura Inca",
          description: "Explora las montañas",
          price: "150.00",
          capacity: 10,
          duration: 3,
          is_active: 1
        }]
      }
    }).as('getPackages');
    
    cy.intercept('GET', '**/api/services/1', {
      statusCode: 200,
      body: {
        data: {
          id: 1,
          title: "Paquete Aventura Inca",
          description: "Explora las montañas en profundidad con este paquete.",
          price: "150.00",
          capacity: 10,
          duration: 3,
          is_active: 1
        }
      }
    }).as('getPackageDetail');

    cy.intercept('POST', '**/api/client/reservations', {
      statusCode: 201,
      body: {
        message: 'Reserva creada con éxito',
        reservation: { id: 101, status: 'pending' }
      }
    }).as('createReservation');

    cy.intercept('GET', '**/api/client/reservations', {
      statusCode: 200,
      body: {
        data: [
          { 
            id: 101, 
            service: { title: 'Paquete Aventura Inca', type: 'paquete' }, 
            status: 'pending', 
            reservation_date: '2026-12-01', 
            total_price: 150.00,
            guests_count: 1
          }
        ]
      }
    }).as('getClientReservationsAfterBooking');
  });

  it('Permite a un cliente loguearse, ver catálogo, ver detalle, y reservar un paquete', () => {
    // 1. Visitar página de login usando /auth para esquivar el login.html estático
    cy.visit('/auth');

    // 2. Llenar credenciales y entrar
    cy.get('#login-email').type('cliente@correo.com');
    cy.get('#login-password').type('password123');
    cy.get('button[type="submit"]').contains('Ingresar').click();

    // Esperar petición simulada y redirección a dashboard
    cy.wait('@loginRequest');
    cy.url().should('include', '/client/dashboard');
    
    // 3. Navegar al catálogo protegido de paquetes
    cy.visit('/client/tourist-packages');
    cy.wait('@getPackages');

    // 4. Verificamos que el paquete cargue y hacemos clic en Ver Detalle
    cy.contains('Paquete Aventura Inca').should('be.visible');
    cy.contains('Ver Detalle').click();

    // 5. Debería cargar el detalle del paquete
    cy.wait('@getPackageDetail');
    cy.url().should('include', '/client/tourist-packages/1');

    // 6. Llenar la fecha de reserva y hacer clic en Reservar Ahora
    // El input tipo date requiere un string YYYY-MM-DD (ej: una fecha futura)
    const futureDate = new Date();
    futureDate.setDate(futureDate.getDate() + 5);
    const dateStr = futureDate.toISOString().split('T')[0];
    
    cy.get('input[type="date"]').type(dateStr);
    cy.contains('Reservar Ahora').click();

    // 7. Nos redirige al checkout
    cy.url().should('include', '/checkout');
    
    // 8. Llenar los datos personales en el checkout
    cy.get('input[placeholder="Ej. Juan Pérez"]').type('Cliente Test');
    cy.get('input[placeholder="tu@email.com"]').type('cliente@correo.com');
    cy.get('input[placeholder="+51 987 654 321"]').type('999888777');
    
    // Hacemos submit (Confirmar y Pagar)
    cy.get('button[type="submit"]').contains('Confirmar y Pagar').click();

    // 9. Esperamos que la reserva se envíe al backend (mock)
    cy.wait('@createReservation');

    // 10. Deberíamos ver el mensaje de éxito
    cy.contains('Reserva confirmada exitosamente').should('be.visible');

    // 11. Esperar la redirección automática al dashboard
    cy.url().should('include', '/client/dashboard');
    cy.wait('@getClientReservationsAfterBooking');

    // 12. Validar que la nueva reserva aparece en el dashboard del cliente
    cy.contains('Paquete Aventura Inca').should('be.visible');
    cy.contains('Pendiente').should('be.visible');
  });
});
