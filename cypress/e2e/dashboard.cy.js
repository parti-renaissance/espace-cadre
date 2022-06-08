import { initialize, mock } from './main.cy'

describe('Dashboard', () => {
  beforeEach(() => {
    initialize()
    mock('GET', '/api/v3/internal/*/adherents?scope=*', 'internal/adherents')
    mock('GET', '/api/v3/internal/*/jemengage/downloads?scope=*', 'internal/downloads')
    mock('GET', '/api/v3/adherent_messages/kpi?scope=*', 'internal/reportsRatio')
    mock('GET', '/api/v3/internal/*/jemengage/survey?scope=*', 'internal/survey')
    mock('GET', '/api/v3/internal/*/jemengage/users?scope=*', 'internal/users')
  })

  it('loads referent dashboard successfully', () => {
    cy.contains('Référent').click()

    cy.contains("Vue d'ensemble")
    cy.contains('100')
    cy.contains('12.34%')
    cy.contains('43.21% au national')
    cy.contains('42.42%')
    cy.contains('44.44% au national')
  })
})
