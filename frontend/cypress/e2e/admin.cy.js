describe('Flujos de Administrador - Gestión de Reservas', () => {
    beforeEach(() => {
      cy.loginAsAdmin();
      
      cy.intercept('GET', '**/api/admin/dashboard-stats', {
        statusCode: 200,
        body: { total_clients: 150, pending_reservations: 5, active_packages: 10 }
      }).as('getAdminStats');
  
      cy.intercept('GET', '**/api/admin/reservations', {
        statusCode: 200,
        body: {
          data: [
            { id: 1, client: { name: 'Juan Perez', email: 'juan@test.com' }, service: { title: 'Tour Montaña', type: 'paquete' }, status: 'pending', reservation_date: '2026-12-01', total_price: 150.00 },
            { id: 2, client: { name: 'Maria Gomez', email: 'maria@test.com' }, service: { title: 'Tour Ciudad', type: 'destino' }, status: 'confirmed', reservation_date: '2026-12-15', total_price: 80.00 }
          ]
        }
      }).as('getReservations');
    });
  
    it('Permite al administrador ver la lista de todas las reservas', () => {
      cy.visit('/admin/reservations');
      cy.wait('@getReservations');
      
      // Expandir el primer grupo de fecha
      cy.get('tbody tr').first().click();

      // Validar que se muestran las dos reservas
      cy.contains('Juan Perez').should('be.visible');
      cy.contains('Maria Gomez').should('be.visible');
      cy.contains('Pendiente').should('be.visible');
      cy.contains('Confirmada').should('be.visible');
    });

    it('Permite al administrador filtrar las reservas por estado', () => {
      cy.visit('/admin/reservations');
      cy.wait('@getReservations');

      cy.get('tbody tr').first().click();

      // Filtrar por Confirmadas
      cy.contains('button', 'Confirmadas').click();
      cy.contains('Maria Gomez').should('be.visible');
      cy.contains('Juan Perez').should('not.exist'); // No debería verse la pendiente

      // Filtrar por Pendientes
      cy.contains('button', 'Pendientes').click();
      cy.contains('Juan Perez').should('be.visible');
      cy.contains('Maria Gomez').should('not.exist');
    });
  
    it('Permite ver el detalle de una reserva específica hecha por un cliente', () => {
      cy.visit('/admin/reservations');
      cy.wait('@getReservations');

      cy.get('tbody tr').first().click();

      // Abrir detalle de la reserva de Juan Perez
      cy.contains('tr', 'Juan Perez').contains('Ver Detalle').click();

      // Validar el panel lateral
      cy.contains('Detalle de Reserva').should('be.visible');
      cy.contains('Información del Cliente').should('be.visible');
      cy.contains('juan@test.com').should('be.visible');
      cy.contains('Tour Montaña').should('be.visible');
      cy.contains('Paquete Turístico').should('be.visible');
    });

    it('Permite al administrador confirmar una reserva pendiente', () => {
      cy.visit('/admin/reservations');
      cy.wait('@getReservations');
  
      cy.get('tbody tr').first().click();

      cy.intercept('PATCH', '**/api/admin/reservations/1/status', {
        statusCode: 200,
        body: { message: 'Reserva confirmada', data: { id: 1, status: 'confirmed' } }
      }).as('confirmReservation');
  
      cy.contains('tr', 'Juan Perez').contains('Ver Detalle').click();
      cy.contains('Confirmar').click();
      cy.wait('@confirmReservation');
    });

    it('Permite al administrador cancelar una reserva pendiente', () => {
        cy.visit('/admin/reservations');
        cy.wait('@getReservations');
    
        cy.get('tbody tr').first().click();

        cy.intercept('PATCH', '**/api/admin/reservations/1/status', {
          statusCode: 200,
          body: { message: 'Reserva cancelada', data: { id: 1, status: 'cancelled' } }
        }).as('cancelReservation');
    
        cy.contains('tr', 'Juan Perez').contains('Ver Detalle').click();
        cy.contains('Cancelar').click();
        cy.wait('@cancelReservation');
    });
});
