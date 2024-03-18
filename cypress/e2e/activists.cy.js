import { initialize, mock } from './main.cy'
import activists from '../fixtures/activists/activists.json'

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
    mock('GET', '/api/v3/adherents?page=1&itemsPerPage=100&scope=referent', 'activists/activists')
    mock('GET', '/api/v3/filters?feature=contacts&scope=referent', 'activists/filters')
    mock('GET', '/api/v3/adherents?page=1&firstName=Jean&scope=referent', 'activists/activists-filtered')

    navigate()
  })

  describe('the activists filters', () => {
    it('should have a page title', () => {
      cy.contains('Militants')
    })

    it('should display the table', () => {
      cy.findByTestId('result-count').valueOf().should('have.text', activists.items.length)
    })
  })
})
