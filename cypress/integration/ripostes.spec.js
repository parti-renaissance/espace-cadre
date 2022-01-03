import { initialization } from './main.spec'

describe('Ripostes', () => {
  beforeEach(() => {
    initialization()
  })

  it('loads national ripostes', () => {
    cy.contains('National').click()
    cy.contains('Riposte').click()

    cy.contains('Riposte 2')
    cy.contains('Par author 2')
    cy.contains('2 vues')
    cy.contains('2 vues détaillées')
    cy.contains('2 ripostes')

    cy.contains('Riposte 1')
    cy.contains('Par author 1')
    cy.contains('1 vue')
    cy.contains('1 vue détaillée')
    cy.contains('1 riposte')

    cy.contains('Éditer').first().click()
    const modale = 'div[role="dialog"]'
    cy.get(modale).contains('Modifier une riposte')
    cy.get(modale).get('input[name="title"]').should('have.value', 'Riposte 2')
    cy.get(modale).get('textarea[name="body"]').should('have.value', 'Répondez à Candidat X')
    cy.get(modale).get('input[name="url"]').should('have.value', 'https://www.en-marche.fr')
    cy.get(modale + ' button')
      .first()
      .click()
    cy.get(modale).should('not.exist')
  })
})
