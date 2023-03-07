import { initialize, mock } from './main.cy'

const HeaderButton = '[data-cy="ui-page-header-button"]'
const ElectedContainer = '[data-cy="elected-representative-container"]'
const ElectedGrid = '[data-cy="elected-representative-grid"]'
const Card = '[data-cy="elected-representative-card"]'

const navigate = () => {
  cy.contains('Référent').click()
  cy.contains('Gestion territoriale').click()
  cy.contains('Registre des élus').click()
  cy.url().should('eq', 'http://localhost:3000/registre-elus')
}

describe('Elected Representative', () => {
  beforeEach(() => {
    initialize()
    mock('GET', '/api/v3/elected_representatives?page=1&renaissance_membership=adherent_re&scope=referent', 'elected-representative/elected-representative')
    mock('GET', '/api/v3/filters?feature=elected_representative&scope=referent', 'elected-representative/filters')

    navigate()
  })

  describe('The header', () => {
    it('should have a page title', () => {
      cy.contains('Registre des élus')
    })
    it('should have a button', () => {
      cy.get(HeaderButton).should('have.text', 'Ajouter un élu')
    })
  })

  describe('the elected list', () => {
    it('should have 2 cards', () => {
      cy.get(ElectedGrid).find(Card).children().should('have.length', 2)
    })
  })

  describe('the elected filters', () => {
    beforeEach(() => {
      mock('GET', '/api/v3/elected_representatives?page=1&renaissance_membership=adherent_re&lastName=Arthur&scope=referent', 'elected-representative/elected-filter')
    })

    it('should have filters form', () => {
      cy.get(ElectedContainer).find('form').should('exist')
    })

    it('can select a filter', () => {
      cy.get(ElectedContainer).find('form')
        .find('>div')
        .find('>div + div')
        .find('input')
        .eq(0)
        .invoke('val', 'Arthur')
        .should('have.value', 'Arthur')

      cy.get(ElectedContainer).find('form').submit()
      cy.get(ElectedGrid).find(Card).children().should('have.length', 2)
    })
  })
})
