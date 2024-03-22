import { initialize, mock } from './main.cy'

const selectScope = () => {
  cy.contains('Président').click()
}

describe('Messagerie', () => {
  beforeEach(() => {
    initialize()
    mock(
      'GET',
      '/api/v3/procuration/requests?scope=president_departmental_assembly&order[createdAt]=asc&page=1',
      'procurations/list-p1'
    )

    mock(
      'GET',
      '/api/v3/procuration/requests?scope=president_departmental_assembly&order[createdAt]=asc&page=2',
      'procurations/list-p2'
    )

    selectScope()
    cy.visit('/procurations')
  })

  it('Messagerie homepage', () => {
    cy.contains('Mandants à traiter')

    cy.findAllByTestId('moreButton').first().click()
    cy.contains('Afficher moins')

    cy.findAllByTestId('lessButton').first().click()
    cy.contains('Afficher plus')

    cy.scrollTo('bottom')
    cy.scrollTo('bottom')

    cy.contains('Il n’y a pas d’autre résultats.')
    cy.contains('Deuxième Page')
  })
})
