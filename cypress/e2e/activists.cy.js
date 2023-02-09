import { initialize, mock } from './main.cy'

describe('Activists', () => {
  beforeEach(() => {
    initialize()
    mock(
      'GET',
      '/api/v3/adherent_messages?order[created_at]=desc&page=1&page_size=20&scope=referent',
      'messagerie/messages'
    )
    mock('GET', '/api/v3/adherents/columns?scope=referent', 'activists/columns')
    mock('GET', '/api/v3/adherents?page=1&scope=referent', 'activists/activists')
    mock('GET', '/api/v3/filters?feature=contacts&scope=referent', 'activists/filters')
  })

  it('loads "activists" page successfully', () => {
    cy.contains('Référent').click()
    cy.contains('Militantisme').click()
    cy.contains('Militants').click()
  })
})
