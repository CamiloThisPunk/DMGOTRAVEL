describe('Flujos del Cliente - Mi Dashboard y Reservas', () => {
    beforeEach(() => {
      // Usamos el comando custom para loguearnos como cliente
      cy.loginAsClient();
  
      // Interceptamos la petición para obtener el historial de reservas del cliente
      cy.intercept('GET', '**/api/client/reservations', {
        statusCode: 200,
        body: {
          data: [
            { 
              id: 101, 
              service: { title: 'Trek Laguna Humantay', type: 'destino' }, 
              status: 'confirmed', 
              reservation_date: '2027-05-15', 
              total_price: 120.00,
              guests_count: 2
            },
            { 
              id: 102, 
              service: { title: 'Tour Ciudad Imperial', type: 'paquete' }, 
              status: 'completed', 
              reservation_date: '2023-01-10', 
              total_price: 80.00,
              guests_count: 1
            }
          ]
        }
      }).as('getClientReservations');
    });
  
    it('Permite al cliente ver su panel de control con sus reservas próximas e históricas', () => {
      // Visitar el dashboard de cliente
      cy.visit('/client/dashboard');
      cy.wait('@getClientReservations');
  
      // Validar que se muestran las tarjetas de resumen
      cy.contains('Próximos').should('be.visible');
      cy.contains('Historial').should('be.visible');
      
      // Validar que se renderizan los nombres de los tours reservados
      cy.contains('Trek Laguna Humantay').should('be.visible');
      cy.contains('Tour Ciudad Imperial').should('be.visible');

      // Validar que se ven los estados correspondientes
      cy.contains('Confirmada').should('be.visible');
      cy.contains('Completado').should('be.visible');
    });

    it('Permite al cliente filtrar sus viajes pasados', () => {
        cy.visit('/client/dashboard');
        cy.wait('@getClientReservations');
    
        // Hacemos clic en el filtro de "Pasados"
        cy.contains('button', 'Pasados').click();
        
        // El tour de 2023 debería verse, el del futuro no
        cy.contains('Tour Ciudad Imperial').should('be.visible');
        cy.contains('Trek Laguna Humantay').should('not.exist');
    });

    it('Permite al cliente cancelar una reserva futura si no ha sido completada', () => {
        cy.visit('/client/dashboard');
        cy.wait('@getClientReservations');
    
        // Interceptar la petición de cancelación
        cy.intercept('PATCH', '**/api/client/reservations/101/cancel', {
            statusCode: 200,
            body: { message: 'Reserva cancelada' }
        }).as('cancelClientReservation');

        // Cypress por defecto bloquea los window.confirm, así que le decimos que devuelva true automáticamente
        cy.on('window:confirm', () => true);

        // Hacemos clic en el botón de Cancelar del primer tour
        cy.contains('Trek Laguna Humantay').parent().parent().parent().contains('Cancelar').click();
        cy.wait('@cancelClientReservation');
    });
});
