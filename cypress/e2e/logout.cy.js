import { initialize } from './main.spec'

const ScopesButton = '[data-cy="scopes-button"]'

const navigate = () => {
  cy.contains('Référent').click()
  cy.url().should('eq', 'http://localhost:3000/')
}

describe('Logout', () => {
  beforeEach(() => {
    initialize()
    navigate()
  })

  it('logout successfully', () => {
    cy.get(ScopesButton).should('exist')
    cy.get(ScopesButton).first().click()
    cy.contains('Me déconnecter').click()
  })
})
