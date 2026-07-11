describe('Seguridad y Autenticación', () => {
    it('Redirige a login al intentar acceder a rutas protegidas sin estar autenticado', () => {
      // Intentar visitar el dashboard del cliente
      cy.visit('/client/dashboard');
      // Debe redirigir al login (depende de cómo esté configurado tu ProtectedRoute)
      cy.url().should('include', '/login');
      
      // Intentar visitar el dashboard de admin
      cy.visit('/admin/dashboard');
      cy.url().should('include', '/login');
    });
  
    it('Permite al Administrador iniciar sesión correctamente', () => {
      cy.visit('/auth');
      
      cy.intercept('GET', '**/sanctum/csrf-cookie', { statusCode: 204 }).as('csrfCookie');

      cy.intercept('POST', '**/api/auth/login', {
        statusCode: 200,
        body: {
          token: 'fake-jwt-token-admin',
          user: { id: 2, name: 'Admin', email: 'admin@dmgotravel.com', roles: ['admin'] }
        }
      }).as('loginAdmin');
  
      cy.get('#login-email').type('admin@dmgotravel.com');
      cy.get('#login-password').type('adminpassword');
      cy.get('button[type="submit"]').contains('Ingresar').click();
  
      cy.wait('@loginAdmin');
      
      // Debe redirigir al dashboard
      cy.url().should('include', '/admin');
    });
  });
