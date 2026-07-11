// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************

Cypress.Commands.add('loginAsClient', () => {
    cy.intercept('GET', '**/sanctum/csrf-cookie', { statusCode: 204 }).as('csrfCookie');
    cy.intercept('POST', '**/api/auth/login', {
      statusCode: 200,
      body: {
        token: 'fake-jwt-token-client',
        user: { id: 1, name: 'Test Client', email: 'client@test.com', roles: ['client'] }
      }
    }).as('loginRequest');
  
    // Store in localStorage as if React had done it
    window.localStorage.setItem('token', 'fake-jwt-token-client');
    window.localStorage.setItem('user', JSON.stringify({
      id: 1, name: 'Test Client', email: 'client@test.com', roles: ['client']
    }));
});

Cypress.Commands.add('loginAsAdmin', () => {
    cy.intercept('GET', '**/sanctum/csrf-cookie', { statusCode: 204 }).as('csrfCookie');
    cy.intercept('POST', '**/api/auth/login', {
      statusCode: 200,
      body: {
        token: 'fake-jwt-token-admin',
        user: { id: 2, name: 'Test Admin', email: 'admin@test.com', roles: ['admin'] }
      }
    }).as('loginRequest');
    
    window.localStorage.setItem('token', 'fake-jwt-token-admin');
    window.localStorage.setItem('user', JSON.stringify({
      id: 2, name: 'Test Admin', email: 'admin@test.com', roles: ['admin']
    }));
});
