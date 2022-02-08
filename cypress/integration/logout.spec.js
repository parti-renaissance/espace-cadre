import { initialization } from './main.spec'

const ScopesButton = '[data-cy="scopes-button"]'

const navigate = () => {
    cy.contains('Référent').click()
    cy.url().should('eq', 'http://localhost:3000/')
}

describe('Logout', () => {
    beforeEach(() => {
        initialization()
        navigate()
    })

  it('logout successfully', () => {
    cy.get(ScopesButton).should('exist')
    cy.get(ScopesButton).first().click()
    cy.contains('Me déconnecter').click()
    cy.url().should('eq', 'https://staging-utilisateur.je-mengage.fr/')
  })
})
