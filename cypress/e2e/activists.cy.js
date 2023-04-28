import { initialize, mock } from './main.cy'

const ContactsList = '[data-cy="contacts-list"]'
const ContactButton = '[data-cy="contact-card-button"]'
const AccordionFiltersContainer = '[data-cy="accordion-filters-container"]'
const FiltersForm = '[data-cy="filters-form"]'

const navigate = () => {
  cy.contains('Référent').click()
    cy.contains('Militants').click()
  cy.url().should('eq', 'http://localhost:3000/militants')
}

describe('Activists', () => {
  beforeEach(() => {
    initialize()
    mock(
      'GET',
      '/api/v3/adherent_messages?order[created_at]=desc&page=1&page_size=20&scope=referent',
      'messagerie/messages'
    )
    mock('GET', '/api/v3/adherents?page=1&scope=referent', 'activists/activists')
    mock('GET', '/api/v3/filters?feature=contacts&scope=referent', 'activists/filters')
    mock('GET', '/api/v3/adherents?page=1&firstName=Jean&scope=referent', 'activists/activists-filtered')

    navigate()
  })

  describe('the activists filters', () => {
    it('should have a page title', () => {
      cy.contains('Militants')
    })

    it('can select a filter', () => {
      cy.get(AccordionFiltersContainer).click()
      cy.get(FiltersForm).should('exist')

      cy.get(ContactsList).find(ContactButton).children().should('have.length', 3)

      cy.get(FiltersForm)
        .find('>div')
        .find('>div + div')
        .find('input')
        .eq(0)
        .type('Jean')

      cy.get(FiltersForm).submit()
      cy.get(ContactsList).find(ContactButton).children().should('have.length', 1)
    })
  })
})
