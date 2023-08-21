import { initialize, mock } from './main.cy'

const HeaderButton = '[data-cy="ui-page-header-button"]'
const ElectedGrid = '[data-cy="elected-representative-grid"]'
const Card = '[data-cy="elected-representative-card"]'
const AccordionFiltersContainer = '[data-cy="accordion-filters-container"]'
const FiltersForm = '[data-cy="filters-form"]'
const InputFirstName = 'input[name="firstName"]'

const navigate = () => {
  cy.contains('Référent').click()
  cy.contains('Registre des élus').click()
  cy.url().should('eq', 'http://localhost:3000/registre-elus')
}

describe('Elected Representative', () => {
  beforeEach(() => {
    initialize()
    mock(
      'GET',
      '/api/v3/elected_representatives?page=1&renaissance_membership=adherent_re&scope=referent',
      'elected-representative/elected-representative'
    )
    mock(
      'GET',
      '/api/v3/elected_representatives?page=1&renaissance_membership=adherent_re&firstName=Arthur&scope=referent',
      'elected-representative/elected-filter'
    )
    mock('GET', '/api/v3/filters?feature=elected_representative&scope=referent', 'elected-representative/filters')

    navigate()
  })

  describe('the elected filters', () => {
    it('can select a filter', () => {
      cy.get(HeaderButton).should('have.text', 'Ajouter un élu')
      cy.contains('Registre des élus')

      cy.get(ElectedGrid).find(Card).children().should('have.length', 2)

      cy.get(AccordionFiltersContainer).click()
      cy.get(FiltersForm).should('exist')

      cy.get(FiltersForm).find(InputFirstName).type('Arthur')

      cy.get(FiltersForm).submit()

      cy.get(ElectedGrid).find(Card).children().should('have.length', 1)
    })
  })
})
