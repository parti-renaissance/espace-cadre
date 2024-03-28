import { initialize, mock } from './main.cy'

const selectScope = () => {
  cy.contains('Président').click()
}

describe('Messagerie', () => {
  beforeEach(() => {
    initialize()

    mock(
      'GET',
      '/api/v3/procuration/requests?scope=president_departmental_assembly&order[createdAt]=asc&status=pending&page=1',
      'procurations/list-p1'
    )

    mock(
      'GET',
      '/api/v3/procuration/requests?scope=president_departmental_assembly&order[createdAt]=asc&status=pending&page=2',
      'procurations/list-p2'
    )

    mock(
      'GET',
      '/api/v3/procuration/proxies?scope=president_departmental_assembly&order[createdAt]=asc&status=pending&page=1',
      'procurations/proxies-p2'
    )

    mock(
      'GET',
      '/api/v3/procuration/proxies?scope=president_departmental_assembly&order[createdAt]=asc&status=pending&page=2',
      'procurations/proxies-p2'
    )

    selectScope()
    cy.visit('/procurations')
  })

  it('should show "Mandants à traiter"', () => {
    cy.contains('Mandants à traiter')

    cy.findAllByTestId('moreButton').first().click()
    cy.contains('Afficher moins')

    cy.findAllByTestId('lessButton').first().click()
    cy.contains('Afficher plus')

    cy.scrollTo('bottom')
    cy.scrollTo('bottom')

    cy.contains('Avant')
    cy.contains('Deuxième')
    cy.contains('Il n’y a pas d’autre résultats.')
  })

  it('should show "Mandataires"', () => {
    cy.findByTestId('tab-mandataires').click()
    cy.contains('Mandataires disponibles')

    cy.findAllByTestId('moreButton').first().click()
    cy.contains('Afficher moins')

    cy.findAllByTestId('lessButton').first().click()
    cy.contains('Afficher plus')

    cy.scrollTo('bottom')
    cy.scrollTo('bottom')

    cy.contains('Dernier')
    cy.contains('Il n’y a pas d’autre résultats.')
  })
})
