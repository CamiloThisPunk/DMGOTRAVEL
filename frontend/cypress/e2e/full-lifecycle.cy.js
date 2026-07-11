describe('Ciclo de Vida Completo: Cliente y Administrador', () => {

    const tourData = {
      id: 999,
      title: "Expedición Selva Amazónica Suprema",
      description: "Aventura profunda en la amazonía peruana",
      price: "450.00",
      capacity: 15,
      duration: 5,
      is_active: 1
    };
  
    // Estado inicial de la reserva (Pendiente)
    const pendingReservation = {
      id: 5050,
      client: { name: 'Aventurero Pro', email: 'aventurero@correo.com' },
      service: { title: tourData.title, type: 'paquete', price: tourData.price },
      status: 'pending',
      reservation_date: '2026-10-15',
      total_price: 450.00,
      guests_count: 1
    };
  
    // Estado final de la reserva (Confirmada)
    const confirmedReservation = {
      ...pendingReservation,
      status: 'confirmed'
    };
  
    it('Flujo E2E Master: Cliente reserva -> Admin Confirma -> Cliente verifica', () => {
      
      // ==========================================================
      // FASE 1: CLIENTE REALIZA LA RESERVA
      // ==========================================================
      cy.log('FASE 1: Cliente logueado y explorando el catálogo');
      cy.loginAsClient(); // Entramos como cliente
  
      // Interceptamos el catálogo para que devuelva nuestro tour supremo
      cy.intercept('GET', '**/api/services?type=paquete', {
        statusCode: 200,
        body: { data: [tourData] }
      }).as('getTours');
      
      // Interceptamos el detalle del tour
      cy.intercept('GET', '**/api/services/999', {
        statusCode: 200,
        body: { data: tourData }
      }).as('getTourDetail');
  
      // Interceptamos el POST de la reserva
      cy.intercept('POST', '**/api/client/reservations', {
        statusCode: 201,
        body: { message: 'Reserva creada con éxito', reservation: { id: 5050, status: 'pending' } }
      }).as('createRes');
  
      // Interceptamos el Dashboard del cliente para que muestre la reserva pendiente
      cy.intercept('GET', '**/api/client/reservations', {
        statusCode: 200,
        body: { data: [pendingReservation] }
      }).as('clientDashboardPending');
  
      // El cliente navega por el sistema y reserva
      cy.visit('/client/tourist-packages');
      cy.wait('@getTours');
      cy.contains('Expedición Selva Amazónica Suprema').should('be.visible');
      cy.contains('Ver Detalle').click();
      
      cy.wait('@getTourDetail');
      cy.get('input[type="date"]').type('2026-10-15');
      cy.contains('Reservar Ahora').click();
  
      cy.url().should('include', '/checkout');
      cy.get('input[placeholder="Ej. Juan Pérez"]').type('Aventurero Pro');
      cy.get('input[placeholder="tu@email.com"]').type('aventurero@correo.com');
      cy.get('input[placeholder="+51 987 654 321"]').type('999888777');
      cy.contains('Confirmar y Pagar').click();
  
      cy.wait('@createRes');
      cy.url().should('include', '/client/dashboard');
      cy.wait('@clientDashboardPending');
  
      // El cliente verifica que su reserva está en el dashboard y está PENDIENTE
      cy.contains('Expedición Selva Amazónica Suprema').should('be.visible');
      cy.contains('Pendiente').should('be.visible');
  
  
      // ==========================================================
      // FASE 2: ADMINISTRADOR GESTIONA Y APRUEBA
      // ==========================================================
      cy.log('FASE 2: Admin logueado para revisar las reservas nuevas');
      cy.loginAsAdmin(); // Sobrescribe la sesión actual, ahora somos Admin
  
      // Interceptamos el panel del Admin para que vea esta misma reserva pendiente
      cy.intercept('GET', '**/api/admin/reservations', {
        statusCode: 200,
        body: { data: [pendingReservation] }
      }).as('adminResPending');
  
      // Interceptamos el endpoint de cambiar el estado a confirmado
      cy.intercept('PATCH', '**/api/admin/reservations/5050/status', {
        statusCode: 200,
        body: { message: 'Reserva confirmada', data: confirmedReservation }
      }).as('adminConfirm');
  
      // El Admin entra a su panel de control
      cy.visit('/admin/reservations');
      cy.wait('@adminResPending');
      
      // Expandir el grupo de mes para ver las filas de reservas
      cy.get('tbody tr').first().click();

      // Añadimos una pausa visual de 2 segundos para que puedas ver el panel del admin
      cy.wait(2000);

      // El Admin ve al cliente y su estado Pendiente
      cy.contains('Aventurero Pro').should('be.visible');
      cy.contains('Pendiente').should('be.visible');
      
      // El Admin abre el panel de detalle, revisa que todo esté en orden y confirma
      cy.contains('Ver Detalle').click();
      cy.contains('aventurero@correo.com').should('be.visible');
      cy.contains('Confirmar').click();
      
      cy.wait('@adminConfirm');
      
  
      // ==========================================================
      // FASE 3: CLIENTE VERIFICA LA CONFIRMACIÓN
      // ==========================================================
      cy.log('FASE 3: Cliente entra de nuevo a revisar si ya le confirmaron su viaje');
      cy.loginAsClient(); // Volvemos a ser el cliente
  
      // Ahora interceptamos el Dashboard pero devolviendo la reserva CONFIRMADA
      cy.intercept('GET', '**/api/client/reservations', {
        statusCode: 200,
        body: { data: [confirmedReservation] }
      }).as('clientDashboardConfirmed');
  
      // Entramos al dashboard del cliente
      cy.visit('/client/dashboard');
      cy.wait('@clientDashboardConfirmed');
      
      // Magia pura: El cliente verifica que la reserva sigue ahí, pero el estado CAMBIÓ.
      cy.contains('Expedición Selva Amazónica Suprema').should('be.visible');
      cy.contains('Confirmada').should('be.visible');
      cy.contains('Pendiente').should('not.exist');
    });
  });
