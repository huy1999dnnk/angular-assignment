/// <reference types="cypress" />
// ***********************************************
// This example commands.ts shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************

declare global {
  namespace Cypress {
    interface Chainable {
      login(username?: string, password?: string): Chainable<void>
    }
  }
}

Cypress.Commands.add('login', (username = 'emilys', password = 'emilyspass') => {
  cy.visit('/login')
  cy.get('input[formControlName="username"]').type(username)
  cy.get('input[formControlName="password"]').type(password)
  cy.get('button[type="submit"]').click()
  cy.url().should('include', '/products')
})
